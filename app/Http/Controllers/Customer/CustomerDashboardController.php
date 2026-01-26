<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CustomerDashboardController extends Controller
{
    public function index()

    {
        dd('CustomerDashboardController HIT');

        $user = Auth::user();
        \Log::info('Customer Dashboard - User ID:', ['user_id' => $user->id]);
    
        // User → Borrower via user_id
        $borrower = $user->borrower()
            ->with('activeLoan')
            ->first();

        
        // Debug: Check if borrower exists
        \Log::info('Customer Dashboard - Borrower:', [
            'borrower_exists' => $borrower !== null,
            'borrower_id' => $borrower?->ID,
            'user_id_in_borrower' => $borrower?->user_id,
        ]);
        
        // If no borrower found, check if any borrowers exist with this user_id
        if (!$borrower) {
            $borrowersWithUserId = \App\Models\Borrower::where('user_id', $user->id)->get();
            \Log::info('Customer Dashboard - Borrowers with user_id:', [
                'count' => $borrowersWithUserId->count(),
                'borrowers' => $borrowersWithUserId->map(fn($b) => ['id' => $b->ID, 'user_id' => $b->user_id])
            ]);
        }

        // No borrower linked to this user
        if (! $borrower) {
            return Inertia::render('customer/dashboard', [
                'borrower' => null,
                'loan' => null,
            ]);
        }

        $loan = $borrower->activeLoan;

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
        return [
            'loanNo'       => $loan->loan_id,
            'released'     => $loan->start_date,
            'maturity'     => $loan->end_date,
            'repayment'    => $loan->repayment_frequency,
            'principal'    => (float) $loan->principal_amount,
            'interest'     => $loan->interest_rate,
            'interestType' => $loan->interest_type,
            'penalty'      => (float) ($loan->penalties_sum ?? 0),
            'due'          => (float) $loan->outstanding_balance,
            'balance'      => (float) $loan->outstanding_balance,
            'status'       => $loan->status,
        ];
    }
}
