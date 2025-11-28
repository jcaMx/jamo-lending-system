<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Payment;
use App\Models\Borrower;
use App\Models\JamoUser;
use App\Models\AmortizationSchedule;


class RepaymentController extends Controller
{
    public function add()
    {
        $borrowers = Borrower::with('loans')->get()->map(function ($b) {
            return [
                'id' => $b->ID,
                'name' => $b->first_name . ' ' . $b->last_name,
                'loanNo' => $b->loan?->ID,
                'amortizationSchedule' => $b->loan ? fn($first = false) => $b->loan->amortizationSchedules->filter(fn($s) => $s->status === 'Unpaid')->when($first, fn($s) => $s->first())->sum('amount_due') : 0,  
            ];  
        });

        $collectors = JamoUser::all()->map(fn($c) => [
            'id' => $c->ID,
            'name' => $c->first_name . ' ' . $c->last_name
        ]);


        return Inertia::render('repayments/add', [
            'borrowers' => $borrowers,
            'collectors' => $collectors,
        ]); 
    }

    public function store(Request $request)
    {
         $request->validate([
        'borrower_id' => 'required|exists:borrower,ID',
        'loanNo' => 'required|exists:loan,ID',
        'amount' => 'required|numeric',
        'method' => 'required|string',
        'collectedBy' => 'required|exists:jamoUser,ID',
        'collectionDate'=> 'required|date'
    ]);

    // Find the next unpaid schedule for this loan
    $schedule = AmortizationSchedule::where('loan_id', $request->loanNo)
                ->where('status', 'Unpaid')
                ->orderBy('installment_no', 'asc')
                ->first();

    if (!$schedule) {
        return redirect()->back()->withErrors(['No unpaid schedule found for this loan.']);
    }

    $payment = Payment::create([
        'loan_id' => $request->loanNo,
        'amount' => $request->amount,
        'payment_method' => $request->method,
        'verified_by' => $request->collectedBy,
        'payment_date' => $request->collectionDate,
        'reference_no' => $request->referenceNumber ?? null,
        'schedule_id' => $schedule->ID, // now guaranteed
    ]);

    return redirect()->back()->with('success', 'Repayment added successfully.');
}

    public function index()
    {
        $payments = Payment::with(['loan.borrower', 'jamoUser'])->orderBy('payment_date', 'desc')->get()->map(function ($p) {
            return ['id' => $p->ID,
            'borrowerName' => $p->loan?->borrower ? $p->loan->borrower->first_name . ' ' . $p->loan->borrower->last_name : "N/A",
            'loanNo' => $p->loan?->ID ?? 'N/A',
            'method' => $p->payment_method ?: 'Cash', 
            'collectedBy' => $p->jamoUser?->first_name ? $p->jamoUser->first_name . ' ' . $p->jamoUser->last_name : 'N/A',
            'collectionDate' => $p->payment_date?->toDateString() ?? null,
            'amount' => $p->amount,
            ];
        });

        return Inertia::render('repayments/index', [
            'repayments' => $payments
        ]);
    }

}
