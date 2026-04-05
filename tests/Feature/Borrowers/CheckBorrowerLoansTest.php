<?php

use App\Models\Borrower;
use App\Models\Loan;
use App\Models\User;
use Spatie\Permission\Models\Role;

test('check loans flags only active or pending statuses', function () {
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

    $admin = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $admin->assignRole($adminRole);

    $activeBorrower = Borrower::create([
        'first_name' => 'Active',
        'last_name' => 'Borrower',
        'email' => 'active.borrower@example.com',
        'contact_no' => '09123456789',
    ]);

    Loan::create([
        'borrower_id' => $activeBorrower->ID,
        'term_months' => 12,
        'principal_amount' => 10000,
        'interest_rate' => 5,
        'balance_remaining' => 10000,
        'status' => 'Active',
    ]);

    $rejectedBorrower = Borrower::create([
        'first_name' => 'Rejected',
        'last_name' => 'Borrower',
        'email' => 'rejected.borrower@example.com',
        'contact_no' => '09123456788',
    ]);

    Loan::create([
        'borrower_id' => $rejectedBorrower->ID,
        'term_months' => 12,
        'principal_amount' => 10000,
        'interest_rate' => 5,
        'balance_remaining' => 10000,
        'status' => 'Rejected',
    ]);

    $pendingBorrower = Borrower::create([
        'first_name' => 'Pending',
        'last_name' => 'Borrower',
        'email' => 'pending.borrower@example.com',
        'contact_no' => '09123456787',
    ]);

    Loan::create([
        'borrower_id' => $pendingBorrower->ID,
        'term_months' => 6,
        'principal_amount' => 5000,
        'interest_rate' => 5,
        'balance_remaining' => 5000,
        'status' => 'Pending',
    ]);

    $this->actingAs($admin)
        ->get(route('borrowers.check-loans', ['id' => $activeBorrower->ID]))
        ->assertOk()
        ->assertJson([
            'hasActiveLoan' => true,
            'hasActiveOrPendingLoan' => true,
        ]);

    $this->actingAs($admin)
        ->get(route('borrowers.check-loans', ['id' => $rejectedBorrower->ID]))
        ->assertOk()
        ->assertJson([
            'hasActiveLoan' => false,
            'hasActiveOrPendingLoan' => false,
        ]);

    $this->actingAs($admin)
        ->get(route('borrowers.check-loans', ['id' => $pendingBorrower->ID]))
        ->assertOk()
        ->assertJson([
            'hasActiveLoan' => true,
            'hasActiveOrPendingLoan' => true,
        ]);
});
