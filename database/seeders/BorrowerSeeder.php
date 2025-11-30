<?php

namespace Database\Seeders;

use App\Models\Borrower;
use App\Models\BorrowerAddress;
use App\Models\BorrowerEmployment;
use App\Models\BorrowerId;
use App\Models\CoBorrower;
use App\Models\Spouse;
use Illuminate\Database\Seeder;

class BorrowerSeeder extends Seeder
{
    public function run(): void
    {
        $borrowers = [
            [
                'borrower' => [
                    'first_name' => 'Juan',
                    'last_name' => 'Dela Cruz',
                    'age' => 35,
                    'gender' => 'Male',
                    'email' => 'juan.delacruz@email.com',
                    'contact_no' => '09171234567',
                    'land_line' => '02-1234-5678',
                    'marital_status' => 'Married',
                    'numof_dependentchild' => 2,
                    'home_ownership' => 'Owned',
                    'membership_date' => now()->subMonths(12),
                    'status' => 'Active',
                    'birth_date' => '1989-05-15',
                ],
                'address' => [
                    'address' => '123 Main Street, Barangay San Jose',
                    'city' => 'Manila',
                ],
                'employment' => [
                    'employment_status' => 'Employed',
                    'income_source' => 'Salary',
                    'occupation' => 'Engineer',
                    'position' => 'Senior Engineer',
                    'agency_address' => 'Makati City, Metro Manila',
                    'monthly_income' => 50000.00,
                ],
                'id' => [
                    'id_type' => 'SSS',
                    'id_number' => '12-3456789-0',
                ],
                'spouse' => [
                    'first_name' => 'Maria',
                    'last_name' => 'Dela Cruz',
                    'contact_no' => '09171234568',
                    'occupation' => 'Teacher',
                    'position' => 'Teacher',
                    'agency_address' => 'Quezon City, Metro Manila',
                ],
            ],
            [
                'borrower' => [
                    'first_name' => 'Pedro',
                    'last_name' => 'Santos',
                    'age' => 42,
                    'gender' => 'Male',
                    'email' => 'pedro.santos@email.com',
                    'contact_no' => '09172345678',
                    'land_line' => '02-2345-6789',
                    'marital_status' => 'Married',
                    'numof_dependentchild' => 3,
                    'home_ownership' => 'Mortgage',
                    'membership_date' => now()->subMonths(8),
                    'status' => 'Active',
                    'birth_date' => '1982-08-20',
                ],
                'address' => [
                    'address' => '456 Oak Avenue, Barangay San Antonio',
                    'city' => 'Quezon City',
                ],
                'employment' => [
                    'employment_status' => 'Employed',
                    'income_source' => 'Salary',
                    'occupation' => 'Manager',
                    'position' => 'Manager',
                    'agency_address' => 'Ortigas Center, Pasig City',
                    'monthly_income' => 75000.00,
                ],
                'id' => [
                    'id_type' => 'TIN',
                    'id_number' => '123-456-789-000',
                ],
                'co_borrower' => [
                    'first_name' => 'Carlos',
                    'last_name' => 'Santos',
                    'age' => 38,
                    'birth_date' => '1986-03-10',
                    'address' => '789 Pine Street, Barangay San Miguel',
                    'email' => 'carlos.santos@email.com',
                    'contact_no' => '09173456789',
                    'occupation' => 'Business Owner',
                    'position' => 'Owner',
                    'agency_address' => 'Mandaluyong City',
                    'marital_status' => 'Single',
                    'home_ownership' => 'Owned',
                ],
            ],
            [
                'borrower' => [
                    'first_name' => 'Ana',
                    'last_name' => 'Garcia',
                    'age' => 28,
                    'gender' => 'Female',
                    'email' => 'ana.garcia@email.com',
                    'contact_no' => '09174567890',
                    'land_line' => null,
                    'marital_status' => 'Single',
                    'numof_dependentchild' => 0,
                    'home_ownership' => 'Rented',
                    'membership_date' => now()->subMonths(6),
                    'status' => 'Active',
                    'birth_date' => '1996-11-05',
                ],
                'address' => [
                    'address' => '789 Elm Street, Barangay San Isidro',
                    'city' => 'Makati',
                ],
                'employment' => [
                    'employment_status' => 'Employed',
                    'income_source' => 'Salary',
                    'occupation' => 'Accountant',
                    'position' => 'Accountant',
                    'agency_address' => 'BGC, Taguig City',
                    'monthly_income' => 35000.00,
                ],
                'id' => [
                    'id_type' => 'Driver\'s License',
                    'id_number' => 'D01-23-456789',
                ],
            ],
            [
                'borrower' => [
                    'first_name' => 'Roberto',
                    'last_name' => 'Lopez',
                    'age' => 50,
                    'gender' => 'Male',
                    'email' => 'roberto.lopez@email.com',
                    'contact_no' => '09175678901',
                    'land_line' => '02-3456-7890',
                    'marital_status' => 'Married',
                    'numof_dependentchild' => 4,
                    'home_ownership' => 'Owned',
                    'membership_date' => now()->subMonths(24),
                    'status' => 'Active',
                    'birth_date' => '1974-02-14',
                ],
                'address' => [
                    'address' => '321 Maple Drive, Barangay San Pedro',
                    'city' => 'Pasig',
                ],
                'employment' => [
                    'employment_status' => 'Employed',
                    'income_source' => 'Salary',
                    'occupation' => 'Business Owner',
                    'position' => 'Owner',
                    'agency_address' => 'Marikina City',
                    'monthly_income' => 100000.00,
                ],
                'id' => [
                    'id_type' => 'PhilHealth',
                    'id_number' => '12-345678901-2',
                ],
                'spouse' => [
                    'first_name' => 'Carmen',
                    'last_name' => 'Lopez',
                    'contact_no' => '09175678902',
                    'occupation' => 'Nurse',
                    'position' => 'Nurse',
                    'agency_address' => 'Manila City',
                ],
            ],
            [
                'borrower' => [
                    'first_name' => 'Liza',
                    'last_name' => 'Reyes',
                    'age' => 33,
                    'gender' => 'Female',
                    'email' => 'liza.reyes@email.com',
                    'contact_no' => '09176789012',
                    'land_line' => null,
                    'marital_status' => 'Married',
                    'numof_dependentchild' => 1,
                    'home_ownership' => 'Rented',
                    'membership_date' => now()->subMonths(3),
                    'status' => 'Active',
                    'birth_date' => '1991-07-22',
                ],
                'address' => [
                    'address' => '654 Cedar Lane, Barangay San Juan',
                    'city' => 'Mandaluyong',
                ],
                'employment' => [
                    'employment_status' => 'Employed',
                    'income_source' => 'Salary',
                    'occupation' => 'Nurse',
                    'position' => 'Nurse',
                    'agency_address' => 'Manila City',
                    'monthly_income' => 40000.00,
                ],
                'id' => [
                    'id_type' => 'SSS',
                    'id_number' => '34-5678901-2',
                ],
            ],
        ];

        foreach ($borrowers as $borrowerData) {
            $borrower = Borrower::firstOrCreate(
                ['email' => $borrowerData['borrower']['email']],
                $borrowerData['borrower']
            );

            $borrowerId = $borrower->ID ?? $borrower->id;

            // Create address
            BorrowerAddress::firstOrCreate(
                ['borrower_id' => $borrowerId],
                array_merge($borrowerData['address'], ['borrower_id' => $borrowerId])
            );

            // Create employment
            BorrowerEmployment::firstOrCreate(
                ['borrower_id' => $borrowerId],
                array_merge($borrowerData['employment'], ['borrower_id' => $borrowerId])
            );

            // Create ID
            BorrowerId::firstOrCreate(
                ['borrower_id' => $borrowerId],
                array_merge($borrowerData['id'], ['borrower_id' => $borrowerId])
            );

            // Create spouse if exists
            if (isset($borrowerData['spouse'])) {
                Spouse::firstOrCreate(
                    ['borrower_id' => $borrowerId],
                    array_merge($borrowerData['spouse'], ['borrower_id' => $borrowerId])
                );
            }

            // Create co-borrower if exists
            if (isset($borrowerData['co_borrower'])) {
                CoBorrower::firstOrCreate(
                    ['borrower_id' => $borrowerId, 'email' => $borrowerData['co_borrower']['email']],
                    array_merge($borrowerData['co_borrower'], ['borrower_id' => $borrowerId])
                );
            }
        }
    }
}
