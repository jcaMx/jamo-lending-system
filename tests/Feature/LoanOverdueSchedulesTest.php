<?php

namespace Tests\Feature;

use App\Models\AmortizationSchedule;
use App\Models\Borrower;
use App\Models\Formula;
use App\Models\Loan;
use App\Models\ScheduleStatus;
use App\Services\LoanService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoanOverdueSchedulesTest extends TestCase
{
    use RefreshDatabase;

    public function test_unpaid_schedules_past_due_are_marked_overdue_before_one_month_late_loans_are_listed(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-05-12 10:00:00'));

        $borrower = Borrower::create([
            'first_name' => 'Test',
            'last_name' => 'Borrower',
            'email' => 'borrower@example.com',
            'contact_no' => '09171234567',
            'status' => 'Active',
        ]);

        $formula = Formula::create([
            'name' => 'Compound Interest Loan',
        ]);

        $loan = Loan::create([
            'term_months' => 12,
            'repayment_frequency' => 'Monthly',
            'principal_amount' => 10000,
            'interest_rate' => 5,
            'interest_type' => 'Compound',
            'status' => 'Active',
            'balance_remaining' => 10000,
            'borrower_id' => $borrower->ID,
            'formula_id' => $formula->ID,
        ]);

        $schedule = AmortizationSchedule::create([
            'loan_id' => $loan->ID,
            'installment_no' => 1,
            'installment_amount' => 1000,
            'interest_amount' => 100,
            'penalty_amount' => 0,
            'amount_paid' => 0,
            'due_date' => Carbon::now()->subDays(31),
            'status' => ScheduleStatus::Unpaid->value,
        ]);

        $loans = app(LoanService::class)->getOneMonthLateLoans();

        $this->assertSame(ScheduleStatus::Overdue, $schedule->fresh()->status);
        $this->assertContains($loan->ID, $loans->pluck('ID')->all());
    }

    public function test_unpaid_schedules_for_non_active_loans_are_not_marked_overdue(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-05-12 10:00:00'));

        $borrower = Borrower::create([
            'first_name' => 'Pending',
            'last_name' => 'Borrower',
            'email' => 'pending@example.com',
            'contact_no' => '09170000000',
            'status' => 'Pending',
        ]);

        $loan = Loan::create([
            'term_months' => 12,
            'repayment_frequency' => 'Monthly',
            'principal_amount' => 10000,
            'interest_rate' => 5,
            'interest_type' => 'Compound',
            'status' => 'Pending',
            'balance_remaining' => 10000,
            'borrower_id' => $borrower->ID,
        ]);

        $schedule = AmortizationSchedule::create([
            'loan_id' => $loan->ID,
            'installment_no' => 1,
            'installment_amount' => 1000,
            'interest_amount' => 100,
            'penalty_amount' => 0,
            'amount_paid' => 0,
            'due_date' => Carbon::now()->subDays(31),
            'status' => ScheduleStatus::Unpaid->value,
        ]);

        app(LoanService::class)->markOverdueSchedules();

        $this->assertSame(ScheduleStatus::Unpaid, $schedule->fresh()->status);
    }
}
