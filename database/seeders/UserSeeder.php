<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Get roles
        $adminRole = Role::where('name', 'admin')->first();
        $cashierRole = Role::where('name', 'cashier')->first();

        // Create Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@jamo.com'],
            [
                'name' => 'Admin User',
                'username' => 'admin',
                'email' => 'admin@jamo.com',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );

        if ($adminRole) {
            $admin->assignRole($adminRole);
        }

        UserProfile::firstOrCreate(
            ['user_id' => $admin->id],
            [
                'phone' => '09123456789',
                'email' => 'admin@jamo.com',
                'avatar_url' => null,
                'meta' => json_encode(['department' => 'Administration']),
            ]
        );

        // Create Cashier Users
        $cashiers = [
            [
                'name' => 'Maria Santos',
                'username' => 'maria.santos',
                'email' => 'maria.santos@jamo.com',
                'phone' => '09123456790',
            ],
            [
                'name' => 'Juan Dela Cruz',
                'username' => 'juan.delacruz',
                'email' => 'juan.delacruz@jamo.com',
                'phone' => '09123456791',
            ],
        ];

        foreach ($cashiers as $cashierData) {
            $cashier = User::firstOrCreate(
                ['email' => $cashierData['email']],
                [
                    'name' => $cashierData['name'],
                    'username' => $cashierData['username'],
                    'email' => $cashierData['email'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );

            if ($cashierRole) {
                $cashier->assignRole($cashierRole);
            }

            UserProfile::firstOrCreate(
                ['user_id' => $cashier->id],
                [
                    'phone' => $cashierData['phone'],
                    'email' => $cashierData['email'],
                    'avatar_url' => null,
                    'meta' => json_encode(['department' => 'Cashier']),
                ]
            );
        }

        // Create Loan Officer Users
        $loanOfficers = [
            [
                'name' => 'Roberto Garcia',
                'username' => 'roberto.garcia',
                'email' => 'roberto.garcia@jamo.com',
                'phone' => '09123456792',
            ],
            [
                'name' => 'Ana Martinez',
                'username' => 'ana.martinez',
                'email' => 'ana.martinez@jamo.com',
                'phone' => '09123456793',
            ],
        ];

        foreach ($loanOfficers as $officerData) {
            $officer = User::firstOrCreate(
                ['email' => $officerData['email']],
                [
                    'name' => $officerData['name'],
                    'username' => $officerData['username'],
                    'email' => $officerData['email'],
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );

            if ($adminRole) {
                $officer->assignRole($adminRole);
            }

            UserProfile::firstOrCreate(
                ['user_id' => $officer->id],
                [
                    'phone' => $officerData['phone'],
                    'email' => $officerData['email'],
                    'avatar_url' => null,
                    'meta' => json_encode(['department' => 'Loan Processing']),
                ]
            );
        }
    }
}
