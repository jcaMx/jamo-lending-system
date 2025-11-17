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
        return User::with(['roles','profile','teams'])->find($id);
    }

    public function findAll(array $filters = []): array
    {
        $query = User::query()->with(['roles','profile']);
        if (!empty($filters['role'])) {
            $query->whereHas('roles', fn($q) => $q->where('name', $filters['role']));
        }
        return $query->paginate($filters['per_page'] ?? 15)->toArray();
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
