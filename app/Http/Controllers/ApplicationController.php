<?php

namespace App\Http\Controllers;

use App\Models\DocumentType;
use App\Models\LoanProduct;
use App\Models\User;
use App\Notifications\LoanApplicationSubmitted;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use App\Services\ApplicationService;
use App\Services\RuleEvaluatorService;
use Illuminate\Support\Facades\Log;

class ApplicationController extends Controller
{
    protected $service;
    protected RuleEvaluatorService $ruleEvaluator;

    public function __construct(ApplicationService $service, RuleEvaluatorService $ruleEvaluator)
    {
        $this->service = $service;
        $this->ruleEvaluator = $ruleEvaluator;
    }

    public function confirm(Request $request)
    {
        Log::info('CONFIRM METHOD CALLED', $request->all());
        $loanProductId = $request->integer('loan_product_id') ?: null;
        $loanType = $request->input('loan_type');
        $loanAmount = (float) $request->input('loan_amount', 0);

        $borrowerId = Auth::user()?->borrower?->ID;
        $loanProduct = $this->resolveLoanProduct($loanProductId, $loanType);
        Log::info('LOAN PRODUCT RESOLVED', ['product' => $loanProduct?->id ?? 'NULL']);

        $ruleEvaluation = $loanProduct
            ? $this->ruleEvaluator->evaluate($loanProduct, $borrowerId, [
                'loan_amount' => $loanAmount,
                'term' => $request->input('term'),
                'monthly_income' => $request->input('monthly_income'),
                'dti_ratio' => $request->input('dti_ratio'),
            ])
            : ['collateral' => false, 'coborrower' => false];

        $requiresCollateral = (bool) ($ruleEvaluation['collateral'] ?? false);
        $requiresCoBorrower = (bool) ($ruleEvaluation['coborrower'] ?? false);
        $hasCollateralDocumentFiles = collect($request->file('documents.collateral', []))
            ->flatten()
            ->filter(fn ($value) => $value instanceof \Illuminate\Http\UploadedFile)
            ->isNotEmpty();

        $hasCollateralPayload = $request->filled('collateral_type')
            || $request->hasFile('ownership_proof')
            || $hasCollateralDocumentFiles;

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
            'documents.loan_product' => 'nullable|array',
            'documents.loan_product.*.document_type_id' => 'required_with:documents.loan_product.*.file|integer|exists:document_types,id',
            'documents.loan_product.*.document_category' => 'nullable|string|max:100',
            'documents.loan_product.*.file' => 'required_with:documents.loan_product.*.document_type_id|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:5120',
            'make' => 'nullable|string|max:50',
            'vehicle_type' => 'nullable|string|max:20',
            'transmission_type' => 'nullable|string|max:20',
            'plate_no' => 'nullable|string|max:20',
            'engine_no' => 'nullable|string|max:20',
            'year_model' => 'nullable|string|max:4',
            'series' => 'nullable|string|max:50',
            'fuel' => 'nullable|string|max:20',
            'certificate_of_title_no' => 'nullable|string|max:50',
            'lot_no' => 'nullable|string|max:50',
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
                $rules['lot_no'] = 'required|string|max:50';
                $rules['location'] = 'required|string|max:255';
            } elseif ($collateralType === 'atm') {
                $rules['bank_name'] = 'required|string|max:100';
                $rules['account_no'] = 'required|string|max:50';
                $rules['cardno_4digits'] = 'required|string|size:4';
            }
        }

        $requiredLoanProductCategories = $loanProduct
            ? $this->requiredLoanProductCategoryRequirements(
                $loanProduct->id,
                mb_strtolower(trim((string) $loanType)) === 'business loan'
            )
            : collect();

        if ($requiredLoanProductCategories->isNotEmpty()) {
            $rules['documents.loan_product'] = 'required|array|min:1';
        }

        $validated = Validator::make($request->all(), $rules)->validate();

        if ($requiresCollateral || $hasCollateralPayload) {
            $collateralType = strtolower((string) $request->input('collateral_type'));
            $requiredTypes = $this->requiredCollateralDocumentTypes(
                $loanProductId,
                $loanType,
                $collateralType
            );

            if ($requiredTypes->isNotEmpty()) {
                $requiredTypeIds = $requiredTypes->pluck('id')->map(fn ($id) => (int) $id)->all();
                $requiredCodesById = $requiredTypes->pluck('code', 'id');

                $submittedRows = collect($request->input('documents.collateral', []));

                $submittedTypeIds = $submittedRows
                    ->pluck('document_type_id')
                    ->filter()
                    ->map(fn ($id) => (int) $id)
                    ->values();

                $invalidTypeIds = $submittedTypeIds
                    ->reject(fn ($id) => in_array($id, $requiredTypeIds, true))
                    ->values()
                    ->all();

                if (! empty($invalidTypeIds)) {
                    throw ValidationException::withMessages([
                        'documents.collateral' => 'Selected collateral document type(s) are not valid for the chosen collateral type.',
                    ]);
                }

                $submittedTypeIdsWithFiles = $submittedRows
                    ->map(function ($row, $index) use ($request) {
                        $documentTypeId = isset($row['document_type_id']) ? (int) $row['document_type_id'] : null;
                        $hasFile = $request->hasFile("documents.collateral.{$index}.file");

                        return $documentTypeId && $hasFile ? $documentTypeId : null;
                    })
                    ->filter()
                    ->values()
                    ->all();

                $missingCodes = collect($requiredTypeIds)
                    ->reject(fn ($id) => in_array($id, $submittedTypeIdsWithFiles, true))
                    ->map(fn ($id) => $requiredCodesById[$id] ?? null)
                    ->filter()
                    ->values()
                    ->all();

                if (! empty($missingCodes)) {
                    throw ValidationException::withMessages([
                        'documents.collateral' => 'Missing required collateral document(s): '.implode(', ', $missingCodes),
                    ]);
                }
            }
        }

        if ($requiredLoanProductCategories->isNotEmpty()) {
            $requiredCategories = $requiredLoanProductCategories->pluck('document_category')->filter()->values();
            $documentTypes = DocumentType::query()
                ->whereIn('category', $requiredCategories)
                ->where('is_active', true)
                ->get(['id', 'code', 'category']);

            $documentTypesById = $documentTypes->keyBy('id');
            $submittedRows = collect($request->input('documents.loan_product', []));

            $invalidTypeIds = $submittedRows
                ->pluck('document_type_id')
                ->filter()
                ->map(fn ($id) => (int) $id)
                ->reject(fn ($id) => $documentTypesById->has($id))
                ->values()
                ->all();

            if (! empty($invalidTypeIds)) {
                throw ValidationException::withMessages([
                    'documents.loan_product' => 'Selected loan product document type(s) are not valid for the chosen loan product.',
                ]);
            }

            foreach ($requiredLoanProductCategories as $requirement) {
                $requiredCategory = (string) $requirement->document_category;
                $matchingRows = $submittedRows
                    ->map(function ($row, $index) use ($request, $documentTypesById) {
                        $documentTypeId = isset($row['document_type_id']) ? (int) $row['document_type_id'] : null;
                        $documentType = $documentTypeId ? $documentTypesById->get($documentTypeId) : null;
                        $hasFile = $request->hasFile("documents.loan_product.{$index}.file");

                        return [
                            'category' => $documentType?->category,
                            'document_type_id' => $documentTypeId,
                            'has_file' => $hasFile,
                        ];
                    })
                    ->filter(fn ($row) => $row['category'] === $requiredCategory && $row['has_file'])
                    ->values();

                if ($matchingRows->count() < (int) $requirement->min_count) {
                    throw ValidationException::withMessages([
                        'documents.loan_product' => "Missing required loan product document(s) for {$requiredCategory}.",
                    ]);
                }
            }
        }

        $loan = $this->service->createFullApplication(
            $validated,
            [
                'files' => $request->file('files', []),
                'ownership_proof' => $request->file('ownership_proof'),
                'collateral_documents' => $request->file('documents.collateral', []),
                'loan_product_documents' => $request->file('documents.loan_product', []),
            ],
            Auth::user()
        );

        $loan->loadMissing('borrower');
        $admins = User::role('admin')->get();

        if ($admins->isNotEmpty()) {
            Notification::send($admins, new LoanApplicationSubmitted($loan));
        }

        return redirect()->route('customer.MyLoan')
                         ->with('success', 'Application submitted successfully.');
    }

    public function evaluateRules(Request $request)
    {
        $loanProductId = $request->integer('loan_product_id') ?: null;
        $loanType = $request->input('loan_type');
        $loanAmount = (float) $request->input('loan_amount', 0);
        
        $borrowerId = Auth::user()?->borrower?->ID;
        $loanProduct = $this->resolveLoanProduct($loanProductId, $loanType);
        
        if (!$loanProduct) {
            return response()->json([
                'collateral' => false,
                'coborrower' => false,
            ]);
        }
        
        $requirements = $this->ruleEvaluator->evaluate($loanProduct, $borrowerId, [
            'loan_amount' => $loanAmount,
            'term' => $request->input('term'),
            'monthly_income' => $request->input('monthly_income'),
            'dti_ratio' => $request->input('dti_ratio'),
        ]);
        Log::info('Term received', ['term' => $request->input('term'), 'type' => gettype($request->input('term'))]);

        
        return response()->json($requirements);
    }


    private function collateralCategoriesByType(string $collateralType): array
    {
        return match (strtolower($collateralType)) {
            'vehicle' => ['collateral_vehicle', 'collateral_general'],
            'land' => ['collateral_land', 'collateral_general'],
            'atm' => ['collateral_general'],
            default => [],
        };
    }

    private function requiredCollateralDocumentTypes(?int $loanProductId, ?string $loanType, string $collateralType)
    {
        $loanProduct = $this->resolveLoanProduct($loanProductId, $loanType);

        if ($loanProduct) {
            $configuredTypes = DB::table('loan_product_document_requirements')
                ->join('document_types', 'document_types.id', '=', 'loan_product_document_requirements.document_type_id')
                ->where('loan_product_document_requirements.loan_product_id', $loanProduct->id)
                ->where('loan_product_document_requirements.requirement_type', 'document_type')
                ->where('loan_product_document_requirements.subject_type', 'collateral')
                ->where('loan_product_document_requirements.collateral_type', strtolower($collateralType))
                ->where('loan_product_document_requirements.is_required', true)
                ->where('loan_product_document_requirements.is_active', true)
                ->whereNotNull('loan_product_document_requirements.document_type_id')
                ->where('document_types.is_active', true)
                ->orderBy('loan_product_document_requirements.sort_order')
                ->get([
                    'document_types.id',
                    'document_types.code',
                    'document_types.category',
                ]);

            if ($configuredTypes->isNotEmpty()) {
                return $configuredTypes;
            }
        }

        $categories = $this->collateralCategoriesByType($collateralType);

        if (empty($categories)) {
            return collect();
        }

        return DocumentType::query()
            ->whereIn('category', $categories)
            ->where('is_active', true)
            ->get(['id', 'code', 'category']);
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

    private function requiredLoanProductCategoryRequirements(int $loanProductId, bool $businessOnly = false)
    {
        $query = DB::table('loan_product_document_requirements')
            ->where('loan_product_id', $loanProductId)
            ->where('requirement_type', 'category')
            ->where('is_required', true)
            ->where('is_active', true)
            ->whereNotNull('document_category')
            ->orderBy('sort_order');

        if ($businessOnly) {
            $query->where('subject_type', 'business');
        } else {
            $query->whereRaw('1 = 0');
        }

        return $query->get(['document_category', 'min_count']);
    }
}
