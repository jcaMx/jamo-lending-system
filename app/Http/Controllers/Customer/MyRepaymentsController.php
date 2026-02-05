<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\RepaymentService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MyRepaymentsController extends Controller
{
    public function __construct(
        protected RepaymentService $repaymentService
    ) {}

    public function index()
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('login')->withErrors([
                'email' => 'Please log in to access your repayments.',
            ]);
        }

        $borrower = $user->borrower()->with('loans')->first();

        if (! $borrower || $borrower->loans->isEmpty()) {
            return Inertia::render('customer/repayments', [
                'payments' => [],
                'totalPaid' => 0,
                'totalPending' => 0,
                'hasBorrower' => (bool) $borrower,
                'hasPendingLoan' => false,
            ]);
        }

        $loanIds = $borrower->loans->pluck('ID');
        $hasPendingLoan = $borrower->loans->contains(fn ($loan) => $loan->status === 'Pending');

        $payments = Payment::query()
            ->whereIn('loan_id', $loanIds)
            ->with(['loan'])
            ->orderByDesc('payment_date')
            ->get()
            ->map(function ($payment) {
                return [
                    'id' => $payment->ID,
                    'loanNo' => $payment->loan?->loan_no
                        ?? sprintf('LN-%06d', $payment->loan_id),
                    'amount' => (float) $payment->amount,
                    'method' => $payment->payment_method?->value ?? (string) $payment->payment_method ?? 'Cash',
                    'payment_date' => optional($payment->payment_date)?->toDateString(),
                    'status' => $payment->verified_date ? 'Completed' : 'Pending',
                ];
            })
            ->values();

        $totalPaid = 0;
        foreach ($borrower->loans as $loan) {
            $totalPaid += $this->repaymentService->getTotalPaid($loan);
        }

        $totalPending = $payments
            ->where('status', 'Pending')
            ->sum('amount');

        return Inertia::render('customer/repayments', [
            'payments' => $payments,
            'totalPaid' => $totalPaid,
            'totalPending' => $totalPending,
            'hasBorrower' => true,
            'hasPendingLoan' => $hasPendingLoan,
        ]);
    }
}
