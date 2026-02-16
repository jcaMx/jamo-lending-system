<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class LoanProductController extends Controller
{
    public function index(): JsonResponse
    {
        $products = DB::table('loan_products as lp')
            ->leftJoin('loan_product_rules as lpr', 'lpr.loan_product_id', '=', 'lp.id')
            ->select([
                'lp.id',
                'lp.name',
                'lp.description',
                'lpr.requires_collateral',
                'lpr.requires_coborrower',
                'lpr.collateral_required_above',
            ])
            ->orderBy('lp.name')
            ->get()
            ->map(static function ($row) {
                return [
                    'id' => (int) $row->id,
                    'name' => $row->name,
                    'description' => $row->description,
                    'rules' => [
                        'requires_collateral' => (bool) $row->requires_collateral,
                        'requires_coborrower' => (bool) $row->requires_coborrower,
                        'collateral_required_above' => $row->collateral_required_above !== null
                            ? (float) $row->collateral_required_above
                            : null,
                    ],
                ];
            })
            ->values();

        return response()->json([
            'data' => $products,
        ]);
    }
}
