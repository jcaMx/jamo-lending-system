<?php

namespace App\Services;

use App\Models\Borrower;
use App\Models\BorrowerId;
use App\Models\Collateral;
use App\Models\Files;
use App\Models\Loan;
use App\Models\LoanComment;
use App\Models\Payment;
use App\Models\Spouse;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class BorrowerService
{
    public function __construct(
        protected UserService $userService
    ) {}

    public function getBorrowersForIndex(): Collection
    {
        return Borrower::query()
            ->with(['borrowerEmployment', 'borrowerAddress', 'loan'])
            ->orderBy('last_name')
            ->get()
            ->map(fn (Borrower $borrower) => [
                'id' => $borrower->ID,
                'first_name' => $borrower->first_name,
                'last_name' => $borrower->last_name,
                'occupation' => $borrower->borrowerEmployment?->occupation,
                'gender' => $borrower->gender,
                'age' => $this->computeAge($borrower->birth_date),
                'address' => $borrower->borrowerAddress?->address,
                'city' => $borrower->borrowerAddress?->city,
                'zipcode' => $borrower->borrowerAddress?->postal_code ?? '',
                'email' => $borrower->email,
                'mobile' => $borrower->contact_no,
                'landline' => $borrower->land_line,
                'activeLoan' => $this->formatLoan(
                    $this->resolveActiveLoan($borrower)?->loadMissing('collateral')
                ),
            ]);
    }

    public function getBorrowerForShow(int $borrowerId): array
    {
        $borrower = Borrower::query()
            ->with([
                'borrowerEmployment',
                'borrowerAddress',
                'files',
                'coBorrowers',
                'loans.borrower',
                'loans.collateral.landDetails',
                'loans.collateral.vehicleDetails',
                'loans.collateral.atmDetails',
                'loans.amortizationSchedules',
            ])
            ->findOrFail($borrowerId);

        // Map all loans with collateral
        $allLoans = $borrower->loans
            ->map(function (Loan $loan) {
                // Safely extract status as string (handle enum or string)
                $status = $loan->status instanceof \BackedEnum
                    ? $loan->status->value
                    : (string) ($loan->status ?? '');

                return [
                    'loanNo' => $loan->loan_no ?? sprintf('LN-%06d', $loan->id),
                    'released' => optional($loan->start_date)?->toDateString() ?? '',
                    'maturity' => optional($loan->end_date)?->toDateString() ?? '',
                    'repayment' => $loan->repayment_frequency?->value ?? '',
                    'principal' => (float) $loan->principal_amount,
                    'interest' => number_format($loan->interest_rate, 2).'%',
                    'interestType' => $loan->interest_type?->value ?? '',
                    'loan_type' => $loan->loan_type ?? '',
                    'repayment_frequency' => $loan->repayment_frequency?->value ?? '',
                    'penalty' => 0,
                    'due' => (float) $loan->amortizationSchedules->first()?->installment_amount ?? 0,
                    'balance' => (float) $loan->balance_remaining,
                    'status' => $status,
                    'collateral' => $loan->collateral ? [
                        'id' => $loan->collateral->id,
                        'type' => $loan->collateral->type,
                        'estimated_value' => $loan->collateral->estimated_value,
                        'appraisal_date' => optional($loan->collateral->appraisal_date)?->toDateString(),
                        'status' => $loan->collateral->status,
                        'description' => $loan->collateral->description,
                        'remarks' => $loan->collateral->remarks,
                        'land_details' => $loan->collateral->landDetails,
                        'vehicle_details' => $loan->collateral->vehicleDetails,
                        'atm_details' => $loan->collateral->atmDetails,
                    ] : null,
                ];
            })
            ->values()
            ->all();

        $activeLoanModel = $this->resolveActiveLoan($borrower); // Loan model

        // Ensure schedules are loaded for the active loan
        if ($activeLoanModel) {
            $activeLoanModel->load('amortizationSchedules');
        }

        $activeLoan = $this->formatLoan($activeLoanModel);      // formatted array for frontend

        $comments = $activeLoanModel
            ? LoanComment::where('loan_id', $activeLoanModel->id)
                ->orderByDesc('comment_date')
                ->get()
            : collect();

        return [
            'borrower' => [
                'id' => $borrower->ID,
                'name' => trim(($borrower->first_name ?? '').' '.($borrower->last_name ?? '')),
                'first_name' => $borrower->first_name,
                'last_name' => $borrower->last_name,
                'age' => $this->computeAge($borrower->birth_date),
                'occupation' => $borrower->borrowerEmployment?->occupation,
                'gender' => $borrower->gender,
                'address' => $borrower->borrowerAddress?->address,
                'city' => $borrower->borrowerAddress?->city,
                'zipcode' => $borrower->borrowerAddress?->postal_code ?? '',
                'email' => $borrower->email,
                'mobile' => $borrower->contact_no,
                'landline' => $borrower->land_line,
                'files' => $borrower->files->values()->all(),
                'coBorrowers' => $borrower->coBorrowers->values()->all(),
                'comments' => $comments->values()->all(),
                'amortizationSchedule' => $this->formatAmortizationSchedule($activeLoanModel),
                'loan' => $allLoans, // include all loans
            ],
            'activeLoan' => $activeLoan,
            'repayments' => $this->formatRepayments($activeLoanModel),
            'collaterals' => $activeLoanModel && $activeLoanModel->collateral
                            ? $this->formatCollaterals(collect([$activeLoanModel->collateral]))
                            : [],

        ];
    }

    private function resolveActiveLoan(Borrower $borrower): ?Loan
    {
        // Pick first active loan or first loan
        return $borrower->loans
            ->first(fn (Loan $loan) => $loan->status === 'Active')
            ?? $borrower->loans->first();
    }

    private function formatCollaterals(Collection $collaterals): array
    {
        return $collaterals->map(fn (Collateral $collateral) => [
            'id' => $collateral->id,
            'type' => $collateral->type,
            'estimated_value' => $collateral->estimated_value,
            'appraisal_date' => optional($collateral->appraisal_date)?->toDateString(),
            'status' => $collateral->status,
            'description' => $collateral->description,
            'remarks' => $collateral->remarks,
            'land_details' => $collateral->landDetails,
            'vehicle_details' => $collateral->vehicleDetails,
            'atm_details' => $collateral->atmDetails,
        ])
            ->values()
            ->all();
    }

    private function formatLoan(?Loan $loan): ?array
    {
        if (! $loan) {
            return null;
        }

        // Safely extract status as string (handle enum or string)
        $status = $loan->status instanceof \BackedEnum
            ? $loan->status->value
            : (string) ($loan->status ?? '');

        return [
            'loanNo' => $loan->loan_no ?? sprintf('LN-%06d', $loan->id),
            'released' => optional($loan->start_date)?->toDateString() ?? '',
            'maturity' => optional($loan->end_date)?->toDateString() ?? '',
            'repayment' => $loan->repayment_frequency?->value ?? '',
            'principal' => (float) $loan->principal_amount,
            'interest' => number_format($loan->interest_rate, 2).'%',
            'interestType' => $loan->interest_type?->value ?? '',
            'loan_type' => $loan->loan_type ?? '',
            'penalty' => 0,
            'due' => (float) $loan->amortizationSchedules->first()?->installment_amount ?? 0,
            'balance' => (float) $loan->balance_remaining,
            'status' => $status,
        ];
    }

    private function formatRepayments(?Loan $loan): array
    {
        if (! $loan) {
            return [];
        }

        return Payment::query()
            ->where('loan_id', $loan->ID)
            ->with(['jamoUser', 'loan.borrower'])
            ->latest('payment_date')
            ->get()
            ->map(function (Payment $payment) use ($loan) {
                // Get borrower name from payment->loan->borrower relationship
                $borrowerName = $payment->loan?->borrower
                    ? trim(($payment->loan->borrower->first_name ?? '').' '.($payment->loan->borrower->last_name ?? ''))
                    : ($loan->borrower?->first_name ?? '').' '.($loan->borrower?->last_name ?? '');
                $borrowerName = $borrowerName ?: 'Unknown Borrower';

                $verifiedByName = $payment->jamoUser
                    ? ($payment->jamoUser->first_name ?? '').' '.($payment->jamoUser->last_name ?? '')
                    : 'Unverified';
                $verifiedByName = trim($verifiedByName) ?: 'Unverified';

                return [
                    'id' => $payment->ID,
                    'name' => $borrowerName,
                    'loanNo' => $loan->loan_no ?? sprintf('LN-%06d', $loan->ID),
                    'method' => $payment->payment_method?->value ?? 'Cash',
                    'collectedBy' => $verifiedByName,
                    'collectionDate' => optional($payment->payment_date)?->toDateString() ?? '',
                    'paidAmount' => (float) $payment->amount,
                ];
            })
            ->values()
            ->all();
    }

    private function formatAmortizationSchedule(?Loan $loan): array
    {
        if (! $loan) {
            return [];
        }

        return $loan->amortizationSchedules
            ->map(fn ($schedule) => [
                'installment_no' => $schedule->installment_no,
                'due_date' => optional($schedule->due_date)?->toDateString(),
                'interest_amount' => (float) $schedule->interest_amount,
                'penalty_amount' => (float) $schedule->penalty_amount,
                'installment_amount' => (float) ($schedule->installment_amount ?? 0),
                'amount_paid' => (float) $schedule->amount_paid,
                'status' => $schedule->status?->value ?? $schedule->status ?? 'Unpaid',
            ])
            ->values()
            ->all();
    }

    private function formatFiles($files)
    {
        return $files->map(function ($f) {
            return [
                'id' => $f->ID,
                'fileName' => $f->file_name,
                'filePath' => asset($f->file_path),
                'description' => $f->description,
                'uploadedAt' => $f->uploaded_at,
            ];
        })->toArray();
    }

    public function createBorrower(array $data): Borrower
    {
        $clean = fn ($value) => isset($value) && trim($value) !== '' ? trim($value) : null;

        return DB::transaction(function () use ($data, $clean) {
            $email = $clean($data['email'] ?? null);

            $userId = null;
            // 1) If admin explicitly provided a user_id, use it
            if (! empty($data['user_id'])) {
                $userId = (int) $data['user_id'];
            } elseif ($email) {
                // 2) If a user already exists with this email, link it
                $userId = User::query()->where('email', $email)->value('id');
                // 3) Otherwise create a new customer user and link it
                if (! $userId) {
                    $result = $this->userService->createCustomerUser([
                        'fName' => $clean($data['borrower_first_name'] ?? null) ?? 'Customer',
                        'lName' => $clean($data['borrower_last_name'] ?? null) ?? 'User',
                        'email' => $email,
                    ]);

                    $userId = $result['user']->id;
        }
            }

            // -------------------------------
            // Borrower
            // -------------------------------
            $borrower = Borrower::create([
                'user_id' => $userId,
                'first_name' => $clean($data['borrower_first_name'] ?? null),
                'last_name' => $clean($data['borrower_last_name'] ?? null),
                'birth_date' => $clean($data['date_of_birth'] ?? null),
                'gender' => $clean($data['gender'] ?? null),
                // removed 'age'
                'marital_status' => $clean($data['marital_status'] ?? null),
                'home_ownership' => $clean($data['home_ownership'] ?? null),
                'contact_no' => $clean($data['contact_no'] ?? null),
                'land_line' => $clean($data['landline_number'] ?? null),
                'email' => $email,
                'num_of_dependentchild' => $clean($data['dependent_child'] ?? null),
                'membership_date' => now(),
                'status' => 'Pending',
            ]);

            // -------------------------------
            // Borrower Address
            // -------------------------------
            if (! empty($clean($data['permanent_address'] ?? null))) {
                $borrower->borrowerAddress()->create([
                    'address' => $clean($data['permanent_address']),
                    'city' => $clean($data['city'] ?? null),
                    'postal_code' => $clean($data['postal_code'] ?? null),
                ]);
            }

            // -------------------------------
            // Borrower Employment
            // -------------------------------
            if (! empty($clean($data['occupation'] ?? null)) || ! empty($clean($data['monthly_income'] ?? null))) {
                $borrower->borrowerEmployment()->create([
                    'employment_status' => $clean($data['employment_status'] ?? null),
                    'income_source' => $clean($data['income_source'] ?? null),
                    'occupation' => $clean($data['occupation'] ?? null),
                    'position' => $clean($data['position'] ?? null),
                    'monthly_income' => $clean($data['monthly_income'] ?? null),
                    'agency_address' => $clean($data['agency_address'] ?? null),
                ]);
            }

            // -------------------------------
            // Spouse (if married)
            // -------------------------------
            if (($data['marital_status'] ?? null) === 'Married' &&
                ! empty($clean($data['spouse_first_name'] ?? null)) &&
                ! empty($clean($data['spouse_last_name'] ?? null))
            ) {
                $borrower->spouse()->create([
                    'first_name' => $clean($data['spouse_first_name'] ?? null),
                    'last_name' => $clean($data['spouse_last_name'] ?? null),
                    'contact_no' => $clean($data['spouse_mobile_number'] ?? null),
                    'occupation' => $clean($data['spouse_occupation'] ?? null),
                    'position' => $clean($data['spouse_position'] ?? null),
                    'agency_address' => $clean($data['spouse_agency_address'] ?? null),
                ]);
            }

            // -------------------------------
            // Borrower ID (optional when documents are used as source of truth)
            // -------------------------------
            $validIdType = $clean($data['valid_id_type'] ?? null);
            $validIdNumber = $clean($data['valid_id_number'] ?? null);

            if ($validIdType && $validIdNumber) {
                BorrowerId::create([
                    'borrower_id' => $borrower->ID,
                    'id_type' => $validIdType,
                    'id_number' => $validIdNumber,
                ]);
            }

            // -------------------------------
            // Documents (polymorphic files)
            // -------------------------------
            $documentCategories = ['borrower_identity', 'borrower_address', 'borrower_employment'];
            $fileTypeByCategory = [
                'borrower_identity' => 'id_document',
                'borrower_address' => 'contract',
                'borrower_employment' => 'contract',
            ];

            foreach ($documentCategories as $category) {
                $documents = $data['documents'][$category] ?? [];

                if (! is_array($documents)) {
                    continue;
                }

                foreach ($documents as $document) {
                    $file = $document['file'] ?? null;
                    $documentTypeId = isset($document['document_type_id']) ? (int) $document['document_type_id'] : null;

                    if (! $file instanceof UploadedFile || ! $documentTypeId) {
                        continue;
                    }

                    $storedPath = $file->store("borrowers/{$borrower->ID}/{$category}", 'public');

                    Files::create([
                        'file_type' => $fileTypeByCategory[$category] ?? 'contract',
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $storedPath,
                        'uploaded_at' => now(),
                        // Keep selected document type traceable even without document_type_id column.
                        'description' => $category . ' (type_id:' . $documentTypeId . ')',
                        'borrower_id' => $borrower->ID,
                        'collateral_id' => null,
                    ]);
                }
            }

            return $borrower;

        });
    }

    public function update(Borrower $borrower, array $data): void
    {
        $borrower->update($data);
    }

    public function computeAge($date_of_birth)
    {
        return $date_of_birth ? Carbon::parse($date_of_birth)->age : null;
    }

    public function deleteBorrower(int $borrowerId): bool
    {
        $borrower = Borrower::findOrFail($borrowerId);

        // Optionally delete related records
        $borrower->borrowerAddress()->delete();
        $borrower->borrowerEmployment()->delete();
        $borrower->spouse()->delete();
        $borrower->coBorrowers()->delete();
        $borrower->loans()->delete(); // or handle loans carefully if needed

        return $borrower->delete();
    }

    public function updateBorrower(Borrower $borrower, array $data): Borrower
    {
        // Update borrower basic info
        $borrower->update([
            'email' => $data['email'] ?? $borrower->email,
            'contact_no' => $data['mobile'] ?? $borrower->contact_no,
            'landline' => $data['landline'] ?? $borrower->landline,
            'occupation' => $data['occupation'] ?? $borrower->occupation,
            'gender' => $data['gender'] ?? $borrower->gender,

        ]);

        // Update or create borrower address if provided
        if (! empty($data['address']) || ! empty($data['city']) || ! empty($data['zipcode'])) {
            $borrower->borrowerAddress()->updateOrCreate(
                ['borrower_id' => $borrower->id],
                [
                    'address' => $data['address'] ?? $borrower->borrowerAddress?->address,
                    'city' => $data['city'] ?? $borrower->borrowerAddress?->city,
                    'postal_code' => $data['zipcode'] ?? $borrower->borrowerAddress?->postal_code,
                ]
            );
        }

        return $borrower->fresh(['borrowerAddress', 'borrowerEmployment', 'spouse', 'coBorrowers', 'loans']);
    }
}
