<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class CollectionSheetController extends Controller
{
    public function index()
    {
        $due_loans = [
            [
                'id' => 1,
                'name' => 'Angela Bautista',
                'loanNo' => 'C402555',
                'principal' => 'Bank Transfer',
                'interest' => 'Jose Ramos',
                'penalty' => '11/01/2025',
                'total_due' => 6000,
            ],
            [
                'id' => 2,
                'name' => 'Mark Santos',
                'loanNo' => 'C402556',
                'principal' => 'Cash',
                'interest' => 'Jose Ramos',
                'penalty' => '11/01/2025',
                'total_due' => 4500,
            ],
        ];

        return Inertia::render('daily-collection', [
            'due_loans' => $due_loans,
        ]);
    }
}
