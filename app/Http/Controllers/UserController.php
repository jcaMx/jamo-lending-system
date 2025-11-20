<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\UserService;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{

    public function __construct(private UserService $service)
    {
        // Only users with the Admin role can access any method in this controller
        $this->service = $service;
        // $this->middleware('role:admin');
    }

    public function index()
    {
        $users = $this->service->getAll();
        return Inertia::render('users/index', ['users' => $users]);
    }

    public function show($id)
    {
        $user = $this->service->getById($id);
        abort_if(!$user, 404);

        return Inertia::render('users/show', ['user' => $user]);
    }

    public function add()
    {
        // Only allow Admin role to be assigned when creating new users
        $roles = Role::where('name', 'admin')->get();

        return Inertia::render('users/add', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fName'   => 'required|string|max:50',
            'lName'   => 'required|string|max:50',
            'email'   => 'required|email|unique:users,email',
            'role'    => 'required|in:admin,cashier',
        ]);

        $user = $this->service->createUser($validated);

        return redirect()
            ->route('users.newUserCredentials', $user->id)
            ->with('success', 'User created successfully.');
    }

    public function edit($id)
    {
        $user = $this->service->getById($id);
        abort_if(!$user, 404);

        // Admin can edit and assign any role
        $roles = Role::all();

        return Inertia::render('users/edit', [
            'user'  => $user,
            'roles' => $roles,
        ]);
    }
}
