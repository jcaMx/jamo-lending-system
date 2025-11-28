<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // 1. Create roles and permissions first (required for users)
            RolePermissionSeeder::class,

            // 2. Create formulas (required for loans)
            FormulaSeeder::class,

            // 3. Create holidays (optional, but good to have)
            HolidaySeeder::class,

            // 4. Create users with roles and profiles (required for loan approvals)
            UserSeeder::class,

            // 5. Create borrowers with complete data (addresses, employment, IDs, co-borrowers, spouses)
            BorrowerSeeder::class,

            // 6. Create loans with collateral and amortization schedules (depends on borrowers, formulas, users)
            LoanSeeder::class,

            // 7. Create payments and penalties (depends on loans and schedules)
            PaymentSeeder::class,

            // 8. Create files for borrowers and collaterals (depends on borrowers and loans)
            FileSeeder::class,
        ]);
    }
}
