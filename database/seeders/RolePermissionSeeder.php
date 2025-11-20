<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // -----------------------------------------
        // Define permissions by module
        // -----------------------------------------

        $permissions = [
            // Loan
            'loan.create',
            'loan.view',
            'loan.update',
            'loan.delete',

            // Loan
            'borrower.create',
            'borrower.view',
            'borrower.update',
            'borrower.delete',

            // User
            'user.create',
            'user.view',
            'user.update',
            'user.delete',

            // Repayment
            'repayment.create',
            'repayment.view',
            'repayment.update',
            'repayment.delete',

            // Reports
            'reports.view',

            // Daily Collection Sheet
            'collection.daily',
        ];

        // -----------------------------------------
        // Create permissions if missing
        // -----------------------------------------
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // -----------------------------------------
        // Create roles
        // -----------------------------------------
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $cashier = Role::firstOrCreate(['name' => 'cashier']);

        // -----------------------------------------
        // Assign permissions
        // -----------------------------------------

        // Admin gets everything
        $admin->syncPermissions(Permission::all());

        // Cashier: view only + can add repayment
        $cashier->syncPermissions([
            'loan.view',
            'borrower.view',
            'repayment.view',
            'repayment.create',    // cashier can add repayment
            'collection.daily',    // can view daily collection sheet
        ]);
    }
}

