<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreLoanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            // Borrower Information
            'borrower_name' => 'required|string|max:255',
            'borrower_id' => 'required|integer|exists:borrower,ID',

            // Loan Details
            'loan_type' => 'required|string|max:255',
            'loan_amount' => 'required|numeric|min:0',
            'interest_type' => 'required|string|in:Compound,Diminishing',
            'interest_rate' => 'required|numeric|min:0|max:100',
            'repayment_frequency' => 'required|string|in:Weekly,Monthly,Yearly',
            'term' => 'required|integer|min:1',

            // Collateral
            'collateral_type' => 'required|string|in:vehicle,land,atm',
            'ownership_proof' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:10240',

            // Co-Borrowers
            'coBorrowers' => 'nullable|array',
            'coBorrowers.*.first_name' => 'required_with:coBorrowers|string|max:255',
            'coBorrowers.*.last_name' => 'required_with:coBorrowers|string|max:255',
            'coBorrowers.*.address' => 'nullable|string|max:255',
            'coBorrowers.*.email' => 'nullable|email|max:255',
            'coBorrowers.*.contact' => 'nullable|string|max:20',
            'coBorrowers.*.birth_date' => 'nullable|date',
            'coBorrowers.*.marital_status' => 'nullable|string|max:50',
            'coBorrowers.*.occupation' => 'nullable|string|max:255',
            'coBorrowers.*.net_pay' => 'nullable|numeric|min:0',
        ];

        // Vehicle Collateral Rules
        if ($this->input('collateral_type') === 'vehicle') {
            $rules['make'] = 'required|string|max:255';
            $rules['chassis_no'] = 'nullable|string|max:255';
            $rules['body_type'] = 'nullable|string|max:255';
            $rules['plate_no'] = 'nullable|string|max:255';
            $rules['engine_no'] = 'nullable|string|max:255';
            $rules['year_model'] = 'nullable|string|max:255';
            $rules['series'] = 'nullable|string|max:255';
            $rules['fuel'] = 'nullable|string|max:255';
        }

        // Land Collateral Rules
        if ($this->input('collateral_type') === 'land') {
            $rules['certificate_of_title_no'] = 'required|string|max:255';
            $rules['location'] = 'required|string|max:255';
            $rules['description'] = 'nullable|string|max:500';
            $rules['area'] = 'nullable|string|max:255';
        }

        // ATM Collateral Rules
        if ($this->input('collateral_type') === 'atm') {
            $rules['bank_name'] = 'required|string|max:255';
            $rules['account_no'] = 'required|string|max:255';
            $rules['cardno_4digits'] = 'required|string|size:4';
            $rules['collateral_id'] = 'nullable|string|max:255';
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'borrower_name.required' => 'Borrower name is required.',
            'loan_type.required' => 'Loan type is required.',
            'loan_amount.required' => 'Loan amount is required.',
            'loan_amount.numeric' => 'Loan amount must be a number.',
            'interest_type.required' => 'Interest type is required.',
            'interest_rate.required' => 'Interest rate is required.',
            'repayment_frequency.required' => 'Repayment frequency is required.',
            'term.required' => 'Term is required.',
            'collateral_type.required' => 'Collateral type is required.',
            'make.required' => 'Vehicle make is required.',
            'certificate_of_title_no.required' => 'Certificate of title number is required.',
            'location.required' => 'Location is required.',
            'bank_name.required' => 'Bank name is required.',
            'account_no.required' => 'Account number is required.',
            'cardno_4digits.required' => 'Card last 4 digits is required.',
        ];
    }
}
