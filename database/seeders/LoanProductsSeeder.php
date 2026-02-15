<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LoanProductsSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $loanProducts = [
            [
                'name' => 'Personal Loan',
                'description' => 'Short-term personal loan for individuals',
                'requires_collateral' => false,
                'requires_coborrower' => true,
                'collateral_required_above' => null,
            ],
            [
                'name' => 'Home Loan',
                'description' => 'Long-term financing for home purchase',
                'requires_collateral' => true,
                'requires_coborrower' => true,
                'collateral_required_above' => null,
            ],
            [
                'name' => 'Business Loan',
                'description' => 'Loan for business expansion or operations',
                'requires_collateral' => true,
                'requires_coborrower' => true,
                'collateral_required_above' => null, // dynamic requirement
            ],
            [
                'name' => 'Emergency Loan',
                'description' => 'Quick, small loan for urgent needs',
                'requires_collateral' => false,
                'requires_coborrower' => false,
                'collateral_required_above' => null,
            ],
        ];

        foreach ($loanProducts as $product) {
            // Insert loan product
            $loanProductId = DB::table('loan_products')->updateOrInsert(
                ['name' => $product['name']],
                [
                    'description' => $product['description'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );

            // Get the inserted product ID
            $id = DB::table('loan_products')->where('name', $product['name'])->value('id');

            // Insert associated loan_product_rules
            DB::table('loan_product_rules')->updateOrInsert(
                ['loan_product_id' => $id],
                [
                    'requires_collateral' => $product['requires_collateral'],
                    'requires_coborrower' => $product['requires_coborrower'],
                    'collateral_required_above' => $product['collateral_required_above'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }
}
