<?php

namespace App\Http\Controllers;

use App\Models\Borrower;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\ScheduleStatus;
use App\Models\User;
use App\Models\JamoUser;
use App\Services\RepaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Notifications\NotifyUser;
use Illuminate\Validation\Rule;
use App\Services\LoanService;
use Carbon\Carbon;


class RepaymentController extends Controller
{
    protected RepaymentService $repaymentService;
    protected LoanService $loanService;

    public function __construct(RepaymentService $repaymentService, LoanService $loanService)
    {
        $this->repaymentService = $repaymentService;
        $this->loanService = $loanService;
    }

    public function add()
    {
        $borrowers = Borrower::with(['loans.amortizationSchedules.penalties'])->get()
            ->map(function ($b) {
                $activeLoan = $b->loans->first(fn($loan) => $loan->status === 'Active');
                if (!$activeLoan) return null;

                $this->loanService->calculatePenalties($activeLoan);
                $activeLoan->refresh()->load('amortizationSchedules.penalties');

                $schedules = $activeLoan->amortizationSchedules
                    ->sortBy('due_date')
                    ->map(function ($schedule) {
                        return [
                            'ID' => $schedule->ID,
                            'installment_no' => $schedule->installment_no,
                            'due_date' => $schedule->due_date?->toDateString(),
                            'installment_amount' => (float)$schedule->installment_amount,
                            'interest_amount' => (float)$schedule->interest_amount,
                            'penalty_amount' => (float)$schedule->penalty_amount,
                            'amount_paid' => (float)$schedule->amount_paid,
                            'rebate_amount' => (float)$schedule->rebate_amount,
                            'status' => $schedule->status?->value ?? 'Unpaid',
                            'total_due' => round(max(0, (float)(
                                $schedule->installment_amount +
                                $schedule->penalty_amount -
                                $schedule->amount_paid -
                                $schedule->rebate_amount
                            )), 2),
                        ];
                    })->values();

                $nextSchedule = $schedules->first();

                return [
                    'id' => $b->ID,
                    'name' => $b->first_name . ' ' . $b->last_name,
                    'loanNo' => $activeLoan->ID,
                    'loan_id' => $activeLoan->ID,
                    'schedules' => $schedules,
                    'next_due_date' => $nextSchedule['due_date'] ?? null,
                    'next_due_amount' => $nextSchedule['total_due'] ?? 0,
                ];
            })
            ->filter();

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
        $request->merge([
            'referenceNumber' => $request->input('referenceNumber', $request->input('reference_number')),
        ]);

        $inputMethod = preg_replace('/\s+/', ' ', trim((string) $request->input('method')));
        $isDirectCash = $inputMethod === PaymentMethod::Cash->value;

        $rules = [
            'borrower_id' => 'required|exists:borrower,ID',
            'loanNo' => 'required|exists:loan,ID',
            'schedule_ids' => 'required|array|min:1',
            'schedule_ids.*' => 'integer|exists:amortizationschedule,ID',
            'amount' => 'required|numeric|min:0.01',
            'method' => ['required', Rule::enum(PaymentMethod::class)],
            'collectedBy' => 'required|exists:jamouser,ID',
            'collectionDate' => 'required|date',
            'reference_number' => 'nullable|string|max:255',
        ];

        $request->validate($rules);

        try {
            DB::beginTransaction();

            $methodEnum = PaymentMethod::from($request->method);
            $methodValue = $methodEnum->value;
            $paymentStatus = $isDirectCash ? 'confirmed' : 'pending';
            $isConfirmedPayment = $paymentStatus === 'confirmed';
            $paymentDate = $isConfirmedPayment
                ? $request->input('collectionDate')
                : now();

            // Generate unique receipt
            do {
                $receiptNumber = 'RCP-'.strtoupper(substr(uniqid(), -8)).'-'.date('YmdHis');
            } while (Payment::where('receipt_number', $receiptNumber)->exists());

            $referenceNo = $request->reference_number;

            if (in_array($methodValue, [
                PaymentMethod::Cash->value,
                PaymentMethod::CashVoucher->value
            ])) {
                $referenceNo = null;
            } else {
                // Auto-generate if empty OR duplicate
                if (!$referenceNo || Payment::where('reference_no', $referenceNo)->exists()) {
                    do {
                        $referenceNo = 'REF-'.strtoupper(substr(uniqid(), -8)).'-'.date('Ymd');
                    } while (Payment::where('reference_no', $referenceNo)->exists());
                }
            }

            // Schedule
            $scheduleId = $request->schedule_id;
            if (!$scheduleId) {
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

            if (!$scheduleId) {
                DB::rollBack();
                return back()->withErrors(['error' => 'No unpaid schedule found.']);
            }

            $status = in_array($methodValue, [
                PaymentMethod::Cash->value,
                PaymentMethod::CashVoucher->value
            ]) ? 'confirmed' : 'pending';

            $payment = Payment::create([
                'receipt_number' => $receiptNumber,
                'loan_id' => $request->loanNo,
                'amount' => (float)$request->amount,
                'payment_method' => $methodEnum,
                'verified_by' => $request->collectedBy,
                'payment_date' => $request->collectionDate,
                'reference_no' => $referenceNo,
                'schedule_id' => $scheduleId,
                'status' => $status,
            ]);

            // Process immediately ONLY if confirmed
            if ($status === 'confirmed') {
                $this->repaymentService->processPayment($payment, $request->schedule_ids ?? []);
            }

            DB::commit();

            return redirect()->route('repayments.index')
                ->with('success', 'Payment saved successfully! Receipt: '.$receiptNumber);

        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('Payment failed', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);

            return back()->withErrors(['error' => 'Failed: '.$e->getMessage()]);
        }
    }

    public function confirm(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'collectedBy' => 'required|exists:users,id',
            'collectionDate' => 'required|date',
        ]);

