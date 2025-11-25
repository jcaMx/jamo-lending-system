<?php

namespace App\Services\Amortization;

use App\Models\Formula;
use App\Models\Loan;
use App\Models\RepaymentFrequency;
use App\Repositories\Interfaces\IAmortizationCalculator;
use App\Repositories\Interfaces\IHolidayService;
use App\Services\FormulaService;

class CompoundAmortizationCalculator implements IAmortizationCalculator
{
    public function __construct(protected IHolidayService $holidayService,
        protected FormulaService $formulaService) {}

    public function generate(Loan $loan): array
    {
        $formula = Formula::where('name', 'Compound Interest Loan')->firstOrFail();

        return $this->calculateSchedules($loan, $formula);
    }

    public function recalculate(Loan $loan): array
    {
        $formula = Formula::where('name', 'Compound Interest Loan')->firstOrFail();

        return $this->calculateSchedules($loan, $formula, false);
    }

    protected function calculateSchedules(Loan $loan, Formula $formula, bool $isNewLoan = true)
    {
        $remaining = $loan->principal_amount;
        $frequency = $loan->repayment_frequency;
        $rate = $loan->interest_rate / 100;

        // Determine total installments
        $totalInstallments = match ($frequency) {
            RepaymentFrequency::Weekly => (int) ceil($loan->term_months * 4.345),
            RepaymentFrequency::Monthly => $loan->term_months,
            RepaymentFrequency::Yearly => (int) ceil($loan->term_months / 12)
        };

        $periodRate = match ($frequency) {
            RepaymentFrequency::Weekly => $rate / 52,
            RepaymentFrequency::Monthly => $rate / 12,
            RepaymentFrequency::Yearly => $rate
        };

        $dueDate = $loan->start_date->copy();
        $results = [];

        for ($i = 1; $i <= $totalInstallments; $i++) {
            $installmentAmount = $this->formulaService->evaluate($formula, [
                'principal' => $loan->principal_amount,
                'rate' => $periodRate,
                'term' => $totalInstallments,
            ]);

            $interest = $remaining * $periodRate;
            $principalPayment = $installmentAmount - $interest;

            $remaining -= $principalPayment;
            $remaining = max(0, $remaining);

            $adjustedDueDate = $this->holidayService->adjustDate($dueDate);
            $holiday = $this->holidayService->getHoliday($adjustedDueDate);

            $results[] = [
                'installment_no' => $i,
                'installment_amount' => round($installmentAmount, 2),
                'interest_amount' => round($interest, 2),
                'due_date' => $adjustedDueDate,
                'holiday_id' => $holiday?->ID,
            ];

            $dueDate = match ($frequency) {
                RepaymentFrequency::Weekly => $dueDate->addWeek(),
                RepaymentFrequency::Monthly => $dueDate->addMonthNoOverflow(),
                RepaymentFrequency::Yearly => $dueDate->addYear()
            };
        }

        return $results;
    }
}
