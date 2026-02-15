<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Services\ApplicationService;

class ApplicationController extends Controller
{
    protected $service;

    public function __construct(ApplicationService $service)
    {
        $this->service = $service;
    }

    public function confirm(Request $request)
    {
        $validated = $request->validate([
            // 'borrower_first_name' => 'required|string|max:255',
            // 'borrower_last_name' => 'required|string|max:255',
            // 'date_of_birth' => 'required|date',
            // 'gender' => 'required|string|max:20',
            // 'marital_status' => 'required|string|max:20',
            // 'contact_no' => 'required|string|max:15',
            // 'landline_number' => 'nullable|string|max:20',
            // 'dependent_child' => 'nullable|integer',
            // 'permanent_address' => 'required|string|max:255',
            // 'city' => 'required|string|max:255',
            // 'home_ownership' => 'nullable|string|max:50',

            // 'spouse_first_name' => 'nullable|string|max:255',
            // 'spouse_last_name' => 'nullable|string|max:255',
            // 'spouse_mobile_number' => 'nullable|string|max:20',
            // 'spouse_occupation' => 'nullable|string|max:100',
            // 'spouse_position' => 'nullable|string|max:100',
            // 'spouse_agency_address' => 'nullable|string|max:255',

            // 'employment_status' => 'nullable|string|max:50',
            // 'income_source' => 'nullable|string|max:50',
            // 'occupation' => 'nullable|string|max:100',
            // 'position' => 'nullable|string|max:100',
            // 'monthly_income' => 'nullable|numeric',
            // 'agency_address' => 'nullable|string|max:255',

            // 'valid_id_type' => 'required|string|max:50',
            // 'valid_id_number' => 'required|string|max:50',
            // 'files.*' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:5120',

            'coBorrowers' => 'nullable|array',
            'coBorrowers.*.first_name' => 'required_with:coBorrowers|string|max:255',
            'coBorrowers.*.last_name' => 'required_with:coBorrowers|string|max:255',
            'coBorrowers.*.birth_date' => 'required_with:coBorrowers|date',
            'coBorrowers.*.marital_status' => 'nullable|string|max:50',
            'coBorrowers.*.mobile' => 'nullable|string|max:20',
            'coBorrowers.*.dependents' => 'nullable|integer|min:0',
            'coBorrowers.*.address' => 'required_with:coBorrowers|string|max:500',
            'coBorrowers.*.occupation' => 'nullable|string|max:255',
            'coBorrowers.*.position' => 'nullable|string|max:255',
            'coBorrowers.*.employer_address' => 'nullable|string|max:500',

            'collateral_type' => 'required|string|max:50',
            'description' => 'nullable|string|max:1000',
            'estimated_value' => 'nullable|numeric|min:0',
            'appraisal_date' => 'nullable|date',
            'appraised_by' => 'nullable|string|max:255',
            'ownership_proof' => 'nullable|file|mimes:pdf,doc,docx,jpg,png|max:4096',
            'make' => 'nullable|string|max:50',
            'vehicle_type' => 'nullable|string|max:20',
            'transmission_type' => 'nullable|string|max:20',
            'plate_no' => 'nullable|string|max:20',
            'engine_no' => 'nullable|string|max:20',
            'year_model' => 'nullable|string|max:4',
            'series' => 'nullable|string|max:50',
            'fuel' => 'nullable|string|max:20',
            'certificate_of_title_no' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
            'area' => 'nullable|string|max:50',
            'bank_name' => 'nullable|string|in:BDO,BPI,LandBank,MetroBank',
            'account_no' => 'nullable|string|max:50',
            'cardno_4digits' => 'nullable|string|max:4',

            'loan_amount' => 'required|numeric|min:1000',
            'loan_type' => 'required|string|max:255',
            'interest_rate' => 'required|numeric|min:0',
            'term' => 'required|integer|min:1',
            'interest_type' => 'required|string|max:20',
            'repayment_frequency' => 'required|string|max:20',

            // 'payment_method' => 'required|string|in:bank,cash,check',
        ]);

        $loan = $this->service->createFullApplication(
            $validated,
            [
                'files' => $request->file('files', []),
                'ownership_proof' => $request->file('ownership_proof'),
            ],
            Auth::user()
        );

        return redirect()->route('customer.MyLoan')
                         ->with('success', 'Application submitted successfully.');
    }
}