        try {
            DB::transaction(function () use ($payment, $validated) {
                $lockedPayment = Payment::query()
                    ->with('loan')
                    ->lockForUpdate()
                    ->findOrFail($payment->ID);

                if (strtolower((string) $lockedPayment->status) !== 'pending') {
                    throw new \RuntimeException('Only pending repayments can be confirmed.');
                }

                $lockedPayment->status = 'confirmed';
                $lockedPayment->verified_by = (int) $validated['collectedBy'];
                $lockedPayment->verified_date = now();
                $lockedPayment->payment_date = $validated['collectionDate'];
                $lockedPayment->save();

                $this->repaymentService->processPayment($lockedPayment, []);
            });

            return redirect()->route('repayments.index')->with('success', 'Pending repayment confirmed successfully.');
        } catch (\Throwable $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to confirm repayment: '.$e->getMessage()]);
        }
    }

    public function reject(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'remarks' => 'nullable|string|max:100',
        ]);

        try {
            DB::transaction(function () use ($payment, $validated) {
                $lockedPayment = Payment::query()
                    ->with('amortizationSchedule')
                    ->lockForUpdate()
                    ->findOrFail($payment->ID);

                if (strtolower((string) $lockedPayment->status) !== 'pending') {
                    throw new \RuntimeException('Only pending repayments can be rejected.');
                }

                $lockedPayment->update([
                    'status' => 'rejected',
                    'remarks' => $validated['remarks'] ?? null,
                    'verified_date' => now(),
                ]);

                $schedule = $lockedPayment->amortizationSchedule;

                if ($schedule) {
                    $schedule->status = Carbon::parse($schedule->due_date)->startOfDay()->lt(now()->startOfDay())
                        ? ScheduleStatus::Overdue
                        : ScheduleStatus::Unpaid;
                    $schedule->save();
                }
            });

            return redirect()->route('repayments.index')->with('success', 'Pending repayment rejected successfully.');
        } catch (\Throwable $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to reject repayment: '.$e->getMessage()]);
        }
    }

    public function index()
    {
        $payments = Payment::whereIn('status', ['pending', 'confirmed', 'rejected'])
            ->with(['loan.borrower', 'jamoUser', 'amortizationSchedule'])
            ->orderBy('payment_date', 'desc')
            ->get()
            ->map(function ($p) {
                $scheduleNos = $p->amortizationSchedule ? [$p->amortizationSchedule->installment_no] : [];

                return [
                    'id' => $p->ID,
                    'borrowerName' => $p->loan?->borrower
                        ? $p->loan->borrower->first_name.' '.$p->loan->borrower->last_name
                        : 'N/A',
                    'loanNo' => $p->loan?->ID ?? 'N/A',
                    'scheduleNos' => $scheduleNos,
                    'method' => $p->payment_method instanceof PaymentMethod ? $p->payment_method->value : (string)$p->payment_method,
                    'status' => $p->status,
                    'referenceNo' => $p->reference_no ?? 'N/A',
                    'collectedBy' => $p->jamoUser?->first_name
                        ? $p->jamoUser->first_name.' '.$p->jamoUser->last_name
                        : 'N/A',
                    'collectionDate' => $p->payment_date?->toDateTimeString(),
                    'submittedDate' => $p->payment_date?->toDateTimeString(),
                    'amount' => (float)$p->amount,
                ];
            });

        return Inertia::render('repayments/index', [
            'repayments' => $payments,
            'collectors' => User::query()
                ->orderBy('name')
                ->get()
                ->map(fn ($collector) => [
                    'id' => $collector->id,
                    'name' => $collector->name,
                ])
                ->values(),
        ]);
    }

    public function pending()
    {
        return redirect()->route('repayments.index', ['tab' => 'pending']);
    }

    public function verify(Payment $payment)
    {
        $payment->status = 'confirmed';
        $payment->save();

        // ✅ Process only on verify
        $this->repaymentService->processPayment($payment);

        return redirect()->route('repayments.pending')
            ->with('success', 'Payment confirmed and processed!');
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
}
