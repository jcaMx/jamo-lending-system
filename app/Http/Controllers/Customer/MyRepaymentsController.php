<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Loan;
use App\Models\Borrower;


class CustomerRepaymentController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('login');
        }

        $borrower = $user->borrower()
            ->with([
                'loans' => function ($q) {
                    $q->where('status', 'Active')
                      ->with([
                          'amortizationSchedules' => function ($q) {
                              $q->orderBy('due_date');
                          },
                          'payments' => function ($q) {
                              $q->orderBy('payment_date', 'desc');
                          },
                      ]);
                }
            ])
            ->first();

        if (! $borrower || $borrower->loans->isEmpty()) {
            return Inertia::render('customer/repayments/index', [
                'loan' => null,
                'schedules' => [],
                'payments' => [],
            ]);
        }

        $loan = $borrower->loans->first();

        return Inertia::render('customer/repayments/index', [
            'loan' => [
                'loanNo' => $loan->ID,
                'principal' => $loan->principal_amount,
                'interest_rate' => $loan->interest_rate,
                'interest_type' => $loan->interest_type,
                'repayment_frequency' => $loan->repayment_frequency,
                'status' => $loan->status,
            ],

            'schedules' => $loan->amortizationSchedules->map(fn ($s) => [
                'installment_no' => $s->installment_no,
                'due_date' => $s->due_date?->toDateString(),
                'installment_amount' => (float) $s->installment_amount,
                'interest_amount' => (float) $s->interest_amount,
                'penalty_amount' => (float) $s->penalty_amount,
                'amount_paid' => (float) $s->amount_paid,
                'status' => $s->status?->value ?? 'Unpaid',
                'total_due' => (float) (
                    $s->installment_amount +
                    $s->interest_amount +
                    $s->penalty_amount -
                    $s->amount_paid
                ),
            ]),

            'payments' => $loan->payments->map(fn ($p) => [
                'receipt_number' => $p->receipt_number,
                'amount' => (float) $p->amount,
                'method' => $p->payment_method,
                'reference_no' => $p->reference_no,
                'payment_date' => $p->payment_date?->toDateString(),
                'schedule_no' => $p->amortizationSchedule?->installment_no,
            ]),
        ]);
    }
}
