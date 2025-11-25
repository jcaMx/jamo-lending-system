<?php

namespace App\Http\Controllers;

use App\Services\BorrowerService;
use Inertia\Inertia;

class BorrowerController extends Controller
{
    public function __construct(
        private BorrowerService $borrowerService,
    ) {}

    public function index()
    {
        return Inertia::render('borrowers/index', [
            'borrowers' => $this->borrowerService->getBorrowersForIndex(),
        ]);
    }

    public function add()
    {
        return Inertia::render('borrowers/add');
    }

    public function show(int $id)
    {
        $payload = $this->borrowerService->getBorrowerForShow($id);

        return Inertia::render('borrowers/show', [
            'borrower' => $payload['borrower'],
            'collaterals' => $payload['collaterals'],
            'activeLoan' => $payload['activeLoan'],
            'repayments' => $payload['repayments'],
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Borrower fields
            'borrowerFirstName' => 'required|string|max:255',
            'borrowerLastName'  => 'required|string|max:255',
            'dateOfBirth'       => 'required|date|before_or_equal:' . now()->subYears(18)->format('Y-m-d'),
            'maritalStatus'     => 'nullable|string|in:Single,Married,Separated,Widowed',
            'age'               => 'nullable|integer|min:18',
            'homeOwnership'     => 'nullable|string|in:Owned,Mortgage,Rented',
            'permanentAddress'  => 'nullable|string|max:255',
            'mobileNumber'      => ['required','regex:/^09\d{9}$/'],
            'occupation'        => 'nullable|string|max:255',
            'dependentChild'    => 'nullable|integer|min:0',
            'netPay'            => 'nullable|numeric|min:0',

            // Spouse fields
            'spouseFirstName'       => 'required|string|max:255',
            'spouseLastName'        => 'required|string|max:255',
            'spouseMobileNumber'    => ['required','regex:/^09\d{9}$/'],
            'spouseOccupation'      => 'nullable|string|max:255',
            'spousePosition'        => 'nullable|string|max:255',
            'spouseAgencyAddress'   => 'nullable|string|max:255',
        ]);

        $this->borrowerService->createBorrower($validated);

        return redirect()->route('borrowers.show', $borrower->id)
            ->with('success', 'Borrower added successfully!');
    }
}
