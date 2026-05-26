<?php

namespace App\Http\Controllers;

use App\Factories\CollateralFactory;
use App\Http\Requests\StoreLoanRequest;
use App\Models\Borrower;
use App\Models\DocumentType;
use App\Models\File;
use App\Models\Files;
use App\Models\Formula;
use App\Models\Loan;
use App\Models\LoanProduct;
use App\Services\DisbursementService;
use App\Services\LoanService;
use App\Services\RuleEvaluatorService;
use App\Models\LoanComment;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Http\Request;


class LoanController extends Controller
{
    protected LoanService $loanService;
    protected DisbursementService $disbursementService;

    public function __construct(LoanService $loanService, DisbursementService $disbursementService)
    {
        $this->loanService = $loanService;
        $this->disbursementService = $disbursementService;
    }

    public function index()
    {
        $loanApplications = Loan::with([
            'borrower',
        ])
            ->where('status', 'Pending')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Loans/VLA', [
            'loanApplications' => $loanApplications,
            'flash' => ['success' => session('success')],
        ]);
    }

    public function add()
    {
        // Get blocked borrower IDs first
        $blockedBorrowerIds = Loan::whereRaw('LOWER(status) IN (?, ?)', ['pending', 'active'])
            ->pluck('borrower_id')
            ->flip();

        $borrowers = Borrower::with('coBorrowers')
            ->orderBy('last_name')
            ->orderBy('first_name')
            ->get()
            ->map(function ($b) use ($blockedBorrowerIds) {
                return [
                    'id' => $b->ID,
                    'name' => $b->first_name . ' ' . $b->last_name,

                    // ✅ retain blocked borrower logic
                    'has_active_or_pending_loan' => $blockedBorrowerIds->has((int) $b->ID),

                    // ✅ retain coBorrowers
                    'coBorrowers' => $b->coBorrowers->map(function ($coBorrower) {
                        return [
                            'first_name' => $coBorrower->first_name ?? '',
                            'last_name' => $coBorrower->last_name ?? '',
                            'address' => $coBorrower->address ?? '',
                            'email' => $coBorrower->email ?? '',
                            'contact' => $coBorrower->contact_no ?? '',
                            'birth_date' => $coBorrower->birth_date 
                                ? \Carbon\Carbon::parse($coBorrower->birth_date)->toDateString() 
                                : '',
                            'marital_status' => $coBorrower->marital_status ?? '',
                            'occupation' => $coBorrower->occupation ?? '',
                            'net_pay' => '',
                        ];
                    })->values()->all(),
                ];
            })
            ->values();

        $documentTypesByCategory = DocumentType::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'code', 'name', 'category'])
            ->groupBy('category')
            ->map(fn ($items) => $items->values())
            ->toArray();

        return Inertia::render('Loans/AddLoan', [
            'borrowers' => $borrowers,
            'documentTypesByCategory' => $documentTypesByCategory,
        ]);
    }

    public function store(StoreLoanRequest $request)
    {
        DB::beginTransaction();

        try {
            // Get borrower by ID (borrower should already exist)
            $borrowerId = $request->input('borrower_id');
            if (! $borrowerId) {
                throw new \Exception('Borrower ID is required.');
            }

            $borrower = Borrower::find($borrowerId);
            if (! $borrower) {
                throw new \Exception('Borrower not found.');
            }

            // Reloan Policy: Check if borrower has existing unpaid loan
            $existingUnpaidLoan = Loan::where('borrower_id', $borrower->ID)
                ->whereIn('status', ['Pending', 'Active'])
                ->where('balance_remaining', '>', 0)
                ->first();

            if ($existingUnpaidLoan) {
                throw new \Exception('Borrower cannot reloan. An existing unpaid loan (ID: '.$existingUnpaidLoan->ID.') is still active.');
            }

            $collateralTypeInput = strtolower((string) $request->input('collateral_type', ''));
            $submittedCollateralRows = collect($request->input('documents.collateral', []));
            $requiredCollateralDocumentTypeIds = $this->requiredCollateralDocumentTypeIds(
                $request->integer('loan_product_id') ?: null,
                $request->input('loan_type'),
                $collateralTypeInput
            );

            if ($requiredCollateralDocumentTypeIds->isNotEmpty()) {
                $requiredIds = $requiredCollateralDocumentTypeIds->all();
                $submittedTypeIds = $submittedCollateralRows
                    ->pluck('document_type_id')
                    ->filter()
                    ->map(fn ($id) => (int) $id)
                    ->values()
                    ->all();

                $invalidTypeIds = array_values(array_diff($submittedTypeIds, $requiredIds));
                if (! empty($invalidTypeIds)) {
                    throw new \Exception('Selected collateral document type(s) are not valid for the chosen loan product and collateral type.');
                }

                $submittedTypeIdsWithFiles = $submittedCollateralRows
                    ->map(function ($row, $index) use ($request) {
                        $documentTypeId = isset($row['document_type_id']) ? (int) $row['document_type_id'] : null;
                        $hasFile = $request->hasFile("documents.collateral.{$index}.file");

                        return $documentTypeId && $hasFile ? $documentTypeId : null;
                    })
                    ->filter()
                    ->values()
                    ->all();

                $missingRequiredIds = array_values(array_diff($requiredIds, $submittedTypeIdsWithFiles));
                if (! empty($missingRequiredIds)) {
                    throw new \Exception('Please upload all required collateral documents for the selected loan product.');
                }
            }

            // Get default formula (Compound Interest Loan)
            $formula = Formula::where('name', 'Compound Interest Loan')->first();
            if (! $formula) {
                throw new \Exception('Default formula not found. Please run FormulaSeeder.');
            }

            // Create Loan using LoanService
            $loanData = [
                'borrower_id' => $borrower->ID,
                'loan_type' => $request->input('loan_type'),
                'principal_amount' => $request->input('loan_amount'),
                'interest_type' => $request->input('interest_type'),
                'interest_rate' => $request->input('interest_rate'),
                'repayment_frequency' => $request->input('repayment_frequency'),
                'term_months' => (int) $request->input('term'),
                'status' => 'Pending',
                'formula_id' => $formula->ID,
                'prepared_by' => auth()->id(),
            ];
            $loan = $this->loanService->createLoan($loanData);

            if ($request->has('monthly_income')) {
                $borrower->update([
                    'monthly_income' => $request->input('monthly_income')
                ]);
            }
            $collateral = null;
            if ($collateralTypeInput) {
                // Create Collateral using CollateralFactory
                $collateralType = match ($collateralTypeInput) {
                    'vehicle' => 'Vehicle',
                    'land' => 'Land',
                    'atm' => 'ATM',
                    default => ucfirst((string) $collateralTypeInput)
                };
                $collateralData = [
                    'loan_id' => $loan->ID,
                    'status' => 'Pending',
                ];

                // Add type-specific collateral data
                if ($collateralTypeInput === 'vehicle') {
                    $collateralData['brand'] = $request->input('make');
                    $collateralData['model'] = $request->input('series') ?? '';
                    $collateralData['year_model'] = $request->input('year_model');
                    $collateralData['plate_no'] = $request->input('plate_no');
                    $collateralData['engine_no'] = $request->input('engine_no');
                    $collateralData['fuel_type'] = $request->input('fuel');
                    $collateralData['vehicle_type'] = $request->input('vehicle_type'); // Vehicle type (Car, Motorcycle, Truck)
                    $collateralData['transmission_type'] = $request->input('transmission_type'); // Transmission type (Manual, Automatic)
                } elseif ($collateralTypeInput === 'land') {
                    $collateralData['titleNo'] = $request->input('certificate_of_title_no');
                    $collateralData['lotNo'] = 0; // Default if not provided
                    $collateralData['location'] = $request->input('location');
                    $collateralData['areaSize'] = $request->input('area') ?? '';
                    $collateralData['description'] = $request->input('description');
                } elseif ($collateralTypeInput === 'atm') {
                    $collateralData['bank_name'] = $request->input('bank_name');
                    $collateralData['account_no'] = $request->input('account_no');
                    $collateralData['cardno_4digits'] = (int) $request->input('cardno_4digits');
                }

                // Create Collateral first (needed for file relationship)
                $collateral = CollateralFactory::createCollateral($collateralType, $collateralData);
            }

            if ($collateral && $submittedCollateralRows->isNotEmpty()) {
                foreach ($submittedCollateralRows as $index => $documentRow) {
                    $uploadedFile = $request->file("documents.collateral.{$index}.file");
                    $documentTypeId = isset($documentRow['document_type_id']) ? (int) $documentRow['document_type_id'] : null;

                    if (! $uploadedFile || ! $documentTypeId) {
                        continue;
                    }

                    $storedPath = $uploadedFile->store("collateral/{$collateral->ID}", 'public');

                    File::create([
                        'documentable_id' => $collateral->ID,
                        'documentable_type' => \App\Models\Collateral::class,
                        'document_type_id' => $documentTypeId,
                        'status' => 'pending',
                        'file_name' => $uploadedFile->getClientOriginalName(),
                        'file_path' => $storedPath,
                        'uploaded_at' => now(),
                        'description' => 'collateral_requirement_upload',
                        'borrower_id' => $borrower->ID,
                        'collateral_id' => $collateral->ID,
                    ]);
                }
            }

            $submittedLoanProductRows = collect($request->input('documents.loan_product', []));
            if ($submittedLoanProductRows->isNotEmpty()) {
                foreach ($submittedLoanProductRows as $index => $documentRow) {
                    $uploadedFile = $request->file("documents.loan_product.{$index}.file");
                    $documentTypeId = isset($documentRow['document_type_id']) ? (int) $documentRow['document_type_id'] : null;
                    $documentCategory = isset($documentRow['document_category']) ? (string) $documentRow['document_category'] : 'loan_product';

                    if (! $uploadedFile || ! $documentTypeId) {
                        continue;
                    }

                    $storedPath = $uploadedFile->store("borrowers/{$borrower->ID}/loan-product", 'public');

                    File::create([
                        'documentable_id' => $borrower->ID,
                        'documentable_type' => \App\Models\Borrower::class,
                        'document_type_id' => $documentTypeId,
                        'status' => 'pending',
                        'file_name' => $uploadedFile->getClientOriginalName(),
                        'file_path' => $storedPath,
                        'uploaded_at' => now(),
                        'description' => 'loan_product_requirement:'.$documentCategory,
                        'borrower_id' => $borrower->ID,
                        'collateral_id' => $collateral?->ID,
                    ]);
                }
            }

            $submittedLoanProductRows = collect($request->input('documents.loan_product', []));
            if ($submittedLoanProductRows->isNotEmpty()) {
                foreach ($submittedLoanProductRows as $index => $documentRow) {
                    $uploadedFile = $request->file("documents.loan_product.{$index}.file");
                    $documentTypeId = isset($documentRow['document_type_id']) ? (int) $documentRow['document_type_id'] : null;
                    $documentCategory = isset($documentRow['document_category']) ? (string) $documentRow['document_category'] : null;

                    if (! $uploadedFile || ! $documentTypeId) {
                        continue;
                    }

                    $storedPath = $uploadedFile->store("borrowers/{$borrower->ID}/loan-product", 'public');

                    File::create([
                        'documentable_id' => $borrower->ID,
                        'documentable_type' => \App\Models\Borrower::class,
                        'document_type_id' => $documentTypeId,
                        'status' => 'pending',
                        'file_name' => $uploadedFile->getClientOriginalName(),
                        'file_path' => $storedPath,
                        'uploaded_at' => now(),
                        'description' => $documentCategory ? "loan_product_requirement:{$documentCategory}" : 'loan_product_requirement',
                        'borrower_id' => $borrower->ID,
                        'collateral_id' => $collateral?->ID,
                    ]);
                }
            }

            // Handle ownership proof file upload
            if ($collateral && $request->hasFile('ownership_proof')) {
                $path = $request->file('ownership_proof')->store('collateral', 'public');
                $file = Files::create([
                    'file_type' => 'ownership_proof',
                    'file_name' => basename($path),
                    'file_path' => $path,
                    'collateral_id' => $collateral->ID,
                ]);
                $collateral->ownership_proof = $file->ID;
                $collateral->save();
            }

            // Co-borrowers are borrower-level in the current schema, so we replace the
            // borrower's saved set with the set explicitly chosen during this loan application.
            $borrower->coBorrowers()->delete();

            if ($request->filled('coBorrowers')) {
                foreach ($request->input('coBorrowers') as $coBorrowerData) {
                    $borrower->coBorrowers()->create([
                        'first_name' => $coBorrowerData['first_name'] ?? '',
                        'last_name' => $coBorrowerData['last_name'] ?? '',
                        'address' => !empty($coBorrowerData['address']) ? $coBorrowerData['address'] : 'N/A',
                        'email' => $coBorrowerData['email'] ?? '',
                        'contact_no' => !empty($coBorrowerData['contact']) ? $coBorrowerData['contact'] : (!empty($coBorrowerData['mobile']) ? $coBorrowerData['mobile'] : '09000000000'),
                        'birth_date' => !empty($coBorrowerData['birth_date']) ? $coBorrowerData['birth_date'] : '1990-01-01',
                        'marital_status' => $coBorrowerData['marital_status'] ?? '',
                        'occupation' => $coBorrowerData['occupation'] ?? '',
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('loans.show', $loan->ID)->with('success', 'Loan application created successfully!');

        } catch (\Throwable $e) {
            DB::rollBack();

            return back()->withErrors([
                'error' => 'Failed to create loan application: '.$e->getMessage(),
            ])->withInput();
        }
    }

    public function evaluateRules(Request $request, RuleEvaluatorService $ruleEvaluator)
    {
        $loanProductId = $request->integer('loan_product_id') ?: null;
        $loanType = $request->input('loan_type');
        $loanAmount = (float) $request->input('loan_amount', 0);
        $borrowerId = $request->integer('borrower_id') ?: null;

        $loanProduct = $this->resolveLoanProduct($loanProductId, $loanType);

        if (! $loanProduct) {
            return response()->json([
                'collateral' => false,
                'coborrower' => false,
            ]);
        }

        $requirements = $ruleEvaluator->evaluate($loanProduct, $borrowerId, [
            'loan_amount' => $loanAmount,
            'term' => $request->input('term'),
            'monthly_income' => $request->input('monthly_income'),
            'dti_ratio' => $request->input('dti_ratio'),
            'monthly_obligation' => $request->input('monthly_obligation'),
        ]);

        return response()->json($requirements);
    }

    public function show(Loan $loan)
    {
        if ($loan->status === 'Active') {
            $this->loanService->calculatePenalties($loan);
            $loan->refresh();
        }

        $loan->load([
            'borrower',
            'borrower.files.documentType',
            'borrower.coBorrowers',
            'borrower.spouse',
            'borrower.borrowerEmployment',
            'borrower.borrowerAddress',
            'collateral',
            'collateral.landDetails',
            'collateral.vehicleDetails',
            'collateral.atmDetails',
            'collateral.files.documentType',
            'amortizationSchedules.penalties',
            'formula',
            'preparer',
            'loanComments' => function ($query) {
                $query->orderBy('comment_date', 'desc');
            },
        ]);

        if ($loan->relationLoaded('loanComments')) {
            $loan->setRelation(
                'loanComments',
                $loan->loanComments
                    ->load('user')
                    ->map(fn (LoanComment $comment) => [
                        'ID' => $comment->ID,
                        'comment_text' => $comment->comment_text,
                        'commented_by' => $comment->user?->name ?? 'Unknown',
                        'comment_date' => optional($comment->comment_date)?->toISOString(),
                    ])
            );
        }

        $loanData = $loan->toArray();
        $loanData['amortizationSchedules'] = $loan->amortizationSchedules
            ->sortBy('installment_no')
            ->map(fn ($schedule) => [
                'ID' => $schedule->ID,
                'installment_no' => $schedule->installment_no,
                'installment_amount' => (float) $schedule->installment_amount,
                'interest_amount' => (float) $schedule->interest_amount,
                'penalty_amount' => (float) $schedule->penalty_amount,
                'amount_paid' => (float) $schedule->amount_paid,
                'rebate_amount' => (float) $schedule->rebate_amount,
                'due_date' => $schedule->due_date?->toDateString(),
                'status' => $schedule->status?->value ?? $schedule->status ?? 'Unpaid',
            ])
            ->values()
            ->all();
        unset($loanData['amortization_schedules']);
        $loanData['loanComments'] = $loan->relationLoaded('loanComments')
            ? $loan->loanComments->values()->all()
            : [];
        $loanData['has_completed_disbursement'] = $loan->disbursements()
            ->where('status', 'Completed')
            ->exists();
        $loanData['releasing_fees'] = $this->disbursementService->getHistoricalOrCurrentFeeBreakdown($loan);
        $loanData['prepared_by_name'] = $loan->preparer?->name ?? 'System';

        if ($loan->borrower) {
            $loanData['borrower'] = [
                'ID' => $loan->borrower->ID,
                'first_name' => $loan->borrower->first_name,
                'last_name' => $loan->borrower->last_name,
                'email' => $loan->borrower->email,
                'contact_no' => $loan->borrower->contact_no,
                'land_line' => $loan->borrower->land_line,
                'gender' => $loan->borrower->gender,
                'marital_status' => $loan->borrower->marital_status,
                'birth_date' => optional($loan->borrower->birth_date)?->toDateString(),
                'age' => $loan->borrower->birth_date ? \Carbon\Carbon::parse($loan->borrower->birth_date)->age : null,
                'home_ownership' => $loan->borrower->home_ownership,
                'address' => $loan->borrower->borrowerAddress?->address,
                'city' => $loan->borrower->borrowerAddress?->city,
                'occupation' => $loan->borrower->borrowerEmployment?->occupation,
                'coBorrowers' => $loan->borrower->coBorrowers?->values()->all() ?? [],
                'spouse' => $loan->borrower->spouse?->toArray(),
                'borrowerEmployment' => $loan->borrower->borrowerEmployment?->toArray(),
                'borrowerAddress' => $loan->borrower->borrowerAddress?->toArray(),
                'files' => $this->formatDocumentFiles($loan->borrower->files),
            ];
        }

        if ($loan->collateral) {
            $loanData['collateral']['files'] = $this->formatDocumentFiles($loan->collateral->files);
        }

        return Inertia::render('Loans/ShowLoan', [
            'loan' => $loanData,
        ]);
    }

    public function approve(Loan $loan)
    {
        try {
            $approvedBy = Auth::id();
            if (! $approvedBy) {
                return back()->withErrors(['error' => 'User not authenticated.']);
            }

            $this->loanService->approveLoan($loan, $approvedBy);

            return redirect()->route('loans.view-approved')->with('success', 'Loan approved. Proceed to Disbursement for fund release.');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Failed to approve loan: '.$e->getMessage()]);
        }
    }

    public function reject(Loan $loan)
    {
        try {
            $this->loanService->rejectLoan($loan);

            return redirect()->route('loans.view')->with('success', 'Loan rejected successfully!');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Failed to reject loan: '.$e->getMessage()]);
        }
    }

    public function threeMonthLate()
    {
        $loans = $this->loanService->getThreeMonthLateLoans();

        return Inertia::render('Loans/3MLL', [
            'loans' => $loans,
        ]);
    }

    public function oneMonthLate()
    {
        $loans = $this->loanService->getOneMonthLateLoans();

        return Inertia::render('Loans/1MLL', [
            'loans' => $loans,
        ]);
    }

    public function pastMaturityDate()
    {
        $loans = $this->loanService->getPastMaturityDateLoans();

        return Inertia::render('Loans/PMD', [
            'loans' => $loans,
        ]);
    }

    public function viewApproved()
    {
        $loans = $this->loanService->getApprovedLoans()->loadCount(['disbursements', 'payments']);

        // Load borrower addresses for each loan
        $loans = $loans->map(function ($loan) {
            $loan->borrower->load('borrowerAddress');
            $loan->load('amortizationSchedules');
            $loan->setAttribute(
                'can_delete',
                (float) ($loan->released_amount ?? 0) <= 0
                && (int) ($loan->disbursements_count ?? 0) === 0
                && (int) ($loan->payments_count ?? 0) === 0
            );

            return $loan;
        });

        return Inertia::render('Loans/ViewLoans', [
            'loans' => $loans,
        ]);
    }

    public function destroy(Loan $loan)
    {
        /** @var \App\Models\User|null $user */
        $user = Auth::user();
        if (! $user?->hasRole('admin')) {
            abort(403, 'Only admin can delete loans.');
        }

        $loan->loadCount(['disbursements', 'payments']);

        $canDelete = (float) ($loan->released_amount ?? 0) <= 0
            && (int) $loan->disbursements_count === 0
            && (int) $loan->payments_count === 0;

        if (! $canDelete) {
            return back()->withErrors(['error' => 'Only unreleased loans without disbursements or payments can be deleted.']);
        }

        try {
            DB::transaction(function () use ($loan) {
                $loan->load(['collateral', 'amortizationSchedules', 'loanComments']);

                if ($loan->loanComments()->exists()) {
                    $loan->loanComments()->delete();
                }

                if ($loan->amortizationSchedules()->exists()) {
                    $loan->amortizationSchedules()->delete();
                }

                if ($loan->collateral) {
                    $loan->collateral->delete();
                }

                $loan->delete();
            });

            return back()->with('success', 'Loan deleted successfully.');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Failed to delete loan: ' . $e->getMessage()]);
        }
    }

    public function showSchedule(Loan $loan)
    {
        if ($loan->status === 'Active') {
            $this->loanService->calculatePenalties($loan);
            $loan->refresh();
        }

        $loan->load(['amortizationSchedules.penalties', 'borrower.borrowerAddress']);

        // Format the loan data to ensure schedules are properly serialized
        $loanData = [
            'ID' => $loan->ID,
            'principal_amount' => (float) $loan->principal_amount,
            'released_amount' => $loan->released_amount ? (float) $loan->released_amount : null,
            'interest_rate' => (float) $loan->interest_rate,
            'term_months' => $loan->term_months,
            'repayment_frequency' => $loan->repayment_frequency,
            'borrower' => [
                'ID' => $loan->borrower->ID,
                'first_name' => $loan->borrower->first_name,
                'last_name' => $loan->borrower->last_name,
            ],
            'amortizationSchedules' => $loan->amortizationSchedules->map(function ($schedule) {
                return [
                    'ID' => $schedule->ID,
                    'installment_no' => $schedule->installment_no,
                    'installment_amount' => (float) $schedule->installment_amount,
                    'interest_amount' => (float) $schedule->interest_amount,
                    'penalty_amount' => (float) $schedule->penalty_amount,
                    'amount_paid' => (float) $schedule->amount_paid,
                    'rebate_amount' => (float) $schedule->rebate_amount,
                    'due_date' => $schedule->due_date?->toDateString(),
                    'status' => $schedule->status?->value ?? $schedule->status ?? 'Unpaid',
                ];
            })->values()->all(),
        ];

        return Inertia::render('Loans/LoanSchedule', [
            'loan' => $loanData,
        ]);
    }

    public function close(Loan $loan)
    {
        try {
            $this->loanService->closeLoan($loan);

            return redirect()->back()->with('success', 'Loan closed successfully!');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Failed to close loan: '.$e->getMessage()]);
        }
    }

    public function updateBorrowerDetails(Loan $loan, Request $request)
    {
        $loan->loadMissing(['borrower.borrowerAddress', 'borrower.borrowerEmployment']);

        $validated = $request->validate([
            'email' => 'nullable|email|max:100',
            'contact_no' => 'nullable|string|max:20',
            'land_line' => 'nullable|string|max:20',
            'occupation' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:100',
            'files' => 'nullable|array',
            'files.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx|max:5120',
        ]);

        try {
            DB::transaction(function () use ($loan, $validated, $request) {
                $borrower = $loan->borrower;

                $borrower->update([
                    'email' => $validated['email'] ?? $borrower->email,
                    'contact_no' => $validated['contact_no'] ?? $borrower->contact_no,
                    'land_line' => $validated['land_line'] ?? $borrower->land_line,
                ]);

                if (
                    array_key_exists('address', $validated)
                    || array_key_exists('city', $validated)
                ) {
                    $address = $borrower->borrowerAddress()->first();

                    if ($address) {
                        $address->update([
                            'address' => $validated['address'] ?? $address->address,
                            'city' => $validated['city'] ?? $address->city,
                        ]);
                    } elseif (
                        ! empty($validated['address'] ?? null)
                        || ! empty($validated['city'] ?? null)
                    ) {
                        $borrower->borrowerAddress()->create([
                            'borrower_id' => $borrower->ID,
                            'address' => $validated['address'] ?? '',
                            'city' => $validated['city'] ?? '',
                        ]);
                    }
                }

                if (array_key_exists('occupation', $validated)) {
                    $employment = $borrower->borrowerEmployment()->first();

                    if ($employment) {
                        $employment->update([
                            'occupation' => $validated['occupation'],
                        ]);
                    } elseif (! empty($validated['occupation'] ?? null)) {
                        // monthly_income is required by the current schema, so create a minimal row safely.
                        $borrower->borrowerEmployment()->create([
                            'borrower_id' => $borrower->ID,
                            'occupation' => $validated['occupation'],
                            'monthly_income' => 0,
                        ]);
                    }
                }

                foreach ($request->file('files', []) as $file) {
                    $storedPath = $file->store("borrowers/{$borrower->ID}/manual", 'public');

                    Files::create([
                        'file_type' => 'contract',
                        'file_name' => $file->getClientOriginalName(),
                        'file_path' => $storedPath,
                        'uploaded_at' => now(),
                        'description' => 'borrower_file',
                        'borrower_id' => $borrower->ID,
                        'collateral_id' => null,
                    ]);
                }
            });

            return redirect()->route('loans.show', $loan->ID)->with('success', 'Borrower information updated successfully.');
        } catch (\Throwable $e) {
            return redirect()->route('loans.show', $loan->ID)->withErrors(['error' => 'Failed to update borrower information: '.$e->getMessage()]);
        }
    }

    public function destroyBorrowerFile(Loan $loan, Files $file)
    {
        if ((int) $file->borrower_id !== (int) $loan->borrower_id) {
            abort(404);
        }

        try {
            if ($file->file_path) {
                Storage::disk('public')->delete($file->file_path);
            }

            $file->delete();

            return back()->with('success', 'Borrower file deleted successfully.');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Failed to delete borrower file: '.$e->getMessage()]);
        }
    }

    public function updateCollateral(Loan $loan, Request $request)
    {
        $loan->loadMissing(['collateral.landDetails', 'collateral.vehicleDetails', 'collateral.atmDetails']);

        if (! $loan->collateral) {
            return back()->withErrors(['error' => 'This loan has no collateral to update.']);
        }

        $validated = $request->validate([
            'estimated_value' => 'nullable|numeric|min:0',
            'description' => 'nullable|string|max:100',
            'remarks' => 'nullable|string|max:100',
            'land_details' => 'nullable|array',
            'land_details.titleNo' => 'nullable|integer',
            'land_details.location' => 'nullable|string|max:50',
            'land_details.areaSize' => 'nullable|string|max:20',
            'vehicle_details' => 'nullable|array',
            'vehicle_details.type' => 'nullable|in:Car,Motorcycle,Truck',
            'vehicle_details.brand' => 'nullable|string|max:20',
            'vehicle_details.model' => 'nullable|string|max:20',
            'vehicle_details.year_model' => 'nullable|integer',
            'vehicle_details.plate_no' => 'nullable|string|max:20',
            'vehicle_details.engine_no' => 'nullable|string|max:20',
            'vehicle_details.transmission_type' => 'nullable|in:Manual,Automatic',
            'vehicle_details.fuel_type' => 'nullable|string|max:20',
            'atm_details' => 'nullable|array',
            'atm_details.bank_name' => 'nullable|string|max:50',
            'atm_details.account_no' => 'nullable|string|max:20',
            'atm_details.cardno_4digits' => 'nullable|digits:4',
        ]);

        try {
            DB::transaction(function () use ($loan, $validated) {
                $collateral = $loan->collateral;

                $collateral->update([
                    'estimated_value' => $validated['estimated_value'] ?? $collateral->estimated_value,
                    'description' => $validated['description'] ?? $collateral->description,
                    'remarks' => $validated['remarks'] ?? $collateral->remarks,
                ]);

                if ($collateral->type === 'Land' && isset($validated['land_details'])) {
                    $collateral->landDetails?->update($validated['land_details']);
                }

                if ($collateral->type === 'Vehicle' && isset($validated['vehicle_details'])) {
                    $collateral->vehicleDetails?->update($validated['vehicle_details']);
                }

                if ($collateral->type === 'ATM' && isset($validated['atm_details'])) {
                    $collateral->atmDetails?->update($validated['atm_details']);
                }
            });

            return back()->with('success', 'Collateral information updated successfully.');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Failed to update collateral information: '.$e->getMessage()]);
        }
    }

    public function storeCollateralFiles(Loan $loan, Request $request)
    {
        $loan->loadMissing('collateral');

        if (! $loan->collateral) {
            return back()->withErrors(['error' => 'This loan has no collateral for file upload.']);
        }

        $validated = $request->validate([
            'files' => 'required|array|min:1',
            'files.*' => 'file|mimes:jpg,jpeg,png,pdf,doc,docx|max:5120',
        ]);

        try {
            foreach ($request->file('files', []) as $file) {
                $storedPath = $file->store("collateral/{$loan->collateral->ID}", 'public');

                Files::create([
                    'file_type' => 'collateral_document',
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $storedPath,
                    'uploaded_at' => now(),
                    'description' => 'collateral_file',
                    'borrower_id' => $loan->borrower_id,
                    'collateral_id' => $loan->collateral->ID,
                ]);
            }

            return back()->with('success', 'Collateral files uploaded successfully.');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Failed to upload collateral files: '.$e->getMessage()]);
        }
    }

    public function destroyCollateralFile(Loan $loan, Files $file)
    {
        $loan->loadMissing('collateral');

        if (! $loan->collateral || (int) $file->collateral_id !== (int) $loan->collateral->ID) {
            abort(404);
        }

        try {
            if ($file->file_path) {
                Storage::disk('public')->delete($file->file_path);
            }

            $file->delete();

            return back()->with('success', 'Collateral file deleted successfully.');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Failed to delete collateral file: '.$e->getMessage()]);
        }
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

    private function requiredCollateralDocumentTypeIds(?int $loanProductId, ?string $loanType, ?string $collateralType)
    {
        $loanProduct = $this->resolveLoanProduct($loanProductId, $loanType);

        if (! $loanProduct || empty($collateralType)) {
            return collect();
        }

        return DB::table('loan_product_document_requirements')
            ->where('loan_product_id', $loanProduct->id)
            ->where('requirement_type', 'document_type')
            ->where('subject_type', 'collateral')
            ->where('collateral_type', strtolower((string) $collateralType))
            ->where('is_required', true)
            ->where('is_active', true)
            ->whereNotNull('document_type_id')
            ->orderBy('sort_order')
            ->pluck('document_type_id')
            ->map(fn ($id) => (int) $id)
            ->values();
    }

    private function formatDocumentFiles($files): array
    {
        $files = collect($files);

        $fallbackDocumentTypeNames = DocumentType::query()
            ->whereIn(
                'id',
                $files
                    ->map(fn ($file) => $this->extractDocumentTypeIdFromDescription($file->description))
                    ->filter()
                    ->unique()
                    ->values()
                    ->all()
            )
            ->pluck('name', 'id');

        return $files
            ->map(fn ($file) => [
                'ID' => $file->ID ?? $file->id ?? null,
                'id' => $file->ID ?? $file->id ?? null,
                'file_name' => $file->file_name,
                'file_path' => $file->file_path,
                'description' => $this->normalizeFileDescription($file->description),
                'document_type_name' => $file->documentType?->name
                    ?? $fallbackDocumentTypeNames->get($this->extractDocumentTypeIdFromDescription($file->description)),
                'uploaded_at' => $file->uploaded_at
                    ? (is_object($file->uploaded_at) && method_exists($file->uploaded_at, 'toISOString')
                        ? $file->uploaded_at->toISOString()
                        : (string) $file->uploaded_at)
                    : null,
            ])
            ->filter(fn ($file) => ! empty($file['file_path']))
            ->values()
            ->all();
    }

    private function extractDocumentTypeIdFromDescription(?string $description): ?int
    {
        if (! $description) {
            return null;
        }

        if (preg_match('/type_id\s*:\s*(\d+)/i', $description, $matches) === 1) {
            return (int) $matches[1];
        }

        return null;
    }

    private function normalizeFileDescription(?string $description): ?string
    {
        if (! $description) {
            return null;
        }

        $cleaned = preg_replace('/\s*\(type_id\s*:\s*\d+\)\s*/i', '', $description) ?? $description;
        $cleaned = trim($cleaned);

        if ($cleaned === '') {
            return null;
        }

        return str($cleaned)
            ->replace(['_', ':'], ' ')
            ->squish()
            ->title()
            ->toString();
    }
}
