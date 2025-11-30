<?php

namespace App\Services;

use App\Models\Loan;
use App\Models\ScheduleStatus;
use App\Repositories\Interfaces\IAmortizationCalculator;
use App\Repositories\Interfaces\IHolidayService;
use App\Repositories\Interfaces\IPenaltyCalculator;
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

    protected IPenaltyCalculator $penaltyCalculator;

    public function __construct(
        IHolidayService $holidayService,
        CompoundAmortizationCalculator $compoundCalculator,
        DiminishingAmortizationCalculator $diminishingCalculator,
        FormulaService $formulaService,
        IPenaltyCalculator $penaltyCalculator)
    {
        $this->holidayService = $holidayService;
        $this->compoundCalculator = $compoundCalculator;
        $this->diminishingCalculator = $diminishingCalculator;
        $this->formulaService = $formulaService;
        $this->penaltyCalculator = $penaltyCalculator;
    }

    public function selectCalculator(Loan $loan): IAmortizationCalculator
    {
        return match ($loan->interest_type) {
            'Compound' => $this->compoundCalculator,
            'Diminishing' => $this->diminishingCalculator,
            default => throw new \Exception('Unknown amortization type')
        };
    }

    public function createLoan(array $data): Loan
    {
        return Loan::addLoan($data);
    }

    public function approveLoan(Loan $loan, int $approvedByUser, float $releasedAmount): Loan
    {
        DB::transaction(function () use ($loan, $approvedByUser, $releasedAmount) {
            $loan->approved_by = $approvedByUser;
            $loan->status = 'Active';
            $loan->released_amount = $releasedAmount;

            // Set start_date to today (first installment will be due on start_date)
            $loan->start_date = Carbon::now();

            // Calculate end_date based on term and repayment frequency
            $totalInstallments = match ($loan->repayment_frequency) {
                'Weekly' => (int) ceil($loan->term_months * 4.345),
                'Monthly' => $loan->term_months,
                'Yearly' => (int) ceil($loan->term_months / 12),
                default => $loan->term_months
            };

            $endDate = $loan->start_date->copy();
            $endDate = match ($loan->repayment_frequency) {
                'Weekly' => $endDate->addWeeks($totalInstallments - 1),
                'Monthly' => $endDate->addMonthsNoOverflow($totalInstallments - 1),
                'Yearly' => $endDate->addYears($totalInstallments - 1),
                default => $endDate->addMonthsNoOverflow($totalInstallments - 1)
            };
            $loan->end_date = $endDate;

            // Use released_amount as the base for balance and amortization
            $loan->balance_remaining = $releasedAmount;
            $loan->save();

            // Generate amortization schedules using released_amount
            $schedules = $this->generateAmortization($loan, $releasedAmount);

            // Update balance_remaining to sum of all installment amounts
            $loan->balance_remaining = $schedules->sum('installment_amount');
            $loan->save();
        });

        return $loan->fresh();
    }

    public function rejectLoan(Loan $loan): Loan
    {
        $loan->status = 'Rejected';
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
            $loan->status = 'Fully_Paid';
            $loan->save();
        }

        return $loan->fresh();
    }

    public function markBadDebt(Loan $loan): Loan
    {
        if ($loan->status !== 'Active') {
            return $loan;
        }

        $cutoff = Carbon::now()->subDays(90);
        $overdueExists = $loan->amortizationSchedules()->where('status', ScheduleStatus::Overdue->value)->where('due_date', '<=', $cutoff)->exists();

        if ($overdueExists) {
            $loan->status = 'Bad_Debt';
            $loan->save();
        }

        return $loan->fresh();
    }

    public function generateAmortization(Loan $loan, ?float $baseAmount = null)
    {
        $calculator = $this->selectCalculator($loan);

        return DB::transaction(function () use ($loan, $calculator, $baseAmount) {
            // Delete old schedules if exist
            $loan->amortizationSchedules()->delete();

            // Use provided baseAmount, or released_amount, or fallback to principal_amount
            $amount = $baseAmount ?? $loan->released_amount ?? $loan->principal_amount;

            // Generate new schedules
            $schedules = $calculator->generate($loan, $amount);

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

            return $loan->amortizationSchedules()->orderBy('installment_no')->get();
        });
    }

    public function calculatePenalties(Loan $loan): void
    {
        $this->penaltyCalculator->calculate($loan);
    }

    public function getThreeMonthLateLoans()
    {
        $cutoff = Carbon::now()->subDays(90);

        return Loan::with(['borrower', 'collateral.landDetails', 'collateral.vehicleDetails', 'collateral.atmDetails', 'amortizationSchedules'])
            ->where(function ($query) use ($cutoff) {
                $query->where('status', 'Active')
                    ->whereHas('amortizationSchedules', function ($q) use ($cutoff) {
                        $q->where('status', ScheduleStatus::Overdue->value)
                            ->where('due_date', '<=', $cutoff);
                    });
            })
            ->orWhere('status', 'Bad_Debt')
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getOneMonthLateLoans()
    {
        $cutoff = Carbon::now()->subDays(30);

        return Loan::with(['borrower', 'collateral.landDetails', 'collateral.vehicleDetails', 'collateral.atmDetails', 'amortizationSchedules'])
            ->where('status', 'Active')
            ->whereHas('amortizationSchedules', function ($query) use ($cutoff) {
                $query->where('status', ScheduleStatus::Overdue->value)
                    ->where('due_date', '<=', $cutoff)
                    ->where('due_date', '>', Carbon::now()->subDays(90));
            })
            ->orderBy('created_at', 'desc')
            ->get();
    }

    public function getPastMaturityDateLoans()
    {
        $today = Carbon::now();

        return Loan::with(['borrower', 'collateral.landDetails', 'collateral.vehicleDetails', 'collateral.atmDetails', 'amortizationSchedules'])
            ->where('status', 'Active')
            ->whereNotNull('end_date')
            ->where('end_date', '<', $today)
            ->where('balance_remaining', '>', 0)
            ->orderBy('end_date', 'asc')
            ->get();
    }

    public function getApprovedLoans()
    {
        return Loan::with(['borrower', 'borrower.coBorrowers', 'borrower.spouse', 'collateral.landDetails', 'collateral.vehicleDetails', 'collateral.atmDetails', 'amortizationSchedules'])
            ->where('status', 'Active')
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
