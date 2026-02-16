<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class LoanProductRuleResolver
{
    public function resolve(?int $loanProductId, ?string $loanType): ?array
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
}
