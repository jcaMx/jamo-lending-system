<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Payment;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Services\RepaymentService;

class CustomerDashboardController extends Controller
{
    public function __construct(
        protected RepaymentService $repaymentService
    ) {
    }
    public function index()
    {
        // dd('CUSTOMER DASHBOARD HIT');
        

        /** @var User|null $user */
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('login')->withErrors([
                'email' => 'Please log in to access your dashboard.',
            ]);
        }

        // Get borrower for this user
        $borrower = $user->borrower()->first();

        // No borrower linked to this user
        if (! $borrower) {
            return Inertia::render('customer/dashboard', [
                'borrower' => null,
                'loans' => [],
                'recentPayments' => [],
                'stats' => null,
                'hasBorrower' => false,
            ]);
        }

        // 1. Get all loans for the borrower (not only active)
        $loans = $borrower->loans()->with(['amortizationSchedules'])->get();

        // 2. Map each loan with nextPaymentDate, penalty, etc.
        $mappedLoans = $loans->map(fn ($loan) => $this->mapLoan($loan));

        // 3. Get recent payments (across all borrower's loans)
        $recentPayments = Payment::whereIn('loan_id', $loans->pluck('ID'))
            ->orderBy('payment_date', 'desc')
            ->limit(10)
            ->get()
            ->map(fn ($p) => $this->mapPayment($p));

        // 4. Compute stats from active loans
        $activeLoans = $loans->whereIn('status', ['Active', 'Overdue']);

        $firstActiveLoan = $activeLoans->first(); // Get the first active loan

        $stats = [
            'totalBalance' => $activeLoans->sum('balance_remaining'),
            'totalDue' => $firstActiveLoan ? $this->repaymentService->getNextDueAmount($firstActiveLoan) : 0,
            'totalPaid' => $firstActiveLoan ? $this->repaymentService->getTotalPaid($firstActiveLoan) : 0,
            'totalPenalty' => $activeLoans->sum(function ($loan) {
                return $loan->amortizationSchedules->sum('penalty_amount')
                    + $loan->amortizationSchedules->flatMap->penalty->sum('amount');
            }), 
            'activeLoans' => $activeLoans->count(),
            'overdueCount' => $loans->where('status', 'Overdue')->count(),
        ];

        return Inertia::render('customer/dashboard', [
            'borrower' => $this->mapBorrower($borrower),
            'loans' => $mappedLoans,
            'recentPayments' => $recentPayments,
            'stats' => $stats,
            'hasBorrower' => true,
        ]);


    }

    /**
     * Format borrower data for the customer dashboard
     */
    private function mapBorrower($borrower): array
    {
        return [
            'name' => "{$borrower->first_name} {$borrower->last_name}",
            'email' => $borrower->email,
            'contact_no' => $borrower->contact_no,
        ];
    }

    /**
     * Format loan data for the customer dashboard
     */
    private function mapLoan($loan): array
    {
        // Safely extract status (handle enum or string)
        $status = $loan->status instanceof \BackedEnum
            ? $loan->status->value
            : (string) ($loan->status ?? 'Active');

        $nextSchedule = $loan->amortizationSchedules()
            ->whereIn('status', ['Unpaid', 'Overdue'])
            ->orderBy('due_date')
            ->first();
        
        $totalPenalty = $loan->amortizationSchedules->sum('penalty_amount')
            + $loan->amortizationSchedules->flatMap->penalty->sum('amount');
    
        
        return [
            'loanNo' => (string) $loan->ID,
            'released' => $loan->start_date?->format('Y-m-d') ?? '',
            'maturity' => $loan->end_date?->format('Y-m-d') ?? '',
            'repayment' => $loan->repayment_frequency ?? '',
            'principal' => (float) $loan->principal_amount,
            'interest' => (string) $loan->interest_rate,
            'interestType' => $loan->interest_type ?? '',
            'penalty' => 0.0,
            'due' => (float) $this->repaymentService->getNextDueAmount($loan),
            'balance' => (float) ($loan->balance_remaining ?? 0),
            'status' => $status,
        ];
    }

    function mapPayment($payment): array
    {
        return [
            'loan_id' => $payment->loan_id,
            'amount' => (float) $payment->amount,
            'payment_date' => $payment->payment_date?->format('Y-m-d') ?? '',
            'method' => $payment->method ?? '',
            'reference' => $payment->reference ?? '',
        ];
    }
}
