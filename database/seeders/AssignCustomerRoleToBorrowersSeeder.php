<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Borrower;
use Spatie\Permission\Models\Role;

class AssignCustomerRoleToBorrowersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         // Ensure customer role exists
        $customerRole = Role::firstOrCreate([
            'name' => 'customer',
            'guard_name' => 'web',
        ]);

        // Get borrowers without linked users
        $borrowers = Borrower::whereNull('user_id')
            ->whereNotNull('email')
            ->get();

        foreach ($borrowers as $borrower) {
            // Skip if user already exists with this email
            $user = User::where('email', $borrower->email)->first();

            if (count($parts) > 1) {
                $firstName = $parts[0];
                $surname   = end($parts); // last word as surname
            } else {
                // fallback if only one name is given
                $firstName = $parts[0];
                $surname   = $parts[0];
            }

            $username = strtolower(substr($firstName, 0, 1) . '.' . $surname);

            if (! $user) {
                $user = User::create([
                    'name' => $borrower->first_name . ' ' . $borrower->last_name,
                    'email' => $borrower->email,
                    'username' => $username,
                    'password' => Hash::make('password123'), // TEMP password
                ]);
            }

            // Assign customer role
            if (! $user->hasRole('customer')) {
                $user->assignRole($customerRole);
            }

            

            // Link borrower to user
            $borrower->update([
                'user_id' => $user->id,
            ]);
        }
    }
}
