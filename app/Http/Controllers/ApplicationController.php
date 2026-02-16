<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Services\ApplicationService;
use App\Services\LoanProductRuleResolver;

class ApplicationController extends Controller
{
    protected $service;
    protected LoanProductRuleResolver $ruleResolver;

    public function __construct(ApplicationService $service, LoanProductRuleResolver $ruleResolver)
    {
        $this->service = $service;
        $this->ruleResolver = $ruleResolver;
    }

    public function confirm(Request $request)
    {
        $loanProductId = $request->integer('loan_product_id') ?: null;
        $loanType = $request->input('loan_type');
        $loanAmount = (float) $request->input('loan_amount', 0);

        $loanRule = $this->ruleResolver->resolve($loanProductId, $loanType);
        $requiresCollateral = $this->ruleResolver->requiresCollateral($loanRule, $loanAmount);
        $requiresCoBorrower = $this->ruleResolver->requiresCoBorrower($loanRule);
        $hasCollateralPayload = $request->filled('collateral_type')
            || $request->hasFile('ownership_proof')
            || $request->hasFile('documents.collateral.0.file');

        $rules = [
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

            'loan_product_id' => 'nullable|integer|exists:loan_products,id',
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

            'collateral_type' => 'nullable|string|in:vehicle,land,atm',
            'description' => 'nullable|string|max:1000',
            'estimated_value' => 'nullable|numeric|min:0',
            'appraisal_date' => 'nullable|date',
            'appraised_by' => 'nullable|string|max:255',
            'ownership_proof' => 'nullable|file|mimes:pdf,doc,docx,jpg,png|max:4096',
            'documents.collateral' => 'nullable|array',
            'documents.collateral.*.document_type_id' => 'required_with:documents.collateral.*.file|integer|exists:document_types,id',
            'documents.collateral.*.file' => 'required_with:documents.collateral.*.document_type_id|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:5120',
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
            'bank_name' => 'nullable|string|max:100',
            'account_no' => 'nullable|string|max:50',
            'cardno_4digits' => 'nullable|string|max:4',

            'loan_amount' => 'required|numeric|min:1000',
            'loan_type' => 'required|string|max:255',
            'interest_rate' => 'required|numeric|min:0',
            'term' => 'required|integer|min:1',
            'interest_type' => 'required|string|max:20',
            'repayment_frequency' => 'required|string|max:20',

            // 'payment_method' => 'required|string|in:bank,cash,check',
        ];

        $rules['coBorrowers'] = $requiresCoBorrower
            ? 'required|array|min:1'
            : 'nullable|array';

        if ($requiresCollateral) {
            $rules['collateral_type'] = 'required|string|in:vehicle,land,atm';
        }

        if ($requiresCollateral || $hasCollateralPayload) {
            $rules['documents.collateral'] = 'required|array|min:1';
            $collateralType = strtolower((string) $request->input('collateral_type'));
            if ($collateralType === 'vehicle') {
                $rules['make'] = 'required|string|max:50';
                $rules['vehicle_type'] = 'required|string|max:20';
                $rules['transmission_type'] = 'required|string|max:20';
            } elseif ($collateralType === 'land') {
                $rules['certificate_of_title_no'] = 'required|string|max:50';
                $rules['location'] = 'required|string|max:255';
            } elseif ($collateralType === 'atm') {
                $rules['bank_name'] = 'required|string|max:100';
                $rules['account_no'] = 'required|string|max:50';
                $rules['cardno_4digits'] = 'required|string|size:4';
            }
        }

        $validated = Validator::make($request->all(), $rules)->validate();

        $loan = $this->service->createFullApplication(
            $validated,
            [
                'files' => $request->file('files', []),
                'ownership_proof' => $request->file('ownership_proof'),
                'collateral_documents' => $request->file('documents.collateral', []),
            ],
            Auth::user()
        );

        return redirect()->route('customer.MyLoan')
                         ->with('success', 'Application submitted successfully.');
    }
}
