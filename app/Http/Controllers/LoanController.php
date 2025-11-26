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

    public function viewApplication()
    {
        $loanApplication = Loan::with([
            'borrower',
            'borrower.coBorrowers',
            'collateral'
        ])->where('status', 'Pending')->get();

        return Inertia::render('Loans/ViewLoanApplication', [
            'loanApplications' => $loanApplications,
        ]);
    }

    public function approve($id)
    {
        $loan = Loan::findOrFail($id);
        $loan->status = 'Active';
        $loan->save();

        return response()->json(['message' => 'Loan approved successfully']);
    }

    public function reject($id)
    {
        $loan = Loan::findOrFail($id);
        $loan->status = 'Rejected';
        $loan->save();

        return response()->json(['message' => 'Loan rejected successfully']);
    }

}
