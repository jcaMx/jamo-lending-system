<?php

namespace App\Services;

use App\Models\Borrower;
use App\Models\BorrowerAddress;
use App\Models\BorrowerEmployment;
use App\Models\BorrowerId;
use App\Models\CoBorrower;
use App\Models\Collateral;
use App\Models\File;
use App\Models\Loan;
use App\Models\Spouse;
use App\Models\VehicleCollateralDetails;
use App\Models\AtmCollateralDetails;
use App\Models\User;
use Illuminate\Http\UploadedFile;
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
            $borrower = $user->borrower;

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

            $collateral = null;
            $collateralType = strtolower((string) ($data['collateral_type'] ?? ''));
            if ($collateralType !== '') {
                $collateral = Collateral::create([
                    'loan_id' => $loan->ID,
                    'type' => $this->normalizeCollateralType($collateralType),
                    'estimated_value' => $data['estimated_value'] ?? null,
                    'appraisal_date' => $data['appraisal_date'] ?? null,
                    'appraised_by' => $data['appraised_by'] ?? null,
                    'description' => $data['description'] ?? null,
                    'status' => 'Pending',
                ]);
            }

            if ($collateral && $collateralType === 'vehicle') {
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

            if ($collateral && $collateralType === 'atm') {
                AtmCollateralDetails::create([
                    'collateral_id' => $collateral->ID,
                    'bank_name' => $data['bank_name'] ?? '',
                    'account_no' => $data['account_no'] ?? '',
                    'cardno_4digits' => $data['cardno_4digits'] ?? 0,
                ]);
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
            if ($collateral && ! empty($files['ownership_proof'])) {
                $file = $files['ownership_proof'];
                $path = $file->store('collaterals', 'public');
                $fileRecord = File::create([
                    'documentable_id' => $collateral->ID,
                    'documentable_type' => Collateral::class,
                    'document_type_id' => null,
                    'status' => 'pending',
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'description' => 'Collateral ownership proof',
                    'borrower_id' => $borrower->ID,
                    'collateral_id' => $collateral->ID,
                    'uploaded_at' => now(),
                ]);
                $ownershipProofFileId = $fileRecord->id;
            }

            if ($collateral && ! empty($data['documents']['collateral']) && ! empty($files['collateral_documents'])) {
                foreach ($data['documents']['collateral'] as $index => $docMeta) {
                    $uploaded = $files['collateral_documents'][$index]['file'] ?? null;
                    if (! $uploaded instanceof UploadedFile) {
                        continue;
                    }

                    $documentTypeId = isset($docMeta['document_type_id']) ? (int) $docMeta['document_type_id'] : null;
                    if (! $documentTypeId) {
                        continue;
                    }

                    $path = $uploaded->store("collaterals/{$collateral->ID}", 'public');
                    File::create([
                        'documentable_id' => $collateral->ID,
                        'documentable_type' => Collateral::class,
                        'document_type_id' => $documentTypeId,
                        'status' => 'pending',
                        'file_name' => $uploaded->getClientOriginalName(),
                        'file_path' => $path,
                        'description' => 'collateral',
                        'borrower_id' => $borrower->ID,
                        'collateral_id' => $collateral->ID,
                        'uploaded_at' => now(),
                    ]);
                }
            }

            if (! empty($files['files'])) {
                foreach ($files['files'] as $file) {
                    $path = $file->store('borrowers', 'public');
                    File::create([
                        'documentable_id' => $borrower->ID,
                        'documentable_type' => Borrower::class,
                        'document_type_id' => null,
                        'status' => 'pending',
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'description' => 'Borrower valid ID',
                        'borrower_id' => $borrower->ID,
                        'collateral_id' => $collateral?->ID,
                        'uploaded_at' => now(),
                    ]);
                }
            }

            if ($collateral && $ownershipProofFileId) {
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
