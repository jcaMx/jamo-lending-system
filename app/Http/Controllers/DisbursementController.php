<?php

namespace App\Http\Controllers;

use App\Models\Disbursement;
use App\Models\Loan;
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
            ->with(['loan.borrower', 'creator', 'approver', 'processor'])
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
            ])
            ->values();

        $eligibleLoans = Loan::query()
            ->with('borrower')
            ->where('status', 'Active')
            ->whereNotIn('ID', $completedLoanIds)
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (Loan $loan) => [
                'id' => $loan->ID,
                'borrower_name' => trim(($loan->borrower?->first_name ?? '') . ' ' . ($loan->borrower?->last_name ?? '')),
                'principal_amount' => (float) $loan->principal_amount,
                'released_amount' => (float) ($loan->released_amount ?? 0),
                'loan_type' => $loan->loan_type,
            ])
            ->values();

        return Inertia::render('disbursements/index', [
            'disbursements' => $disbursements,
            'eligibleLoans' => $eligibleLoans,
            'initialLoanId' => $request->integer('loan_id') ?: null,
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
            'method' => 'required|string|in:Bank,Cash,GCash,Cebuana,Cheque Voucher',
            'reference_no' => 'nullable|string|max:100',
            'remarks' => 'nullable|string|max:255',
        ]);

        if (in_array($validated['method'], ['Bank', 'GCash', 'Cebuana', 'Cheque Voucher'], true)
            && empty($validated['reference_no'])) {
            return back()->withErrors(['reference_no' => 'Reference number is required for this disbursement method.']);
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
                $validated['disbursed_at'] ?? null
            );

            return back()->with('success', 'Disbursement completed and loan release posted.');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Failed to complete disbursement: ' . $e->getMessage()]);
        }
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

            return back()->with('success', 'Disbursement marked as failed.');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Failed to update disbursement: ' . $e->getMessage()]);
        }
    }
}
