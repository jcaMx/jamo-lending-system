<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Borrower;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BorrowerController extends Controller
{
    public function index()
    {
        $borrowers = Borrower::with('loan')->get()->map(function ($b) {
            return [
                'id' => $b->ID,
                'first_name' => $b->first_name,
                'last_name' => $b->last_name,
                'email' => $b->email,
                'city' => $b->city,
                'gender' => $b->gender,
                'occupation' => $b->occupation,
                'contact_no' => $b->contact_no,
                'loan' => $b->loan ? [
                    'status' => $b->loan->status,
                ] : null,
            ];
        });

        return Inertia::render('borrowers/index', [
            'borrowers' => $borrowers,
        ]);
    }

    public function show($id)
    {
        $borrower = Borrower::with('loan')->findOrFail($id);

        return Inertia::render('borrowers/show', [
            'borrower' => [
                'id' => $borrower->ID,
                'first_name' => $borrower->first_name,
                'last_name' => $borrower->last_name,
                'email' => $borrower->email,
                'city' => $borrower->city,
                'gender' => $borrower->gender,
                'occupation' => $borrower->occupation,
                'contact_no' => $borrower->contact_no,
                'loan' => $borrower->loan ? [
                    'status' => $borrower->loan->status,
                ] : null,
            ],
        ]);
    }

    public function add()
    {
        return Inertia::render('borrowers/add');
    }

}
