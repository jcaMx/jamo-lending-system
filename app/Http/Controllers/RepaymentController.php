<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class RepaymentController extends Controller
{
    public function index()
    {
        // Combined repayment data
        $repayments = [
            [
                'id' => 1,
                'name' => 'Angela Bautista',
                'loanNo' => 'C402555',
                'method' => 'Bank Transfer',
                'collectedBy' => 'Jose Ramos',
                'collectionDate' => '11/01/2025',
                'paidAmount' => 6000,
            ],
            [
                'id' => 2,
                'name' => 'Ramon Dela Peña',
                'loanNo' => 'B203412',
                'method' => 'Cash',
                'collectedBy' => 'Jenny Flores',
                'collectionDate' => '10/10/2025',
                'paidAmount' => 2500,
            ],
            [
                'id' => 3,
                'name' => 'Maria Salem',
                'loanNo' => 'A100651',
                'method' => 'Cash',
                'collectedBy' => 'RJ Arevalo',
                'collectionDate' => '10/15/2025',
                'paidAmount' => 8650,
            ],
            [
                'id' => 4,
                'name' => 'Maria Salem',
                'loanNo' => 'A100651',
                'method' => 'GCash',
                'collectedBy' => 'Alex Lopez',
                'collectionDate' => '11/01/2025',
                'paidAmount' => 5400,
            ],
        ];

        return Inertia::render('repayments/index', [
            'repayments' => $repayments,
        ]);
    }

    public function add()
    {
        $borrowers = [
            [
                "id" => 1,
                "name" => "Angela Bautista",
                "loanNo" => "C402555",
            ],
            [
                "id" => 2,
                "name" => "Marvin Santos",
                "loanNo" => "A550233",
            ],
            [
                "id" => 3,
                "name" => "Jessa Dizon",
                "loanNo" => "B302188",
            ],
        ];

        $collectors = [
            'Jose Ramos',
            'Maria Santos',
            'Ana Dela Cruz',
            'Peter Reyes',
        ];

        return Inertia::render('repayments/add', [
            "borrowers" => $borrowers,
            "collectors" =>  $collectors ,
        ]);
    }


}
