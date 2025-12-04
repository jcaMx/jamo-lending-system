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
        // Fetch formula from DB
        $formula = Formula::where('name', 'Diminishing Balance Loan')->firstOrFail();

        $principal = $principalAmount ?? $loan->principal_amount;

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

        $principalPerInstallment = $remaining / $totalInstallments;
        $startDate = $loan->start_date->copy();
        $endDate = $loan->end_date ? $loan->end_date->copy() : null;
        $results = [];

        for ($i = 1; $i <= $totalInstallments; $i++) {

            // FormulaService Calculates interest or total installment
            $interest = $this->formulaService->evaluate($formula, [
                'principal' => $principal,
                'remaining_principal' => $remaining,
                'rate' => $rate,
                'total_terms' => $totalInstallments,
            ]);

            $principalPayment = $principalPerInstallment;

            $remaining -= $principalPayment;
            $remaining = max(0, $remaining);

            // First installment uses start_date, last uses end_date, others are calculated
            if ($i === 1) {
                $dueDate = $startDate->copy();
            } elseif ($i === $totalInstallments && $endDate) {
                $dueDate = $endDate->copy();
            } else {
                // Calculate based on frequency from start_date
                $dueDate = $startDate->copy();
                $periodsToAdd = $i - 1;
                $dueDate = match ($frequency) {
                    'Weekly' => $dueDate->addWeeks($periodsToAdd),
                    'Monthly' => $dueDate->addMonthsNoOverflow($periodsToAdd),
                    'Yearly' => $dueDate->addYears($periodsToAdd),
                    default => $dueDate->addMonthsNoOverflow($periodsToAdd)
                };
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
}
