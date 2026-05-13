<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     * 
     * This migration identifies users with non-Bcrypt passwords (likely imported as plain-text)
     * and hashes them correctly to resolve the BcryptHasher RuntimeException.
     */
    public function up(): void
    {
        // Get users whose passwords do not start with the Bcrypt prefix '$2y$'
        $users = User::where('password', 'not like', '$2y$%')->get();

        foreach ($users as $user) {
            // We assume the existing value is plain-text.
            // Hashing it allows the user to continue using their original password.
            $user->password = Hash::make($user->password);
            $user->save();
        }
    }

    /**
     * Reverse the migrations.
     * 
     * Note: Reversing this is not possible as we cannot "un-hash" passwords.
     */
    public function down(): void
    {
        // No action needed
    }
};
