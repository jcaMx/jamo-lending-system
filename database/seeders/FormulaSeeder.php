<?php

namespace Database\Seeders;

use App\Models\Formula;
use Illuminate\Database\Seeder;

class FormulaSeeder extends Seeder
{
    public function run(): void
    {
        $formulas = [
                [
                    'name' => 'Compound Interest Loan',
                    'description' => null,
                    'expression' => 'principal*(rate*(1+rate)^term)/((1+rate)^term-1)',
                    'variables' => '["principal","rate","term"]',
                ],
                [
                    'name' => 'Diminishing Balance Loan',
                    'description' => null,
                    'expression' => 'remaining_principal*rate',
                    'variables' => '["remaining_principal","rate"]',
                ],
        ];

        foreach ($formulas as $formulaData) {
            Formula::firstOrCreate(
                ['name' => $formulaData['name']],
                array_merge($formulaData, ['createdAt' => now()])
            );
        }
    }
}
