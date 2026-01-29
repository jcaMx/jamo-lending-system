<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Illuminate\Support\Facades\Hash;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $this->passwordRules(),
        ])->validate();

        $parts = preg_split('/\s+/', trim($input['name']));
        
        if (count($parts) > 1) {
            $firstName = $parts[0];
            $surname   = end($parts); // last word as surname
        } else {
            // fallback if only one name is given
            $firstName = $parts[0];
            $surname   = $parts[0];
            }

        $username = strtolower(substr($firstName, 0, 1) . '.' . $surname);

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'username' => $username,
            'password' => Hash::make($input['password']),
        ]);
    
        // ✅ Assign CUSTOMER role
        $user->assignRole('customer');
    
        return $user;
    }
}
