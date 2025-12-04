<?php

namespace App\Http\Controllers;

use App\Models\AmortizationSchedule;
use App\Models\JamoUser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DailyCollectionController extends Controller
{
    public function index(Request $request)
    {
        $collector = $request->input('collector');
        $date = $request->input('date') ?? Carbon::today()->toDateString();

        // Get due schedules for the date
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

        // Get payments made on this date
        $payments = \App\Models\Payment::with(['loan.borrower', 'jamoUser', 'amortizationSchedule'])
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

        $collections = $payments->map(function ($payment) {
            return [
                'id' => $payment->ID,
                'name' => $payment->loan->borrower->first_name.' '.$payment->loan->borrower->last_name,
                'loanNo' => $payment->loan->ID,
                'amount' => $payment->amount,
                'method' => $payment->payment_method?->value ?? 'N/A',
                'reference_no' => $payment->reference_no,
                'collected_by' => $payment->jamoUser ? $payment->jamoUser->first_name.' '.$payment->jamoUser->last_name : 'N/A',
                'collection_date' => $payment->payment_date->toDateString(),
                'schedule_no' => $payment->amortizationSchedule?->installment_no ?? 'N/A',
            ];
        });

        $collectors = JamoUser::pluck('first_name')->unique()->toArray();

        return Inertia::render('daily-collection-sheet', [
            'due_loans' => $due_loans,
            'collections' => $collections,
            'collectors' => $collectors,
            'date' => $date,
        ]);

    }
}
