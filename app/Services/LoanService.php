<?php

namespace App\Services;

use App\Events\LoanApproved;
use App\Events\LoanRejected;
use App\Models\Loan;
use App\Models\ScheduleStatus;
use App\Models\AmortizationSchedule;
use App\Models\Holiday;
use App\Repositories\Interfaces\IAmortizationCalculator;
use App\Repositories\Interfaces\IHolidayService;
use App\Repositories\Interfaces\IPenaltyCalculator;
use App\Services\Amortization\CompoundAmortizationCalculator;
use App\Services\Amortization\DiminishingAmortizationCalculator;
use Carbon\Carbon;
use Carbon\CarbonInterface;
use Illuminate\Support\Facades\DB;


class LoanService
{
    protected IHolidayService $holidayService;

    protected CompoundAmortizationCalculator $compoundCalculator;

    protected DiminishingAmortizationCalculator $diminishingCalculator;

    protected FormulaService $formulaService;

    protected IPenaltyCalculator $penaltyCalculator;

    public function __construct(
        IHolidayService $holidayService,
        CompoundAmortizationCalculator $compoundCalculator,
        DiminishingAmortizationCalculator $diminishingCalculator,
        FormulaService $formulaService,
        IPenaltyCalculator $penaltyCalculator)
    {
        $this->holidayService = $holidayService;
        $this->compoundCalculator = $compoundCalculator;
        $this->diminishingCalculator = $diminishingCalculator;
        $this->formulaService = $formulaService;
        $this->penaltyCalculator = $penaltyCalculator;
    }

    public function selectCalculator(Loan $loan): IAmortizationCalculator
    {
        return match ($loan->interest_type) {
            'Compound' => $this->compoundCalculator,
            'Diminishing' => $this->diminishingCalculator,
            default => throw new \Exception('Unknown amortization type')
        };
    }

    public function createLoan(array $data): Loan
    {
        return Loan::addLoan($data);
    }

    public function approveLoan(Loan $loan, int $approvedByUser): Loan
    {
        $updatedLoan = DB::transaction(function () use ($loan, $approvedByUser) {
            if ($loan->term_months < 1 || $loan->term_months > 840) {
                throw new \InvalidArgumentException('Loan term is invalid. Allowed range is 1 to 840 months.');
            }

            $loan->approved_by = $approvedByUser;
            $loan->status = 'Active';
            $loan->save();

            $schedules = $this->generateAmortization($loan);
            $loan->balance_remaining = $schedules->sum('installment_amount');
            $loan->save();

            $loan->borrower()->update(['status' => 'Active']);

            return $loan->fresh();
        });

        LoanApproved::dispatch($updatedLoan);

        return $updatedLoan;
    }

    public function finalizeLoanDisbursement(Loan $loan, float $releasedAmount, ?string $releasedDate = null): Loan
    {
        DB::transaction(function () use ($loan, $releasedAmount, $releasedDate) {
            $loan->released_amount = $releasedAmount;
            $loan->released_date = $releasedDate ? Carbon::parse($releasedDate) : Carbon::now();

            // Keep start_date as the release baseline. Calculators derive the first due date
            // by adding one repayment interval from this date.
            $loan->start_date = $loan->released_date->copy();

            // Calculate end_date based on term and repayment frequency
            $totalInstallments = match ($loan->repayment_frequency) {
                'Weekly' => (int) ceil($loan->term_months * 4.345),
                'Monthly' => $loan->term_months,
                'Yearly' => (int) ceil($loan->term_months / 12),
                default => $loan->term_months
            };

            $endDate = $loan->start_date->copy();
            $endDate = match ($loan->repayment_frequency) {
                'Weekly' => $endDate->addWeeks($totalInstallments),
                'Monthly' => $endDate->addMonthsNoOverflow($totalInstallments),
                'Yearly' => $endDate->addYears($totalInstallments),
                default => $endDate->addMonthsNoOverflow($totalInstallments)
            };

            if ((int) $endDate->format('Y') > 9999) {
                throw new \InvalidArgumentException('Loan end date exceeds supported range. Please correct the loan term.');
            }

            $loan->end_date = $endDate;

            $loan->balance_remaining = (float) $loan->principal_amount;
            $loan->save();

            $schedules = $this->generateAmortization($loan);
            $loan->balance_remaining = $schedules->sum('installment_amount');
            $loan->save();
        });

        return $loan->fresh();
    }

    public function rejectLoan(Loan $loan): Loan
    {
        $updatedLoan = DB::transaction(function () use ($loan) {
            $loan->status = 'Rejected';
            $loan->save();

            return $loan->fresh();
        });

        LoanRejected::dispatch($updatedLoan);

        return $updatedLoan;
    }

    public function editLoan(Loan $loan, array $data): Loan
    {
        $loan->editLoan($data);

        return $loan->fresh();
    }

    public function closeLoan(Loan $loan): Loan
    {
        if ($loan->balance_remaining <= 0) {
            $loan->status = 'Fully_Paid';
            $loan->save();
        }

        return $loan->fresh();
    }

    public function markBadDebt(Loan $loan): Loan
    {
        if ($loan->status !== 'Active') {
            return $loan;
        }

        $cutoff = Carbon::now()->subDays(90);
        $overdueExists = $loan->amortizationSchedules()->where('status', ScheduleStatus::Overdue->value)->where('due_date', '<=', $cutoff)->exists();

        if ($overdueExists) {
            $loan->status = 'Bad_Debt';
            $loan->save();
        }

        return $loan->fresh();
    }

