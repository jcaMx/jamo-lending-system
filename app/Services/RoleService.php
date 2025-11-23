<?php

namespace App\Services;

use App\Repositories\Interfaces\IRoleRepository;
use App\Repositories\Interfaces\IPermissionRepository;
use App\Models\Role;
use App\Models\Permission;

class RoleService
{
    public function __construct(
        protected IRoleRepository $roles,
        protected IPermissionRepository $permissions
    ) {}

    public function createRole(array $data): Role
    {
        $role = new Role(['name' => $data['name'], 'description' => $data['description'] ?? null]);
        $saved = $this->roles->save($role);

        if (!empty($data['permissions'])) {
            $permIds = [];
            foreach ($data['permissions'] as $code) {
                $perm = Permission::firstOrCreate(['code' => $code], ['description' => $code]);
                $permIds[] = $perm->id;
            }
            $saved->permissions()->sync($permIds);
        }

        return $saved;
    }

    public function getAllRoles(): array
    {
        return $this->roles->all();
    }
}
