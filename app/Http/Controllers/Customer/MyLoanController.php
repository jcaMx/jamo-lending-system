<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MyLoanController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect()->route('login')->withErrors([
                'email' => 'Please log in to access your loans.',
            ]);
        }

        $borrower = $user->borrower()->first();

        if (!$borrower) {
            return Inertia::render('customer/my-loan-details', [
                'borrower' => null,
                'loan' => null,
            ]);
        }

        $loan = $borrower->activeLoan()->first();

        // Fallback: manually query if relationship fails
        if (!$loan) {
            $loan = $borrower->loans()->where('status', 'Active')->first();
        }

        return Inertia::render('customer/my-loan', [
            'borrower' => $borrower ? [
                'name' => "{$borrower->first_name} {$borrower->last_name}",
                'email' => $borrower->email,
                'contact_no' => $borrower->contact_no,
            ] : null,
            'loan' => $loan ? [
                'loanNo' => $loan->ID,
                'released' => $loan->start_date?->format('Y-m-d') ?? '-',
                'maturity' => $loan->end_date?->format('Y-m-d') ?? '-',
                'repayment' => $loan->repayment_frequency ?? '-',
                'principal' => $loan->principal_amount ?? 0,
                'interest' => $loan->interest_rate ?? 0,
                'interestType' => $loan->interest_type ?? '-',
                'penalty' => 0,
                'due' => $loan->balance_remaining ?? 0,
                'balance' => $loan->balance_remaining ?? 0,
                'status' => $loan->status ?? 'Pending',
            ] : null,
        ]);
    }
}
