<?php

    namespace App\Http\Controllers;

    use Illuminate\Http\Request;
    use App\Services\LoanService;
    use App\Models\Loan;
    use App\Models\Files as FileModel;
    use Illuminate\Support\Facades\DB;
    use App\Models\Borrower;
    use App\Models\BorrowerEmployment;
    use App\Models\Spouse;
    use App\Models\CoBorrower;
    use App\Models\Files;
    use App\Models\LoanStatus;
    use Inertia\Inertia;



class LoanController extends Controller
{
    protected LoanService $loanService;
    
    public function __construct(LoanService $loanService)
    {
        $this->loanService = $loanService;
    }

    public function index()
    {
        $loanApplications = Loan::with(['borrower.coBorrowers', 'borrower.spouse', 'collateral'])
            ->where('status', LoanStatus::Pending->value)
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Loans/ViewLoanApplications', [
            'loanApplications' => $loanApplications,
            'flash' => ['success' => session('success')]
        ]);
    }



    public function store(Request $request)
    {
        $request->validate([
            'borrower.first_name' => 'required|string|max:255',
            'borrower.last_name' => 'required|string|max:255',
            'borrower.membership_date' => 'required|date',
            'borrower.birth_date' => 'required|date',
            'loan.principal_amount' => 'required|numeric',
            'loan.interest_rate' => 'required|numeric',
            'loan.interest_type' => 'required|string',
            'loan.loan_type' => 'required|string',
            'loan.repayment_frequency' => 'required|string',
            'loan.term_months' => 'required|integer',
        ]);

        DB::beginTransaction();

        try {
            $borrowerData = $request->input('borrower');
            $borrower = Borrower::create($borrowerData);

            $employmentData = $request->input('employment');
            $employment = new BorrowerEmployment($employmentData);
            $borrower->borrowerEmployment()->save($employment);

            if ($request->filled('coBorrowers')) {
                foreach ($request->input('coBorrowers') as $co) {
                    $borrower->coBorrowers()->create($co);
                }
            }

            $loanData = $request->input('loan');
            $loanData['borrower_id'] = $borrower->ID;
            $loan =$this->loanService->createLoan($loanData);

            if ($request->hasFile('borrowerPhoto')) {
                $path = $request->file('borrowerPhoto')->store('borrower');
                Files::create([
                    'file_type' => 'borrower_photo',
                    'file_name' => basename($path),
                    'file_path' => $path,
                    'borrower_id' => $borrower->ID,
                ]);
            }

            DB::commit();   

            return redirect()->route('loans.view')->with('success', 'Loan application created successfully!');

        } catch (\Throwable $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create loan application',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
