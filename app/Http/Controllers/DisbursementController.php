<?php

namespace App\Http\Controllers;

use App\Models\BankAccount;
use App\Models\Disbursement;
use App\Models\Loan;
use App\Notifications\NotifyUser;
use App\Services\DisbursementService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DisbursementController extends Controller
{
    public function __construct(
        protected DisbursementService $service
    ) {}

    public function index(Request $request)
    {
        $completedLoanIds = Disbursement::query()
            ->where('status', 'Completed')
            ->pluck('loan_id')
            ->unique()
            ->values();

        $disbursements = Disbursement::query()
            ->with(['loan.borrower', 'creator', 'approver', 'processor', 'voucher.chequeDetail.bankAccount'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Disbursement $d) => [
                'id' => $d->ID,
                'disbursement_no' => $d->disbursement_no,
                'loan_id' => $d->loan_id,
                'borrower_name' => trim(($d->loan?->borrower?->first_name ?? '') . ' ' . ($d->loan?->borrower?->last_name ?? '')),
                'amount' => (float) $d->amount,
                'currency' => $d->currency,
                'method' => $d->method,
                'reference_no' => $d->reference_no,
                'status' => $d->status,
                'requested_at' => optional($d->requested_at)->toDateTimeString(),
                'approved_at' => optional($d->approved_at)->toDateTimeString(),
                'disbursed_at' => optional($d->disbursed_at)->toDateTimeString(),
                'created_by' => $d->creator?->name ?? 'N/A',
                'approved_by' => $d->approver?->name ?? 'N/A',
                'processed_by' => $d->processor?->name ?? 'N/A',
                'failure_code' => $d->failure_code,
                'failure_reason' => $d->failure_reason,
                'remarks' => $d->remarks,
                'voucher' => $d->voucher ? [
                    'voucher_no' => $d->voucher->voucher_no,
                    'voucher_type' => $d->voucher->voucher_type,
                    'voucher_date' => optional($d->voucher->voucher_date)->toDateString(),
                    'payee_name' => $d->voucher->payee_name,
                    'particulars' => $d->voucher->particulars,
                    'gross_amount' => (float) $d->voucher->gross_amount,
                    'status' => $d->voucher->status,
                    'received_by_name' => $d->voucher->received_by_name,
                    'received_at' => optional($d->voucher->received_at)->toDateTimeString(),
                    'cheque' => $d->voucher->chequeDetail ? [
                        'bank_account_id' => $d->voucher->chequeDetail->bank_account_id,
                        'bank_name' => $d->voucher->chequeDetail->bankAccount?->bank_name ?? $d->voucher->chequeDetail->bank_name,
                        'account_name' => $d->voucher->chequeDetail->bankAccount?->account_name,
                        'account_number' => $d->voucher->chequeDetail->bankAccount?->account_number,
                        'cheque_no' => $d->voucher->chequeDetail->cheque_no,
                        'cheque_date' => optional($d->voucher->chequeDetail->cheque_date)->toDateString(),
                    ] : null,
                ] : null,
            ])
            ->values();

        $eligibleLoans = Loan::query()
            ->with('borrower.borrowerAddress')
            ->where('status', 'Active')
            ->whereNotIn('ID', $completedLoanIds)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Loan $loan) => [
                'id' => $loan->ID,
                'borrower_name' => trim(($loan->borrower?->first_name ?? '') . ' ' . ($loan->borrower?->last_name ?? '')),
                'borrower_address' => trim(collect([
                    $loan->borrower?->borrowerAddress?->address,
                    $loan->borrower?->borrowerAddress?->city,
                ])->filter()->implode(', ')),
                'principal_amount' => (float) $loan->principal_amount,
                'released_amount' => (float) ($loan->released_amount ?? 0),
                'loan_type' => $loan->loan_type,
            ])
            ->values();

        $bankAccounts = BankAccount::query()
            ->where('is_active', true)
            ->orderBy('bank_name')
            ->orderBy('account_name')
            ->get()
            ->map(fn (BankAccount $bankAccount) => [
                'id' => $bankAccount->ID,
                'bank_name' => $bankAccount->bank_name,
                'account_name' => $bankAccount->account_name,
                'account_number' => $bankAccount->account_number,
                'branch' => $bankAccount->branch,
            ])
            ->values();

        return Inertia::render('disbursements/index', [
            'disbursements' => $disbursements,
            'eligibleLoans' => $eligibleLoans,
            'bankAccounts' => $bankAccounts,
            'initialLoanId' => $request->integer('loan_id') ?: null,
            'feeConfig' => $this->service->getFeeBreakdown(0),
        ]);
    }

    public function store(Request $request)
    {
        if (! auth()->user()?->hasRole(['cashier', 'admin'])) {
            abort(403, 'Only cashier/admin can create disbursement requests.');
        }

        $validated = $request->validate([
            'loan_id' => 'required|exists:loan,ID',
            'amount' => 'required|numeric|min:0.01',
            'currency' => 'nullable|string|size:3',
            'method' => 'required|string|in:Cash,Cheque Voucher',
            'reference_no' => 'nullable|string|max:100',
            'remarks' => 'nullable|string|max:255',
            'voucher_no' => 'nullable|string|max:30',
            'voucher_date' => 'nullable|date',
            'payee_name' => 'nullable|string|max:255',
            'payee_address' => 'nullable|string|max:255',
            'payee_tin' => 'nullable|string|max:50',
            'particulars' => 'nullable|string|max:1000',
            'gross_amount' => 'nullable|numeric|min:0.01',
            'bank_account_id' => 'nullable|exists:bank_accounts,ID',
            'cheque_no' => 'nullable|string|max:50',
            'cheque_date' => 'nullable|date',
        ]);

        if (in_array($validated['method'], ['Cash', 'Cheque Voucher'], true)) {
            $voucherErrors = [];

            if (empty($validated['voucher_no'])) $voucherErrors['voucher_no'] = 'Voucher number is required.';
            if (empty($validated['voucher_date'])) $voucherErrors['voucher_date'] = 'Voucher date is required.';
            if (empty($validated['payee_name'])) $voucherErrors['payee_name'] = 'Payee name is required.';
            if (empty($validated['particulars'])) $voucherErrors['particulars'] = 'Particulars are required.';

            if ($validated['method'] === 'Cheque Voucher') {
                if (empty($validated['bank_account_id'])) $voucherErrors['bank_account_id'] = 'Bank account is required.';
                if (empty($validated['cheque_no'])) $voucherErrors['cheque_no'] = 'Cheque number is required.';
                if (empty($validated['cheque_date'])) $voucherErrors['cheque_date'] = 'Cheque date is required.';
            }

            if (! empty($voucherErrors)) {
                return back()->withErrors($voucherErrors);
            }
        }

        $actorId = auth()->id();
        if (! $actorId) {
            return back()->withErrors(['error' => 'User not authenticated.']);
        }

        try {
            $this->service->create($validated, $actorId);

            return back()->with('success', 'Disbursement request created.');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Failed to create disbursement request: ' . $e->getMessage()]);
        }
    }

    public function storeBankAccount(Request $request)
    {
        if (! auth()->user()?->hasRole('admin')) {
            abort(403, 'Only admin can add bank accounts.');
        }

        $validated = $request->validate([
            'bank_name' => 'required|string|max:150',
            'account_name' => 'required|string|max:150',
            'account_number' => 'required|string|max:50|unique:bank_accounts,account_number',
            'branch' => 'nullable|string|max:150',
            'is_active' => 'nullable|boolean',
        ]);

        $bankAccount = BankAccount::create([
            'bank_name' => $validated['bank_name'],
            'account_name' => $validated['account_name'],
            'account_number' => $validated['account_number'],
            'branch' => $validated['branch'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return response()->json([
            'message' => 'Bank account added successfully.',
            'bankAccount' => [
                'id' => $bankAccount->ID,
                'bank_name' => $bankAccount->bank_name,
                'account_name' => $bankAccount->account_name,
                'account_number' => $bankAccount->account_number,
                'branch' => $bankAccount->branch,
            ],
        ], 201);
    }

    public function approve(Disbursement $disbursement)
    {
        if (! auth()->user()?->hasRole('admin')) {
            abort(403, 'Only admin can approve disbursements.');
        }

        $actorId = auth()->id();
        if (! $actorId) {
            return back()->withErrors(['error' => 'User not authenticated.']);
        }

        try {
            $this->service->approve($disbursement, $actorId);

            return back()->with('success', 'Disbursement approved and moved to processing.');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Failed to approve disbursement: ' . $e->getMessage()]);
        }
    }

    public function complete(Request $request, Disbursement $disbursement)
    {
        if (! auth()->user()?->hasRole('admin')) {
            abort(403, 'Only admin can complete disbursements.');
        }

        $validated = $request->validate([
            'reference_no' => 'nullable|string|max:100',
            'disbursed_at' => 'nullable|date',
            'received_by_name' => 'nullable|string|max:255',
            'received_at' => 'nullable|date',
        ]);

        $actorId = auth()->id();
        if (! $actorId) {
            return back()->withErrors(['error' => 'User not authenticated.']);
        }

        try {
            $this->service->complete(
                $disbursement,
                $actorId,
                $validated['reference_no'] ?? null,
                $validated['disbursed_at'] ?? null,
                $validated['received_by_name'] ?? null,
                $validated['received_at'] ?? null
            );

            return back()->with('success', 'Disbursement completed and loan release posted.');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Failed to complete disbursement: ' . $e->getMessage()]);
        }
    }

    public function printVoucher(Disbursement $disbursement)
    {
        $disbursement->load([
            'loan.borrower',
            'creator',
            'approver',
            'processor',
            'voucher.chequeDetail.bankAccount',
            'voucher.preparedBy',
            'voucher.approvedBy',
        ]);

        if (! $disbursement->voucher) {
            return redirect()->route('disbursements.index')
                ->withErrors(['error' => 'This disbursement does not have a voucher to print.']);
        }

        return Inertia::render('disbursements/voucher-print', [
            'voucher' => [
                'id' => $disbursement->voucher->ID,
                'voucher_no' => $disbursement->voucher->voucher_no,
                'voucher_type' => $disbursement->voucher->voucher_type,
                'voucher_date' => optional($disbursement->voucher->voucher_date)->toDateString(),
                'payee_name' => $disbursement->voucher->payee_name,
                'payee_address' => $disbursement->voucher->payee_address,
                'payee_tin' => $disbursement->voucher->payee_tin,
                'particulars' => $disbursement->voucher->particulars,
                'gross_amount' => (float) $disbursement->voucher->gross_amount,
                'status' => $disbursement->voucher->status,
                'received_by_name' => $disbursement->voucher->received_by_name,
                'received_at' => optional($disbursement->voucher->received_at)->toDateTimeString(),
                'remarks' => $disbursement->remarks,
                'prepared_by' => $disbursement->voucher->preparedBy?->name ?? $disbursement->creator?->name ?? '',
                'approved_by' => $disbursement->voucher->approvedBy?->name ?? $disbursement->approver?->name ?? '',
                'checked_by' => $disbursement->processor?->name ?? '',
                'cheque' => $disbursement->voucher->chequeDetail ? [
                    'bank_account_id' => $disbursement->voucher->chequeDetail->bank_account_id,
                    'bank_name' => $disbursement->voucher->chequeDetail->bankAccount?->bank_name ?? $disbursement->voucher->chequeDetail->bank_name,
                    'account_name' => $disbursement->voucher->chequeDetail->bankAccount?->account_name,
                    'account_number' => $disbursement->voucher->chequeDetail->bankAccount?->account_number,
                    'cheque_no' => $disbursement->voucher->chequeDetail->cheque_no,
                    'cheque_date' => optional($disbursement->voucher->chequeDetail->cheque_date)->toDateString(),
                ] : null,
            ],
            'disbursement' => [
                'id' => $disbursement->ID,
                'disbursement_no' => $disbursement->disbursement_no,
                'method' => $disbursement->method,
                'reference_no' => $disbursement->reference_no,
                'disbursed_at' => optional($disbursement->disbursed_at)->toDateTimeString(),
                'remarks' => $disbursement->remarks,
            ],
            'loan' => [
                'id' => $disbursement->loan?->ID,
                'loan_type' => $disbursement->loan?->loan_type,
            ],
            'borrower' => [
                'name' => trim(($disbursement->loan?->borrower?->first_name ?? '') . ' ' . ($disbursement->loan?->borrower?->last_name ?? '')),
            ],
        ]);
    }

    public function fail(Request $request, Disbursement $disbursement)
    {
        if (! auth()->user()?->hasRole('admin')) {
            abort(403, 'Only admin can fail disbursements.');
        }

        $validated = $request->validate([
            'failure_code' => 'nullable|string|max:50',
            'failure_reason' => 'required|string|max:255',
        ]);

        $actorId = auth()->id();
        if (! $actorId) {
            return back()->withErrors(['error' => 'User not authenticated.']);
        }

        try {
            $this->service->fail(
                $disbursement,
                $actorId,
                $validated['failure_code'] ?? null,
                $validated['failure_reason']
            );

            // Notify borrower of failed disbursement
            $borrower = $disbursement->loan?->borrower;
            if ($borrower) {
                $borrower->notify(new NotifyUser(
                    message: "Your loan disbursement could not be completed. Reason: {$validated['failure_reason']}",
                    subject: "Disbursement Failed",
                    email: $borrower->email
                ));
            }

            return back()->with('success', 'Disbursement marked as failed.');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Failed to update disbursement: ' . $e->getMessage()]);
        }
    }

    public function destroy(Disbursement $disbursement)
    {
        if (! auth()->user()?->hasRole('admin')) {
            abort(403, 'Only admin can delete disbursements.');
        }

        if ($disbursement->status !== 'Failed') {
            return back()->withErrors(['error' => 'Only failed disbursements can be deleted. Completed disbursements should be reversed, not deleted.']);
        }

        try {
            \DB::transaction(function () use ($disbursement) {
                $disbursement->load(['voucher.chequeDetail', 'events']);

                if ($disbursement->voucher?->chequeDetail) {
                    $disbursement->voucher->chequeDetail->delete();
                }

                if ($disbursement->voucher) {
                    $disbursement->voucher->delete();
                }

                if ($disbursement->events()->exists()) {
                    $disbursement->events()->delete();
                }

                $disbursement->delete();
            });

            return back()->with('success', 'Disbursement deleted.');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Failed to delete disbursement: ' . $e->getMessage()]);
        }
    }
}
