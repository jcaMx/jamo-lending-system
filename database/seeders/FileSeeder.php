<?php

namespace Database\Seeders;

use App\Models\Borrower;
use App\Models\Collateral;
use App\Models\Files;
use Illuminate\Database\Seeder;

class FileSeeder extends Seeder
{
    public function run(): void
    {
        $borrowers = Borrower::all();

        foreach ($borrowers as $borrower) {
            // Create ID document
            Files::firstOrCreate(
                [
                    'borrower_id' => $borrower->ID,
                    'file_type' => 'id_document',
                ],
                [
                    'file_name' => 'ID_' . $borrower->first_name . '_' . $borrower->last_name . '.pdf',
                    'file_path' => '/documents/borrowers/' . $borrower->ID . '/id_document.pdf',
                    'description' => 'Valid ID document for ' . $borrower->first_name . ' ' . $borrower->last_name,
                ]
            );

            // Create photo
            Files::firstOrCreate(
                [
                    'borrower_id' => $borrower->ID,
                    'file_type' => 'photo',
                ],
                [
                    'file_name' => 'Photo_' . $borrower->first_name . '_' . $borrower->last_name . '.jpg',
                    'file_path' => '/documents/borrowers/' . $borrower->ID . '/photo.jpg',
                    'description' => 'Profile photo of ' . $borrower->first_name . ' ' . $borrower->last_name,
                ]
            );

            // Get borrower's loan and create contract files
            $loan = $borrower->loan;
            if ($loan) {
                Files::firstOrCreate(
                    [
                        'borrower_id' => $borrower->ID,
                        'file_type' => 'contract',
                    ],
                    [
                        'file_name' => 'Contract_Loan_' . $loan->ID . '.pdf',
                        'file_path' => '/documents/borrowers/' . $borrower->ID . '/contracts/loan_' . $loan->ID . '.pdf',
                        'description' => 'Loan contract for Loan #' . $loan->ID,
                    ]
                );
            }
        }

        // Create collateral documents
        $collaterals = Collateral::with('loan')->get();

        foreach ($collaterals as $collateral) {
            $borrowerId = $collateral->loan ? $collateral->loan->borrower_id : null;

            Files::firstOrCreate(
                [
                    'collateral_id' => $collateral->ID,
                    'file_type' => 'collateral_document',
                ],
                [
                    'borrower_id' => $borrowerId,
                    'file_name' => 'Collateral_' . $collateral->type . '_' . $collateral->ID . '.pdf',
                    'file_path' => '/documents/collaterals/' . $collateral->ID . '/document.pdf',
                    'description' => ucfirst($collateral->type) . ' collateral document for Collateral #' . $collateral->ID,
                ]
            );
        }
    }
}
