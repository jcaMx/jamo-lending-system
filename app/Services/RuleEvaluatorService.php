<?php

namespace App\Services;

use App\Models\BorrowerEmployment;
use App\Models\LoanProduct;
use App\Models\LoanProductRule;
use Illuminate\Support\Facades\Log;


class RuleEvaluatorService
{
    /**
     * Evaluate product rules against the provided loan context.
     *
     * @param  array<string, mixed>  $context
     * @return array{collateral: bool, coborrower: bool}
     */
    public function evaluate(LoanProduct $product, ?int $borrowerId = null, array $context = []): array
    {
        Log::info('EVALUATE METHOD CALLED'); // Add this first
    
        $requirements = [
            'collateral' => false,
            'coborrower' => false,
        ];

        $loanAmount = $this->toFloat($context['loan_amount'] ?? 0.0);
        $monthlyIncome = $this->resolveMonthlyIncome($borrowerId, $context);
        $dtiRatio = $this->resolveDtiRatio($loanAmount, $monthlyIncome, $context);
        Log::info('Rule Debug', [
            'loan_amount' => $loanAmount,
            'monthly_income' => $monthlyIncome,
            'dti_ratio' => $dtiRatio,
            'rules' => $product->rules->map(fn($r) => [
                'key' => $r->condition_key,
                'operator' => $r->operator,
                'value' => $r->condition_value,
                'type' => $r->rule_type,
            ]),
        ]);
        

        $businessAgeYears = $this->toFloat($context['business_age_years'] ?? 0.0);
        $monthlyNetCashflow = $this->toFloat($context['monthly_net_cashflow'] ?? 0.0);

        if (! $product->relationLoaded('rules')) {
            $product->load('rules');
        }

        foreach ($product->rules as $rule) {
            if (! $rule instanceof LoanProductRule) {
                continue;
            }

            $result = false;
            $conditionValue = $this->toFloat($rule->condition_value ?? 0.0);

            switch ($rule->condition_key) {
                // loan_amount > monthly_income * multiplier
                case 'monthly_income':
                    if ($monthlyIncome <= 0) {
                        break; // Skip rule if income is unavailable
                    }
                    $threshold = $monthlyIncome * $conditionValue;
                    $result = $this->compare($loanAmount, (string) $rule->operator, $threshold);
                    break;

                // dti_ratio > threshold (threshold is stored in percent)
                case 'dti_ratio':
                    if ($monthlyIncome <= 0) {
                        break; // Skip rule if income is unavailable
                    }
                    $result = $this->compare($dtiRatio, (string) $rule->operator, $conditionValue);
                    break;

                // Optional supported rule key for future rules
                case 'monthly_net_cashflow':
                    $threshold = $monthlyNetCashflow * $conditionValue;
                    $result = $this->compare($loanAmount, (string) $rule->operator, $threshold);
                    break;

                // Optional supported rule key for future rules
                case 'business_age_years':
                    $result = $this->compare($businessAgeYears, (string) $rule->operator, $conditionValue);
                    break;

                default:
                    // Unknown condition keys are ignored to keep evaluation resilient.
                    break;
            }

            if (! $result) {
                continue;
            }

            if ($rule->rule_type === 'collateral') {
                $requirements['collateral'] = true;
            }

            if ($rule->rule_type === 'coborrower') {
                $requirements['coborrower'] = true;
            }
        }

        return $requirements;
    }

    /**
     * @param  array<string, mixed>  $context
     */
    private function resolveMonthlyIncome(?int $borrowerId, array $context): float
    {
        $contextIncome = $this->toFloat($context['monthly_income'] ?? null);
        if ($contextIncome > 0) {
            return $contextIncome;
        }

        if (! $borrowerId) {
            return 0.0;
        }

        $employment = BorrowerEmployment::query()
            ->where('borrower_id', $borrowerId)
            ->latest('ID')
            ->first();

        return $this->toFloat($employment?->monthly_income ?? 0.0);
    }

    /**
     * @param  array<string, mixed>  $context
     */
    private function resolveDtiRatio(float $loanAmount, float $monthlyIncome, array $context): float
    {
        $providedDti = $context['dti_ratio'] ?? null;
        if ($providedDti !== null && $providedDti !== '') {
            return $this->toFloat($providedDti);
        }

        // Skip DTI calculation if income is missing
        if ($monthlyIncome <= 0) {
            return 0.0;
        }

        $monthlyObligation = $this->toFloat($context['monthly_obligation'] ?? 0.0);
        if ($monthlyObligation <= 0) {
            $term = max(1, (int) $this->toFloat($context['term'] ?? 0.0));
            $monthlyObligation = $term > 0 ? $loanAmount / $term : 0.0;
        }

        return ($monthlyObligation / $monthlyIncome) * 100.0;
    }

    private function compare(float $left, string $operator, float $right): bool
    {
        return match (trim($operator)) {
            '>' => $left > $right,
            '>=' => $left >= $right,
            '<' => $left < $right,
            '<=' => $left <= $right,
            '=', '==' => $left == $right,
            '!=', '<>' => $left != $right,
            default => false,
        };
    }

    private function toFloat(mixed $value): float
    {
        if (is_numeric($value)) {
            return (float) $value;
        }

        return 0.0;
    }
}
