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
        return Inertia::render('users/add');
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
