<?php

namespace App\Services;

use App\Models\Loan;
use App\Models\Payment;
use App\Models\AmortizationSchedule;
use Carbon\Carbon;

class RepaymentService
{
    /**
     * Apply a payment to the loan and amortization schedules.
     */
    public function processPayment(Payment $payment)
    {
        $loan = $payment->loan;

        if (!$loan) {
            return;
        }

        $amount = $payment->amount;
        $paymentDate = Carbon::parse($payment->payment_date);

        // ---- 1. Check if advance payment ----
        if ($this->isAdvancePayment($loan, $paymentDate)) {
            $this->voidRemainingInterest($loan, $paymentDate);
        }

        // ---- 2. Apply payment to amortization schedules ----
        $this->applyPaymentToSchedules($loan, $amount);

        // ---- 3. Update loan balances ----
        $this->updateLoanTotals($loan);
    }

    /**
     * Check if the payment is considered advance.
     * Advance = payment date is earlier than the next unpaid amortization's due date
     */
    private function isAdvancePayment(Loan $loan, Carbon $paymentDate): bool
    {
        $nextDue = $loan->amortizationSchedules()
            ->whereNull('paid_at')
            ->orderBy('due_date')
            ->first();

        if (!$nextDue) return false;

        return $paymentDate->lt(Carbon::parse($nextDue->due_date));
    }

    /**
     * VOID remaining future interest when borrower pays in advance.
     */
    private function voidRemainingInterest(Loan $loan, Carbon $paymentDate)
    {
        $loan->amortizationSchedules()
            ->where('due_date', '>', $paymentDate)
            ->update([
                'interest_amount' => 0,
                'status' => 'interest_void'
            ]);
    }

    /**
     * Apply partial/complete payment to amortization rows.
     */
    private function applyPaymentToSchedules(Loan $loan, float $amount)
    {
        $schedules = $loan->amortizationSchedules()
            ->orderBy('due_date')
            ->get();

        foreach ($schedules as $row) {

            if ($amount <= 0) break;

            $rowBalance = $row->principal_amount + $row->interest_amount - $row->amount_paid;

            if ($rowBalance <= 0) continue;

            // Pay into this row
            $apply = min($amount, $rowBalance);

            $row->amount_paid += $apply;
            $row->paid_at = now();

            // --- Mark as overpaid ---
            if ($row->amount_paid > ($row->principal_amount + $row->interest_amount)) {
                $this->markAsOverpaid($row);
            }

            $row->save();

            $amount -= $apply;
        }
    }

    /**
     * Recompute totals of loan balance.
     */
    private function updateLoanTotals(Loan $loan)
    {
        $loan->total_paid = $loan->amortizationSchedules()->sum('amount_paid');
        $loan->save();
    }

    /**
     * Mark amortization as OVERPAID.
     */
    public function markAsOverpaid(AmortizationSchedule $row)
    {
        $row->status = 'Overpaid';
        $row->save();
    }
}