    public function generateAmortization(Loan $loan, ?float $baseAmount = null)
    {
        $calculator = $this->selectCalculator($loan);

        return DB::transaction(function () use ($loan, $calculator, $baseAmount) {
            // Delete old schedules if exist
            $loan->amortizationSchedules()->delete();

            // Generate new schedules
            $schedules = $calculator->generate($loan);

            foreach ($schedules as $item) {
                $loan->amortizationSchedules()->create([
                    'installment_no' => $item['installment_no'],
                    'installment_amount' => $item['installment_amount'],
                    'interest_amount' => $item['interest_amount'],
                    'amount_paid' => 0,
                    'penalty_amount' => 0,
                    'status' => ScheduleStatus::Unpaid->value,
                    'due_date' => $item['due_date'],
                    'holiday_id' => $item['holiday_id'] ?? null,
                ]);
            }

            return $loan->amortizationSchedules()->orderBy('installment_no')->get();
        });
    }

    public function calculatePenalties(Loan $loan): void
    {
        $this->markOverdueSchedules($loan);

        $this->penaltyCalculator->calculate($loan);
    }

    public function markOverdueSchedules(?Loan $loan = null, ?CarbonInterface $asOf = null): int
    {
        $asOf ??= Carbon::now();

        return DB::transaction(function () use ($loan, $asOf) {
            $query = AmortizationSchedule::query()
                ->where('status', ScheduleStatus::Unpaid->value)
                ->whereNotNull('due_date')
                ->whereDate('due_date', '<', $asOf->toDateString())
                ->whereHas('loan', function ($query) use ($loan) {
                    $query->where('status', 'Active');

                    if ($loan) {
                        $query->whereKey($loan->getKey());
                    }
                });

            return $query->update(['status' => ScheduleStatus::Overdue->value]);
        });
    }

    public function getThreeMonthLateLoans()
    {
        $this->markOverdueSchedules();

        $cutoff = Carbon::now()->subDays(90);

        return Loan::with(['borrower', 'collateral.landDetails', 'collateral.vehicleDetails', 'collateral.atmDetails', 'amortizationSchedules'])
            ->where(function ($query) use ($cutoff) {
                $query->where('status', 'Active')
                    ->whereHas('amortizationSchedules', function ($q) use ($cutoff) {
                        $q->where('status', ScheduleStatus::Overdue->value)
                            ->where('due_date', '<=', $cutoff);
                    });
            })
            ->orWhere('status', 'Bad_Debt')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn (Loan $loan) => $this->appendLateRuleMetadata($loan, '3MLL'));
    }

    public function getOneMonthLateLoans()
    {
        $this->markOverdueSchedules();

        $cutoff = Carbon::now()->subDays(30);

        return Loan::with(['borrower', 'collateral.landDetails', 'collateral.vehicleDetails', 'collateral.atmDetails', 'amortizationSchedules'])
            ->where('status', 'Active')
            ->whereHas('amortizationSchedules', function ($query) use ($cutoff) {
                $query->where('status', ScheduleStatus::Overdue->value)
                    ->where('due_date', '<=', $cutoff)
                    ->where('due_date', '>', Carbon::now()->subDays(90));
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn (Loan $loan) => $this->appendLateRuleMetadata($loan, '1MLL'));
    }

    public function getPastMaturityDateLoans()
    {
        $today = Carbon::now();

        return Loan::with(['borrower', 'collateral.landDetails', 'collateral.vehicleDetails', 'collateral.atmDetails', 'amortizationSchedules'])
            ->where('status', 'Active')
            ->whereNotNull('end_date')
            ->where('end_date', '<', $today)
            ->where('balance_remaining', '>', 0)
            ->orderBy('end_date', 'asc')
            ->get()
            ->map(fn (Loan $loan) => $this->appendLateRuleMetadata($loan, 'PMD'));
    }

    public function getApprovedLoans()
    {
        return Loan::with(['borrower', 'borrower.coBorrowers', 'borrower.spouse', 'collateral.landDetails', 'collateral.vehicleDetails', 'collateral.atmDetails', 'amortizationSchedules'])
            ->where('status', 'Active')
            ->orderBy('created_at', 'desc')
            ->get();
    }
    public function notifyUpcomingDue(): void
    {
        $threeDaysFromNow = Carbon::now()->addDays(3)->startOfDay();
        
        AmortizationSchedule::with('loan.borrower')
            ->where('status', ScheduleStatus::Unpaid->value)
            ->whereNotNull('due_date')
            ->whereDate('due_date', $threeDaysFromNow)
            ->get()
            ->each(function ($schedule) {
                $borrower = $schedule->loan->borrower;
                $borrower->notify(new NotifyUser(
                    subject: 'Upcoming Loan Payment Due',
                    message: "Hi {$borrower->name}!, Your loan payment of ₱{$schedule->installment_amount} is due on {$schedule->due_date->format('M d, Y')}.",
                    email: $borrower->email
                ));
            });

    }

    private function appendLateRuleMetadata(Loan $loan, string $bucket): Loan
    {
        $overdueSchedule = $loan->amortizationSchedules
            ->filter(fn ($schedule) => $schedule->status === ScheduleStatus::Overdue)
            ->sortBy('due_date')
            ->first();

        $loan->setAttribute('past_due_date', match ($bucket) {
            'PMD' => optional($loan->end_date)?->toDateString(),
            default => optional($overdueSchedule?->due_date)?->toDateString(),
        });

        $loan->setAttribute('past_due_rule', match ($bucket) {
            'PMD' => 'End date is earlier than today and the loan still has remaining balance.',
            '1MLL' => 'Has an overdue amortization schedule that is at least 30 days late but less than 90 days late.',
            '3MLL' => 'Has an overdue amortization schedule that is at least 90 days late, or the loan is already marked as Bad Debt.',
            default => null,
        });

        return $loan;
    }

}
