<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\CollateralService;
use App\Models\Borrower;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BorrowerController extends Controller
{
    public function __construct(
        private CollateralService $collateralService
    ) {}

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
            // Find the borrower by ID from mock data
        $borrower = collect($borrowers)->firstWhere('id', (int) $id);

        if (!$borrower) {
            abort(404, 'Borrower not found');
        }


        // If you have a real Borrower model, fetch collaterals from the active loan
        // For now, we'll add mock collateral data, but you should replace this with:
        // $loanId = $borrower->activeLoan->id ?? null;
        // $collaterals = $loanId ? $this->collateralService->listAllCollateral($loanId) : [];
        
        // Mock collateral data for now (replace with real data later)
        $collaterals = $this->getMockCollaterals($id);

        // // Find the borrower by ID
        // $borrower = Borrower::with([
        //     'loans.collaterals.landDetails',
        //     'loans.collaterals.vehicleDetails',
        //     'loans.collaterals.atmDetails',
        //     'loans.collaterals.appraisedBy',
        //     'repayments',
        //     'collateral',
        //     'files',
        //     'coBorrowers',
        //     'comments'
        // ])->findOrFail($id);

        // $activeLoan = $borrower->loans()->where('status', 'Active')->first();
        // $collaterals = $activeLoan 
        //     ? $this->collateralService->listAllCollateral($activeLoan->id)
        //     : [];
    

        // In BorrowerController.php, update the show method:
        return Inertia::render('borrowers/show', [
            'borrower' => array_merge($borrower, ['collaterals' => $collaterals]), // ← Add collaterals to borrower
            'activeLoan' => $borrower['activeLoan'] ?? null,
            'repayments' => $borrower['repayments'] ?? [],
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
        // Temporary mock method - replace with real data fetching
    private function getMockCollaterals(int $borrowerId): array
    {
        // This should be replaced with:
        // 1. Get borrower's active loan
        // 2. Get all collaterals for that loan
        // For now, return sample data
        return [
            [
                'id' => 1,
                'type' => 'Land',
                'estimated_value' => 500000.00,
                'appraisal_date' => '2025-01-15',
                'status' => 'Pledged',
                'description' => 'Residential lot in Davao City',
                'remarks' => 'Title verified',
                'land_details' => [
                    'titleNo' => 12345,
                    'lotNo' => 678,
                    'location' => 'Ubalde, R. Castillo, Davao City',
                    'areaSize' => '200 sqm',
                ],
            ],
            [
                'id' => 2,
                'type' => 'Vehicle',
                'estimated_value' => 350000.00,
                'appraisal_date' => '2025-01-20',
                'status' => 'Pledged',
                'description' => '2020 Toyota Vios',
                'remarks' => 'Vehicle in good condition',
                'vehicle_details' => [
                    'type' => 'Car',
                    'brand' => 'Toyota',
                    'model' => 'Vios',
                    'year_model' => 2020,
                    'plate_no' => 'ABC-1234',
                    'engine_no' => 'ENG123456',
                    'transmission_type' => 'Automatic',
                    'fuel_type' => 'Gasoline',
                ],
            ],
        ];
    }
}

