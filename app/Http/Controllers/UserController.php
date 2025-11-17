<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Borrower; 
use Inertia\Inertia;

class UserController extends Controller
{

    public function index()
    {
        // Dummy data for testing
        $users = [
            [
                'ID' => 1,
                'username' => 'jdelacruz',
                'fName' => 'Juan',
                'lName' => 'Dela Cruz',
                'role' => 'Admin',
                'status' => 'Active',
                'lastLogin' => '2025-11-13 10:30 AM',
            ],
            [
                'ID' => 2,
                'username' => 'mgarcia',
                'fName' => 'Maria',
                'lName' => 'Garcia',
                'role' => 'User',
                'status' => 'Inactive',
                'lastLogin' => '2025-11-10 03:15 PM',
            ],
            [
                'ID' => 3,
                'username' => 'pperez',
                'fName' => 'Pedro',
                'lName' => 'Perez',
                'role' => 'User',
                'status' => 'Closed',
                'lastLogin' => '2025-11-01 09:45 AM',
            ],
        ];

        return Inertia::render('users/index', [
            'users' => $users
            //uncomment if backend na
            // 'users' => User::all() 
        ]);
            
    }


    public function show($id)
    {
        $user = [
            'ID' => $id,
            'username' => 'jdelacruz',
            'fName' => 'Juan',
            'lName' => 'Dela Cruz',
            'role' => 'Admin',
            'email' => 'juan.delacruz@example.com',
            'status' => 'Active',
            'lastLogin' => '2025-11-13 10:30 AM',
        ];

        return Inertia::render('users/show', [
            'user' => $user,
        ]);
    }

    public function add()
    {
        $user_roles = ['manager', 'admin', 'cashier'];
        return Inertia::render('users/add', [
            'user_roles' => $user_roles,
        ]);

    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role' => 'required|in:manager,admin,cashier',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
            'role' => $validated['role'],
        ]);

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }


    public function newUserCredentials($id) 
    {
        $user = [
            'ID' => $id,
            'username' => 'jdelacruz',
            'fName' => 'Juan',
            'lName' => 'Dela Cruz',
        ];
        return Inertia::render('users/new-user-credentials', [
            'user' => $user,
        ]);
    }

    
    public function edit(User $user)
    {
        dd($user);
        return Inertia::render('Users/Edit', [
            'user' => $user
        ]);
    }
    


}
