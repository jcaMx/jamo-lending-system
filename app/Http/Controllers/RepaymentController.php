<?php

namespace App\Http\Controllers;

use App\Models\Borrower;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Models\User;
use App\Services\RepaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Notifications\NotifyUser;
use Illuminate\Validation\Rule;



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
    
        $collectors = User::query()
            ->orderBy('name')
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'name' => $c->name,
            ])
            ->values();
    
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
            'method' => 'required|string|max:50',
            'collectedBy' => [
                Rule::requiredIf($isDirectCash),
                'nullable',
                'exists:users,id',
            ],
            'collectionDate' => [
                Rule::requiredIf($isDirectCash),
                'nullable',
                'date',
            ],
        ];

        // Conditionally require referenceNumber for non-Cash payments
        if (in_array($inputMethod, ['Bank', 'GCash', 'Cebuana'])) {
            $rules['reference_number'] = 'required|string|max:255';
        }

        // Validation for Cash Voucher
        if ($inputMethod === 'Cash Voucher') {
            $rules['voucher_number'] = 'required|string|max:255';
            $rules['voucher_date'] = 'nullable|date';
        }

        // Validation for Cheque Voucher
        if ($inputMethod === 'Cheque Voucher') {
            $rules['cheque_number'] = 'required|string|max:255';
            $rules['bank_name'] = 'required|string|max:255';
            $rules['cheque_date'] = 'required|date';
        }
        $request->validate($rules);

        try {
            DB::beginTransaction();

            $methodEnum = $this->normalizePaymentMethod($inputMethod);
            $methodValue = $methodEnum->value;
            $paymentStatus = $isDirectCash ? 'confirmed' : 'pending';
            $isConfirmedPayment = $paymentStatus === 'confirmed';
            $paymentDate = $isConfirmedPayment
                ? $request->input('collectionDate')
                : now();

            // Generate unique receipt number
            do {
                $receiptNumber = 'RCP-' . strtoupper(substr(uniqid(), -8)) . '-' . now()->format('YmdHis');
            } while (Payment::where('receipt_number', $receiptNumber)->exists());


            // Generate reference number only for Bank/GCash/Cebuana
            $referenceNo = null;

            if (in_array($methodValue, [PaymentMethod::Bank->value, PaymentMethod::GCash->value, PaymentMethod::Cebuana->value], true)) {
                $referenceNo = $request->reference_number
                    ?? 'REF-' . strtoupper(substr(uniqid(), -8)) . '-' . now()->format('Ymd');
            } elseif ($inputMethod === 'Cash Voucher') {
                $referenceNo = $request->voucher_number;
            } elseif ($inputMethod === 'Cheque Voucher') {
                $referenceNo = $request->cheque_number;
            }


            // Check if reference number already exists (for non-cash)
            if (! $isDirectCash && $referenceNo) {
                $existingPayment = Payment::where('reference_no', $referenceNo)->first();
                if ($existingPayment) {
                    DB::rollBack();
                    return redirect()->back()->withErrors(['referenceNumber' => 'This reference number has already been used.']);
                }
            }

            $loan = \App\Models\Loan::find($request->loanNo);
            $selectedScheduleIds = collect($request->input('schedule_ids', []))
                ->map(fn ($id) => (int) $id)
                ->filter()
                ->unique()
                ->values();

            if (! $loan || $selectedScheduleIds->isEmpty()) {
                DB::rollBack();
                return redirect()->back()->withErrors(['error' => 'Please select at least one schedule to pay.']);
            }

            $eligibleSchedules = $loan->amortizationSchedules()
                ->whereIn('ID', $selectedScheduleIds->all())
                ->whereIn('status', [\App\Models\ScheduleStatus::Unpaid, \App\Models\ScheduleStatus::Overdue])
                ->orderBy('due_date', 'asc')
                ->get();

            if ($eligibleSchedules->isEmpty()) {
                DB::rollBack();
                return redirect()->back()->withErrors(['error' => 'Selected schedules are not eligible for payment.']);
            }

            $primaryScheduleId = (int) $eligibleSchedules->first()->ID;

            $payment = Payment::create([
                'receipt_number' => $receiptNumber,
                'loan_id' => $request->loanNo,
                'amount' => (float) $request->amount,  
                'status' => $paymentStatus,
                'payment_method' => $methodValue,
                'verified_by' => $isConfirmedPayment ? $request->collectedBy : null,
                'verified_date' => $isConfirmedPayment ? now() : null,
                'payment_date' => $paymentDate,
                'reference_no' => $referenceNo,
                'schedule_id' => $primaryScheduleId,
            ]);

            $payment->refresh();
            $payment->load('loan');

            if ($isConfirmedPayment) {
                $this->repaymentService->processPayment($payment, $eligibleSchedules->pluck('ID')->all());
            }

            DB::commit();

            $successMessage = $isConfirmedPayment
                ? 'Payment processed successfully! Receipt Number: '.$receiptNumber
                : 'Payment submitted as pending verification. Receipt Number: '.$receiptNumber;

            return redirect()->route('repayments.index')->with('success', $successMessage);
        } catch (\Throwable $e) {
            DB::rollBack();

            // Log the full error for debugging
            \Log::error('Payment processing failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all(),
            ]);

            return redirect()->back()->withErrors(['error' => 'Failed to process payment: '.$e->getMessage()]);
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
            $updatedRows = Payment::query()
                ->where('ID', $payment->ID)
                ->whereRaw('LOWER(status) = ?', ['pending'])
                ->update([
                    'status' => 'rejected',
                    'remarks' => $validated['remarks'] ?? null,
                    'verified_date' => now(),
                ]);

            if ($updatedRows === 0) {
                return redirect()->back()->withErrors(['error' => 'Only pending repayments can be rejected.']);
            }

            return redirect()->route('repayments.index')->with('success', 'Pending repayment rejected successfully.');
        } catch (\Throwable $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to reject repayment: '.$e->getMessage()]);
        }
    }

    public function index()
    {
        $relations = ['loan.borrower', 'verifiedBy', 'amortizationSchedule'];
        if (Schema::hasTable('payment_schedule_allocations')) {
            $relations[] = 'scheduleAllocations.amortizationSchedule';
        }

        $payments = Payment::with($relations)
            ->orderBy('payment_date', 'desc')
            ->get()
            ->map(function ($p) {
                $scheduleNos = [];
                if (Schema::hasTable('payment_schedule_allocations')) {
                    $scheduleNos = $p->scheduleAllocations
                        ->pluck('amortizationSchedule.installment_no')
                        ->filter()
                        ->unique()
                        ->values()
                        ->all();
                }

                return [
                    'id' => $p->ID,
                    'receiptNumber' => $p->receipt_number ?? 'N/A',
                    'borrowerName' => $p->loan?->borrower
                        ? $p->loan->borrower->first_name.' '.$p->loan->borrower->last_name
                        : 'N/A',
                    'loanNo' => $p->loan?->ID ?? 'N/A',
                    'scheduleNo' => $p->amortizationSchedule?->installment_no ?? 'N/A',
                    'scheduleNos' => $scheduleNos,
                    'method' => $p->payment_method ?? 'N/A',
                    'status' => (string) ($p->status ?? 'pending'),
                    'referenceNo' => $p->reference_no ?? 'N/A',
                    'collectedBy' => $p->verifiedBy?->name ?? 'N/A',
                    'collectionDate' => $p->payment_date?->toDateString() ?? null,
                    'submittedDate' => $p->payment_date?->toDateString() ?? null,
                    'amount' => $p->amount,
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

    private function normalizePaymentMethod(string $inputMethod): PaymentMethod
    {
        return match ($inputMethod) {
            'Cash', 'Cash Voucher', 'Cheque Voucher' => PaymentMethod::Cash,
            'GCash' => PaymentMethod::GCash,
            'Cebuana' => PaymentMethod::Cebuana,
            'Bank', 'Metrobank' => PaymentMethod::Bank,
            default => throw new \InvalidArgumentException('Unsupported payment method: '.$inputMethod),
        };
    }
}
