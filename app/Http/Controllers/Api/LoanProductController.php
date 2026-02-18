<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoanProduct;
use Illuminate\Http\JsonResponse;

class LoanProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = LoanProduct::query()
            ->with('rules')
            ->orderBy('name')
            ->get()
            ->map(static function (LoanProduct $product) {
                return [
                    'id' => (int) $product->id,
                    'name' => $product->name,
                    'description' => $product->description,
                    'rules' => [
                        // These are placeholders; real requirement evaluation is dynamic.
                        'requires_collateral' => false,
                        'requires_coborrower' => false,
                        'collateral_required_above' => null,
                        'dynamic_rules' => $product->rules->map(static fn ($rule) => [
                            'rule_type' => $rule->rule_type,
                            'condition_key' => $rule->condition_key,
                            'operator' => $rule->operator,
                            'condition_value' => $rule->condition_value !== null
                                ? (float) $rule->condition_value
                                : null,
                        ])->values(),
                    ],
                ];
            })
            ->values();

        return response()->json([
            'data' => $products,
        ]);
    }
}
