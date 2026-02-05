<?php

namespace App\Services;

use App\Models\AmortizationSchedule;
use App\Models\Borrower;
use App\Models\Loan;
use App\Models\Payment;
use App\Models\ScheduleStatus;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RepaymentService
{

    public function fetchBorrowersForRepayment()
    {
        $borrowers = Borrower::with(['loans.amortizationSchedules'])->get();
        $results = [];

        foreach ($borrowers as $b) {

            // Find active loan
            $activeLoan = $b->loans->first(function ($loan) {
                return strtolower($loan->status) === 'active';
            });

            if (!$activeLoan) {
                continue;
            }

            // Filter unpaid and overdue schedules
            $unpaid = $activeLoan->amortizationSchedules
                ->filter(function ($s) {
                    return $s->status && in_array($s->status->value, ['Unpaid', 'Overdue'], true);
                })
                ->sortBy('due_date')
                ->values();

            // Transform schedules
            $schedules = $unpaid->map(function ($s) {
                $totalDue = (
                    $s->installment_amount +
                    $s->interest_amount +
                    $s->penalty_amount -
                    $s->amount_paid
                );

                return [
                    'ID' => $s->ID,
                    'installment_no' => $s->installment_no,
                    'due_date' => $s->due_date?->toDateString(),
                    'installment_amount' => (float) $s->installment_amount,
                    'interest_amount' => (float) $s->interest_amount,
                    'penalty_amount' => (float) $s->penalty_amount,
                    'amount_paid' => (float) $s->amount_paid,
                    'status' => $s->status?->value ?? 'Unpaid',
                    'total_due' => (float) $totalDue,
                ];
            });

            $nextDue = $schedules->first();

            $results[] = [
                'id' => $b->id,
                'name' => $b->full_name,
                'loan_id' => $activeLoan->id,
                'loanNo' => $activeLoan->loan_number ?? null,     // frontend expects this
                'schedules' => $schedules ?? [],
                'next_due_date' => $nextDue['due_date'] ?? null,
                'next_due_amount' => $nextDue['total_due'] ?? 0,
            ];
        }

        return $results;
    }

    /**
     * Apply a payment to the loan and amortization schedules.
     * Business Rules:
     * - Borrower can make partial payment
     * - Borrower can make equal payment (same as installment amount)
     * - Borrower can make advanced payment
     * - If loan fully settled early, remaining interest is waived
     */
    public function processPayment(Payment $payment): void
    {
        // Note: Transaction is managed by the controller, so we don't wrap this in a transaction
        // Ensure loan relationship is loaded
        if (! $payment->relationLoaded('loan')) {
            $payment->load('loan');
        }
        
        $loan = $payment->loan;

        if (! $loan) {
            // \Log::error('Payment has no loan', ['payment_id' => $payment->ID, 'loan_id' => $payment->loan_id]);
            throw new \Exception('Payment does not have an associated loan. Payment ID: '.$payment->ID.', Loan ID: '.$payment->loan_id);
        }

        // Safely get payment method as string (handle enum or string)
        $paymentMethod = (string) $payment->payment_method; // always string now

        $isCash = stripos($paymentMethod, 'Cash') !== false;

        $amount = (float) $payment->amount;
        $paymentDate = Carbon::parse($payment->payment_date);
        $scheduleId = $payment->schedule_id;

        // Get the schedule if specified, otherwise get first unpaid
        if ($scheduleId) {
            $targetSchedule = AmortizationSchedule::find($scheduleId);
        } else {
            $targetSchedule = $loan->amortizationSchedules()
                ->whereIn('status', [ScheduleStatus::Unpaid->value, ScheduleStatus::Overdue->value])
                ->orderBy('due_date', 'asc')
                ->first();
        }

        if (! $targetSchedule) {
            throw new \Exception('No unpaid schedule found for this loan.');
        }

        // Check if this is an advance payment (payment date before due date)
        $isAdvancePayment = $paymentDate->lt(Carbon::parse($targetSchedule->due_date));

        // Calculate remaining balance for the target schedule
        $totalDue = $targetSchedule->installment_amount + $targetSchedule->interest_amount + $targetSchedule->penalty_amount;
        $remainingBalance = $totalDue - $targetSchedule->amount_paid;

        // Apply payment to target schedule
        $paymentToApply = min($amount, $remainingBalance);
        $targetSchedule->amount_paid += $paymentToApply;

        // Update schedule status - if total due is fully paid, mark as Paid
        if ($targetSchedule->amount_paid >= $totalDue) {
            $targetSchedule->status = ScheduleStatus::Paid;
        }

        $targetSchedule->save();
        $amount -= $paymentToApply;

        // If there's remaining amount, apply to next schedules (advance payment)
        if ($amount > 0) {
            $this->applyAdvancePayment($loan, $amount, $paymentDate);
        }

        // Update loan balance
        $this->updateLoanBalance($loan);

        // Check if loan is fully paid - if so, void remaining interest and update status
        if ($this->isLoanFullyPaid($loan)) {
            $this->voidRemainingInterest($loan);
            $loan->status = 'Fully_Paid';
            $loan->save();
        }
    }

    /**
     * Apply advance payment to future schedules
     */
    private function applyAdvancePayment(Loan $loan, float $remainingAmount, Carbon $paymentDate): void
    {
        $futureSchedules = $loan->amortizationSchedules()
            ->whereIn('status', [ScheduleStatus::Unpaid->value, ScheduleStatus::Overdue->value])
            ->where('due_date', '>', $paymentDate)
            ->orderBy('due_date', 'asc')
            ->get();

        foreach ($futureSchedules as $schedule) {
            if ($remainingAmount <= 0) {
                break;
            }

            $totalDue = $schedule->installment_amount + $schedule->interest_amount + $schedule->penalty_amount;
            $remainingBalance = $totalDue - $schedule->amount_paid;
            $paymentToApply = min($remainingAmount, $remainingBalance);

            $schedule->amount_paid += $paymentToApply;

            // Update schedule status - if total due is fully paid, mark as Paid
            if ($schedule->amount_paid >= $totalDue) {
                $schedule->status = ScheduleStatus::Paid;
            }

            $schedule->save();
            $remainingAmount -= $paymentToApply;
        }
    }

    /**
     * Check if loan is fully paid
     */
    private function isLoanFullyPaid(Loan $loan): bool
    {
        // Check if all schedules have been fully paid
        $unpaidSchedules = $loan->amortizationSchedules()
            ->whereIn('status', [ScheduleStatus::Unpaid->value, ScheduleStatus::Overdue->value])
            ->get();

        foreach ($unpaidSchedules as $schedule) {
            $totalDue = $schedule->installment_amount + $schedule->interest_amount + $schedule->penalty_amount;
            if ($schedule->amount_paid < $totalDue) {
                return false;
            }
        }

        return true;
    }

    /**
     * Void remaining interest when loan is fully settled early
     * Business Rule: If borrower fully settles the loan early, remaining interest is waived
     */
    private function voidRemainingInterest(Loan $loan): void
    {
        // Void interest on all unpaid schedules
        $unpaidSchedules = $loan->amortizationSchedules()
            ->whereIn('status', [ScheduleStatus::Unpaid->value, ScheduleStatus::Overdue->value])
            ->get();

        foreach ($unpaidSchedules as $schedule) {
            // Only void interest if schedule hasn't been fully paid yet
            $totalDue = $schedule->installment_amount + $schedule->interest_amount + $schedule->penalty_amount;
            if ($schedule->amount_paid < $totalDue) {
                // Void the interest - reduce total due by interest amount
                $schedule->interest_amount = 0;
                $schedule->save();
            }
        }

        $loan->status = 'Fully_Paid';
        $loan->save();
    }

    /**
     * Update loan balance remaining
     */
    private function updateLoanBalance(Loan $loan): void
    {
        $totalPaid = $loan->amortizationSchedules()->sum('amount_paid');
        
        // Calculate total due across all schedules
        $totalDue = 0;
        foreach ($loan->amortizationSchedules()->get() as $schedule) {
            $totalDue += $schedule->installment_amount + $schedule->interest_amount + $schedule->penalty_amount;
        }

        $loan->balance_remaining = max(0, $totalDue - $totalPaid);
        $loan->save();
    }

    public function getNextDueAmount(Loan $loan): float
    {
        return $loan->amortizationSchedules
            ->whereIn('status', ['Unpaid', 'Overdue'])
            ->sum(function ($s) {
                return ($s->installment_amount ?? 0)
                    + ($s->interest_amount ?? 0)
                    + ($s->penalty_amount ?? 0)
                    - ($s->amount_paid ?? 0);
            });
    }

    public function getTotalPaid(Loan $loan): float
    {
        return (float) Payment::query()
            ->where('loan_id', $loan->ID)
            ->sum('amount');
    }

    



}
