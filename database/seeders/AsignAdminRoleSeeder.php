<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class AsignAdminRoleSeeder extends Seeder
{
    public function run()
    {
        $user = User::where('email', 'your@email.com')->first();
        if ($user) {
            $user->assignRole('admin');
        }
    }
}

// php artisan db:seed --class=AsignAdminRoleSeeder