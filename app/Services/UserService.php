<?php

namespace App\Services;

use App\Repositories\Interfaces\IUserRepository;
use App\Repositories\Interfaces\IRoleRepository;
use App\Models\User;
use App\Models\Role;
use App\Models\UserProfile;

class UserService
{
    public function __construct(
        protected IUserRepository $users,
        protected IRoleRepository $roles
    ) {}

    public function createUser(array $data): User
    {
        $data['password'] = bcrypt($data['password']);
        $data['full_name'] = $data['full_name'] ?? trim(($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''));
        $user = new User($data);
        $saved = $this->users->save($user);

        if (!empty($data['profile'])) {
            $profile = new UserProfile($data['profile']);
            $saved->profile()->save($profile);
        }

        if (!empty($data['role'])) {
            $role = $this->roles->findByName($data['role']);
            if ($role) $saved->assignRole($role);
        }

        return $saved;
    }

    public function getAll(array $filters = [])
    {
        return $this->users->findAll($filters);
    }

    public function getById(int $id): ?User
    {
        return $this->users->findById($id);
    }

    public function updateUser(int $id, array $data): ?User
    {
        $user = $this->users->findById($id);
        if (!$user) return null;

        if (!empty($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        } else {
            unset($data['password']);
        }

        $updated = $this->users->update($user, $data);

        if (isset($data['profile'])) {
            $profile = $user->profile ?? new UserProfile();
            $profile->fill($data['profile']);
            $user->profile()->save($profile);
        }

        if (!empty($data['role'])) {
            $role = $this->roles->findByName($data['role']);
            if ($role) $user->roles()->sync([$role->id]);
        }

        return $updated;
    }

    public function deleteUser(int $id): bool
    {
        $user = $this->users->findById($id);
        return $user ? $this->users->delete($user) : false;
    }
}
