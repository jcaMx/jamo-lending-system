<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use App\Models\User;


class UsernameSeeder extends Seeder
{
    public function run(): void
    {
        // Fetch users with NULL username
        $users = DB::table('users')->whereNull('username')->get();

        foreach ($users as $user) {
            // Split full name into parts
            $parts = explode(' ', trim($user->name));

            if (count($parts) > 1) {
                $firstName = $parts[0];
                $surname   = end($parts); // last word as surname
            } else {
                // fallback if only one name is given
                $firstName = $parts[0];
                $surname   = $parts[0];
            }

            // Build username: first initial + '.' + lowercase surname
            $username = strtolower(substr($firstName, 0, 1) . '.' . $surname);

            // Update user record
            DB::table('users')
                ->where('id', $user->id)
                ->update(['username' => $username]);
        }
    }
}

