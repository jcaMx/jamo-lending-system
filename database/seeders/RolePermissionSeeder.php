<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $perms = ['user.create','user.read','user.update','user.delete','role.manage','team.manage'];
        $permIds = [];
        foreach ($perms as $p) {
            $perm = Permission::firstOrCreate(['code' => $p], ['description' => $p]);
            $permIds[] = $perm->id;
        }

        $admin = Role::firstOrCreate(['name' => 'admin'], ['description' => 'Administrator']);
        $admin->permissions()->sync($permIds);

        $manager = Role::firstOrCreate(['name' => 'manager'], ['description' => 'Manager']);
        $manager->permissions()->sync(
            Permission::whereIn('code',['user.read','user.update','team.manage'])->pluck('id')->toArray()
        );

        Role::firstOrCreate(['name' => 'staff'], ['description' => 'Staff']);
    }
}
