<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class LoanProductRuleResolver
{
    public function resolve(?int $loanProductId, ?string $loanType): ?array
    {
        if ($this->hasLegacyRuleColumns()) {
            return $this->resolveFromLegacyColumns($loanProductId, $loanType);
        }

        return $this->resolveFromRuleRows($loanProductId, $loanType);
    }

    public function requiresCollateral(?array $rule, float $loanAmount): bool
    {
        if (! $rule || ! ($rule['requires_collateral'] ?? false)) {
            return false;
        }

        $threshold = $rule['collateral_required_above'] ?? null;
        if ($threshold === null) {
            return true;
        }

        return $loanAmount > (float) $threshold;
    }

    public function requiresCoBorrower(?array $rule): bool
    {
        return (bool) ($rule['requires_coborrower'] ?? false);
    }

    private function fallbackByLoanType(?string $loanType): ?array
    {
        if (! $loanType) {
            return null;
        }

        $key = strtolower(trim(preg_replace('/\s+loan$/i', '', $loanType)));
        $fallback = [
            'personal' => ['requires_collateral' => false, 'requires_coborrower' => true, 'collateral_required_above' => null],
            'home' => ['requires_collateral' => true, 'requires_coborrower' => true, 'collateral_required_above' => null],
            'business' => ['requires_collateral' => true, 'requires_coborrower' => true, 'collateral_required_above' => null],
        ];

        if (! isset($fallback[$key])) {
            return null;
        }

        return [
            'loan_product_id' => null,
            'loan_product_name' => $loanType,
            ...$fallback[$key],
        ];
    }

    private function hasLegacyRuleColumns(): bool
    {
        return Schema::hasColumn('loan_product_rules', 'requires_collateral')
            && Schema::hasColumn('loan_product_rules', 'requires_coborrower')
            && Schema::hasColumn('loan_product_rules', 'collateral_required_above');
    }

    private function resolveFromLegacyColumns(?int $loanProductId, ?string $loanType): ?array
    {
        $query = DB::table('loan_products as lp')
            ->leftJoin('loan_product_rules as lpr', 'lpr.loan_product_id', '=', 'lp.id')
            ->select([
                'lp.id',
                'lp.name',
                'lpr.requires_collateral',
                'lpr.requires_coborrower',
                'lpr.collateral_required_above',
            ]);

        if ($loanProductId) {
            $query->where('lp.id', $loanProductId);
        } elseif (! empty($loanType)) {
            $query->whereRaw('LOWER(lp.name) = ?', [mb_strtolower(trim($loanType))]);
        } else {
            return null;
        }

        $row = $query->first();
        if (! $row) {
            return $this->fallbackByLoanType($loanType);
        }

        return [
            'loan_product_id' => (int) $row->id,
            'loan_product_name' => (string) $row->name,
            'requires_collateral' => (bool) $row->requires_collateral,
            'requires_coborrower' => (bool) $row->requires_coborrower,
            'collateral_required_above' => $row->collateral_required_above !== null
                ? (float) $row->collateral_required_above
                : null,
        ];
    }

    private function resolveFromRuleRows(?int $loanProductId, ?string $loanType): ?array
    {
        $productQuery = DB::table('loan_products as lp')->select(['lp.id', 'lp.name']);

        if ($loanProductId) {
            $productQuery->where('lp.id', $loanProductId);
        } elseif (! empty($loanType)) {
            $productQuery->whereRaw('LOWER(lp.name) = ?', [mb_strtolower(trim($loanType))]);
        } else {
            return null;
        }

        $product = $productQuery->first();
        if (! $product) {
            return $this->fallbackByLoanType($loanType);
        }

        $ruleRows = DB::table('loan_product_rules')
            ->select(['rule_type', 'condition_key', 'operator', 'condition_value'])
            ->where('loan_product_id', $product->id)
            ->get();

        $requiresCollateral = $ruleRows->contains(fn ($r) => strtolower((string) $r->rule_type) === 'collateral');
        $requiresCoBorrower = $ruleRows->contains(fn ($r) => strtolower((string) $r->rule_type) === 'coborrower');

        $collateralThresholdRow = $ruleRows->first(function ($r) {
            return strtolower((string) $r->rule_type) === 'collateral'
                && str_contains(strtolower((string) $r->condition_key), 'loan_amount')
                && is_numeric($r->condition_value);
        });

        return [
            'loan_product_id' => (int) $product->id,
            'loan_product_name' => (string) $product->name,
            'requires_collateral' => $requiresCollateral,
            'requires_coborrower' => $requiresCoBorrower,
            'collateral_required_above' => $collateralThresholdRow
                ? (float) $collateralThresholdRow->condition_value
                : null,
        ];
    }
}
