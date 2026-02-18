<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LoanProductRulesSeeder extends Seeder
{
    public function run(): void
    {
        // Clear existing rows so re-seeding does not duplicate rules.
        DB::table('loan_product_rules')->truncate();

        DB::table('loan_product_rules')->insert([
            // Personal Loan
            [
                'loan_product_id' => 1,
                'rule_type' => 'collateral',
                'condition_key' => 'monthly_income',
                'operator' => '>',
                'condition_value' => 5, // loan_amount > monthly_income * 5
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'loan_product_id' => 1,
                'rule_type' => 'coborrower',
                'condition_key' => 'dti_ratio',
                'operator' => '>',
                'condition_value' => 40, // dti_ratio > 40%
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Business Loan
            [
                'loan_product_id' => 3,
                'rule_type' => 'collateral',
                'condition_key' => 'monthly_income',
                'operator' => '>',
                'condition_value' => 6, // loan_amount > monthly_income * 6
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'loan_product_id' => 3,
                'rule_type' => 'coborrower',
                'condition_key' => 'dti_ratio',
                'operator' => '>',
                'condition_value' => 35, // dti_ratio > 35%
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
