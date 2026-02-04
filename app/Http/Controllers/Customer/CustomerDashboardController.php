<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerDashboardController extends Controller
{
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
                'loan' => null,
            ]);
        }

        // Get active loan - try relationship first, fallback to query if needed
        $loan = $borrower->activeLoan()->first();

        // Fallback: if activeLoan relationship returns null, try to find active loan manually
        if (! $loan) {
            $loan = \App\Models\Loan::where('borrower_id', $borrower->ID)
                ->where('status', 'Active')
                ->first();
        }

        \Log::info('Borrower', ['borrower' => $borrower->toArray()]);
        \Log::info('Active Loan', ['loan' => optional($loan)->toArray()]);


        return Inertia::render('customer/dashboard', [
            'borrower' => $this->mapBorrower($borrower),
            'loan' => $loan ? $this->mapLoan($loan) : null,
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

        return [
            'loanNo' => (string) $loan->ID,
            'released' => $loan->start_date?->format('Y-m-d') ?? '',
            'maturity' => $loan->end_date?->format('Y-m-d') ?? '',
            'repayment' => $loan->repayment_frequency ?? '',
            'principal' => (float) $loan->principal_amount,
            'interest' => (string) $loan->interest_rate,
            'interestType' => $loan->interest_type ?? '',
            'penalty' => 0.0,
            'due' => (float) ($loan->balance_remaining ?? 0),
            'balance' => (float) ($loan->balance_remaining ?? 0),
            'status' => $status,
        ];
    }
}
