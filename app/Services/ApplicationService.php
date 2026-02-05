<?php

namespace App\Services;

use App\Models\Borrower;
use App\Models\BorrowerAddress;
use App\Models\BorrowerEmployment;
use App\Models\BorrowerId;
use App\Models\CoBorrower;
use App\Models\Collateral;
use App\Models\Files;
use App\Models\Loan;
use App\Models\Spouse;
use App\Models\VehicleCollateralDetails;
use App\Models\AtmCollateralDetails;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ApplicationService
{
    /**
     * Create full application in a single transaction.
     */
    public function createFullApplication(array $data, array $files = [], ?User $user = null): Loan
    {
        return DB::transaction(function () use ($data, $files, $user) {
            $user = $user ?? Auth::user();

            $borrower = Borrower::create([
                'user_id' => $user?->id,
                'first_name' => $data['borrower_first_name'],
                'last_name' => $data['borrower_last_name'],
                'birth_date' => $data['date_of_birth'],
                'gender' => $data['gender'],
                'marital_status' => $data['marital_status'],
                'contact_no' => $data['contact_no'],
                'land_line' => $data['landline_number'] ?? null,
                'numof_dependentchild' => $data['dependent_child'] ?? null,
                'home_ownership' => $data['home_ownership'] ?? null,
                'email' => $user?->email ?? '',
                'status' => 'Pending',
            ]);

            BorrowerAddress::create([
                'borrower_id' => $borrower->ID,
                'address' => $data['permanent_address'],
                'city' => $data['city'],
            ]);

            BorrowerEmployment::create([
                'borrower_id' => $borrower->ID,
                'employment_status' => $data['employment_status'] ?? null,
                'income_source' => $data['income_source'] ?? null,
                'occupation' => $data['occupation'] ?? null,
                'position' => $data['position'] ?? null,
                'agency_address' => $data['agency_address'] ?? null,
                'monthly_income' => $data['monthly_income'] ?? 0,
            ]);

            BorrowerId::create([
                'borrower_id' => $borrower->ID,
                'id_type' => $data['valid_id_type'],
                'id_number' => $data['valid_id_number'],
            ]);

            if (
                ($data['marital_status'] ?? null) === 'Married'
                && ! empty($data['spouse_first_name'])
                && ! empty($data['spouse_last_name'])
            ) {
                Spouse::create([
                    'borrower_id' => $borrower->ID,
                    'first_name' => $data['spouse_first_name'],
                    'last_name' => $data['spouse_last_name'],
                    'contact_no' => $data['spouse_mobile_number'] ?? '',
                    'occupation' => $data['spouse_occupation'] ?? null,
                    'position' => $data['spouse_position'] ?? null,
                    'agency_address' => $data['spouse_agency_address'] ?? null,
                ]);
            }

            $loan = Loan::create([
                'borrower_id' => $borrower->ID,
                'loan_type' => $data['loan_type'],
                'principal_amount' => $data['loan_amount'],
                'interest_rate' => $data['interest_rate'],
                'interest_type' => $this->normalizeInterestType($data['interest_type']),
                'repayment_frequency' => $this->normalizeRepaymentFrequency($data['repayment_frequency']),
                'term_months' => $data['term'],
                'balance_remaining' => $data['loan_amount'],
            ]);

            $collateral = Collateral::create([
                'loan_id' => $loan->ID,
                'type' => $this->normalizeCollateralType($data['collateral_type']),
                'estimated_value' => $data['estimated_value'] ?? null,
                'appraisal_date' => $data['appraisal_date'] ?? null,
                'appraised_by' => $data['appraised_by'] ?? null,
                'description' => $data['description'] ?? null,
                'status' => 'Pending',
            ]);

            if (strtolower($data['collateral_type']) === 'vehicle') {
                VehicleCollateralDetails::create([
                    'collateral_id' => $collateral->ID,
                    'type' => $data['vehicle_type'] ?? null,
                    'brand' => $data['make'] ?? '',
                    'model' => $data['series'] ?? '',
                    'year_model' => $data['year_model'] ?? null,
                    'plate_no' => $data['plate_no'] ?? null,
                    'engine_no' => $data['engine_no'] ?? null,
                    'transmission_type' => $data['transmission_type'] ?? null,
                    'fuel_type' => $data['fuel'] ?? null,
                ]);
            }

            if (strtolower($data['collateral_type']) === 'atm') {
                $allowedBanks = ['BDO', 'BPI', 'LandBank', 'MetroBank'];
                $bankName = $data['bank_name'] ?? null;
                $bankName = in_array($bankName, $allowedBanks, true) ? $bankName : null;

                if ($bankName) {
                    AtmCollateralDetails::create([
                        'collateral_id' => $collateral->ID,
                        'bank_name' => $bankName,
                        'account_no' => $data['account_no'] ?? '',
                        'cardno_4digits' => $data['cardno_4digits'] ?? 0,
                    ]);
                }
            }

            $coBorrowerIds = [];
            if (! empty($data['coBorrowers'])) {
                foreach ($data['coBorrowers'] as $co) {
                    $coBorrower = CoBorrower::create([
                        'borrower_id' => $borrower->ID,
                        'first_name' => $co['first_name'],
                        'last_name' => $co['last_name'],
                        'birth_date' => $co['birth_date'],
                        'marital_status' => $co['marital_status'] ?? null,
                        'contact_no' => $co['mobile'] ?? '',
                        'address' => $co['address'],
                        'occupation' => $co['occupation'] ?? null,
                        'position' => $co['position'] ?? null,
                        'agency_address' => $co['employer_address'] ?? null,
                        'email' => $user?->email ?? '',
                        'age' => $this->calculateAge($co['birth_date']),
                    ]);
                    $coBorrowerIds[] = $coBorrower->ID;
                }
            }

            $ownershipProofFileId = null;
            if (! empty($files['ownership_proof'])) {
                $file = $files['ownership_proof'];
                $path = $file->store('collaterals', 'public');
                $fileRecord = Files::create([
                    'file_type' => 'collateral_documennt',
                    'file_name' => substr($file->getClientOriginalName(), 0, 20),
                    'file_path' => $path,
                    'description' => 'Collateral ownership proof',
                    'borrower_id' => $borrower->ID,
                    'collateral_id' => $collateral->ID,
                ]);
                $ownershipProofFileId = $fileRecord->ID;
            }

            if (! empty($files['files'])) {
                foreach ($files['files'] as $file) {
                    $path = $file->store('borrowers', 'public');
                    Files::create([
                        'file_type' => 'id_document',
                        'file_name' => substr($file->getClientOriginalName(), 0, 20),
                        'file_path' => $path,
                        'description' => 'Borrower valid ID',
                        'borrower_id' => $borrower->ID,
                        'collateral_id' => $collateral->ID,
                    ]);
                }
            }

            if ($ownershipProofFileId) {
                $collateral->ownership_proof = $ownershipProofFileId;
                $collateral->save();
            }

            return $loan;
        });
    }

    private function normalizeCollateralType(string $value): ?string
    {
        $map = [
            'land' => 'Land',
            'vehicle' => 'Vehicle',
            'atm' => 'ATM',
        ];

        return $map[strtolower($value)] ?? null;
    }

    private function normalizeInterestType(string $value): ?string
    {
        $map = [
            'compound' => 'Compound',
            'diminishing' => 'Diminishing',
        ];

        return $map[strtolower($value)] ?? $value;
    }

    private function normalizeRepaymentFrequency(string $value): ?string
    {
        $map = [
            'weekly' => 'Weekly',
            'monthly' => 'Monthly',
            'yearly' => 'Yearly',
        ];

        return $map[strtolower($value)] ?? $value;
    }

    private function calculateAge(string $birthDate): ?int
    {
        try {
            return \Carbon\Carbon::parse($birthDate)->age;
        } catch (\Throwable $e) {
            return null;
        }
    }
}
