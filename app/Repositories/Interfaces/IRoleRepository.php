<?php
namespace App\Repositories\Interfaces;

use App\Models\Role;

interface IRoleRepository
{
    public function save(Role $role): Role;
    public function findById(int $id): ?Role;
    public function findByName(string $name): ?Role;
    public function all(): array;
}
