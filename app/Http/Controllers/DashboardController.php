<?php

namespace App\Http\Controllers;

use App\Models\AmortizationSchedule;
use App\Models\Borrower;
use App\Models\Loan;
use App\Models\Payment;
use App\Models\ScheduleStatus;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats()
    {
        $totalBorrowers = Borrower::count();
        $totalLoans = Loan::where('status', 'Active')->count();
        $totalCollections = Payment::sum('amount');
        $toReviewLoans = Loan::where('status', 'Pending')->count();
        $openLoans = Loan::where('status', 'Active')->count();
        $fullyPaid = Loan::where('status', 'Fully_Paid')->count();
        $restructured = Loan::where('status', 'Restructured')->count();
        $defaulted = Loan::where('status', 'Bad_Debt')->count();
        $totalLoansReleased = Loan::whereNotNull('released_amount')->sum('released_amount');

        return response()->json([
            'totalBorrowers' => $totalBorrowers,
            'total_loans' => $totalLoans,
            'total_collections' => round($totalCollections, 2),
            'to_review_loans' => $toReviewLoans,
            'open_loans' => $openLoans,
            'fully_paid' => $fullyPaid,
            'restructured' => $restructured,
            'defaulted' => $defaulted,
            'total_loans_released' => round($totalLoansReleased, 2),
        ]);
    }

    public function loans()
{
        $loans = Loan::selectRaw('MONTHNAME(updated_at) as month, COALESCE(SUM(released_amount), 0) as value')
            ->whereNotNull('released_amount')
            ->where('status', 'Active')
        ->groupBy('month')
            ->orderByRaw('MIN(updated_at)')
        ->get();

    return response()->json($loans);
}

    public function collections()
{
        $collections = Payment::selectRaw('MONTHNAME(payment_date) as month, COALESCE(SUM(amount), 0) as value')
        ->groupBy('month')
            ->orderByRaw('MIN(payment_date)')
        ->get();

    return response()->json($collections);
}

    public function upcomingDueSchedules()
    {
        $threeDaysFromNow = Carbon::now()->addDays(3);

        $schedules = AmortizationSchedule::with(['loan.borrower'])
            ->whereIn('status', [ScheduleStatus::Unpaid, ScheduleStatus::Overdue])
            ->whereBetween('due_date', [Carbon::now(), $threeDaysFromNow])
            ->orderBy('due_date', 'asc')
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->ID,
                    'loan_id' => $schedule->loan_id,
                    'borrower_name' => $schedule->loan->borrower->first_name.' '.$schedule->loan->borrower->last_name,
                    'installment_no' => $schedule->installment_no,
                    'due_date' => $schedule->due_date->toDateString(),
                    'total_due' => (float) ($schedule->installment_amount + $schedule->interest_amount + $schedule->penalty_amount - $schedule->amount_paid),
                    'days_until_due' => Carbon::now()->diffInDays($schedule->due_date, false),
                ];
            });

        return response()->json($schedules);
    }
}
