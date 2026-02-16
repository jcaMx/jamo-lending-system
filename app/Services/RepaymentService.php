<?php

namespace App\Services;

use App\Models\AmortizationSchedule;
use App\Models\Borrower;
use App\Models\Loan;
use App\Models\Payment;
use App\Models\PaymentScheduleAllocation;
use App\Models\ScheduleStatus;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;

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
    public function processPayment(Payment $payment, array $preferredScheduleIds = []): void
    {
        if (! $payment->relationLoaded('loan')) {
            $payment->load('loan');
        }

        $loan = $payment->loan;

        if (! $loan) {
            throw new \Exception('Payment does not have an associated loan. Payment ID: '.$payment->ID.', Loan ID: '.$payment->loan_id);
        }

        $amount = (float) $payment->amount;
        $paymentDate = Carbon::parse($payment->payment_date);

        $selectedSchedules = collect();
        if (! empty($preferredScheduleIds)) {
            $selectedSchedules = $loan->amortizationSchedules()
                ->whereIn('ID', $preferredScheduleIds)
                ->whereIn('status', [ScheduleStatus::Unpaid->value, ScheduleStatus::Overdue->value])
                ->orderBy('due_date', 'asc')
                ->get();
        }

        if ($selectedSchedules->isEmpty()) {
            $selectedSchedules = $loan->amortizationSchedules()
                ->whereIn('status', [ScheduleStatus::Unpaid->value, ScheduleStatus::Overdue->value])
                ->orderBy('due_date', 'asc')
                ->get();
        }

        if ($selectedSchedules->isEmpty()) {
            throw new \Exception('No unpaid schedule found for this loan.');
        }

        foreach ($selectedSchedules as $schedule) {
            if ($amount <= 0) {
                break;
            }
            $amount = $this->applyPaymentToSchedule($payment, $loan, $schedule, $amount, $paymentDate);
        }

        if ($amount > 0) {
            $amount = $this->applyAdvancePayment($payment, $loan, $amount, $paymentDate, $selectedSchedules->pluck('ID')->all());
        }

        $this->updateLoanBalance($loan);

        if ($this->isLoanFullyPaid($loan)) {
            $this->voidRemainingInterest($loan);
            $loan->status = 'Fully_Paid';
            $loan->save();
        }
    }

    private function applyAdvancePayment(
        Payment $payment,
        Loan $loan,
        float $remainingAmount,
        Carbon $paymentDate,
        array $excludedScheduleIds = []
    ): float
    {
        $futureSchedules = $loan->amortizationSchedules()
            ->whereIn('status', [ScheduleStatus::Unpaid->value, ScheduleStatus::Overdue->value])
            ->when(! empty($excludedScheduleIds), function ($query) use ($excludedScheduleIds) {
                $query->whereNotIn('ID', $excludedScheduleIds);
            })
            ->orderBy('due_date', 'asc')
            ->get();

        foreach ($futureSchedules as $schedule) {
            if ($remainingAmount <= 0) {
                break;
            }

            $remainingAmount = $this->applyPaymentToSchedule($payment, $loan, $schedule, $remainingAmount, $paymentDate);
        }

        return $remainingAmount;
    }

    private function applyPaymentToSchedule(
        Payment $payment,
        Loan $loan,
        AmortizationSchedule $schedule,
        float $remainingAmount,
        Carbon $paymentDate
    ): float {
        $totalDue = (float) ($schedule->installment_amount + $schedule->interest_amount + $schedule->penalty_amount);
        $outstanding = max(0, $totalDue - (float) $schedule->amount_paid);

        if ($outstanding <= 0) {
            return $remainingAmount;
        }

        $applied = min($remainingAmount, $outstanding);
        if ($applied <= 0) {
            return $remainingAmount;
        }

        $principalRatio = $totalDue > 0 ? ((float) $schedule->installment_amount / $totalDue) : 0;
        $interestRatio = $totalDue > 0 ? ((float) $schedule->interest_amount / $totalDue) : 0;
        $penaltyRatio = $totalDue > 0 ? ((float) $schedule->penalty_amount / $totalDue) : 0;

        $principalApplied = round($applied * $principalRatio, 2);
        $interestApplied = round($applied * $interestRatio, 2);
        $penaltyApplied = round($applied * $penaltyRatio, 2);
        $delta = round($applied - ($principalApplied + $interestApplied + $penaltyApplied), 2);
        $principalApplied += $delta;

        $schedule->amount_paid = (float) $schedule->amount_paid + $applied;
        if ($schedule->amount_paid >= $totalDue) {
            $schedule->status = ScheduleStatus::Paid;
        } else {
            $schedule->status = Carbon::parse($schedule->due_date)->lt($paymentDate)
                ? ScheduleStatus::Overdue
                : ScheduleStatus::Unpaid;
        }
        $schedule->save();

        if (Schema::hasTable('payment_schedule_allocations')) {
            PaymentScheduleAllocation::updateOrCreate(
                ['payment_id' => $payment->ID, 'schedule_id' => $schedule->ID],
                [
                    'loan_id' => $loan->ID,
                    'applied_amount' => $applied,
                    'principal_applied' => $principalApplied,
                    'interest_applied' => $interestApplied,
                    'penalty_applied' => $penaltyApplied,
                    'due_date' => optional($schedule->due_date)?->toDateString(),
                    'payment_date' => $paymentDate->toDateString(),
                ]
            );
        }

        return $remainingAmount - $applied;
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
