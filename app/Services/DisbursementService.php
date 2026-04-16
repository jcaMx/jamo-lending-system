<?php

namespace App\Services;

use App\Models\BankAccount;
use App\Models\ChequeDetail;
use App\Models\Disbursement;
use App\Models\Loan;
use App\Models\Voucher;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Notifications\NotifyUser;

class DisbursementService
{
    private const PROCESSING_FEE_RATE = 0.03;
    private const INSURANCE_FEE_RATE = 0.02;
    private const NOTARY_FEE_RATE = 0.01;
    private const SAVINGS_CONTRIBUTION_RATE = 0.02;

    public function __construct(
        protected LoanService $loanService
    ) {}

    public function create(array $data, int $actorId): Disbursement
    {
        return DB::transaction(function () use ($data, $actorId) {
            $loan = Loan::query()->findOrFail((int) $data['loan_id']);

            if ($loan->status !== 'Active') {
                throw new \RuntimeException('Only approved/active loans can be disbursed.');
            }

            $grossAmount = (float) $data['amount'];
            if ($grossAmount <= 0) {
                throw new \RuntimeException('Disbursement amount must be greater than zero.');
            }

            if ($grossAmount > (float) $loan->principal_amount) {
                throw new \RuntimeException('Disbursement amount cannot exceed loan principal.');
            }

            if ((float) ($loan->released_amount ?? 0) > 0) {
                throw new \RuntimeException('Loan already has released amount posted.');
            }

            $feeBreakdown = $this->getFeeBreakdown($grossAmount);
            $processingFee = $feeBreakdown['processing_fee'];
            $insuranceFee = $feeBreakdown['insurance_fee'];
            $notaryFee = $feeBreakdown['notary_fee'];
            $savingsContribution = $feeBreakdown['savings_contribution'];
            $totalFees = $feeBreakdown['total_fees'];
            $netDisbursedAmount = $feeBreakdown['net_disbursed_amount'];

            if ($netDisbursedAmount <= 0) {
                throw new \RuntimeException('Net disbursed amount must be greater than zero after fees.');
            }

            $completedExists = Disbursement::query()
                ->where('loan_id', $loan->ID)
                ->where('status', 'Completed')
                ->exists();

            if ($completedExists) {
                throw new \RuntimeException('A completed disbursement already exists for this loan.');
            }

            $disbursement = Disbursement::create([
                'loan_id' => $loan->ID,
                'borrower_id' => $loan->borrower_id,
                'disbursement_no' => $this->generateDisbursementNumber(),
                'amount' => $netDisbursedAmount,
                'currency' => $data['currency'] ?? 'PHP',
                'method' => $data['method'],
                'reference_no' => $data['reference_no'] ?? null,
                'status' => 'Pending',
                'requested_at' => now(),
                'remarks' => $data['remarks'] ?? null,
                'idempotency_key' => $data['idempotency_key'] ?? $this->generateIdempotencyKey(),
                'created_by' => $actorId,
            ]);

            if (in_array($disbursement->method, ['Cash', 'Cheque Voucher'], true)) {
                $voucher = Voucher::create([
                    'disbursement_id' => $disbursement->ID,
                    'loan_id' => $loan->ID,
                    'voucher_no' => $data['voucher_no'],
                    'voucher_type' => $disbursement->method === 'Cheque Voucher' ? 'cheque' : 'cash',
                    'voucher_date' => $data['voucher_date'],
                    'payee_name' => $data['payee_name'],
                    'payee_address' => $data['payee_address'] ?? null,
                    'payee_tin' => $data['payee_tin'] ?? null,
                    'particulars' => $data['particulars'],
                    'gross_amount' => $data['gross_amount'] ?? $grossAmount,
                    'prepared_by_user_id' => $actorId,
                    'status' => 'draft',
                ]);

                if ($disbursement->method === 'Cheque Voucher') {
                    $bankAccount = BankAccount::query()->where('is_active', true)->findOrFail((int) $data['bank_account_id']);

                    ChequeDetail::create([
                        'voucher_id' => $voucher->ID,
                        'bank_account_id' => $bankAccount->ID,
                        'bank_name' => $bankAccount->bank_name,
                        'cheque_no' => $data['cheque_no'],
                        'cheque_date' => $data['cheque_date'],
                    ]);
                }
            }

            $this->addEvent($disbursement, 'Requested', null, 'Pending', $actorId, [
                'method' => $disbursement->method,
                'reference_no' => $disbursement->reference_no,
                'gross_amount' => $grossAmount,
                'processing_fee' => $processingFee,
                'insurance_fee' => $insuranceFee,
                'notary_fee' => $notaryFee,
                'savings_contribution' => $savingsContribution,
                'total_fees' => $totalFees,
                'net_disbursed_amount' => $netDisbursedAmount,
            ]);

            return $disbursement->fresh();
        });
    }

    public function approve(Disbursement $disbursement, int $actorId): Disbursement
    {
        return DB::transaction(function () use ($disbursement, $actorId) {
            $locked = Disbursement::query()->lockForUpdate()->findOrFail($disbursement->ID);

            if ($locked->status !== 'Pending') {
                throw new \RuntimeException('Only pending disbursements can be approved.');
            } 

            $oldStatus = $locked->status;
            $locked->status = 'Processing';
            $locked->approved_by = $actorId;
            $locked->approved_at = now();
            $locked->save();

            if ($locked->voucher && $locked->voucher->status === 'draft') {
                $locked->voucher->approved_by_user_id = $actorId;
                $locked->voucher->status = 'approved';
                $locked->voucher->save();
            }

            $this->addEvent($locked, 'Approved', $oldStatus, $locked->status, $actorId);

            return $locked->fresh();
        });
    }

