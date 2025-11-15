<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BorrowerController extends Controller
{
    public function index()
    {
        // Get borrowers data from centralized method
        $borrowers = $this->getBorrowersData();

        // Send all borrowers to index
        return Inertia::render('borrowers/index', [
            'borrowers' => $borrowers,
        ]);
    }
    public function add()
    {
        return Inertia::render('borrowers/add');
        
    }

    public function show($id)
    {
        // Get the same dataset as index
        $borrowers = $this->getBorrowersData();

        // Find the borrower by ID
        $borrower = collect($borrowers)->firstWhere('id', (int) $id);

        return Inertia::render('borrowers/show', [
            'borrower' => $borrower,
        ]);
    }

    // Centralized dataset (to simulate backend DB)
    private function getBorrowersData(): array
    {
        // Master dataset with all borrower data
        return [
            [
                'id' => 1500154,
                'name' => 'Maria Salem',
                'occupation' => 'Software Developer',
                'gender' => 'Female',
                'age' => 20,
                'address' => 'Ubalde, R. Castillo',
                'city' => 'Davao City',
                'zipcode' => '8000',
                'email' => 'mirasol@gmail.com',
                'mobile' => '09234354974',
                'landline' => '01235306981',
                'activeLoan' => [
                    'loanNo' => 'A100651',
                    'released' => '01/01/2025',
                    'maturity' => '01/12/2025',
                    'repayment' => 'Monthly',
                    'principal' => 2000,
                    'interest' => '5%',
                    'interestType' => 'Compound',
                    'penalty' => 0,
                    'due' => 200,
                    'balance' => 1855,
                    'status' => 'Active',
                ],
                'repayments' => [
                    [
                        'id' => 1,
                        'name' => 'Maria Salem',
                        'loanNo' => 'A100651',
                        'method' => 'Cash',
                        'collectedBy' => 'RJ Arevalo',
                        'collectionDate' => '10/15/2025',
                        'paidAmount' => 8650,
                    ],
                    [
                        'id' => 2,
                        'name' => 'Maria Salem',
                        'loanNo' => 'A100651',
                        'method' => 'GCash',
                        'collectedBy' => 'Alex Lopez',
                        'collectionDate' => '11/01/2025',
                        'paidAmount' => 5400,
                    ],
                ],
            ],
            [
                'id' => 1500155,
                'name' => 'Ramon Dela Peña',
                'occupation' => 'Small Business Owner',
                'gender' => 'Male',
                'age' => 34,
                'address' => 'Lizada, Toril',
                'city' => 'Davao City',
                'zipcode' => '8000',
                'email' => 'ramon.dp@gmail.com',
                'mobile' => '09124567890',
                'landline' => '0821234567',
                'activeLoan' => [
                    'loanNo' => 'B203412',
                    'released' => '02/05/2025',
                    'maturity' => '02/05/2026',
                    'repayment' => 'Weekly',
                    'principal' => 50000,
                    'interest' => '8%',
                    'interestType' => 'Flat',
                    'penalty' => 500,
                    'due' => 2500,
                    'balance' => 42000,
                    'status' => 'Active',
                ],
                'repayments' => [
                    [
                        'id' => 1,
                        'name' => 'Ramon Dela Peña',
                        'loanNo' => 'B203412',
                        'method' => 'Cash',
                        'collectedBy' => 'Jenny Flores',
                        'collectionDate' => '10/10/2025',
                        'paidAmount' => 2500,
                    ],
                ],
            ],
            [
                'id' => 1500156,
                'name' => 'Angela Bautista',
                'occupation' => 'Nurse',
                'gender' => 'Female',
                'age' => 29,
                'address' => 'Ponciano Reyes Street',
                'city' => 'Tagum City',
                'zipcode' => '8100',
                'email' => 'angela.b@gmail.com',
                'mobile' => '09087651234',
                'landline' => '0823345678',
                'activeLoan' => [
                    'loanNo' => 'C402555',
                    'released' => '03/01/2025',
                    'maturity' => '03/01/2026',
                    'repayment' => 'Monthly',
                    'principal' => 80000,
                    'interest' => '6%',
                    'interestType' => 'Diminishing',
                    'penalty' => 0,
                    'due' => 4000,
                    'balance' => 60000,
                    'status' => 'Active',
                ],
                'repayments' => [
                    [
                        'id' => 1,
                        'name' => 'Angela Bautista',
                        'loanNo' => 'C402555',
                        'method' => 'Bank Transfer',
                        'collectedBy' => 'Jose Ramos',
                        'collectionDate' => '11/01/2025',
                        'paidAmount' => 6000,
                    ],
                ],
            ],
        ];
    }
}
