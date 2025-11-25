<?php

namespace App\Services;

use App\Models\Borrower;
use App\Models\Collateral;
use App\Models\Loan;
use App\Models\Payment;
use App\Models\CoBorrower;
use App\Models\LoanComment;
use Illuminate\Support\Collection;

class BorrowerService
{
    public function getBorrowersForIndex(): Collection
    {
        return Borrower::query()
            ->with(['borrowerEmployment', 'borrowerAddresses', 'loan'])
            ->orderBy('last_name')
            ->get()
            ->map(fn (Borrower $borrower) => [
                'id' => $borrower->ID,
                'name' => $borrower->name,
                'occupation' => $borrower->borrowerEmployment?->occupation,
                'gender' => $borrower->gender,
                'age' => $borrower->age,
                'address' => $borrower->borrowerAddresses?->address,
                'city' => $borrower->borrowerAddresses?->city,
                'zipcode' => $borrower->borrowerAddresses?->postal_code ?? '',
                'email' => $borrower->email,
                'mobile' => $borrower->contact_no,
                'landline' => $borrower->land_line,
                'activeLoan' => $this->formatLoan(
                    $borrower->loan?->loadMissing('collateral')
                ),
            ]);
    }

    public function getBorrowerForShow(int $borrowerId): array
    {
        $borrower = Borrower::query()
            ->with([
                'borrowerEmployment',
                'borrowerAddresses',
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
        $allLoans = $borrower->loans->map(function (Loan $loan) {
            return [
                'loanNo' => $loan->loan_no ?? sprintf('LN-%06d', $loan->id),
                'released' => optional($loan->start_date)?->toDateString() ?? '',
                'maturity' => optional($loan->end_date)?->toDateString() ?? '',
                'repayment' => $loan->repayment_frequency?->value ?? '',
                'principal' => (float) $loan->principal_amount,
                'interest' => number_format($loan->interest_rate, 2).'%',
                'interestType' => $loan->interest_type?->value ?? '',
                'penalty' => 0,
                'due' => (float) $loan->amortizationSchedules->first()?->installment_amount ?? 0,
                'balance' => (float) $loan->balance_remaining,
                'status' => $loan->status?->value ?? '',
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
        $activeLoan = $this->formatLoan($activeLoanModel);      // formatted array for frontend

        $comments = $activeLoanModel
            ? LoanComment::where('loan_id', $activeLoanModel->id)
                ->orderByDesc('comment_date')
                ->get()
            : collect();


        return [
            'borrower' => [
                'id' => $borrower->ID,
                'name' => $borrower->name,
                'occupation' => $borrower->borrowerEmployment?->occupation,
                'gender' => $borrower->gender,
                'age' => $borrower->age,
                'address' => $borrower->borrowerAddresses?->address,
                'city' => $borrower->borrowerAddresses?->city,
                'zipcode' => $borrower->borrowerAddresses?->postal_code ?? '',
                'email' => $borrower->email,
                'mobile' => $borrower->contact_no,
                'landline' => $borrower->land_line,
                'files' => $borrower->files->values()->all(),
                'coBorrowers' => $borrower->coBorrowers->values()->all(),
                'comments' => $comments->values()->all(),
                'amortizationSchedule' => $this->formatAmortizationSchedule($activeLoanModel),
                'loans' => $allLoans, // include all loans
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
            ->first(fn (Loan $loan) => $loan->status?->value === 'Active')
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

        return [
            'loanNo' => $loan->loan_no ?? sprintf('LN-%06d', $loan->id),
            'released' => optional($loan->start_date)?->toDateString() ?? '',
            'maturity' => optional($loan->end_date)?->toDateString() ?? '',
            'repayment' => $loan->repayment_frequency?->value ?? '',
            'principal' => (float) $loan->principal_amount,
            'interest' => number_format($loan->interest_rate, 2).'%',
            'interestType' => $loan->interest_type?->value ?? '',
            'penalty' => 0,
            'due' => (float) $loan->amortizationSchedules->first()?->installment_amount ?? 0,
            'balance' => (float) $loan->balance_remaining,
            'status' => $loan->status?->value ?? '',
        ];
    }

    private function formatRepayments(?Loan $loan): array
    {
        if (! $loan) {
            return [];
        }

        return Payment::query()
            ->where('loan_id', $loan->ID)
            ->with('verifiedBy')
            ->latest('payment_date')
            ->get()
            ->map(function (Payment $payment) use ($loan) {
                $borrowerName = $loan->borrower?->name ?? 'Unknown Borrower';
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
                'status' => $schedule->status,
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
        $borrower = Borrower::create([
            'first_name'        => $data['borrowerFirstName'],
            'last_name'        => $data['borrowerLastName'],
            'date_of_birth'    => $data['dateOfBirth'],
            'marital_status'   => $data['maritalStatus'] ?? null,
            'age'              => $data['age'] ?? null,
            'home_ownership'   => $data['homeOwnership'] ?? null,
            'permanent_address'=> $data['permanentAddress'] ?? null,
            'mobile_number'    => $data['mobileNumber'],
            'occupation'       => $data['occupation'] ?? null,
            'dependent_child'  => $data['dependentChild'] ?? null,
            'net_pay'          => $data['netPay'] ?? null,
        ]);

        
        if (!empty($data['phone'])) {
            $borrower->spouse()->create([
                'first_name' => $data['spouseFirstName'],
                'last_name' => $data['spouseLastName'],
                'contact_no' => $data['spouseMobileNumber'],
                'occupation' => $data['spouseOccupation'],
                'position' => $data['spousePosition'],
                'agency_address' => $data['spouseAgencyAddress'],
            ]);
        }

        return $borrower;
    }

}
