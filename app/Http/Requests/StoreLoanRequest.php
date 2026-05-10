<?php

namespace App\Http\Requests;

use App\Models\LoanProduct;
use App\Models\DocumentType;
use App\Services\RuleEvaluatorService;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;

class StoreLoanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $collateralUploadFileRule = 'file|mimes:jpg,jpeg,jfif,png,pdf,doc,docx|max:5120';
        $loanProductUploadFileRule = 'file|max:5120';

        $loanProductId = $this->input('loan_product_id');
        $loanProductId = is_numeric($loanProductId) ? (int) $loanProductId : null;
        $loanType = $this->input('loan_type');
        $loanAmount = (float) $this->input('loan_amount', 0);

        $borrowerIdRaw = $this->input('borrower_id');
        $borrowerId = is_numeric($borrowerIdRaw) ? (int) $borrowerIdRaw : null;
        $loanProduct = $this->resolveLoanProduct($loanProductId, $loanType);

        /** @var RuleEvaluatorService $ruleEvaluator */
        $ruleEvaluator = app(RuleEvaluatorService::class);
        $evaluation = $loanProduct
            ? $ruleEvaluator->evaluate($loanProduct, $borrowerId, [
                'loan_amount' => $loanAmount,
                'term' => $this->input('term'),
                'monthly_income' => $this->input('monthly_income'),
                'dti_ratio' => $this->input('dti_ratio'),
                'monthly_obligation' => $this->input('monthly_obligation'),
            ])
            : ['collateral' => false, 'coborrower' => false];

        $requiresCollateral = (bool) ($evaluation['collateral'] ?? false);
        $requiresCoBorrower = (bool) ($evaluation['coborrower'] ?? false);

        $rules = [
            // Borrower Information
            'borrower_name' => 'required|string|max:255',
            'borrower_id' => 'required|integer|exists:borrower,ID',
            'loan_product_id' => 'nullable|integer|exists:loan_products,id',
            'co_borrower_source' => 'nullable|string|in:previous,new',

            // Loan Details
            'loan_type' => 'required|string|max:255',
            'loan_amount' => 'required|numeric|min:0',
            'interest_type' => 'required|string|in:Compound,Diminishing',
            'interest_rate' => 'required|numeric|min:0|max:100',
            'repayment_frequency' => 'required|string|in:Weekly,Monthly,Yearly',
            'term' => 'required|integer|min:1|max:840',

            // Collateral
            'collateral_type' => $requiresCollateral
                ? 'required|string|in:vehicle,land,atm'
                : 'nullable|string|in:vehicle,land,atm',
            'ownership_proof' => 'nullable|file|mimes:pdf,jpg,jpeg,jfif,png|max:10240',
            'documents.collateral' => $requiresCollateral ? 'required|array|min:1' : 'nullable|array',
            'documents.collateral.*.document_type_id' => 'required_with:documents.collateral.*.file|integer|exists:document_types,id',
            'documents.collateral.*.file' => 'required_with:documents.collateral.*.document_type_id|'.$collateralUploadFileRule,
            'documents.loan_product' => 'nullable|array',
            'documents.loan_product.*.document_type_id' => 'required_with:documents.loan_product.*.file|integer|exists:document_types,id',
            'documents.loan_product.*.document_category' => 'nullable|string|max:100',
            'documents.loan_product.*.file' => 'required_with:documents.loan_product.*.document_type_id|'.$loanProductUploadFileRule,

            // Co-Borrowers
            'coBorrowers' => $requiresCoBorrower ? 'required|array|min:1' : 'nullable|array',
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
        if ($this->filled('collateral_type') && $this->input('collateral_type') === 'vehicle') {
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
        if ($this->filled('collateral_type') && $this->input('collateral_type') === 'land') {
            $rules['certificate_of_title_no'] = 'required|string|max:255';
            $rules['location'] = 'required|string|max:255';
            $rules['description'] = 'nullable|string|max:500';
            $rules['area'] = 'nullable|string|max:255';
        }

        // ATM Collateral Rules
        if ($this->filled('collateral_type') && $this->input('collateral_type') === 'atm') {
            $rules['bank_name'] = 'required|string|max:255';
            $rules['account_no'] = 'required|string|max:255';
            $rules['cardno_4digits'] = 'required|string|size:4';
            $rules['collateral_id'] = 'nullable|string|max:255';
        }

        return $rules;
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $isBusinessLoan = mb_strtolower(trim((string) $this->input('loan_type', ''))) === 'business loan';
            if (! $isBusinessLoan) {
                return;
            }

            $loanProductId = $this->input('loan_product_id');
            $loanProductId = is_numeric($loanProductId) ? (int) $loanProductId : null;
            $loanType = $this->input('loan_type');
            $loanProduct = $this->resolveLoanProduct($loanProductId, $loanType);

            if (! $loanProduct) {
              return;
            }

            $requiredRequirements = DB::table('loan_product_document_requirements')
                ->where('loan_product_id', $loanProduct->id)
                ->where('requirement_type', 'category')
                ->where('subject_type', 'business')
                ->where('is_required', true)
                ->where('is_active', true)
                ->whereNotNull('document_category')
                ->orderBy('sort_order')
                ->get(['document_category', 'min_count']);

            if ($requiredRequirements->isEmpty()) {
                return;
            }

            $submittedRows = collect($this->input('documents.loan_product', []));
            if ($submittedRows->isEmpty()) {
                $validator->errors()->add('documents.loan_product', 'Required loan product documents are missing.');
                return;
            }

            $requiredCategories = $requiredRequirements->pluck('document_category')->filter()->values();
            $documentTypesById = DocumentType::query()
                ->whereIn('category', $requiredCategories)
                ->where('is_active', true)
                ->get(['id', 'category'])
                ->keyBy('id');

            $invalidTypeIds = $submittedRows
                ->pluck('document_type_id')
                ->filter()
                ->map(fn ($id) => (int) $id)
                ->reject(fn ($id) => $documentTypesById->has($id))
                ->values()
                ->all();

            if (! empty($invalidTypeIds)) {
                $validator->errors()->add('documents.loan_product', 'Selected loan product document type(s) are not valid for the chosen loan product.');
                return;
            }

            foreach ($requiredRequirements as $requirement) {
                $category = (string) $requirement->document_category;
                $count = $submittedRows
                    ->map(function ($row, $index) use ($documentTypesById) {
                        $documentTypeId = isset($row['document_type_id']) ? (int) $row['document_type_id'] : null;
                        $documentType = $documentTypeId ? $documentTypesById->get($documentTypeId) : null;

                        return [
                            'category' => $documentType?->category,
                            'has_file' => $this->hasFile("documents.loan_product.{$index}.file"),
                        ];
                    })
                    ->filter(fn ($row) => $row['category'] === $category && $row['has_file'])
                    ->count();

                if ($count < (int) $requirement->min_count) {
                    $validator->errors()->add('documents.loan_product', "Missing required loan product document(s) for {$category}.");
                }
            }
        });
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

    private function resolveLoanProduct(?int $loanProductId, ?string $loanType): ?LoanProduct
    {
        if ($loanProductId) {
            return LoanProduct::query()->with('rules')->find($loanProductId);
        }

        if (! empty($loanType)) {
            return LoanProduct::query()
                ->with('rules')
                ->whereRaw('LOWER(name) = ?', [mb_strtolower(trim($loanType))])
                ->first();
        }

        return null;
    }
}
