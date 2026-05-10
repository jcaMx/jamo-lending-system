<?php

namespace App\Services;

use App\Models\AmortizationSchedule;
use App\Models\Borrower;
use App\Models\Loan;
use App\Models\Payment;
use App\Models\PaymentScheduleAllocation;
use App\Models\ScheduleStatus;
use App\Models\SystemSetting;
use Carbon\Carbon;
use Illuminate\Support\Facades\Schema;

class RepaymentService
{
    private const MONEY_EPSILON = 0.01;

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
                $totalDue = round(max(0, (
                    $s->installment_amount +
                    $s->interest_amount +
                    $s->penalty_amount -
                    $s->amount_paid -
                    $s->rebate_amount
                )), 2);

                return [
                    'ID' => $s->ID,
                    'installment_no' => $s->installment_no,
                    'due_date' => $s->due_date?->toDateString(),
                    'installment_amount' => (float) $s->installment_amount,
                    'interest_amount' => (float) $s->interest_amount,
                    'penalty_amount' => (float) $s->penalty_amount,
                    'amount_paid' => (float) $s->amount_paid,
                    'rebate_amount' => (float) $s->rebate_amount,
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
        $schedule->refresh();
        $totalDue = round((float) ($schedule->installment_amount + $schedule->interest_amount + $schedule->penalty_amount), 2);
        $currentPaid = round((float) $schedule->amount_paid, 2);
        $rebateApplied = round((float) $schedule->rebate_amount, 2);
        $outstanding = round(max(0, $totalDue - $currentPaid - $rebateApplied), 2);

        // Check for early payment rebate
        $enableRebates = SystemSetting::getValue('enable_rebates', false);
        // We only calculate rebate if the schedule will be fully paid after this payment
        $willBeFullyPaid = $remainingAmount >= ($outstanding - self::MONEY_EPSILON);

        if ($enableRebates && $willBeFullyPaid) {
            $minDaysEarly = (int) SystemSetting::getValue('rebate_min_days_early', 0);
            $requireGoodStanding = SystemSetting::getValue('rebate_require_good_standing', true);
            $dueDate = Carbon::parse($schedule->due_date)->startOfDay();
            
            // Check if payment is early enough
            if ($paymentDate->diffInDays($dueDate, false) >= $minDaysEarly) {
                $canApply = true;

                if ($requireGoodStanding) {
                    // Check if there are any other overdue schedules (not including this one)
                    $hasOtherOverdue = $loan->amortizationSchedules()
                        ->where('status', ScheduleStatus::Overdue->value)
                        ->where('ID', '!=', $schedule->ID)
                        ->exists();
                    if ($hasOtherOverdue) {
                        $canApply = false;
                    }
                }

                if ($canApply) {
                    $this->applyRebate($loan, $schedule);
                    $schedule->refresh(); // Refresh to get updated rebate_amount if applied to current
                    
                    // Recalculate outstanding after rebate is applied
                    $rebateApplied = round((float) $schedule->rebate_amount, 2);
                    $outstanding = round(max(0, $totalDue - $currentPaid - $rebateApplied), 2);
                }
            }
        }

        if ($outstanding <= self::MONEY_EPSILON) {
            if ($schedule->status !== ScheduleStatus::Paid) {
                // If it's already fully covered by rebate/previous payments
                $schedule->status = ScheduleStatus::Paid;
                $schedule->save();
            }

            return $remainingAmount;
        }

        $applied = round(min($remainingAmount, $outstanding), 2);
        $schedule->amount_paid = round($currentPaid + $applied, 2);
        $remainingAmount = round($remainingAmount - $applied, 2);

        if ($outstanding - $applied <= self::MONEY_EPSILON) {
            $schedule->status = ScheduleStatus::Paid;
        }
        $principalRatio = $totalDue > 0 ? ((float) $schedule->installment_amount / $totalDue) : 0;
        $interestRatio = $totalDue > 0 ? ((float) $schedule->interest_amount / $totalDue) : 0;
        $penaltyRatio = $totalDue > 0 ? ((float) $schedule->penalty_amount / $totalDue) : 0;

        $principalApplied = round($applied * $principalRatio, 2);
        $interestApplied = round($applied * $interestRatio, 2);
        $penaltyApplied = round($applied * $penaltyRatio, 2);
        $delta = round($applied - ($principalApplied + $interestApplied + $penaltyApplied), 2);
        $principalApplied = round($principalApplied + $delta, 2);

        $newAmountPaid = round($currentPaid + $applied, 2);
        $remainingOutstanding = round(max(0, $totalDue - $newAmountPaid - $rebateApplied), 2);

        if ($remainingOutstanding <= self::MONEY_EPSILON) {
            // Amount paid should be the total due minus any rebates applied to this schedule
            $schedule->amount_paid = round(max(0, $totalDue - $rebateApplied), 2);
            $schedule->status = ScheduleStatus::Paid;
        } else {
            $schedule->amount_paid = $newAmountPaid;
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

        return $remainingAmount;
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
            $totalDue = round((float) ($schedule->installment_amount + $schedule->interest_amount + $schedule->penalty_amount), 2);
            $amountPaid = round((float) $schedule->amount_paid, 2);
            if (($totalDue - $amountPaid) > self::MONEY_EPSILON) {
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
            ->whereRaw('LOWER(status) = ?', ['confirmed'])
            ->sum('amount');
    }

    private function applyRebate(Loan $loan, AmortizationSchedule $currentSchedule): void
    {
        // R = P * r * t
        // P = Principal being paid early
        // r = Interest rate per period
        // t = Remaining periods in the loan
        
        $principalAmount = round((float) $currentSchedule->installment_amount, 2);
        
        $ratePerPeriod = match ($loan->repayment_frequency) {
            'Weekly' => ($loan->interest_rate / 100) / 52,
            'Monthly' => ($loan->interest_rate / 100) / 12,
            'Yearly' => ($loan->interest_rate / 100),
            default => ($loan->interest_rate / 100) / 12,
        };
        
        $totalInstallments = $loan->amortizationSchedules()->count();
        $remainingPeriods = max(0, $totalInstallments - $currentSchedule->installment_no);
        
        $rebateAmount = round($principalAmount * $ratePerPeriod * $remainingPeriods, 2);

        if ($rebateAmount <= 0) {
            return;
        }

        // Find the next unpaid/overdue schedule
        $nextSchedule = $loan->amortizationSchedules()
            ->where('installment_no', '>', $currentSchedule->installment_no)
            ->whereIn('status', [ScheduleStatus::Unpaid->value, ScheduleStatus::Overdue->value])
            ->orderBy('installment_no', 'asc')
            ->first();

        if ($nextSchedule) {
            $nextSchedule->rebate_amount = round($nextSchedule->rebate_amount + $rebateAmount, 2);
            $nextSchedule->save();
        } else {
            // No next schedule (last one)
            $applyToFullPayoff = SystemSetting::getValue('rebate_apply_to_full_payoff', true);
            if ($applyToFullPayoff) {
                $currentSchedule->rebate_amount = round($currentSchedule->rebate_amount + $rebateAmount, 2);
                $currentSchedule->save();
            }
        }
    }
}
