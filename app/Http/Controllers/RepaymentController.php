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

class RepaymentController extends Controller
{
    protected RepaymentService $repaymentService;

    public function __construct(RepaymentService $repaymentService)
    {
        $this->repaymentService = $repaymentService;
    }

    public function add()
    {
        $borrowers = Borrower::with(['loans.amortizationSchedules' => function ($query) {
            $query->whereIn('status', ['Unpaid', 'Overdue'])->orderBy('due_date', 'asc');
        }])->get()->map(function ($b) {
            $activeLoan = $b->loans->first(fn ($loan) => $loan->status === 'Active');

            if (! $activeLoan) {
                return null;
            }

            // Get only the first unpaid/overdue schedule (next due)
            $nextDueSchedule = $activeLoan->amortizationSchedules
                ->whereIn('status', ['Unpaid', 'Overdue'])
                ->sortBy('due_date')
                ->first();

            $schedules = [];
            if ($nextDueSchedule) {
                $schedules[] = [
                    'ID' => $nextDueSchedule->ID,
                    'installment_no' => $nextDueSchedule->installment_no,
                    'due_date' => $nextDueSchedule->due_date?->toDateString(),
                    'installment_amount' => (float) $nextDueSchedule->installment_amount,
                    'interest_amount' => (float) $nextDueSchedule->interest_amount,
                    'penalty_amount' => (float) $nextDueSchedule->penalty_amount,
                    'amount_paid' => (float) $nextDueSchedule->amount_paid,
                    'status' => $nextDueSchedule->status?->value,
                    'total_due' => (float) ($nextDueSchedule->installment_amount + $nextDueSchedule->interest_amount + $nextDueSchedule->penalty_amount - $nextDueSchedule->amount_paid),
                ];
            }

            $firstSchedule = $schedules[0] ?? null;

            return [
                'id' => $b->ID,
                'name' => $b->first_name.' '.$b->last_name,
                'loanNo' => $activeLoan->ID,
                'loan_id' => $activeLoan->ID,
                'schedules' => $schedules,
                'next_due_date' => $firstSchedule['due_date'] ?? null,
                'next_due_amount' => $firstSchedule['total_due'] ?? 0,
            ];
        })->filter();

        $collectors = JamoUser::all()->map(fn ($c) => [
            'id' => $c->ID,
            'name' => $c->first_name.' '.$c->last_name,
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
            'schedule_id' => 'nullable|exists:amortizationschedule,ID',
            'amount' => 'required|numeric|min:0.01',
            'method' => ['required', Rule::enum(PaymentMethod::class)],
            'collectedBy' => 'required|exists:jamouser,ID',
            'collectionDate' => 'required|date',
            'referenceNumber' => [
                Rule::requiredIf(fn () => $request->method !== 'Cash'),
                'nullable',
                'string',
                'max:255',
            ],
        ]);

        try {
            DB::beginTransaction();

            $method = PaymentMethod::from($request->method)->value;

            // Generate reference number if not provided and not Cash
            $referenceNo = $request->referenceNumber;
            if ($method !== PaymentMethod::Cash->value && ! $referenceNo) {
                $referenceNo = 'REF-'.strtoupper(substr(uniqid(), -8)).'-'.date('Ymd');
            }

            // Check if reference number already exists (for non-cash)
            if ($method !== PaymentMethod::Cash->value && $referenceNo) {
                $existingPayment = Payment::where('reference_no', $referenceNo)->first();
                if ($existingPayment) {
                    return redirect()->back()->withErrors(['referenceNumber' => 'This reference number has already been used.']);
                }
            }

            $payment = Payment::create([
                'loan_id' => $request->loanNo,
                'amount' => $request->amount,
                'payment_method' => $method,
                'verified_by' => $request->collectedBy,
                'payment_date' => $request->collectionDate,
                'reference_no' => $method === PaymentMethod::Cash->value ? null : $referenceNo,
                'schedule_id' => $request->schedule_id,
            ]);

            // Process payment using RepaymentService
            $this->repaymentService->processPayment($payment);

            DB::commit();

            return redirect()->route('repayments.index')->with('success', 'Payment processed successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();

            return redirect()->back()->withErrors(['error' => 'Failed to process payment: '.$e->getMessage()]);
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
                    'borrowerName' => $p->loan?->borrower
                        ? $p->loan->borrower->first_name.' '.$p->loan->borrower->last_name
                        : 'N/A',
                    'loanNo' => $p->loan?->ID ?? 'N/A',
                    'scheduleNo' => $p->amortizationSchedule?->installment_no ?? 'N/A',
                    'method' => $p->payment_method?->label() ?? 'N/A',
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
}
