<?php

namespace App\Services;

use App\Models\Loan;
use App\Models\Penalty;
use App\Models\PenaltyStatus;
use App\Models\PenaltyType;
use App\Models\ScheduleStatus;
use App\Repositories\Interfaces\IHolidayService;
use App\Repositories\Interfaces\IPenaltyCalculator;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Notifications\NotifyUser;

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
     * Calculate penalties for overdue loan schedules
     * Business Rules:
     * - 6% penalty on overdue amounts
     * - If both capital and interest are unpaid → penalty applies to total balance
     * - If interest has already been paid → penalty applies only to the capital of the current term
     * - Penalties are applied in the next billing cycle (following month)
     */
    public function calculate(Loan $loan): void
    {
        DB::transaction(function () use ($loan) {
            // Get all overdue schedules ordered by due date
            $overdueSchedules = $loan->amortizationSchedules()
                ->where('status', ScheduleStatus::Overdue->value)
                ->orderBy('due_date')
                ->get();

            foreach ($overdueSchedules as $overdue) {
                // Determine penalty base amount
                // If interest has been paid, penalty only on capital (installment - interest)
                // If interest not paid, penalty on total balance (full installment amount)
                $penaltyBase = $overdue->installment_amount;

                if ($overdue->amount_paid >= $overdue->interest_amount) {
                    // Interest has been paid, penalty applies only to capital
                    $penaltyBase = $overdue->installment_amount - $overdue->interest_amount;
                }
                // Otherwise, penalty applies to total balance (full installment_amount)

                // Calculate 6% penalty
                $penaltyAmount = round($penaltyBase * Penalty::PENALTY_RATE, 2);

                if ($penaltyAmount <= 0) {
                    continue; // Skip if no penalty amount
                }

                // Find the next unpaid installment (next billing cycle)
                $nextInstallment = $loan->amortizationSchedules()
                    ->where('status', ScheduleStatus::Unpaid->value)
                    ->where('installment_no', '>', $overdue->installment_no)
                    ->orderBy('installment_no')
                    ->first();

                if ($nextInstallment) {
                    // Adjust due date for holidays if needed
                    $nextInstallment->due_date = $this->holidayService->adjustDate($nextInstallment->due_date);

                    // Add penalty to next installment
                    $nextInstallment->installment_amount += $penaltyAmount;
                    $nextInstallment->penalty_amount += $penaltyAmount;
                    $nextInstallment->save();

                    // Create penalty record
                    Penalty::create([
                        'type' => PenaltyType::LatePayment->value,
                        'amount' => $penaltyAmount,
                        'date_applied' => Carbon::now(),
                        'status' => PenaltyStatus::Pending->value,
                        'schedule_id' => $nextInstallment->ID,
                    ]);

                    $borrower = $loan->borrower;
                    $borrower->notify(new NotifyUser(
                        message: "A penalty of ₱{$penaltyAmount} has been applied to your loan #{$loan->ID} for overdue payment.",
                        email: $borrower->email
                    ));
                    // Update loan balance
                    $loan->balance_remaining += $penaltyAmount;
                }
            }

            $loan->save();
        });
    }
}
