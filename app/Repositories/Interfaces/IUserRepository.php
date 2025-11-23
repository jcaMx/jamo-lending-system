<?php
namespace App\Repositories\Interfaces;

use App\Models\User;

interface IUserRepository
{
    public function save(User $user): User;
    public function findById(int $id): ?User;
    public function findAll(array $filters = []): array;
    public function update(User $user, array $data): User;
    public function delete(User $user): bool;
}
