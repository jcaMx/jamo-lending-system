<?php
namespace App\Repositories\Eloquent;

use App\Repositories\Interfaces\IUserRepository;
use App\Models\User;

class UserRepository implements IUserRepository
{
    public function save(User $user): User
    {
        $user->save();
        return $user;
    }

    public function findById(int $id): ?User
    {
        return User::with([
            'profile',
            'roles.permissions', // each role's permissions
            'permissions',       // direct user permissions (if any)
        ])->find($id);
    }

    public function findAll(array $filters = []): array
    {
        $query = User::query()
            ->with(['profile', 'roles']) // Add 'roles' to eager load
            ->withTrashed(); // Include soft deleted users

        // Filter by role using Spatie's whereHas('roles')
        if (!empty($filters['role'])) {
            $query->whereHas('roles', fn($q) => $q->where('name', $filters['role']));
        }

        $result = $query->paginate($filters['per_page'] ?? 15)->toArray();
        
        // Ensure roles are included in the response
        if (isset($result['data'])) {
            foreach ($result['data'] as &$user) {
                if (isset($user['roles'])) {
                    $user['roles'] = collect($user['roles'])->pluck('name')->toArray();
                }
            }
        }
        
        return $result;
    }

    public function update(User $user, array $data): User
    {
        $user->fill($data);
        $user->save();
        return $user;
    }

    public function delete(User $user): bool
    {
        return (bool) $user->delete();
    }
}
