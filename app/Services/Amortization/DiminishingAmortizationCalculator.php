<?php

namespace App\Services\Amortization;

use App\Models\Formula;
use App\Models\Loan;
use App\Repositories\Interfaces\IAmortizationCalculator;
use App\Repositories\Interfaces\IHolidayService;
use App\Services\FormulaService;

class DiminishingAmortizationCalculator implements IAmortizationCalculator
{
    public function __construct(protected IHolidayService $holidayService,
        protected FormulaService $formulaService) {}

    public function generate(Loan $loan): array
    {
        $interestFormula = Formula::where('name', 'Diminishing Balance Loan')->firstOrFail();

        $principal = (float) $loan->principal_amount;

        return $this->calculateSchedules($loan, $interestFormula, $principal);
    }

    public function recalculate(Loan $loan): array
    {
        $interestFormula = Formula::where('name', 'Diminishing Balance Loan')->firstOrFail();

        return $this->calculateSchedules($loan, $interestFormula, (float) $loan->principal_amount, false);
    }

    protected function calculateSchedules(
        Loan $loan,
        Formula $interestFormula,
        float $principal,
        bool $isNewLoan = true
    ): array
    {
        $remaining = round($principal, 2);
        $frequency = $loan->repayment_frequency;
        $rate = $loan->interest_rate / 100;

        // Determine total installments
        $totalInstallments = match ($frequency) {
            'Weekly' => (int) ceil($loan->term_months * 4.345),
            'Monthly' => $loan->term_months,
            'Yearly' => (int) ceil($loan->term_months / 12),
            default => $loan->term_months
        };

        $periodRate = match ($frequency) {
            'Weekly' => $rate / 52,
            'Monthly' => $rate / 12,
            'Yearly' => $rate,
            default => $rate / 12
        };

        $startDate = $loan->start_date ? $loan->start_date->copy() : null;
        $endDate = $loan->end_date ? $loan->end_date->copy() : null;
        $results = [];
        $fixedPrincipalPayment = $totalInstallments > 0
            ? round($principal / $totalInstallments, 2)
            : 0;

        for ($i = 1; $i <= $totalInstallments; $i++) {
            $interest = round($this->formulaService->evaluate($interestFormula, [
                'remaining_principal' => $remaining,
                'rate' => $periodRate,
            ]), 2);

            $principalPayment = $i === $totalInstallments
                ? $remaining
                : min($fixedPrincipalPayment, $remaining);

            $currentInstallmentAmount = round($principalPayment + $interest, 2);

            $remaining = round(max(0, $remaining - $principalPayment), 2);

            if (! $startDate) {
                $adjustedDueDate = null;
                $holiday = null;
            } elseif ($i === $totalInstallments && $endDate) {
                $dueDate = $endDate->copy();
                $adjustedDueDate = $this->holidayService->adjustDate($dueDate);
                $holiday = $this->holidayService->getHoliday($adjustedDueDate);
            } else {
                $dueDate = $this->calculateDueDate($startDate, $frequency, $i);
                $adjustedDueDate = $this->holidayService->adjustDate($dueDate);
                $holiday = $this->holidayService->getHoliday($adjustedDueDate);
            }

            $results[] = [
                'installment_no' => $i,
                'installment_amount' => $currentInstallmentAmount,
                'interest_amount' => $interest,
                'due_date' => $adjustedDueDate,
                'holiday_id' => $holiday?->ID,
            ];
        }

        return $results;
    }

    protected function calculateDueDate($startDate, string $frequency, int $installmentNumber)
    {
        return match ($frequency) {
            'Weekly' => $startDate->copy()->addWeeks($installmentNumber),
            'Monthly' => $startDate->copy()->addMonthsNoOverflow($installmentNumber),
            'Yearly' => $startDate->copy()->addYears($installmentNumber),
            default => $startDate->copy()->addMonthsNoOverflow($installmentNumber),
        };
    }
}
