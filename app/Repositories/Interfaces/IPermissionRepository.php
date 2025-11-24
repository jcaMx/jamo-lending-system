<?php
namespace App\Repositories\Interfaces;

use App\Models\Permission;

interface IPermissionRepository
{
    public function save(Permission $permission): Permission;
}