    public function getFeeBreakdown(float $grossAmount): array
    {
        $grossAmount = round(max($grossAmount, 0), 2);
        $processingFee = round($grossAmount * self::PROCESSING_FEE_RATE, 2);
        $insuranceFee = round($grossAmount * self::INSURANCE_FEE_RATE, 2);
        $notaryFee = round($grossAmount * self::NOTARY_FEE_RATE, 2);
        $savingsContribution = round($grossAmount * self::SAVINGS_CONTRIBUTION_RATE, 2);
        $totalFees = round($processingFee + $insuranceFee + $notaryFee + $savingsContribution, 2);

        return [
            'gross_amount' => $grossAmount,
            'processing_fee' => $processingFee,
            'insurance_fee' => $insuranceFee,
            'notary_fee' => $notaryFee,
            'savings_contribution' => $savingsContribution,
            'total_fees' => $totalFees,
            'net_disbursed_amount' => round($grossAmount - $totalFees, 2),
        ];
    }

    public function complete(
        Disbursement $disbursement,
        int $actorId,
        ?string $referenceNo = null,
        ?string $disbursedAt = null,
        ?string $receivedByName = null,
        ?string $receivedAt = null
    ): Disbursement
    {
        return DB::transaction(function () use ($disbursement, $actorId, $referenceNo, $disbursedAt, $receivedByName, $receivedAt) {
            $locked = Disbursement::query()->lockForUpdate()->findOrFail($disbursement->ID);

            if ($locked->status !== 'Processing') {
                throw new \RuntimeException('Only processing disbursements can be completed.');
            }

            $oldStatus = $locked->status;
            $locked->status = 'Completed';
            $locked->processed_by = $actorId;

            $finalDisbursedAt = $disbursedAt ? Carbon::parse($disbursedAt) : Carbon::now();
            if ($locked->approved_at && $finalDisbursedAt->lt(Carbon::parse($locked->approved_at))) {
                throw new \RuntimeException('Disbursed date cannot be earlier than approval date.');
            }
            if ($finalDisbursedAt->gt(Carbon::now()->addDay())) {
                throw new \RuntimeException('Disbursed date cannot be set too far in the future.');
            }

            $locked->disbursed_at = $finalDisbursedAt;
            if ($referenceNo !== null && $referenceNo !== '') {
                $locked->reference_no = $referenceNo;
            }

            $locked->save();

            $loan = Loan::query()->findOrFail($locked->loan_id);
            $this->loanService->finalizeLoanDisbursement(
                $loan,
                (float) $locked->amount,
                optional($finalDisbursedAt)->toDateTimeString()
            );

            
            $borrower = $loan->borrower;
            
            if ($borrower && $borrower->email) {
                $borrower->notify(new NotifyUser(
                    message: $message ?? "Your loan has been successfully released. You may now claim your funds.",
                    subject: "Loan Disbursed",
                    email: $borrower->email,
                ));
            }

            if ($locked->voucher) {
                $voucherReceivedAt = $receivedAt ? Carbon::parse($receivedAt) : $finalDisbursedAt;
                $locked->voucher->status = 'released';
                $locked->voucher->received_by_name = $receivedByName;
                $locked->voucher->received_at = $voucherReceivedAt;
                $locked->voucher->save();
            }

            $this->addEvent($locked, 'Completed', $oldStatus, $locked->status, $actorId, [
                'reference_no' => $locked->reference_no,
            ]);

            return $locked->fresh();
        });
    }

    public function fail(Disbursement $disbursement, int $actorId, ?string $failureCode, ?string $failureReason): Disbursement
    {
        return DB::transaction(function () use ($disbursement, $actorId, $failureCode, $failureReason) {
            $locked = Disbursement::query()->lockForUpdate()->findOrFail($disbursement->ID);

            if (! in_array($locked->status, ['Pending', 'Processing'], true)) {
                throw new \RuntimeException('Only pending/processing disbursements can be failed.');
            }

            $oldStatus = $locked->status;
            $locked->status = 'Failed';
            $locked->processed_by = $actorId;
            $locked->failure_code = $failureCode;
            $locked->failure_reason = $failureReason;
            $locked->save();

            if ($locked->voucher && $locked->voucher->status !== 'released') {
                $locked->voucher->status = 'void';
                $locked->voucher->void_reason = $failureReason;
                $locked->voucher->save();
            }

            $this->addEvent($locked, 'Failed', $oldStatus, $locked->status, $actorId, [
                'failure_code' => $failureCode,
                'failure_reason' => $failureReason,
            ]);

            return $locked->fresh();
        });
    }

    private function addEvent(Disbursement $disbursement, string $eventType, ?string $oldStatus, ?string $newStatus, ?int $actorId, array $payload = []): void
    {
        if (! Schema::hasTable('disbursement_events')) {
            return;
        }

        $disbursement->events()->create([
            'event_type' => $eventType,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'payload' => $payload ?: null,
            'actor_id' => $actorId,
            'created_at' => now(),
        ]);
    }

    private function generateDisbursementNumber(): string
    {
        do {
            $value = 'DSB-' . now()->format('YmdHis') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6));
        } while (Disbursement::query()->where('disbursement_no', $value)->exists());

        return $value;
    }

    private function generateIdempotencyKey(): string
    {
        do {
            $value = hash('sha256', uniqid('dsb_', true) . random_int(1000, 999999));
        } while (Disbursement::query()->where('idempotency_key', $value)->exists());

        return $value;
    }
}
