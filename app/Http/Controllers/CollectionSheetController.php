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
                'principal' => 5000,
                'interest' => 800,
                'penalty' => 200,
                'total_due' => 6000,
                'collector' => 'Jose Ramos',
                'collection_date' => '2025-11-17', // YYYY-MM-DD format for date filter
            ],
            [
                'id' => 2,
                'name' => 'Mark Santos',
                'loanNo' => 'C402556',
                'principal' => 4000,
                'interest' => 500,
                'penalty' => 0,
                'total_due' => 4500,
                'collector' => 'Jose Ramos',
                'collection_date' => '2025-11-17',
            ],
            [
                'id' => 3,
                'name' => 'Liza Mercado',
                'loanNo' => 'C402557',
                'principal' => 3000,
                'interest' => 400,
                'penalty' => 100,
                'total_due' => 3500,
                'collector' => 'Ana Cruz',
                'collection_date' => '2025-11-16',
            ],
        ];

        return Inertia::render('daily-collection-sheet', [
            'due_loans' => $due_loans,
        ]);
    }
}
