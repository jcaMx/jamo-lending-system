<?php

namespace Database\Seeders;

use App\Models\AmortizationSchedule;
use App\Models\Loan;
use App\Models\Payment;
use App\Models\Penalty;
use App\Models\User;
use Illuminate\Database\Seeder;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $cashier = User::where('email', 'maria.santos@jamo.com')->first();
        $verifier = User::where('email', 'admin@jamo.com')->first();

        if (! $cashier || ! $verifier) {
            $this->command->warn('Cashier or Verifier not found. Please run UserSeeder first.');

            return;
        }

        // Get active loans
        $loans = Loan::where('status', 'Active')->get();

        foreach ($loans as $loan) {
            $schedules = AmortizationSchedule::where('loan_id', $loan->ID)
                ->where('status', '!=', 'Paid')
                ->orderBy('installment_no')
                ->take(3)
                ->get();

            foreach ($schedules as $schedule) {
                // Create payment for some schedules
                if (rand(0, 1)) {
                    $paymentAmount = $schedule->installment_amount;
                    $paymentDate = $schedule->due_date->copy()->addDays(rand(-5, 5));

                    $payment = Payment::create([
                        'payment_date' => $paymentDate,
                        'amount' => $paymentAmount,
                        'payment_method' => $this->getRandomPaymentMethod(),
                        'reference_no' => 'PAY-'.strtoupper(uniqid()),
                        'remarks' => 'Payment for installment #'.$schedule->installment_no,
                        'verified_by' => $verifier->id,
                        'verified_date' => $paymentDate->copy()->addHours(2),
                        'schedule_id' => $schedule->ID,
                        'loan_id' => $loan->ID,
                    ]);

                    // Update schedule
                    $schedule->update([
                        'status' => 'Paid',
                        'amount_paid' => $paymentAmount,
                    ]);

                    // Update loan balance
                    $loan->decrement('balance_remaining', $paymentAmount);

                    if ($loan->balance_remaining <= 0) {
                        $loan->update(['status' => 'Fully_Paid']);
                    }
                } else {
                    // Create penalty for overdue schedules
                    if ($schedule->due_date < now() && $schedule->status === 'Overdue') {
                        Penalty::create([
                            'type' => 'Late_Payment',
                            'amount' => $schedule->penalty_amount ?: ($schedule->installment_amount * 0.06),
                            'date_applied' => $schedule->due_date->copy()->addDays(7),
                            'schedule_id' => $schedule->ID,
                            'status' => 'Pending',
                        ]);
                    }
                }
            }
        }

        // Create some additional payments for fully paid loan
        $fullyPaidLoan = Loan::where('status', 'Fully_Paid')->first();
        if ($fullyPaidLoan) {
            $paidSchedules = AmortizationSchedule::where('loan_id', $fullyPaidLoan->ID)
                ->where('status', 'Paid')
                ->get();

            foreach ($paidSchedules as $schedule) {
                Payment::firstOrCreate(
                    ['schedule_id' => $schedule->ID],
                    [
                        'payment_date' => $schedule->due_date->copy()->addDays(rand(-3, 3)),
                        'amount' => $schedule->amount_paid,
                        'payment_method' => $this->getRandomPaymentMethod(),
                        'reference_no' => 'PAY-'.strtoupper(uniqid()),
                        'remarks' => 'Payment for installment #'.$schedule->installment_no,
                        'verified_by' => $verifier->id,
                        'verified_date' => $schedule->due_date->copy()->addDays(rand(0, 2)),
                        'loan_id' => $fullyPaidLoan->ID,
                    ]
                );
            }
        }
    }

    private function getRandomPaymentMethod(): string
    {
        $methods = ['Cash', 'Cheque', 'GCash', 'Cebuana', 'Metrobank'];
        return $methods[array_rand($methods)];
    }
}
