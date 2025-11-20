<?php
namespace App\Repositories\Eloquent;

use Spatie\Permission\Models\Role;
use App\Repositories\Interfaces\IRoleRepository;

class RoleRepository implements IRoleRepository
{
    public function save(Role $role): Role
    {
        $role->save();
        return $role;
    }

    public function findById(int $id): ?Role
    {
        return Role::with('permissions')->find($id);
    }

    public function findByName(string $name): ?Role
    {
        return Role::where('name', $name)->first();
    }

    public function all(): array
    {
        return Role::with('permissions')->get()->toArray();
    }
}
