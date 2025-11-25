<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Loan;
use App\Models\Borrower;
use App\Models\Spouse;
use App\Models\Collateral;
use App\Models\CoBorrower;
use App\Models\Enums\LoanStatus;

class LoanController extends Controller
{
    /**
     * Show all loan applications (for ViewLoanApplications page).
     */
    public function index()
    {
        // eager-load borrower, spouse, collateral, coBorrowers
        $loans = Loan::with(['borrower.spouse', 'collateral', 'coBorrowers'])->get();

        return inertia('LoanApplication/ViewLoanApplications', [
            'loanApplications' => $loans,
        ]);
    }

    /**
     * Store a new loan application.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Borrower
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'age'        => 'nullable|integer',
            'gender'     => 'nullable|string',
            'email'      => 'nullable|email',
            'contact_no' => 'nullable|string',
            'city'       => 'nullable|string',
            'address'    => 'nullable|string',
            'land_line'  => 'nullable|string',
            'marital_status' => 'nullable|string',
            'numof_dependentchild' => 'nullable|integer',
            'home_ownership' => 'nullable|string',
            'membership_date' => 'required|date',
            'status'          => 'required|string',
            'birth_date'      => 'nullable|date',

            // Spouse
            'spouseFullName'     => 'nullable|string|max:255',
            'spouseMobileNumber' => 'nullable|string|max:20',
            'spouseAgencyAddress'=> 'nullable|string|max:255',
            'spouseOccupation'   => 'nullable|string|max:255',

            // Loan
            'principal_amount'   => 'required|numeric',
            'interest_rate'      => 'required|numeric',
            'interest_type'      => 'required|in:Compound,Diminishing',
            'loan_type'          => 'required|in:Personal,Home,Business,Emergency',
            'term_months'        => 'required|integer',
            'repayment_frequency'=> 'required|in:Weekly,Monthly,Yearly',
            'start_date'         => 'required|date',
            'end_date'           => 'required|date',

            // Collateral
            'collateral_type' => 'required|string|max:255',
            'description'     => 'nullable|string',
            'estimated_value' => 'nullable|numeric',
            'appraisal_date'  => 'nullable|date',
            'appraised_by'    => 'nullable|string|max:255',
            'ownership_proof' => 'nullable|string|max:255',

            // CoBorrowers
            'coBorrowers' => 'nullable|array',
            'coBorrowers.*.first_name'     => 'required|string|max:255',
            'coBorrowers.*.last_name'      => 'required|string|max:255',
            'coBorrowers.*.birth_date'     => 'nullable|date',
            'coBorrowers.*.age'            => 'nullable|integer',
            'coBorrowers.*.marital_status' => 'nullable|string',
            'coBorrowers.*.address'        => 'nullable|string',
            'coBorrowers.*.contact_no'     => 'nullable|string',
            'coBorrowers.*.occupation'     => 'nullable|string',
            'coBorrowers.*.position'       => 'nullable|string',
            'coBorrowers.*.agency_address' => 'nullable|string',
            'coBorrowers.*.home_ownership' => 'nullable|string',
        ]);

        // 1. Borrower
        $borrower = Borrower::create([
            'first_name' => $validated['first_name'],
            'last_name'  => $validated['last_name'],
            'age'        => $validated['age'] ?? null,
            'gender'     => $validated['gender'] ?? null,
            'email'      => $validated['email'] ?? null,
            'contact_no' => $validated['contact_no'] ?? null,
            'city'       => $validated['city'] ?? null,
            'address'    => $validated['address'] ?? null,
            'land_line'  => $validated['land_line'] ?? null,
            'marital_status' => $validated['marital_status'] ?? null,
            'numof_dependentchild' => $validated['numof_dependentchild'] ?? null,
            'home_ownership' => $validated['home_ownership'] ?? null,
            'membership_date' => $validated['membership_date'],
            'status'          => $validated['status'],
            'birth_date'      => $validated['birth_date'] ?? null,
        ]);

        // 2. Spouse
        if (!empty($validated['spouseFullName'])) {
            $borrower->spouse()->create([
                'full_name'      => $validated['spouseFullName'],
                'mobile_number'  => $validated['spouseMobileNumber'] ?? null,
                'agency_address' => $validated['spouseAgencyAddress'] ?? null,
                'occupation'     => $validated['spouseOccupation'] ?? null,
            ]);
        }

        // 3. Loan
        $loan = $borrower->loan()->create([
            'principal_amount'   => $validated['principal_amount'],
            'interest_rate'      => $validated['interest_rate'],
            'interest_type'      => $validated['interest_type'],
            'loan_type'          => $validated['loan_type'],
            'term_months'        => $validated['term_months'],
            'repayment_frequency'=> $validated['repayment_frequency'],
            'start_date'         => $validated['start_date'],
            'end_date'           => $validated['end_date'],
            'status'             => LoanStatus::Pending->value,
            'balance_remaining'  => $validated['principal_amount'],
        ]);

        // 4. Collateral
        $loan->collateral()->create([
            'type'           => $validated['collateral_type'],
            'description'    => $validated['description'] ?? null,
            'estimated_value'=> $validated['estimated_value'] ?? null,
            'appraisal_date' => $validated['appraisal_date'] ?? null,
            'appraised_by'   => $validated['appraised_by'] ?? null,
            'ownership_proof'=> $validated['ownership_proof'] ?? null,
        ]);

        // 5. CoBorrowers
        foreach ($validated['coBorrowers'] ?? [] as $co) {
            $loan->coBorrowers()->create($co);
        }

        // Return with flash success
        return back()->with('success', 'Loan application submitted successfully!');
    }
}
