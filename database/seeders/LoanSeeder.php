<?php

namespace Database\Seeders;

use App\Models\AmortizationSchedule;
use App\Models\AtmCollateralDetails;
use App\Models\Borrower;
use App\Models\Collateral;
use App\Models\Formula;
use App\Models\LandCollateralDetails;
use App\Models\Loan;
use App\Models\User;
use App\Models\VehicleCollateralDetails;
use Illuminate\Database\Seeder;

class LoanSeeder extends Seeder
{
    public function run(): void
    {
        $formula = Formula::where('name', 'Compound Interest')->first();
        $approver = User::where('email', 'admin@jamo.com')->first();

        $borrowers = Borrower::all();

        if ($borrowers->isEmpty() || !$formula || !$approver) {
            $this->command->warn('Borrowers, Formula, or Approver not found. Please run BorrowerSeeder, FormulaSeeder, and UserSeeder first.');
            return;
        }

        $loans = [
            [
                'borrower_email' => 'juan.delacruz@email.com',
                'loan' => [
                    'start_date' => now()->subMonths(6),
                    'end_date' => now()->addMonths(6),
                    'term_months' => 12,
                    'repayment_frequency' => 'Monthly',
                    'principal_amount' => 100000.00,
                    'interest_rate' => 5.0,
                    'interest_type' => 'Compound',
                    'loan_type' => 'Personal Loan',
                    'status' => 'Active',
                    'balance_remaining' => 65000.00,
                    'approved_by' => $approver->id,
                    'formula_id' => $formula->ID,
                ],
                'collateral' => [
                    'type' => 'Land',
                    'estimated_value' => 500000.00,
                    'appraisal_date' => now()->subMonths(6),
                    'appraised_by' => $approver->id,
                    'status' => 'Pledged',
                    'description' => 'Residential lot in Manila',
                    'remarks' => 'Valid title, no encumbrances',
                ],
                'collateral_details' => [
                    'type' => 'land',
                    'data' => [
                        'titleNo' => 123456789,
                        'lotNo' => 456,
                        'location' => 'Manila, Metro Manila',
                        'areaSize' => '200 sqm',
                    ],
                ],
            ],
            [
                'borrower_email' => 'pedro.santos@email.com',
                'loan' => [
                    'start_date' => now()->subMonths(4),
                    'end_date' => now()->addMonths(8),
                    'term_months' => 12,
                    'repayment_frequency' => 'Monthly',
                    'principal_amount' => 200000.00,
                    'interest_rate' => 6.0,
                    'interest_type' => 'Diminishing',
                    'loan_type' => 'Business Loan',
                    'status' => 'Active',
                    'balance_remaining' => 140000.00,
                    'approved_by' => $approver->id,
                    'formula_id' => $formula->ID,
                ],
                'collateral' => [
                    'type' => 'Vehicle',
                    'estimated_value' => 800000.00,
                    'appraisal_date' => now()->subMonths(4),
                    'appraised_by' => $approver->id,
                    'status' => 'Pledged',
                    'description' => 'Toyota Vios 2020',
                    'remarks' => 'Good condition, low mileage',
                ],
                'collateral_details' => [
                    'type' => 'vehicle',
                    'data' => [
                        'type' => 'Car',
                        'brand' => 'Toyota',
                        'model' => 'Vios',
                        'year_model' => 2020,
                        'plate_no' => 'ABC-1234',
                        'engine_no' => 'ENG123456789',
                        'transmission_type' => 'Automatic',
                        'fuel_type' => 'Gasoline',
                    ],
                ],
            ],
            [
                'borrower_email' => 'ana.garcia@email.com',
                'loan' => [
                    'start_date' => now()->subMonths(2),
                    'end_date' => now()->addMonths(10),
                    'term_months' => 12,
                    'repayment_frequency' => 'Monthly',
                    'principal_amount' => 50000.00,
                    'interest_rate' => 4.5,
                    'interest_type' => 'Simple',
                    'loan_type' => 'Personal Loan',
                    'status' => 'Active',
                    'balance_remaining' => 45000.00,
                    'approved_by' => $approver->id,
                    'formula_id' => $formula->ID,
                ],
                'collateral' => [
                    'type' => 'ATM',
                    'estimated_value' => 100000.00,
                    'appraisal_date' => now()->subMonths(2),
                    'appraised_by' => $approver->id,
                    'status' => 'Pledged',
                    'description' => 'ATM card as collateral',
                    'remarks' => 'Active account with good standing',
                ],
                'collateral_details' => [
                    'type' => 'atm',
                    'data' => [
                        'bank_name' => 'BDO',
                        'account_no' => '1234567890',
                        'cardno_4digits' => 1234,
                    ],
                ],
            ],
            [
                'borrower_email' => 'roberto.lopez@email.com',
                'loan' => [
                    'start_date' => now()->subMonths(10),
                    'end_date' => now()->subMonths(2),
                    'term_months' => 12,
                    'repayment_frequency' => 'Monthly',
                    'principal_amount' => 300000.00,
                    'interest_rate' => 5.5,
                    'interest_type' => 'Compound',
                    'loan_type' => 'Business Loan',
                    'status' => 'Fully_Paid',
                    'balance_remaining' => 0.00,
                    'approved_by' => $approver->id,
                    'formula_id' => $formula->ID,
                ],
                'collateral' => [
                    'type' => 'Land',
                    'estimated_value' => 1500000.00,
                    'appraisal_date' => now()->subMonths(10),
                    'appraised_by' => $approver->id,
                    'status' => 'Released',
                    'description' => 'Commercial lot in Pasig',
                    'remarks' => 'Loan fully paid, collateral released',
                ],
                'collateral_details' => [
                    'type' => 'land',
                    'data' => [
                        'titleNo' => 987654321,
                        'lotNo' => 789,
                        'location' => 'Pasig, Metro Manila',
                        'areaSize' => '500 sqm',
                    ],
                ],
            ],
            [
                'borrower_email' => 'liza.reyes@email.com',
                'loan' => [
                    'start_date' => now()->subMonths(1),
                    'end_date' => now()->addMonths(11),
                    'term_months' => 12,
                    'repayment_frequency' => 'Monthly',
                    'principal_amount' => 75000.00,
                    'interest_rate' => 5.0,
                    'interest_type' => 'Simple',
                    'loan_type' => 'Personal Loan',
                    'status' => 'Pending',
                    'balance_remaining' => 75000.00,
                    'approved_by' => null,
                    'formula_id' => $formula->ID,
                ],
                'collateral' => [
                    'type' => 'Vehicle',
                    'estimated_value' => 300000.00,
                    'appraisal_date' => now()->subMonths(1),
                    'appraised_by' => $approver->id,
                    'status' => 'Pending',
                    'description' => 'Honda Civic 2018',
                    'remarks' => 'Pending approval',
                ],
                'collateral_details' => [
                    'type' => 'vehicle',
                    'data' => [
                        'type' => 'Car',
                        'brand' => 'Honda',
                        'model' => 'Civic',
                        'year_model' => 2018,
                        'plate_no' => 'XYZ-5678',
                        'engine_no' => 'ENG987654321',
                        'transmission_type' => 'Manual',
                        'fuel_type' => 'Gasoline',
                    ],
                ],
            ],
        ];

        foreach ($loans as $loanData) {
            $borrower = Borrower::where('email', $loanData['borrower_email'])->first();

            if (!$borrower) {
                continue;
            }

            $loan = Loan::create(array_merge($loanData['loan'], ['borrower_id' => $borrower->ID]));

            // Create collateral
            $collateral = Collateral::create(array_merge($loanData['collateral'], ['loan_id' => $loan->ID]));

            // Create collateral details based on type
            if ($loanData['collateral_details']['type'] === 'land') {
                LandCollateralDetails::create(array_merge($loanData['collateral_details']['data'], ['collateral_id' => $collateral->ID]));
            } elseif ($loanData['collateral_details']['type'] === 'vehicle') {
                VehicleCollateralDetails::create(array_merge($loanData['collateral_details']['data'], ['collateral_id' => $collateral->ID]));
            } elseif ($loanData['collateral_details']['type'] === 'atm') {
                AtmCollateralDetails::create(array_merge($loanData['collateral_details']['data'], ['collateral_id' => $collateral->ID]));
            }

            // Create amortization schedule
            $this->createAmortizationSchedule($loan);
        }
    }

