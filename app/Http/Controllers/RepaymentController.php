<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\Payment;
use App\Models\Borrower;
use App\Models\JamoUser;
use App\Models\AmortizationSchedule;
use App\Models\PaymentMethod;

class RepaymentController extends Controller
{
    public function add()
    {
        $borrowers = Borrower::with('loans.amortizationSchedules')->get()->map(function ($b) {
            $loan = $b->loans->first();
            return [
                'id' => $b->ID,
                'name' => $b->first_name . ' ' . $b->last_name,
                'loanNo' => $loan?->ID,
                'amortizationSchedule' => $loan
                    ? $loan->amortizationSchedules->where('status', 'Unpaid')->sum('amount_due')
                    : 0,
            ];
        });

        $collectors = JamoUser::all()->map(fn($c) => [
            'id' => $c->ID,
            'name' => $c->first_name . ' ' . $c->last_name,
        ]);

        return Inertia::render('repayments/add', [
            'borrowers' => $borrowers,
            'collectors' => $collectors,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'borrower_id'   => 'required|exists:borrower,ID',
            'loanNo'        => 'required|exists:loan,ID',
            'amount'        => 'required|numeric|min:1',
            'method'        => ['required', Rule::enum(PaymentMethod::class)],
            'collectedBy'   => 'required|exists:jamouser,ID',
            'collectionDate'=> 'required|date',
            'referenceNumber' => [
                Rule::requiredIf(fn () => $request->method !== 'Cash'),
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        $method = PaymentMethod::from($request->method)->value;

        $schedule = AmortizationSchedule::where('loan_id', $request->loanNo)
            ->where('status', 'Unpaid')
            ->orderBy('installment_no', 'asc')
            ->first();

        if (!$schedule) {
            return redirect()->back()->withErrors(['No unpaid schedule found for this loan.']);
        }

        Payment::create([
            'loan_id'       => $request->loanNo,
            'amount'        => $request->amount,
            'payment_method'=> $method,
            'verified_by'   => $request->collectedBy,
            'payment_date'  => $request->collectionDate,
            'reference_no'  => $method === PaymentMethod::Cash->value ? null : $request->referenceNumber,
            'schedule_id'   => $schedule->ID,
        ]);

        return redirect()->back()->with('success', 'Repayment added successfully.');
    }

    public function index()
    {
        $payments = Payment::with(['loan.borrower', 'jamoUser'])
            ->orderBy('payment_date', 'desc')
            ->get()
            ->map(function ($p) {
                return [
                    'id'            => $p->ID,
                    'borrowerName'  => $p->loan?->borrower
                        ? $p->loan->borrower->first_name . ' ' . $p->loan->borrower->last_name
                        : "N/A",
                    'loanNo'        => $p->loan?->ID ?? 'N/A',
                    'method'        => $p->payment_method?->label() ?? 'N/A',
                    'collectedBy'   => $p->jamoUser?->first_name
                        ? $p->jamoUser->first_name . ' ' . $p->jamoUser->last_name
                        : 'N/A',
                    'collectionDate'=> $p->payment_date?->toDateString() ?? null,
                    'amount'        => $p->amount,
                ];
            });

        return Inertia::render('repayments/index', [
            'repayments' => $payments,
        ]);
    }
}
