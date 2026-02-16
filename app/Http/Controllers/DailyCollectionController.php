<?php

namespace App\Http\Controllers;

use App\Models\AmortizationSchedule;
use App\Models\JamoUser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Schema;
use PDF;

class DailyCollectionController extends Controller
{
    public function index(Request $request)
    {
        $collector = $request->input('collector');
        $date = $request->input('date') ?? Carbon::today()->toDateString();
        [$due_loans, $collections] = $this->buildDailyCollectionData($collector, $date);

        $collectors = JamoUser::pluck('first_name')->unique()->toArray();

        return Inertia::render('daily-collection-sheet', [
            'due_loans' => $due_loans,
            'collections' => $collections,
            'collectors' => $collectors,
            'date' => $date,
        ]);

    }

    public function exportPdf(Request $request)
    {
        $collector = $request->input('collector');
        $date = $request->input('date') ?? Carbon::today()->toDateString();
        $tab = $request->input('tab', 'due');
        $tab = in_array($tab, ['due', 'collections'], true) ? $tab : 'due';

        [$due_loans, $collections] = $this->buildDailyCollectionData($collector, $date);

        return PDF::loadView('pdf.dcs_pdf', [
            'due_loans' => $due_loans,
            'collections' => $collections,
            'collector' => $collector,
            'date' => $date,
            'tab' => $tab,
        ])->download('Daily_Collection_Sheet.pdf');
    }

    private function buildDailyCollectionData(?string $collector, string $date): array
    {
        $dueSchedules = AmortizationSchedule::with(['loan.borrower', 'loan.approver'])
            ->whereDate('due_date', $date)
            ->whereIn('status', ['Unpaid', 'Overdue'])
            ->when($collector, function ($query, $collector) {
                $query->whereHas('loan.approver', function ($q) use ($collector) {
                    $q->where('first_name', 'like', "%{$collector}%")
                        ->orWhere('last_name', 'like', "%{$collector}%");
                });
            })
            ->get();

        $paymentRelations = ['loan.borrower', 'jamoUser', 'amortizationSchedule'];
        if (Schema::hasTable('payment_schedule_allocations')) {
            $paymentRelations[] = 'scheduleAllocations.amortizationSchedule';
        }

        $payments = \App\Models\Payment::with($paymentRelations)
            ->whereDate('payment_date', $date)
            ->when($collector, function ($query, $collector) {
                $query->whereHas('jamoUser', function ($q) use ($collector) {
                    $q->where('first_name', 'like', "%{$collector}%")
                        ->orWhere('last_name', 'like', "%{$collector}%");
                });
            })
            ->get();

        $due_loans = $dueSchedules->map(function ($schedule) {
            return [
                'id' => $schedule->ID,
                'name' => $schedule->loan->borrower->first_name.' '.$schedule->loan->borrower->last_name,
                'loanNo' => $schedule->loan->ID,
                'principal' => $schedule->installment_amount,
                'interest' => $schedule->interest_amount,
                'penalty' => $schedule->penalty_amount,
                'total_due' => $schedule->installment_amount + $schedule->interest_amount + $schedule->penalty_amount - $schedule->amount_paid,
                'collector' => $schedule->loan->approver->first_name ?? '',
                'collection_date' => $schedule->due_date->toDateString(),
            ];
        });

        $collections = $payments->flatMap(function ($payment) {
            $borrowerName = $payment->loan->borrower->first_name.' '.$payment->loan->borrower->last_name;
            $collectorName = $payment->jamoUser ? $payment->jamoUser->first_name.' '.$payment->jamoUser->last_name : 'N/A';
            $paymentMethod = (string) $payment->payment_method;

            if (Schema::hasTable('payment_schedule_allocations') && $payment->scheduleAllocations->isNotEmpty()) {
                return $payment->scheduleAllocations->map(function ($allocation) use ($payment, $borrowerName, $collectorName, $paymentMethod) {
                    return [
                        'id' => $payment->ID.'-'.$allocation->ID,
                        'name' => $borrowerName,
                        'loanNo' => $payment->loan->ID,
                        'amount' => (float) $allocation->applied_amount,
                        'method' => $paymentMethod ?: 'N/A',
                        'reference_no' => $payment->reference_no,
                        'collected_by' => $collectorName,
                        'collection_date' => $payment->payment_date->toDateString(),
                        'schedule_no' => $allocation->amortizationSchedule?->installment_no ?? 'N/A',
                        'due_date' => optional($allocation->due_date)->toDateString(),
                    ];
                });
            }

            return [[
                'id' => $payment->ID,
                'name' => $borrowerName,
                'loanNo' => $payment->loan->ID,
                'amount' => (float) $payment->amount,
                'method' => $paymentMethod ?: 'N/A',
                'reference_no' => $payment->reference_no,
                'collected_by' => $collectorName,
                'collection_date' => $payment->payment_date->toDateString(),
                'schedule_no' => $payment->amortizationSchedule?->installment_no ?? 'N/A',
                'due_date' => optional($payment->amortizationSchedule?->due_date)->toDateString(),
            ]];
        })->values();

        return [$due_loans, $collections];
    }
}