    private function createAmortizationSchedule(Loan $loan): void
    {
        $termMonths = $loan->term_months;
        $principal = $loan->principal_amount;
        $interestRate = $loan->interest_rate / 100;
        $monthlyRate = $interestRate / 12;

        // Calculate monthly payment using amortization formula
        if ($loan->interest_type === 'Diminishing') {
            $monthlyPayment = ($principal * $monthlyRate * pow(1 + $monthlyRate, $termMonths)) / (pow(1 + $monthlyRate, $termMonths) - 1);
        } else {
            // Simple or Compound - simplified calculation
            $totalInterest = $principal * $interestRate * ($termMonths / 12);
            $monthlyPayment = ($principal + $totalInterest) / $termMonths;
        }

        $startDate = $loan->start_date ?? now();
        $remainingBalance = $loan->balance_remaining ?? $principal;

        for ($i = 1; $i <= $termMonths; $i++) {
            $dueDate = $startDate->copy()->addMonths($i);

            // Calculate interest for this period
            $interestAmount = $remainingBalance * $monthlyRate;

            // Determine status
            $status = 'Unpaid';
            $amountPaid = 0.00;
            $penaltyAmount = 0.00;

            if ($loan->status === 'Fully_Paid' && $dueDate < now()) {
                $status = 'Paid';
                $amountPaid = $monthlyPayment;
                $remainingBalance -= $monthlyPayment;
            } elseif ($dueDate < now()->subDays(7)) {
                $status = 'Overdue';
                $penaltyAmount = $monthlyPayment * 0.06; // 6% penalty
            }

            AmortizationSchedule::create([
                'installment_no' => $i,
                'installment_amount' => round($monthlyPayment, 2),
                'interest_amount' => round($interestAmount, 2),
                'due_date' => $dueDate,
                'penalty_amount' => $penaltyAmount,
                'amount_paid' => $amountPaid,
                'status' => $status,
                'loan_id' => $loan->ID,
            ]);
        }
    }
}
