<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use App\Models\Loan;
use App\Models\Payment;
use App\Models\PaymentScheduleAllocation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Schema;
use PDF;

class MCPRController extends Controller
{
    public function index()
    {
        $rowsByKey = [];

        $loans = Loan::query()
            ->whereNotNull('released_amount')
            ->where('released_amount', '>', 0)
            ->whereNotNull('released_date')
            ->get(['released_amount', 'released_date', 'interest_rate']);

        foreach ($loans as $loan) {
            $month = optional($loan->released_date)->format('Y-m');
            if (! $month) {
                continue;
            }

            $interestType = $this->normalizeInterestType($loan->interest_rate);
            $key = $month.'|'.$interestType;

            if (! isset($rowsByKey[$key])) {
                $rowsByKey[$key] = $this->emptyMonthlyRow($month, $interestType);
            }

            $released = (float) $loan->released_amount;
            $rowsByKey[$key]['loanReleased'] += $released;
            $rowsByKey[$key]['sixPercentDeduction'] += $released * 0.06;
            $rowsByKey[$key]['advanceTenPercentDeduction'] += $interestType === '10%' ? $released * 0.10 : 0;
        }

        $hasAllocationsTable = Schema::hasTable('payment_schedule_allocations');

        if ($hasAllocationsTable) {
            $allocations = PaymentScheduleAllocation::with(['loan', 'payment'])
                ->whereHas('payment', function ($query) {
                    $query->whereRaw('LOWER(status) = ?', ['confirmed']);
                })
                ->orderBy('payment_date')
                ->get();

            foreach ($allocations as $allocation) {
                $month = optional($allocation->payment_date)->format('Y-m')
                    ?? optional($allocation->payment?->payment_date)->format('Y-m');
                if (! $month) {
                    continue;
                }

                $interestType = $this->normalizeInterestType($allocation->loan?->interest_rate);
                $key = $month.'|'.$interestType;

                if (! isset($rowsByKey[$key])) {
                    $rowsByKey[$key] = $this->emptyMonthlyRow($month, $interestType);
                }

                $rowsByKey[$key]['LPP'] += (float) ($allocation->principal_applied ?? 0);
                $rowsByKey[$key]['LIP'] += (float) ($allocation->interest_applied ?? 0);
            }
        } else {
            $payments = Payment::with(['loan', 'amortizationSchedule'])
                ->whereRaw('LOWER(status) = ?', ['confirmed'])
                ->orderBy('payment_date')
                ->get();

            foreach ($payments as $payment) {
                $month = optional($payment->payment_date)->format('Y-m');
                if (! $month) {
                    continue;
                }

                $interestType = $this->normalizeInterestType($payment->loan?->interest_rate);
                $key = $month.'|'.$interestType;

                if (! isset($rowsByKey[$key])) {
                    $rowsByKey[$key] = $this->emptyMonthlyRow($month, $interestType);
                }

                $principalPaid = (float) min(
                    (float) ($payment->amortizationSchedule?->installment_amount ?? 0),
                    (float) $payment->amount
                );

                $remainingAfterPrincipal = max(0, (float) $payment->amount - $principalPaid);
                $interestPaid = (float) min(
                    (float) ($payment->amortizationSchedule?->interest_amount ?? 0),
                    $remainingAfterPrincipal
                );

                $rowsByKey[$key]['LPP'] += $principalPaid;
                $rowsByKey[$key]['LIP'] += $interestPaid;
            }
        }

        $rows = collect($rowsByKey)
            ->values()
            ->sortBy('month')
            ->values()
            ->all();

        return Inertia::render('Reports/MonthlyReport', [
            'rows' => $rows,
        ]);
    }

    public function exportPdf(Request $request)
    {
        $rows = $request->input('rows', []);

        return PDF::loadView('pdf.mcpr_pdf', compact('rows'))
            ->download('Monthly_Report.pdf');
    }

    public function printPreview(Request $request)
    {
        $rows = $request->input('rows', []);

        return view('pdf.mcpr_pdf', compact('rows'));
    }

    private function normalizeInterestType(?float $interestRate): string
    {
        return $interestRate !== null && $interestRate >= 10 ? '10%' : '5%';
    }

    private function emptyMonthlyRow(string $month, string $interestType): array
    {
        return [
            'month' => $month,
            'loanReleased' => 0.0,
            'sixPercentDeduction' => 0.0,
            'advanceTenPercentDeduction' => 0.0,
            'LPP' => 0.0,
            'LIP' => 0.0,
            'interestType' => $interestType,
        ];
    }
}
