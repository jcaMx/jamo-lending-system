<?php
namespace App\Repositories\Eloquent;

use App\Models\Permission;
use App\Repositories\Interfaces\IPermissionRepository;

class PermissionRepository implements IPermissionRepository
{
    public function save(Permission $permission): Permission
    {
        $permission->save();
        return $permission;
    }
}
