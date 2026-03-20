<?php

namespace App\Http\Controllers;

use App\Models\Borrower;
use App\Models\JamoUser;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Services\RepaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;


class RepaymentController extends Controller
{
    protected RepaymentService $repaymentService;

    public function __construct(RepaymentService $repaymentService)
    {
        $this->repaymentService = $repaymentService;
    }

    public function add()
    {
        $borrowers = Borrower::with(['loans.amortizationSchedules'])->get()
            ->map(function ($b) {
                // Get active loan
                $activeLoan = $b->loans->first(fn($loan) => $loan->status === 'Active');
                if (! $activeLoan) return null;

                // Get all schedules (show full schedule, but only unpaid/overdue can be selected)
                $schedules = $activeLoan->amortizationSchedules
                    ->sortBy('due_date')
                    ->map(function ($schedule) {
                        return [
                            'ID' => $schedule->ID,
                            'installment_no' => $schedule->installment_no,
                            'due_date' => $schedule->due_date?->toDateString(),
                            'installment_amount' => (float) $schedule->installment_amount,
                            'interest_amount' => (float) $schedule->interest_amount,
                            'penalty_amount' => (float) $schedule->penalty_amount,
                            'amount_paid' => (float) $schedule->amount_paid,
                            'status' => $schedule->status?->value ?? 'Unpaid', // string
                            'total_due' => (float) (
                                $schedule->installment_amount +
                                $schedule->interest_amount +
                                $schedule->penalty_amount -
                                $schedule->amount_paid
                            ),
                        ];
                    })->values();
    
                $nextSchedule = $schedules->first();
    
                return [
                    'id' => $b->ID,
                    'name' => $b->first_name . ' ' . $b->last_name,
                    'loanNo' => $activeLoan->ID,
                    'loan_id' => $activeLoan->ID,
                    'schedules' => $schedules, // all unpaid/overdue schedules
                    'next_due_date' => $nextSchedule['due_date'] ?? null,
                    'next_due_amount' => $nextSchedule['total_due'] ?? 0,
                ];
            })
            ->filter(); // remove borrowers without active loans
    
        $collectors = JamoUser::all()
            ->map(fn($c) => [
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
    $rules = [
        'borrower_id' => 'required|exists:borrower,ID',
        'loanNo' => 'required|exists:loan,ID',
        'schedule_id' => 'nullable|exists:amortizationschedule,ID',
        'amount' => 'required|numeric|min:0.01',
        'method' => ['required', Rule::enum(PaymentMethod::class)],
        'collectedBy' => 'required|exists:jamouser,ID',
        'collectionDate' => 'required|date',
    ];

    $inputMethod = $request->input('method');

    // ✅ FIXED: Proper condition
    if (!in_array($inputMethod, ['Cash', 'Cash Voucher'])) {
        $rules['reference_number'] = 'required|string|max:255';
    } else {
        $rules['reference_number'] = 'nullable|string|max:255';
    }

    $request->validate($rules);

    try {
        DB::beginTransaction();

        $methodEnum = PaymentMethod::from($inputMethod);
        $methodValue = $methodEnum->value;

        // Generate receipt number
        $receiptNumber = 'RCP-'.strtoupper(substr(uniqid(), -8)).'-'.date('YmdHis');

        while (Payment::where('receipt_number', $receiptNumber)->exists()) {
            $receiptNumber = 'RCP-'.strtoupper(substr(uniqid(), -8)).'-'.date('YmdHis');
        }

        // Get reference number
        $referenceNo = $request->reference_number;

        // ✅ FIXED: Exclude BOTH Cash and Cash Voucher
        if (!in_array($methodValue, [
            PaymentMethod::Cash->value,
            PaymentMethod::CashVoucher->value
        ]) && ! $referenceNo) {
            $referenceNo = 'REF-'.strtoupper(substr(uniqid(), -8)).'-'.date('Ymd');
        }

        // ✅ Cash = NULL reference
        if (in_array($methodValue, [
            PaymentMethod::Cash->value,
            PaymentMethod::CashVoucher->value
        ])) {
            $referenceNo = null;
        }

        // Check duplicate reference (non-cash only)
        if (!in_array($methodValue, [
            PaymentMethod::Cash->value,
            PaymentMethod::CashVoucher->value
        ]) && $referenceNo) {
            $existingPayment = Payment::where('reference_no', $referenceNo)->first();
            if ($existingPayment) {
                DB::rollBack();
                return redirect()->back()->withErrors([
                    'referenceNumber' => 'This reference number has already been used.'
                ]);
            }
        }

        // Get schedule if not provided
        $scheduleId = $request->schedule_id;

        if (! $scheduleId) {
            $loan = \App\Models\Loan::find($request->loanNo);
            if ($loan) {
                $firstUnpaidSchedule = $loan->amortizationSchedules()
                    ->whereIn('status', [
                        \App\Models\ScheduleStatus::Unpaid,
                        \App\Models\ScheduleStatus::Overdue
                    ])
                    ->orderBy('due_date', 'asc')
                    ->first();

                if ($firstUnpaidSchedule) {
                    $scheduleId = $firstUnpaidSchedule->ID;
                }
            }
        }

        if (! $scheduleId) {
            DB::rollBack();
            return redirect()->back()->withErrors([
                'error' => 'No unpaid schedule found for this loan.'
            ]);
        }

      $status = in_array($methodValue, [
    PaymentMethod::Cash->value,
    PaymentMethod::CashVoucher->value
]) ? 'verified' : 'pending';
        \Log::info('Creating payment', [
            'receipt_number' => $receiptNumber,
            'loan_id' => $request->loanNo,
            'amount' => $request->amount,
            'payment_method' => $methodValue,
            'status' => $status,
        ]);

        $payment = Payment::create([
            'receipt_number' => $receiptNumber,
            'loan_id' => $request->loanNo,
            'amount' => (float) $request->amount,
            'payment_method' => $methodEnum,
            'verified_by' => $request->collectedBy,
            'payment_date' => $request->collectionDate,
            'reference_no' => $referenceNo,
            'schedule_id' => $scheduleId,
            'status' => $status, // ✅ IMPORTANT
        ]);

        $payment->refresh();
        $payment->load('loan');

        // Process payment
        $this->repaymentService->processPayment($payment);

        DB::commit();

        return redirect()->route('repayments.index')
            ->with('success', 'Payment processed successfully! Receipt Number: '.$receiptNumber);

    } catch (\Throwable $e) {
        DB::rollBack();

        \Log::error('Payment processing failed', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
            'request' => $request->all(),
        ]);

        return redirect()->back()->withErrors([
            'error' => 'Failed to process payment: '.$e->getMessage()
        ]);
    }
}

    public function index()
    {
        $payments = Payment::with(['loan.borrower', 'jamoUser', 'amortizationSchedule'])
            ->orderBy('payment_date', 'desc')
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->ID,
                    'receiptNumber' => $p->receipt_number ?? 'N/A',
                    'borrowerName' => $p->loan?->borrower
                        ? $p->loan->borrower->first_name.' '.$p->loan->borrower->last_name
                        : 'N/A',
                    'loanNo' => $p->loan?->ID ?? 'N/A',
                    'scheduleNo' => $p->amortizationSchedule?->installment_no ?? 'N/A',
                    'method' => $p->payment_method ?? 'N/A',
                    'referenceNo' => $p->reference_no ?? 'N/A',
                    'collectedBy' => $p->jamoUser?->first_name
                        ? $p->jamoUser->first_name.' '.$p->jamoUser->last_name
                        : 'N/A',
                    'collectionDate' => $p->payment_date?->toDateString() ?? null,
                    'amount' => $p->amount,
                ];
            });

        return Inertia::render('repayments/index', [
            'repayments' => $payments,
        ]);
    }
    public function verifyPage(Request $request)
{
    $ref = $request->query('ref');

    $pendingPayments = Payment::with(['loan.borrower', 'jamoUser'])
        ->where('status', 'pending')
        ->when($ref, fn($q) => $q->where('reference_no', $ref))
        ->orderBy('payment_date', 'desc')
        ->get()
        ->map(fn($p) => [
            'id' => $p->ID,
            'borrower' => $p->loan?->borrower?->first_name.' '.$p->loan?->borrower?->last_name,
            'loanNo' => $p->loan?->ID,
            'amount' => $p->amount,
            'method' => $p->payment_method,
            'referenceNo' => $p->reference_no,
            'collectedBy' => $p->jamoUser?->first_name.' '.$p->jamoUser?->last_name,
            'collectionDate' => $p->payment_date?->toDateString(),
        ]);

    return Inertia::render('repayments/verify', [
        'pendingPayments' => $pendingPayments,
    ]);
}

public function pending()
{
    $pendingPayments = Payment::where('status', 'pending')
        ->with(['loan.borrower', 'jamoUser', 'amortizationSchedule'])
        ->orderBy('payment_date', 'desc')
        ->get()
        ->map(function ($p) {
            return [
                'id' => $p->ID,
                'borrowerName' => $p->loan?->borrower
                    ? $p->loan->borrower->first_name . ' ' . $p->loan->borrower->last_name
                    : 'N/A',
                'loanNo' => $p->loan?->ID ?? 'N/A',
                'amount' => $p->amount,
                'method' => $p->payment_method,
                'referenceNo' => $p->reference_no,
                'collectedBy' => $p->jamoUser?->first_name
                    ? $p->jamoUser->first_name . ' ' . $p->jamoUser->last_name
                    : 'N/A',
                'collectionDate' => $p->payment_date?->toDateString() ?? null,
            ];
        });

    return Inertia::render('repayments/pending', [
        'pendingPayments' => $pendingPayments,
    ]);
}

public function verify(Payment $payment)
{
    $payment->status = 'verified';
    $payment->save();

    return redirect()->route('repayments.pending')->with('success', 'Payment verified successfully!');
}

}