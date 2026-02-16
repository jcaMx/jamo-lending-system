<?php

namespace App\Http\Controllers;

use App\Factories\CollateralFactory;
use App\Http\Requests\StoreLoanRequest;
use App\Models\Borrower;
use App\Models\Files;
use App\Models\Formula;
use App\Models\Loan;
use App\Services\LoanService;
use App\Models\LoanComment;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    protected LoanService $loanService;
    public function __construct(LoanService $loanService)
    {
        $this->loanService = $loanService;
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
        $borrowers = Borrower::orderBy('last_name')->orderBy('first_name')->get()->map(function ($b) {
            return [
                'id' => $b->ID,
                'name' => $b->first_name.' '.$b->last_name,
            ];
        });

        return Inertia::render('Loans/AddLoan', [
            'borrowers' => $borrowers,
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
            ];
            $loan = $this->loanService->createLoan($loanData);

            $collateral = null;
            $collateralTypeInput = $request->input('collateral_type');
            if ($collateralTypeInput) {
                // Create Collateral using CollateralFactory
                $collateralType = match($collateralTypeInput) {
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

            // Create Co-Borrowers
            if ($request->filled('coBorrowers')) {
                foreach ($request->input('coBorrowers') as $coBorrowerData) {
                    $borrower->coBorrowers()->create([
                        'first_name' => $coBorrowerData['first_name'] ?? '',
                        'last_name' => $coBorrowerData['last_name'] ?? '',
                        'address' => $coBorrowerData['address'] ?? '',
                        'email' => $coBorrowerData['email'] ?? '',
                        'contact_no' => $coBorrowerData['contact'] ?? '',
                        'birth_date' => $coBorrowerData['birth_date'] ?? null,
                        'marital_status' => $coBorrowerData['marital_status'] ?? '',
                        'occupation' => $coBorrowerData['occupation'] ?? '',
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('loans.view')->with('success', 'Loan application created successfully!');

        } catch (\Throwable $e) {
            DB::rollBack();

            return back()->withErrors([
                'error' => 'Failed to create loan application: '.$e->getMessage(),
            ])->withInput();
        }
    }

    public function show(Loan $loan)
    {
        $loan->load([
            'borrower',
            'borrower.files',
            'borrower.coBorrowers',
            'borrower.spouse',
            'borrower.borrowerEmployment',
            'borrower.borrowerAddress',
            'collateral',
            'collateral.landDetails',
            'collateral.vehicleDetails',
            'collateral.atmDetails',
            'collateral.files',
            'amortizationSchedules',
            'formula',
            'loanComments' => function ($query) {
                    $query->orderBy('comment_date', 'desc');
            }
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

        return Inertia::render('Loans/ShowLoan', [
            'loan' => $loan,
        ]);
    }

    public function approve(Loan $loan)
    {
        try {
            $approvedBy = auth()->id();
            if (! $approvedBy) {
                return back()->withErrors(['error' => 'User not authenticated.']);
            }

            $request = request();
            $releasedAmount = $request->input('released_amount');

            if (! $releasedAmount || $releasedAmount <= 0) {
                return back()->withErrors(['error' => 'Released amount is required and must be greater than 0.']);
            }

            $this->loanService->approveLoan($loan, $approvedBy, (float) $releasedAmount);

            return redirect()->route('loans.view-approved')->with('success', 'Loan approved successfully!');
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
        $loans = $this->loanService->getApprovedLoans();

        // Load borrower addresses for each loan
        $loans = $loans->map(function ($loan) {
            $loan->borrower->load('borrowerAddress');
            $loan->load('amortizationSchedules');

            return $loan;
        });

        return Inertia::render('Loans/ViewLoans', [
            'loans' => $loans,
        ]);
    }

    public function showSchedule(Loan $loan)
    {
        $loan->load(['amortizationSchedules', 'borrower.borrowerAddress']);

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

    public function addComment(Loan $loan, Request $request)
    {
        // Validation
        $request->validate([
            'comment_text' => 'required|string|max:1000',
        ]);

        // Use the relationship to create comment
        $comment = $loan->loanComments()->create([
            'comment_text' => $request->input('comment_text'),
            'commented_by' => auth()->id(),
            'comment_date' => now(),
        ]);

        return back()->with('success', 'Comment added successfully.');
    }


    public function deleteComment(LoanComment $comment)
    {
        try {
            $comment->delete();

            return back()->with('success', 'Comment deleted successfully!');
        } catch (\Throwable $e) {
            return back()->withErrors(['error' => 'Failed to delete comment: '.$e->getMessage()]);
        }
    }

}
