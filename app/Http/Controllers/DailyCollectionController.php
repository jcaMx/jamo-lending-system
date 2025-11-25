<?php
  namespace App\Http\Controllers;

  use App\Models\Loan;
  use Illuminate\Http\Request;
  use App\Models\AmortizationSchedule;
  use Inertia\Inertia;
  use App\Models\JamoUser;
  use Carbon\Carbon;

  class DailyCollectionController extends Controller
  {
    public function index(Request $request) 
    {
      $collector = $request->input('collector');

      $date = $request->input('date') ?? Carbon::today()->toDateString();

      $dueSchedules = AmortizationSchedule::with(['loan.borrower', 'loan.approver'])->whereDate('due_date', $date)->where('status', '!=', 'Paid')->when($collector, function ($query, $collector) {
        $query->whereHas('loan.approver', function ($q) use ($collector) {
          $q->where('first_name', 'like', "%{$collector}%")
          ->orWhere('last_name', 'like', "%{$collector}%");
        });
      })->get();

      $due_loans = $dueSchedules->map(function ($schedule) {
        return [
          'id' => $schedule->ID,
          'name' => $schedule->loan->borrower->first_name . ' ' . $schedule->loan->borrower->last_name,
          'loanNo' => $schedule->loan->ID,
          'principal' => $schedule->installment_amount,
          'interest' => $schedule->interest_amount,
          'penalty' => $schedule->penalty_amount,
          'total_due' => $schedule->installment_amount + $schedule->interest_amount + $schedule->penalty_amount,
          'collector' => $schedule->loan->approver->first_name ?? '',
          'collection_date' => $schedule->due_date->toDateString(),
        ];
      });

      $collectors = JamoUser::pluck('first_name')->unique()->toArray();

      return Inertia::render('daily-collection-sheet', [
        'due_loans' => $due_loans,
        'collectors' => $collectors,
      ]);

    }
  }