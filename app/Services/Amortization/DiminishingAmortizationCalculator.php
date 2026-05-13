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
        $formula = Formula::where('name', 'Diminishing Balance Loan')->firstOrFail();

        $principal = (float) $loan->principal_amount;

        return $this->calculateSchedules($loan, $formula, $principal);
    }

    public function recalculate(Loan $loan): array
    {
        $formula = Formula::where('name', 'Diminishing Balance Loan')->firstOrFail();

        return $this->calculateSchedules($loan, $formula, $loan->principal_amount, false);
    }

    protected function calculateSchedules(Loan $loan, Formula $formula, float $principal, bool $isNewLoan = true): array
    {
        $remaining = $principal;
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

        $principalPerInstallment = $remaining / $totalInstallments;
        $startDate = $loan->start_date->copy();
        $endDate = $loan->end_date ? $loan->end_date->copy() : null;
        $results = [];

        for ($i = 1; $i <= $totalInstallments; $i++) {
            $interest = $this->formulaService->evaluate($formula, [
                'remaining_principal' => $remaining,
                'rate' => $periodRate,
            ]);

            $principalPayment = $i === $totalInstallments
                ? $remaining
                : $principalPerInstallment;

            $remaining -= $principalPayment;
            $remaining = max(0, $remaining);

            if ($i === $totalInstallments && $endDate) {
                $dueDate = $endDate->copy();
            } else {
                $dueDate = $this->calculateDueDate($startDate, $frequency, $i);
            }

            $adjustedDueDate = $this->holidayService->adjustDate($dueDate);
            $holiday = $this->holidayService->getHoliday($adjustedDueDate);

            $results[] = [
                'installment_no' => $i,
                'installment_amount' => round($principalPayment + $interest, 2),
                'interest_amount' => round($interest, 2),
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
