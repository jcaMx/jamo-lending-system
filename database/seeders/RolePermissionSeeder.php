<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

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

            // borrower
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

            // Customer permissions
            'loan.view.own',
            'repayment.view.own',
            'profile.view',
            'profile.update',
        ];

        // -----------------------------------------
        // Create permissions if missing (with guard_name)
        // -----------------------------------------
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(
                [
                    'name' => $permission,
                    'guard_name' => 'web',
                ]
            );
        }

        // -----------------------------------------
        // Create roles (with guard_name)
        // -----------------------------------------
        $admin = Role::firstOrCreate(
            [
                'name' => 'admin',
                'guard_name' => 'web',
            ]
        );
        $cashier = Role::firstOrCreate(
            [
                'name' => 'cashier',
                'guard_name' => 'web',
            ]
        );

        $customer = Role::firstOrCreate([
            'name' => 'customer',
            'guard_name' => 'web',
        ]);
        


        // -----------------------------------------
        // Assign permissions
        // -----------------------------------------

        // Admin gets all permissions (permission_id 1-18)
        $admin->syncPermissions(Permission::all());

        // Cashier permissions (matching SQL data):
        // permission_id 2 (loan.view), 6 (borrower.view), 10 (user.view),
        // 13 (repayment.create), 14 (repayment.view), 18 (collection.daily)
        $cashier->syncPermissions([
            'loan.view',
            'borrower.view',
            'user.view',
            'repayment.create',
            'repayment.view',
            'collection.daily',
        ]);

        $customer->syncPermissions([
            'loan.view.own',
            'repayment.view.own',
            'profile.view',
            'profile.update',
        ]);
    }
}
