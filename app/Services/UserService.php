<?php

namespace App\Services;

use App\Repositories\Interfaces\IUserRepository;
use App\Repositories\Interfaces\IRoleRepository;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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
    public function createUser(array $data): User
    {
        // 1. Generate username
        $username = $this->generateUsername($data['fName'], $data['lName']);

        // 2. Generate password
        $rawPassword = $this->generatePassword();

        // 3. Create user
        $user = User::create([
            'name'     => "{$data['fName']} {$data['lName']}",
            'email'    => $data['email'],
            'username' => $username,
            'password' => Hash::make($rawPassword),
        ]);

        // 4. Assign role via Spatie
        if (!empty($data['role'])) {
            $user->assignRole($data['role']); // expects role name string
        }

        // 5. Attach raw password for UI display
        $user->rawPassword = $rawPassword;

        return $user;
    }

    /**
     * Generate a unique username.
     */
    private function generateUsername(string $fname, string $lname): string
    {
        $base = strtolower(substr($fname, 0, 1) . '.' . $lname);
        $base = str_replace(' ', '', $base);

        $count = User::where('username', 'LIKE', "$base%")->count();

        return $count === 0 ? $base : $base . ($count + 1);
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
