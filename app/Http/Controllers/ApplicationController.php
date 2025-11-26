<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Application;
use App\Models\Borrower;
use App\Models\CoBorrower;
use App\Models\Collateral;
use App\Models\Loan;
use App\Models\Confirmation;


class ApplicationController extends Controller
{
    public function storeBorrowerInfo(Request $request)
    {
        // Validate incoming data
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'middle_name' => 'nullable|string|max:255',
            'last_name' => 'required|string|max:255',
            'dob' => 'required|date',
            'age' => 'required|integer|min:18',
            'marital_status' => 'required|string',
            'address' => 'required|string|max:500',
            'mobile' => 'required|string|max:20',
            'dependents' => 'nullable|integer|min:0',
            'home_ownership' => 'nullable|string|max:255',
            'occupation' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'employer_address' => 'nullable|string|max:500',
            'photo' => 'nullable|image|max:2048', // 2MB limit
            'spouse_first_name' => 'nullable|string|max:255',
            'spouse_middle_name' => 'nullable|string|max:255',
            'spouse_last_name' => 'nullable|string|max:255',
            'spouse_occupation' => 'nullable|string|max:255',
            'spouse_position' => 'nullable|string|max:255',
            'spouse_employer_address' => 'nullable|string|max:500',
            'spouse_mobile' => 'nullable|string|max:20',
        ]);

        // Handle photo upload if present
        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('borrowers', 'public');
        }

        // Create borrower record
        $borrower = Borrower::create($validated);

        // Create application record tied to borrower
        $application = Application::create([
            'borrower_id' => $borrower->id,
            'status' => 'draft', // or 'submitted' later
        ]);

        // Return back to Inertia with success
        return redirect()->route('applications.show', $application->id)
                         ->with('success', 'Application created successfully.');
    }
     public function storeCoBorrower(Request $request, Application $application)
    {
        // Validate incoming data
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'dob' => 'required|date',
            'age' => 'required|integer|min:18',
            'marital_status' => 'required|string|max:50',
            'address' => 'required|string|max:500',
            'mobile' => 'required|string|max:20',
            'dependents' => 'nullable|integer|min:0',
            'home_ownership' => 'nullable|string|max:255',
            'occupation' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'employer_address' => 'nullable|string|max:500',
        ]);

        // Create co-borrower record
        $coBorrower = CoBorrower::create($validated);

        // Link co-borrower to application
        $application->co_borrower_id = $coBorrower->id;
        $application->save();

        // Redirect back to Inertia with success
        return redirect()->route('applications.show', $application->id)
                         ->with('success', 'Co-Borrower information saved successfully.');
    }

    public function storeCollateral(Request $request, Application $application)
    {
        // Validate incoming data
        $validated = $request->validate([
            'collateral_type' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'estimated_value' => 'required|numeric|min:0',
            'appraisal_date' => 'nullable|date',
            'appraised_by' => 'nullable|string|max:255',
            'ownership_proof' => 'nullable|file|mimes:pdf,doc,docx,jpg,png|max:4096',
        ]);

        // Handle file upload if present
        if ($request->hasFile('ownership_proof')) {
            $validated['ownership_proof'] = $request->file('ownership_proof')->store('collaterals', 'public');
        }

        // Create collateral record
        $collateral = Collateral::create($validated);

        // Link collateral to application
        $application->collateral_id = $collateral->id;
        $application->save();

        // Redirect back to Inertia with success
        return redirect()->route('applications.show', $application->id)
                         ->with('success', 'Collateral information saved successfully.');
    }
     public function storeLoanDetails(Request $request, Application $application)
    {
        // Validate incoming data
        $validated = $request->validate([
            'loan_amount' => 'required|numeric|min:1000',
            'loan_type' => 'required|string|max:255',
            'interest_rate' => 'required|numeric|min:0',
            'term' => 'required|integer|min:1',
            'interest_type' => 'required|string|in:fixed,variable',
            'repayment_frequency' => 'required|string|in:monthly,quarterly,annually',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        // Create loan record
        $loan = Loan::create($validated);

        // Link loan to application
        $application->loan_id = $loan->id;
        $application->save();

        // Redirect back to Inertia with success
        return redirect()->route('applications.show', $application->id)
                         ->with('success', 'Loan details saved successfully.');
    }
    public function confirm(Request $request, Application $application)
{
    $validated = $request->validate([
        'payment_method' => 'required|string|in:bank,cash,check',
    ]);

    $application->payment_method = $validated['payment_method'];
    $application->status = 'submitted';
    $application->submitted_at = now();
    $application->save();

    return redirect()->route('applications.show', $application->id)
                     ->with('success', 'Application submitted successfully.');
}
public function show(Application $application)
{
    // Eager-load all related models
    $application->load(['borrower', 'coBorrower', 'collateral', 'loan']);

    // Pass to Inertia view
    return inertia('BorrowerApplication', [
        'application' => $application,
    ]);
}
}
