<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\LoanProduct;
use Illuminate\Support\Facades\DB;
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

    public function requirements(LoanProduct $loanProduct): JsonResponse
    {
        $documentTypes = DB::table('document_types')
            ->where('is_active', true)
            ->get(['id', 'code', 'name', 'category']);

        $requirements = DB::table('loan_product_document_requirements as lpdr')
            ->leftJoin('document_types as dt', 'dt.id', '=', 'lpdr.document_type_id')
            ->where('lpdr.loan_product_id', $loanProduct->id)
            ->where('lpdr.is_active', true)
            ->orderBy('lpdr.sort_order')
            ->orderBy('lpdr.id')
            ->get([
                'lpdr.id',
                'lpdr.requirement_type',
                'lpdr.document_type_id',
                'lpdr.document_category',
                'lpdr.subject_type',
                'lpdr.collateral_type',
                'lpdr.is_required',
                'lpdr.min_count',
                'lpdr.max_count',
                'lpdr.sort_order',
                'lpdr.notes',
                'dt.code as document_type_code',
                'dt.name as document_type_name',
                'dt.category as document_type_category',
            ])
            ->map(function ($row) use ($documentTypes) {
                $acceptableDocuments = [];
                if ($row->requirement_type === 'category' && $row->document_category) {
                    $acceptableDocuments = $documentTypes->where('category', $row->document_category)->values()->map(function ($dt) {
                        return [
                            'id' => (int) $dt->id,
                            'code' => $dt->code,
                            'name' => $dt->name,
                        ];
                    })->toArray();
                }

                return [
                    'id' => (int) $row->id,
                    'requirement_type' => (string) $row->requirement_type,
                    'document_type_id' => $row->document_type_id !== null ? (int) $row->document_type_id : null,
                    'document_category' => $row->document_category,
                    'document_category_label' => $row->document_category ? ucwords(str_replace('_', ' ', $row->document_category)) : null,
                    'subject_type' => (string) $row->subject_type,
                    'collateral_type' => $row->collateral_type,
                    'is_required' => (bool) $row->is_required,
                    'min_count' => (int) $row->min_count,
                    'max_count' => $row->max_count !== null ? (int) $row->max_count : null,
                    'sort_order' => (int) $row->sort_order,
                    'notes' => $row->notes,
                    'document_type' => $row->document_type_id !== null
                        ? [
                            'id' => (int) $row->document_type_id,
                            'code' => (string) $row->document_type_code,
                            'name' => (string) $row->document_type_name,
                            'category' => (string) $row->document_type_category,
                        ]
                        : null,
                    'acceptable_documents' => $acceptableDocuments,
                ];
            })
            ->values();

        return response()->json([
            'data' => $requirements,
        ]);
    }
}
