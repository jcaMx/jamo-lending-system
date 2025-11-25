<?php
  namespace App\Services;

  use App\Repositories\Interfaces\IPenaltyCalculator;
  use App\Repositories\Interfaces\IHolidayService;
  use App\Services\FormulaService;
  use App\Models\Loan;
  use App\Models\AmortizationSchedule;
  use App\Models\ScheduleStatus;
  use App\Models\Penalty;
  use App\Models\PenaltyStatus;
  use App\Models\PennaltyType;
  use Carbon\Carbon;

  class DefaultPenaltyService implements IPenaltyCalculator
  {
    protected FormulaService $formulaService;
    protected IHolidayService $holidayService;

    const PENALTY_FORMULA_NAME = 'Overdue Penalty';

    public function __construct(FormulaService $formulaService,
    IHolidayService $holidayService)
    {
      $this->formulaService = $formulaService;
      $this->holidayService = $holidayService;
    }

    public function calculate(Loan $loan): void
    {
      DB::transaction(function () use ($loan) {

        $overdueSchedules = $loan->amortizationSchedules()->where('status', ScheduleStatus::Overdue->value)->orderBy('due_date')->get();

        foreach ($overdueSchedules as $overdue) {

          $penaltyBase = $overdue->installment_amount;

          if($overdue->amount_paid >= $overdue->interest_amount) {
            $penaltyBase -= $overdue->interest_amount;
          }

          $penaltyAmount = round($penaltyBase * Penalty::PENALTY_RATE, 2);

          $nextInstallment = $loan->amortizationnSchedules()->where('status', ScheduleStatus::Unpaid->value)->where('installment_no', '>', $overdue->installment_no)->orderBy('installment_no')->first();

          if($nextInstallment) {

            $nextInstallment->due_date = $this->holidayService->adjustDate($nextInstallment->due_date);

            $nextInstallment->installment_amount += $penaltyAmount;
            $nextInstallment->penalty_amount += $penaltyAmount;
            $nextInstallment->save();

            Penalty::create([
              'type' => PenaltyType::LatePayment->value,
              'amount' => $penaltyAmount,
              'date_applied' => Carbon::now(),
              'status' => PenaltyStatus::Pending->value,
              'schedule_id' => $nextInstallment->ID
            ]);

            $loan->balance_remaining += $penaltyAmount;
          }
        }
        $loan->save();
      });

    }
  }