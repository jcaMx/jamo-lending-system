<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        $this->call([
            RolePermissionSeeder::class,
        ]);

        \App\Models\User::factory(5)->create()->each(function ($user) {
            $user->profile()->create(['address' => 'Sample address']);
        });

        // create an admin user
        $admin = \App\Models\User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'full_name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
        ]);
        $adminRole = \App\Models\Role::where('name', 'admin')->first();
        if ($adminRole) {
            $admin->assignRole($adminRole);
        }

        // If you want to add an AuditLog record during seeding, you need to avoid making assumptions about the current authenticated user,
        // as there is no authenticated user context when running the seeder.
        // Instead, you can associate the log either with a specific seeded user or leave 'user_id' as null if appropriate.
        // You will also need to define what $saved refers to–for this, use the relevant user, for example $admin.
        //
        // Example:
        // use App\Models\AuditLog;
        // \App\Models\AuditLog::create([
        //     'user_id' => $admin->id, // or set to null if no user context applies
        //     'action' => 'created',
        //     'entity_type' => 'User',
        //     'entity_id' => $admin->id,
        //     'changes' => json_encode($admin->toArray()),
        // ]);
        //
        // (Make sure AuditLog model and its migration exist and the schema matches.)
    }
}
