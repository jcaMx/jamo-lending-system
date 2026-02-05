<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Borrower;
use App\Models\Loan;
use App\Models\Payment;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MyLoanController extends Controller
{
    /**
     * Display the authenticated user's loan details.
     */
    public function index()
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('login')->withErrors([
                'email' => 'Please log in to access your loan.',
            ]);
        }

        $borrower = $user->borrower()->first();

        if (! $borrower) {
            return Inertia::render('customer/MyLoan', [
                'authUser' => null,
                'collaterals' => [],
                'activeLoan' => null,
                'repayments' => [],
            ]);
        }

        $payload = $this->getBorrowerLoanData($borrower->ID);

        if ($payload['pendingLoan']) {
            return Inertia::render('customer/MyLoanApplicationSummary', [
                'authUser' => $payload['borrower'],
                'pendingLoan' => $payload['pendingLoan'],
                'collaterals' => $payload['pendingCollaterals'],
            ]);
        }

        return Inertia::render('customer/MyLoan', [
            'authUser' => $payload['borrower'],
            'collaterals' => $payload['collaterals'],
            'activeLoan' => $payload['activeLoan'],
            // 'repayments' => $payload['repayments'],
        ]);
    }

    /**
     * Adapted version of your getBorrowerForShow logic
     */
    private function getBorrowerLoanData(int $borrowerId): array
    {
        $borrower = Borrower::query()
            ->with([
                'borrowerEmployment',
                'borrowerAddress',
                'loans.collateral.landDetails',
                'loans.collateral.vehicleDetails',
                'loans.collateral.atmDetails',
                'loans.amortizationSchedules',
            ])
            ->findOrFail($borrowerId);

        $activeLoanModel = $borrower->loans()
            ->whereIn('status', ['Active', 'Approved', 'Released'])
            ->latest()
            ->first();

        if ($activeLoanModel) {
            $activeLoanModel->load(['amortizationSchedules','collateral']);
        }

        $pendingLoanModel = $borrower->loans()
            ->where('status', 'Pending')
            ->latest()
            ->first();

        if ($pendingLoanModel) {
            $pendingLoanModel->load(['collateral']);
        }

        return [
            'borrower' => [
                'id' => $borrower->ID,
                'name' => trim(($borrower->first_name ?? '').' '.($borrower->last_name ?? '')),
                'email' => $borrower->email,
                'mobile' => $borrower->contact_no,
                'address' => $borrower->borrowerAddress?->address,
                'amortizationSchedule' => $this->formatAmortizationSchedule($activeLoanModel),
            ],
            'activeLoan' => $activeLoanModel ? $this->formatLoan($activeLoanModel) : null,
            'pendingLoan' => $pendingLoanModel ? $this->formatLoan($pendingLoanModel) : null,
            // 'repayments' => $activeLoanModel ? $this->formatRepayments($activeLoanModel) : [],
            'collaterals' => ($activeLoanModel && $activeLoanModel->collateral)
                ? $this->formatCollaterals(collect([$activeLoanModel->collateral]))
                : [],
            'pendingCollaterals' => ($pendingLoanModel && $pendingLoanModel->collateral)
                ? $this->formatCollaterals(collect([$pendingLoanModel->collateral]))
                : [],
        ];
    }

    private function formatLoan(?Loan $loan): ?array
    {
        if (! $loan) {
            return null;
        }

        $status = $loan->status instanceof \BackedEnum
            ? $loan->status->value
            : (string) ($loan->status ?? '');

        return [
            'loanNo' => $loan->loan_no ?? sprintf('LN-%06d', $loan->ID),
            'released' => optional($loan->start_date)?->toDateString() ?? '',
            'maturity' => optional($loan->end_date)?->toDateString() ?? '',
            // 'repayment' => $loan->repayment_frequency?->value ?? $loan->repayment_frequency ?? '',
            'principal' => (float) $loan->principal_amount,
            'interest' => (float) $loan->interest_rate,
            'interestType' => $loan->interest_type?->value ?? $loan->interest_type ?? '',
            'penalty' => 0,
            'due' => (float) $loan->amortizationSchedules->first()?->installment_amount ?? 0,
            'balance' => (float) $loan->balance_remaining,
            'status' => $status,
        ];
    }

    // private function formatRepayments(?Loan $loan): array
    // {
    //     if (! $loan) {
    //         return [];
    //     }

    //     return Payment::query()
    //         ->where('loan_id', $loan->ID)
    //         ->with(['loan.borrower', 'jamoUser'])
    //         ->latest('payment_date')
    //         ->get()
    //         ->map(function (Payment $payment) use ($loan) {
    //             $borrowerName = $payment->loan?->borrower
    //                 ? trim(($payment->loan->borrower->first_name ?? '').' '.($payment->loan->borrower->last_name ?? ''))
    //                 : ($loan->borrower?->first_name ?? '').' '.($loan->borrower?->last_name ?? '');
    //             $borrowerName = $borrowerName ?: 'Unknown Borrower';

    //             $verifiedByName = $payment->jamoUser
    //                 ? ($payment->jamoUser->first_name ?? '').' '.($payment->jamoUser->last_name ?? '')
    //                 : 'Unverified';
    //             $verifiedByName = trim($verifiedByName) ?: 'Unverified';

    //             return [
    //                 'id' => $payment->ID,
    //                 'name' => $borrowerName,
    //                 'loanNo' => $loan->loan_no ?? sprintf('LN-%06d', $loan->ID),
    //                 'method' => $payment->payment_method?->value ?? (string) $payment->payment_method ?? 'Cash',
    //                 'collectedBy' => $verifiedByName,
    //                 'collectionDate' => optional($payment->payment_date)?->toDateString() ?? '',
    //                 'paidAmount' => (float) $payment->amount,
    //             ];
    //         })
    //         ->values()
    //         ->all();
    // }

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

    private function formatCollaterals($collaterals): array
    {
        return $collaterals->map(fn ($collateral) => [
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
}
