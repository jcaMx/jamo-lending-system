<?php

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

test('admin creating a borrower links it to an existing user by email', function () {
    $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);

    $admin = User::factory()->create([
        'email_verified_at' => now(),
    ]);
    $admin->assignRole($adminRole);

    $existingCustomerUser = User::factory()->create([
        'email' => 'borrower@example.com',
        'email_verified_at' => now(),
    ]);

    $this->actingAs($admin)->post(route('borrowers.store'), [
        'borrower_first_name' => 'Jane',
        'borrower_last_name' => 'Doe',
        'date_of_birth' => '2000-01-01',
        'gender' => 'Female',
        'marital_status' => 'Single',
        'contact_no' => '09123456789',
        'email' => $existingCustomerUser->email,
        'valid_id_type' => 'Passport',
        'valid_id_number' => 'P1234567',
    ])->assertRedirect();

    $linkedUserId = DB::table('borrower')->where('email', $existingCustomerUser->email)->value('user_id');

    expect($linkedUserId)->toBe($existingCustomerUser->id);
});
