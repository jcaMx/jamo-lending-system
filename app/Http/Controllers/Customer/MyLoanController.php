<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Borrower;
use App\Models\DocumentType;
use App\Models\Loan;
use App\Models\LoanProduct;
use App\Services\DisbursementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class MyLoanController extends Controller
{
    public function __construct(
        protected DisbursementService $disbursementService
    ) {}

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

        $borrower = Borrower::query()
            ->where('user_id', $user->id)
            ->first();

        if (! $borrower) {
            return Inertia::render('customer/MyLoan', [
                'authUser' => null,
                'collaterals' => [],
                'activeLoan' => null,
                'hasLoan' => false,
                'repayments' => [],
            ]);
        }

        if (! $borrower->loans()->exists()) {
            return Inertia::render('customer/MyLoan', [
                'authUser' => [
                    'id' => $borrower->ID,
                    'name' => trim(($borrower->first_name ?? '').' '.($borrower->last_name ?? '')),
                    'email' => $borrower->email,
                    'mobile' => $borrower->contact_no,
                ],
                'collaterals' => [],
                'activeLoan' => null,
                'hasLoan' => false,
            ]);
        }

        $payload = $this->getBorrowerLoanData($borrower->ID);

        if ($payload['pendingLoan']) {
            return Inertia::render('customer/MyLoanApplicationSummary', [
                'authUser' => $payload['borrower'],
                'pendingLoan' => $payload['pendingLoan'],
                'collaterals' => $payload['pendingCollaterals'],
                'loanProducts' => LoanProduct::query()
                    ->orderBy('name')
                    ->get(['id', 'name'])
                    ->map(fn ($product) => [
                        'id' => (int) $product->id,
                        'name' => (string) $product->name,
                    ])
                    ->values()
                    ->all(),
            ]);
        }

        return Inertia::render('customer/MyLoan', [
            'authUser' => $payload['borrower'],
            'collaterals' => $payload['collaterals'],
            'activeLoan' => $payload['activeLoan'],
            'hasLoan' => true,
            // 'repayments' => $payload['repayments'],
        ]);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('login')->withErrors([
                'email' => 'Please log in to update your loan application.',
            ]);
        }

        $borrower = Borrower::query()
            ->with([
                'borrowerAddress',
                'loans' => fn ($query) => $query->where('status', 'Pending')->latest(),
                'loans.collateral.landDetails',
                'loans.collateral.vehicleDetails',
                'loans.collateral.atmDetails',
            ])
            ->where('user_id', $user->id)
            ->first();

        if (! $borrower) {
            return back()->withErrors([
                'borrower' => 'Borrower profile not found.',
            ]);
        }

        /** @var Loan|null $pendingLoan */
        $pendingLoan = $borrower->loans->first();

        if (! $pendingLoan) {
            return back()->withErrors([
                'loan' => 'No pending loan application found.',
            ]);
        }

        $validated = $request->validate([
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'mobile' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:500'],
            'principal' => ['nullable', 'numeric', 'min:0'],
            'loanType' => ['nullable', 'string', 'max:100'],
            'interestType' => ['nullable', 'string', 'max:100'],
            'collateral' => ['nullable', 'array'],
            'collateral.description' => ['nullable', 'string', 'max:255'],
            'collateral.land_details' => ['nullable', 'array'],
            'collateral.land_details.titleNo' => ['nullable', 'integer'],
            'collateral.land_details.location' => ['nullable', 'string', 'max:255'],
            'collateral.land_details.areaSize' => ['nullable', 'string', 'max:100'],
            'collateral.vehicle_details' => ['nullable', 'array'],
            'collateral.vehicle_details.type' => ['nullable', 'in:Car,Motorcycle,Truck'],
            'collateral.vehicle_details.brand' => ['nullable', 'string', 'max:100'],
            'collateral.vehicle_details.model' => ['nullable', 'string', 'max:100'],
            'collateral.vehicle_details.year_model' => ['nullable', 'integer'],
            'collateral.vehicle_details.plate_no' => ['nullable', 'string', 'max:100'],
            'collateral.vehicle_details.engine_no' => ['nullable', 'string', 'max:100'],
            'collateral.vehicle_details.transmission_type' => ['nullable', 'in:Manual,Automatic'],
            'collateral.vehicle_details.fuel_type' => ['nullable', 'string', 'max:100'],
            'collateral.atm_details' => ['nullable', 'array'],
            'collateral.atm_details.bank_name' => ['nullable', 'string', 'max:100'],
            'collateral.atm_details.account_no' => ['nullable', 'string', 'max:100'],
            'collateral.atm_details.cardno_4digits' => ['nullable', 'digits:4'],
        ]);

        try {
            DB::transaction(function () use ($borrower, $pendingLoan, $validated) {
                $borrower->update([
                    'first_name' => $validated['first_name'] ?? $borrower->first_name,
                    'last_name' => $validated['last_name'] ?? $borrower->last_name,
                    'email' => $validated['email'] ?? $borrower->email,
                    'contact_no' => $validated['mobile'] ?? $borrower->contact_no,
                ]);

                if (array_key_exists('address', $validated)) {
                    $borrower->borrowerAddress()->updateOrCreate(
                        ['borrower_id' => $borrower->ID],
                        ['address' => $validated['address'] ?? '']
                    );
                }

                $pendingLoan->update([
                    'principal_amount' => $validated['principal'] ?? $pendingLoan->principal_amount,
                    'balance_remaining' => $validated['principal'] ?? $pendingLoan->balance_remaining,
                    'loan_type' => $validated['loanType'] ?? $pendingLoan->loan_type,
                    'interest_type' => $validated['interestType'] ?? $pendingLoan->interest_type,
                ]);

                $collateralPayload = $validated['collateral'] ?? null;
                $collateral = $pendingLoan->collateral;

                if ($collateral && is_array($collateralPayload)) {
                    $collateral->update([
                        'description' => $collateralPayload['description'] ?? $collateral->description,
                    ]);

                    if ($collateral->type === 'Land' && isset($collateralPayload['land_details'])) {
                        $collateral->landDetails()->updateOrCreate(
                            ['collateralID' => $collateral->ID],
                            [
                                'titleNo' => $collateralPayload['land_details']['titleNo'] ?? null,
                                'location' => $collateralPayload['land_details']['location'] ?? '',
                                'areaSize' => $collateralPayload['land_details']['areaSize'] ?? '',
                            ]
                        );
                    }

                    if ($collateral->type === 'Vehicle' && isset($collateralPayload['vehicle_details'])) {
                        $collateral->vehicleDetails()->updateOrCreate(
                            ['collateral_id' => $collateral->ID],
                            [
                                'type' => $collateralPayload['vehicle_details']['type'] ?? null,
                                'brand' => $collateralPayload['vehicle_details']['brand'] ?? '',
                                'model' => $collateralPayload['vehicle_details']['model'] ?? '',
                                'year_model' => $collateralPayload['vehicle_details']['year_model'] ?? null,
                                'plate_no' => $collateralPayload['vehicle_details']['plate_no'] ?? '',
                                'engine_no' => $collateralPayload['vehicle_details']['engine_no'] ?? '',
                                'transmission_type' => $collateralPayload['vehicle_details']['transmission_type'] ?? null,
                                'fuel_type' => $collateralPayload['vehicle_details']['fuel_type'] ?? '',
                            ]
                        );
                    }

                    if ($collateral->type === 'ATM' && isset($collateralPayload['atm_details'])) {
                        $collateral->atmDetails()->updateOrCreate(
                            ['collateral_id' => $collateral->ID],
                            [
                                'bank_name' => $collateralPayload['atm_details']['bank_name'] ?? '',
                                'account_no' => $collateralPayload['atm_details']['account_no'] ?? '',
                                'cardno_4digits' => $collateralPayload['atm_details']['cardno_4digits'] ?? null,
                            ]
                        );
                    }
                }
            });

            return back()->with('success', 'Loan application updated successfully.');
        } catch (\Throwable $e) {
            return back()->withErrors([
                'error' => 'Failed to update loan application: '.$e->getMessage(),
            ]);
        }
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
                'coBorrowers',
                'files.documentType',
                'loans.collateral.landDetails',
                'loans.collateral.vehicleDetails',
                'loans.collateral.atmDetails',
                'loans.collateral.files.documentType',
                'loans.amortizationSchedules.penalties',
            ])
            ->findOrFail($borrowerId);

        $activeLoanModel = $borrower->loans()
            ->whereIn('status', ['Active', 'Approved', 'Released'])
            ->latest()
            ->first();

        if ($activeLoanModel) {
            $activeLoanModel->load([
                'amortizationSchedules.penalties',
                'collateral.landDetails',
                'collateral.vehicleDetails',
                'collateral.atmDetails',
                'collateral.files.documentType',
            ]);
        }

        $pendingLoanModel = $borrower->loans()
            ->where('status', 'Pending')
            ->latest()
            ->first();

        if ($pendingLoanModel) {
            $pendingLoanModel->load([
                'collateral.landDetails',
                'collateral.vehicleDetails',
                'collateral.atmDetails',
                'collateral.files.documentType',
                'loanComments.user',
            ]);
        }

        return [
            'borrower' => [
                'id' => $borrower->ID,
                'name' => trim(($borrower->first_name ?? '').' '.($borrower->last_name ?? '')),
                'first_name' => $borrower->first_name,
                'last_name' => $borrower->last_name,
                'email' => $borrower->email,
                'mobile' => $borrower->contact_no,
                'address' => $borrower->borrowerAddress?->address,
                'coBorrowers' => $borrower->coBorrowers
                    ->map(fn ($coBorrower) => [
                        'id' => $coBorrower->ID,
                        'first_name' => $coBorrower->first_name,
                        'last_name' => $coBorrower->last_name,
                        'email' => $coBorrower->email,
                        'mobile' => $coBorrower->contact_no,
                        'birth_date' => optional($coBorrower->birth_date)?->toDateString() ?? $coBorrower->birth_date,
                        'marital_status' => $coBorrower->marital_status,
                        'occupation' => $coBorrower->occupation,
                        'position' => $coBorrower->position,
                        'employer_address' => $coBorrower->agency_address,
                        'address' => $coBorrower->address,
                    ])
                    ->values()
                    ->all(),
                'files' => $this->formatFiles($borrower->files),
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

        $releasingFees = $this->disbursementService->getHistoricalOrCurrentFeeBreakdown($loan);

        return [
            'id' => $loan->ID,
            'loanNo' => $loan->loan_no ?? sprintf('LN-%06d', $loan->ID),
            'released' => optional($loan->start_date)?->toDateString() ?? '',
            'maturity' => optional($loan->end_date)?->toDateString() ?? '',
            'repayment_frequency' => $loan->repayment_frequency?->value ?? $loan->repayment_frequency ?? '',
            'principal' => (float) $loan->principal_amount,
            'interest' => (string) $loan->interest_rate,
            'interestType' => $loan->interest_type?->value ?? $loan->interest_type ?? '',
            'loan_type' => (string) ($loan->loan_type ?? ''),
            'releasing_fees' => $releasingFees,
            'penalty' => 0,
            'due' => (float) $loan->amortizationSchedules->first()?->installment_amount ?? 0,
            'balance' => (float) $loan->balance_remaining,
            'status' => $status,
            'comments' => $loan->loanComments
                ->sortByDesc('comment_date')
                ->values()
                ->map(fn ($comment) => [
                    'ID' => $comment->ID,
                    'comment_text' => $comment->comment_text,
                    'commented_by' => $comment->user?->name ?? 'Unknown',
                    'comment_date' => optional($comment->comment_date)?->toISOString(),
                ])
                ->all(),
        ];
    }

    // private function formatRepayments(?Loan $loan): array
    // {
    //     if (! $loan) {
    //         return [];
    //     }

    //     return Payment::query()
    //         ->where('loan_id', $loan->ID)
    //         ->with(['loan.borrower', 'verifiedBy'])
    //         ->latest('payment_date')
    //         ->get()
    //         ->map(function (Payment $payment) use ($loan) {
    //             $borrowerName = $payment->loan?->borrower
    //                 ? trim(($payment->loan->borrower->first_name ?? '').' '.($payment->loan->borrower->last_name ?? ''))
    //                 : ($loan->borrower?->first_name ?? '').' '.($loan->borrower?->last_name ?? '');
    //             $borrowerName = $borrowerName ?: 'Unknown Borrower';

    //             $verifiedByName = $payment->verifiedBy
    //                 ? ($payment->verifiedBy->name ?? '')
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

        $loan->loadMissing('amortizationSchedules.penalties');

        return $loan->amortizationSchedules
            ->map(fn ($schedule) => [
                'installment_no' => $schedule->installment_no,
                'due_date' => optional($schedule->due_date)?->toDateString(),
                'interest_amount' => (float) $schedule->interest_amount,
                'penalty_amount' => (float) $schedule->penalty_amount,
                'rebate_amount' => (float) $schedule->rebate_amount,
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
            'files' => $this->formatFiles($collateral->files),
        ])
            ->values()
            ->all();
    }

    private function formatFiles($files): array
    {
        $files = collect($files);

        $fallbackDocumentTypeNames = DocumentType::query()
            ->whereIn(
                'id',
                $files
                    ->map(fn ($file) => $this->extractDocumentTypeIdFromDescription($file->description))
                    ->filter()
                    ->unique()
                    ->values()
                    ->all()
            )
            ->pluck('name', 'id');

        return $files
            ->map(fn ($file) => [
                'id' => $file->ID ?? $file->id ?? null,
                'file_name' => $file->file_name,
                'file_path' => $file->file_path,
                'description' => $this->normalizeFileDescription($file->description),
                'document_type_name' => $file->documentType?->name
                    ?? $fallbackDocumentTypeNames->get($this->extractDocumentTypeIdFromDescription($file->description)),
                'uploaded_at' => $file->uploaded_at
                    ? (is_object($file->uploaded_at) && method_exists($file->uploaded_at, 'toISOString')
                        ? $file->uploaded_at->toISOString()
                        : (string) $file->uploaded_at)
                    : null,
            ])
            ->filter(fn ($file) => ! empty($file['file_path']))
            ->values()
            ->all();
    }

    private function extractDocumentTypeIdFromDescription(?string $description): ?int
    {
        if (! $description) {
            return null;
        }

        if (preg_match('/type_id\s*:\s*(\d+)/i', $description, $matches) === 1) {
            return (int) $matches[1];
        }

        return null;
    }

    private function normalizeFileDescription(?string $description): ?string
    {
        if (! $description) {
            return null;
        }

        $cleaned = preg_replace('/\s*\(type_id\s*:\s*\d+\)\s*/i', '', $description) ?? $description;
        $cleaned = trim($cleaned);

        if ($cleaned === '') {
            return null;
        }

        return str($cleaned)
            ->replace(['_', ':'], ' ')
            ->squish()
            ->title()
            ->toString();
    }
}
