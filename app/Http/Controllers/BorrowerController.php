<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Borrower;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\BorrowerService; 


class BorrowerController extends Controller
{
    public function __construct(
        private BorrowerService $borrowerService,
    ) {}

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
            'active_loan' => $payload['active_loan'],
            'repayments' => $payload['repayments'],
        ]);
    }
    
    public function store(Request $request)
    {
        // Debug: Log incoming request data
        \Log::info('Incoming request data:', $request->all());
        
        $validated = $request->validate([
            'borrower_first_name' => 'required|string|max:255',
            'borrower_last_name'  => 'required|string|max:255',
            'date_of_birth'       => 'required|date',
            'gender'              => 'required|string',
            'marital_status'      => 'required|string',
            'contact_no'       => 'required|string|max:15',
            'landline_number'     => 'nullable|string|max:15',
            'email'               => 'required|email|max:255',
            'dependent_child'     => 'nullable|integer',
            'permanent_address'   => 'nullable|string|max:255',
            'city'                => 'nullable|string|max:255',
            'home_ownership'      => 'nullable|string|max:50',
            'employment_status'   => 'nullable|string|max:50',
            'income_source'       => 'nullable|string|max:50',
            'occupation'          => 'nullable|string|max:100',
            'position'            => 'nullable|string|max:100',
            'monthly_income'      => 'nullable|numeric',
            'agency_address'      => 'nullable|string|max:255',
            'valid_id_type'       => 'required|string|max:50',
            'valid_id_number'     => 'required|string|max:50',
            'files.*'             => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',
            // spouse fields if married
            'spouse_first_name'    => 'nullable|string|max:255',
            'spouse_last_name'     => 'nullable|string|max:255',
            'spouse_mobile_number' => 'nullable|string|max:15',
            'spouse_occupation'    => 'nullable|string|max:100',
            'spouse_position'      => 'nullable|string|max:100',
            'spouse_agency_address'=> 'nullable|string|max:255',
        ]);

        // -------------------------------
        // Check if borrower already exists
        // -------------------------------
        $exists = Borrower::where('first_name', $validated['borrower_first_name'])
            ->where('last_name', $validated['borrower_last_name'])
            ->where('birth_date', $validated['date_of_birth'])
            ->exists();

        if ($exists) {
            return back()
                ->withErrors([
                    'borrower_first_name' => 'Borrower already exists.',
                    'borrower_last_name' => 'Borrower already exists.',
                    'email' => 'Borrower already exists.',
                ])
                ->withInput();

        }

        // -------------------------------
        // Create borrower using service
        // -------------------------------
        $borrower = $this->borrowerService->createBorrower($validated);

        return redirect()
        ->route('borrowers.show', ['id' => $borrower->ID])
        ->with('success', 'Borrower added successfully!');

    }

    
    public function update(Request $request, Borrower $borrower)
    {
        $validated = $request->validate([
            'address' => 'nullable|string|max:50',
            'city' => 'nullable|string|max:50',
            'zipcode' => 'nullable|string|max:10',
            'email' => 'nullable|email|max:100',
            'mobile' => 'nullable|string|max:20',
            'landline' => 'nullable|string|max:20',
            'occupation' => 'nullable|string|max:50',
            'gender' => 'nullable|string|in:Male,Female',
            'age' => 'nullable|integer|min:0',
        ]);

        $this->service->update($borrower, $validated);

        return redirect()->back()->with('success', 'Borrower updated successfully');
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






}
