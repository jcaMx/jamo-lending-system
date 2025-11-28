<?php

namespace App\Services;

use App\Repositories\Interfaces\IUserRepository;
use App\Repositories\Interfaces\IRoleRepository;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use App\Notifications\NotifyUser;


class UserService
{
    public function __construct(
        protected IUserRepository $users,
        protected IRoleRepository $roles
    ) {}

    /**
     * Get all users with optional filters.
     */
    public function getAll(array $filters = [])
    {
        return $this->users->findAll($filters);
    }

    /**
     * Get a single user by ID.
     */
    public function getById(int $id): ?User
    {
        return $this->users->findById($id);
    }

    /**
     * Create a new user and assign role.
     */
    public function createUser(array $data)
    {
        $username = $this->generateUsername($data['fName'], $data['lName']);
        $generatedPassword = $this->generatePassword();

        $user = null;

        DB::transaction(function () use ($data, $username, $generatedPassword, &$user) {
            $user = User::create([
                'name'     => "{$data['fName']} {$data['lName']}",
                'fName'    => $data['fName'],
                'lName'    => $data['lName'],
                'email'    => $data['email'],
                'username' => $username,
                'password' => Hash::make($generatedPassword),
                'status'   => 'Active',
            ]);

            if (!empty($data['role'])) {
                $user->assignRole($data['role']);
            }

            if (!empty($data['phone'])) {
                $user->profile()->create([
                    'phone'      => $data['phone'],
                    'email'      => $data['email'],
                    'avatar_url' => $data['userPhoto'] ?? null,
                ]);
            }

            $message = "Welcome {$data['fName']}! Your account has been created.\n\n".
                   "Email: $email \nPassword: $generatedPassword";

            $user->notify(new NotifyUser(
            message: $message,
            email: $user->email,
            sms: $user->profile->phone ?? null
            ));

        }); 

        return [
            'user' => $user,
            'password' => $generatedPassword,
        ];
    } 

    
    
    

    /**
     * Generate a unique username.
     */
    private function generateUsername(string $fname, string $lname): string
    {
        $base = strtolower(substr($fname, 0, 1) . '.' . $lname);
        $base = str_replace(' ', '', $base);
        
        // Check if base username exists
        $count = User::where('username', 'LIKE', "$base%")->count();
        
        if ($count === 0) {
            $username = $base;
        } else {
            // Find the highest number suffix
            $existingUsernames = User::where('username', 'LIKE', "$base%")
                ->pluck('username')
                ->map(function ($un) use ($base) {
                    $suffix = str_replace($base, '', $un);
                    return is_numeric($suffix) ? (int)$suffix : 0;
                })
                ->max();
            
            $username = $base . ($existingUsernames + 1);
        }
        
        // Double-check uniqueness (in case of race condition)
        while (User::where('username', $username)->exists()) {
            $username = $base . (++$count);
        }
        
        return $username;
    }

    /**
     * Generate a random password string.
     */
    private function generatePassword(int $length = 8): string
    {
        return Str::random($length);
    }

    /**
     * Update an existing user and sync roles/profile if provided.
     */
    public function updateUser(int $id, array $data): ?User
    {
        $user = $this->users->findById($id);
        if (!$user) return null;

        // Handle password update
        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $updated = $this->users->update($user, $data);

        // Sync role if provided
        if (!empty($data['role'])) {
            $user->syncRoles([$data['role']]); // replaces existing roles
        }

        // Update or create profile
        if (isset($data['profile'])) {
            $profile = $user->profile ?? new UserProfile();
            $profile->fill($data['profile']);
            $user->profile()->save($profile);
        }

        return $updated;
    }

    /**
     * Delete a user by ID.
     */
    public function deleteUser(int $id): bool
    {
        $user = $this->users->findById($id);
        return $user ? $this->users->delete($user) : false;
    }
}
