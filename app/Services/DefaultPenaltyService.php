<?php

namespace App\Services;

use App\Models\Loan;
use App\Models\Penalty;
use App\Models\PenaltyStatus;
use App\Models\PenaltyType;
use App\Models\ScheduleStatus;
use App\Notifications\NotifyUser;
use App\Repositories\Interfaces\IHolidayService;
use App\Repositories\Interfaces\IPenaltyCalculator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DefaultPenaltyService implements IPenaltyCalculator
{
    protected FormulaService $formulaService;

    protected IHolidayService $holidayService;

    const PENALTY_FORMULA_NAME = 'Overdue Penalty';

    public function __construct(
        FormulaService $formulaService,
        IHolidayService $holidayService)
    {
        $this->formulaService = $formulaService;
        $this->holidayService = $holidayService;
    }

    /**
     * Calculate penalties for overdue loan schedules.
     *
     * Business rules:
     * - Penalty is applied only after a 3-day grace period from the due date.
     * - 6% penalty on overdue amounts.
     * - If both capital and interest are unpaid, penalty applies to total balance.
     * - If interest has already been paid, penalty applies only to the capital of the current term.
     * - Penalty is charged to the next unpaid installment.
     * - The penalty record stays linked to the overdue schedule that caused it.
     */
    public function calculate(Loan $loan): void
    {
        DB::transaction(function () use ($loan) {
            $penaltyCutoff = Carbon::today()->subDays(Penalty::GRACE_PERIOD_DAYS);

            $overdueSchedules = $loan->amortizationSchedules()
                ->where('status', ScheduleStatus::Overdue->value)
                ->whereDate('due_date', '<', $penaltyCutoff->toDateString())
                ->orderBy('due_date')
                ->get();

            foreach ($overdueSchedules as $overdue) {
                $existingPenaltyAmount = (float) Penalty::query()
                    ->where('type', PenaltyType::LatePayment->value)
                    ->where('schedule_id', $overdue->ID)
                    ->where('loan_id', $loan->ID)
                    ->sum('amount');

                $penaltyBase = $overdue->installment_amount;

                if ($overdue->amount_paid >= $overdue->interest_amount) {
                    $penaltyBase = $overdue->installment_amount - $overdue->interest_amount;
                }

                $penaltyAmount = round($penaltyBase * Penalty::PENALTY_RATE, 2);

                if ($penaltyAmount <= 0) {
                    continue;
                }

                $nextInstallment = $loan->amortizationSchedules()
                    ->whereIn('status', [
                        ScheduleStatus::Unpaid->value,
                        ScheduleStatus::Overdue->value,
                    ])
                    ->where('installment_no', '>', $overdue->installment_no)
                    ->orderBy('installment_no')
                    ->first();

                if (! $nextInstallment) {
                    continue;
                }

                if ($existingPenaltyAmount > 0) {
                    $overduePenaltyAmount = (float) $overdue->penalty_amount;

                    if ($overduePenaltyAmount > 0) {
                        $overdue->penalty_amount = max(0, $overduePenaltyAmount - $existingPenaltyAmount);
                        $overdue->save();
                    }

                    $missingPenaltyAmount = round($existingPenaltyAmount - (float) $nextInstallment->penalty_amount, 2);

                    if ($missingPenaltyAmount > 0) {
                        $nextInstallment->penalty_amount += $missingPenaltyAmount;
                        $nextInstallment->save();
                    }

                    continue;
                }

                $nextInstallment->due_date = $this->holidayService->adjustDate($nextInstallment->due_date);
                $nextInstallment->penalty_amount += $penaltyAmount;
                $nextInstallment->save();

                Penalty::create([
                    'type' => PenaltyType::LatePayment->value,
                    'amount' => $penaltyAmount,
                    'date_applied' => Carbon::now(),
                    'status' => PenaltyStatus::Pending->value,
                    'schedule_id' => $overdue->ID,
                    'loan_id' => $loan->ID,
                ]);

                $borrower = $loan->borrower;
                $borrower->notify(new NotifyUser(
                    subject: 'Penalty Applied',
                    message: "Hi {$borrower->name}!, a penalty of PHP {$penaltyAmount} has been applied to your loan #{$loan->ID} for overdue payment. Please make sure to settle your dues to avoid further penalties. Thank you!",
                    email: $borrower->email
                ));

                $loan->balance_remaining += $penaltyAmount;
            }

            $loan->save();
        });
    }
}
