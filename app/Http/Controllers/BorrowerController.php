<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use Inertia\Inertia;

class BorrowerController extends Controller
{
    public function index()
    {
        return Inertia::render('borrowers/index');
    }

    // public function index()
    // {
    //     $borrowers = Borrower::all(['id', 'name', 'borrower_id', 'age', 'gender', 'mobile', 'city', 'status']);

    //     return Inertia::render('borrowers/index', [
    //         'borrowers' => $borrowers,
    //     ]);
    // }

    public function add()
    {
        return Inertia::render('borrowers/add');
    }

    public function show($id)
    {
        $borrower = Borrower::findOrFail($id);

        return Inertia::render('borrowers/show', [
            'borrower' => $borrower,
        ]);
    }
        public function loans($id)
    {
        $borrower = Borrower::findOrFail($id);
        // load only needed data for loans
        $loans = $borrower->loans()->orderBy('released_at','desc')->get();

        return Inertia::render('borrowers/show', [
            'borrower' => $borrower,
            'tab' => 'loans',
            'loans' => $loans,
        ]);
    }

    public function repayments($id)
    {
        $borrower = Borrower::findOrFail($id);
        $repayments = $borrower->repayments()->latest()->get();

        return Inertia::render('borrowers/show', [
            'borrower' => $borrower,
            'tab' => 'repayments',
            'repayments' => $repayments,
        ]);
    }

}
