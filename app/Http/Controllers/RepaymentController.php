<?php

namespace App\Http\Controllers;

use App\Models\Borrower;
use App\Models\JamoUser;
use App\Models\Payment;
use App\Models\PaymentMethod;
use App\Services\RepaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
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
        $request->merge([
            'referenceNumber' => $request->input('referenceNumber', $request->input('reference_number')),
        ]);

        $rules = [
            'borrower_id' => 'required|exists:borrower,ID',
            'loanNo' => 'required|exists:loan,ID',
            'schedule_ids' => 'required|array|min:1',
            'schedule_ids.*' => 'integer|exists:amortizationschedule,ID',
            'amount' => 'required|numeric|min:0.01',
            'method' => 'required|string|max:50',
            'collectedBy' => 'required|exists:jamouser,ID',
            'collectionDate' => 'required|date',
        ];

        // Conditionally require referenceNumber for non-Cash payments
        $inputMethod = $request->input('method');
        if (in_array($inputMethod, ['Bank', 'GCash', 'Cebuana', 'Metrobank'], true)) {
            $rules['referenceNumber'] = 'required|string|max:255';
        } else {
            $rules['referenceNumber'] = 'nullable|string|max:255';
        }

        $request->validate($rules);

        try {
            DB::beginTransaction();

            $methodValue = $this->normalizePaymentMethod($inputMethod)->value;

            // Generate receipt number (unique payment ID)
            $receiptNumber = 'RCP-'.strtoupper(substr(uniqid(), -8)).'-'.date('YmdHis');
            
            // Ensure receipt number is unique
            while (Payment::where('receipt_number', $receiptNumber)->exists()) {
                $receiptNumber = 'RCP-'.strtoupper(substr(uniqid(), -8)).'-'.date('YmdHis');
            }

            // Generate reference number if not provided and not Cash
            $referenceNo = $request->referenceNumber;
            if ($methodValue !== PaymentMethod::Cash->value && ! $referenceNo) {
                $referenceNo = 'REF-'.strtoupper(substr(uniqid(), -8)).'-'.date('Ymd');
            }

            // For Cash payments, use NULL instead of empty string (allows multiple cash payments)
            if ($methodValue === PaymentMethod::Cash->value) {
                $referenceNo = null;
            }

            // Check if reference number already exists (for non-cash)
            if ($methodValue !== PaymentMethod::Cash->value && $referenceNo) {
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
                'payment_method' => $methodValue,
                'verified_by' => $request->collectedBy,
                'payment_date' => $request->collectionDate,
                'reference_no' => $referenceNo,
                'schedule_id' => $primaryScheduleId,
            ]);

            $payment->refresh();
            $payment->load('loan');

            $this->repaymentService->processPayment($payment, $eligibleSchedules->pluck('ID')->all());

            DB::commit();

            return redirect()->route('repayments.index')->with('success', 'Payment processed successfully! Receipt Number: '.$receiptNumber);
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

    public function index()
    {
        $relations = ['loan.borrower', 'jamoUser', 'amortizationSchedule'];
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
