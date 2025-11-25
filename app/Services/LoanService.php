<?php

namespace App\Services;

use App\Models\InterestType;
use App\Models\Loan;
use App\Models\LoanStatus;
use App\Models\RepaymentFrequency;
use App\Models\ScheduleStatus;
use App\Repositories\Interfaces\IAmortizationCalculator;
use App\Repositories\Interfaces\IHolidayService;
use App\Services\Amortization\CompoundAmortizationCalculator;
use App\Services\Amortization\DiminishingAmortizationCalculator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class LoanService
{
    protected IHolidayService $holidayService;

    protected CompoundAmortizationCalculator $compoundCalculator;

    protected DiminishingAmortizationCalculator $diminishingCalculator;

    protected FormulaService $formulaService;

    public function __construct(
        IHolidayService $holidayService,
        CompoundAmortizationCalculator $compoundCalculator,
        DiminishingAmortizationCalculator $diminishingCalculator,
        FormulaService $formulaService)
    {
        $this->holidayService = $holidayService;
        $this->compoundCalculator = $compoundCalculator;
        $this->diminishingCalculator = $diminishingCalculator;
        $this->formulaService = $formulaService;
    }

    public function selectCalculator(Loan $loan): IAmortizationCalculator
    {
        return match ($loan->interest_type) {
            InterestType::Compound => $this->compoundCalculator,
            InterestType::Diminishing => $this->diminishingCalculator,
            default => throw new \Exception('Unknown amortization type')
        };
    }

    public function createLoan(array $data): Loan
    {
        return Loan::addLoan($data);
    }

    public function approveLoan(Loan $loan, int $approvedByUser): Loan
    {
        DB::transaction(function () use ($loan, $approvedByUser) {
            $loan->approved_by = $approvedByUser;
            $loan->status = LoanStatus::Active->value;

            // Determine start_date based on repayment frequency
            $today = Carbon::now();

            $loan->start_date = match ($loan->repayment_frequency) {
                RepaymentFrequency::Weekly => $today->copy()->addWeek(),
                RepaymentFrequency::Monthly => $today->copy()->addMonthNoOverflow(),
                RepaymentFrequency::Yearly => $today->copy()->addYear()
            };

            $processing_fee = round($loan->principal_amount * 0.03, 2);

            $insurance_fee = round($loan->principal_amount * 0.02, 2);

            $notary_fee = round($loan->principal_amount * 0.01, 2);

            $savings_contribution = round($loan->principal_amount * 0.02, 2);

            $netPrincipal = $loan->principal_amount - ($processing_fee + $insurance_fee + $notary_fee + $savings_contribution
            );

            $loan->balance_remaining = $netPrincipal;
            $loan->save();

            // Generate amortization schedules
            $schedules = $this->generateAmortization($loan);

            // Set emd date from last schedule
            if ($schedules->isNotEmpty()) {
                $loan->end_date = $schedules->last()->due_date;
                $loan->save();
            }
        });

        return $loan->fresh();
    }

    public function rejectLoan(Loan $loan): Loan
    {
        $loan->status = LoanStatus::Rejected->value;
        $loan->save();

        return $loan->fresh();
    }

    public function editLoan(Loan $loan, array $data): Loan
    {
        $loan->editLoan($data);

        return $loan->fresh();
    }

    public function closeLoan(Loan $loan): Loan
    {
        if ($loan->balance_remaining <= 0) {
            $loan->status = LoanStatus::FullyPaid->value;
            $loan->save();
        }

        return $loan->fresh();
    }

    public function markBadDebt(Loan $loan): Loan
    {
        if ($loan->status !== LoanStatus::Active) {
            return $loan;
        }

        $cutoff = Carbon::now()->subDays(90);
        $overdueExists = $loan->amortizationSchedules()->where('status', ScheduleStatus::Overdue->value)->where('due_date', '<=', $cutoff)->exists();

        if ($overdueExists) {
            $loan->status = LoanStatus::BadDebt->value;
            $loan->save();
        }

        return $loan->fresh();
    }

    public function generateAmortization(Loan $loan)
    {
        $calculator = $this->selectCalculator($loan);

        return DB::transaction(function () use ($loan, $calculator) {
            // Delete old schedules if exist
            $loan->amortizationSchedules()->delete();

            // Generate ne schedules
            $schedules = $calculator->generate($loan, $loan->balance_remaining);

            foreach ($schedules as $item) {
                $loan->amortizationSchedules()->create([
                    'installment_no' => $item['installment_no'],
                    'installment_amount' => $item['installment_amount'],
                    'interest_amount' => $item['interest_amount'],
                    'amount_paid' => 0,
                    'penalty_amount' => 0,
                    'status' => ScheduleStatus::Unpaid->value,
                    'due_date' => $item['due_date'],
                    'holiday_id' => $item['holiday_id'] ?? null,
                ]);
            }

            $remaining = $loan->balance_remaining;

            return $loan->amortizationSchedules()->orderBy('installment_no')->get();
        });
    }

    public function applyPenalty(IHolidayService $holidayService): void
    {
        DB::transaction(function () use ($holidayService) {

            // Get all overdue schedules
            $overdueSchedules = $this->amortizationSchedules()->where('status', ScheduleStatus::Overdue->value)->orderBy('due_date')->get();

            foreach ($overdueSchedules as $overdue) {

                // Determine penalty base
                if ($overdue->interest_amount == $overdue->installment_amount) {

                    // Only interest unpaid, apply penalty on principal
                    $penaltyBase = $overdue->installment_amount;
                } else {

                    // Both principal & interest unpaid
                    $penaltyBase = $overdue->installment_amount;
                }

                $penaltyAmount = round($penaltyBase * self::PENALTY_RATE, 2);

                $nextInstallment = $this->amortizationSchedules()->where('status', ScheduleStatus::Unpaid->value)->where('installment_no', '>', $overdue->installment_no)->orderBy('installment_no')->first();

                if ($nextInstallment) {
                    // Adjust next installment for penalty
                    $nextInstallment->installment_amount += $penaltyAmount;
                    $nextInstallment->penalty_amount += $penaltyAmount;

                    $nextInstallment->due_date = $holidayService->adjustDate($nextInstallment->due_date);

                    $nextInstallment->save();

                    $this->balance_remaining += $penaltyAmount;

                    Penalty::create([
                        'type' => PenaltyType::LatePayment->value,
                        'amount' => $penaltyAmount,
                        'date_applied' => Carbon::now(),
                        'status' => PenaltyStatus::Pending->value,
                        'schedule_id' => $nextInstallment->ID,
                    ]);
                }
            }
            $this->save();
        });
    }
}
