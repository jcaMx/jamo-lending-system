<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\UserService;
use Spatie\Permission\Models\Role;
use App\Models\User;

class UserController extends Controller
{
    public function __construct(private UserService $service) {}

    public function index()
    {
        $users = $this->service->getAll();

        $transformed = isset($users['data'])
            ? collect($users['data'])->map(fn ($u) => $this->transformUser($u))->toArray()
            : collect($users)->map(fn ($u) => $this->transformUser($u))->toArray();

        return Inertia::render('users/index', [
            'users' => $transformed
        ]);
    }

    public function show($id)
    {
        $user = $this->service->getById($id);
        abort_if(!$user, 404);

        return Inertia::render('users/show', [
            'user' => $this->transformUser($user->toArray())
        ]);
    }

    public function add()
    {
        return Inertia::render('users/add', [
            'roles' => Role::whereIn('name', ['admin', 'cashier'])
                ->pluck('name')
                ->toArray(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fName' => 'required|string',
            'lName' => 'required|string',
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'role' => 'required|string',
        ]);

        // Create user through service
        $result = $this->service->createUser($validated);

        if (!$result || !isset($result['user']) || !isset($result['password'])) {
            return back()->with('error', 'User could not be created.');
        }

        return redirect()->route('users.newUserCredentials', $result['user']->id)
    ->with('rawPassword', $result['password']);

    }

    public function edit($id)
    {
        $user = $this->service->getById($id);
        abort_if(!$user, 404);

        return Inertia::render('users/edit', [
            'user'  => $this->transformUser($user->toArray()),
            'roles' => Role::whereIn('name', ['admin', 'cashier'])
                ->pluck('name')
                ->toArray(),
        ]);
    }


    /**
     * Transform user array for frontend
     */
    private function transformUser(array $user): array
    {
        // Use actual DB fields
        $fName = $user['fName'] ?? '';
        $lName = $user['lName'] ?? '';

        // Roles
        $roleNames = collect($user['roles'] ?? [])
            ->map(fn ($r) => is_array($r) ? $r['name'] : $r)
            ->toArray();

        $primaryRole = $roleNames[0] ?? '';

        // Permissions
        $permissionNames = collect($user['permissions'] ?? [])
            ->map(fn ($p) => $p['name'])
            ->merge(
                collect($user['roles'] ?? [])->flatMap(function ($r) {
                    return collect($r['permissions'] ?? [])
                        ->map(fn ($p) => $p['name']);
                })
            )
            ->unique()
            ->values()
            ->toArray();

        // Username fallback
        $username = $user['username']
            ?? strtolower(substr($fName, 0, 1) . '.' . $lName);

        return [
            'id'          => $user['id'],
            'username'    => $username,
            'fName'       => $fName,
            'lName'       => $lName,
            'role'        => $primaryRole,
            'roles'       => $roleNames,
            'permissions' => $permissionNames,
            'status'      => $user['deleted_at'] ? 'inactive' : 'active',
            'lastLogin'   => $user['last_login_at'] ?? 'Never',
            'email'       => $user['email'] ?? '',
        ];
    }


    public function credentials($id, Request $request)
    {
        $user = User::findOrFail($id);
        $rawPassword = $request->session()->get('rawPassword');
        

        // Full name fallback
        $fName = $user->fName ?? '';
        $lName = $user->lName ?? '';
        if (empty($fName) && empty($lName) && isset($user->name)) {
            $parts = explode(' ', $user->name, 2);
            $fName = $parts[0] ?? '';
            $lName = $parts[1] ?? '';
        }
        // Role fallback
        $role = '';
        if ($user->relationLoaded('roles')) {
            $role = $user->roles->pluck('name')->first() ?? '';
        } elseif (!empty($user->role)) {
            $role = $user->role;
        }

        return Inertia::render('users/new-user-credentials', [
            'user' => [
                'ID'       => $user->id,
                'username' => $user->username,
                'fName'    => $fName,
                'lName'    => $lName,
                'email'    => $user->email,
                'role'     => $user->roles->pluck('name')->first() ?? '',
                'status'   => $user->deleted_at ? 'inactive' : 'active',
                'lastLogin' => $user->last_login_at,
                'password' => $rawPassword, // RAW password
            ]
        ]);
    }
}
