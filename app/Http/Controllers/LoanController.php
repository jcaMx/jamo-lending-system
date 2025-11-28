<?php
namespace App\Http\Controllers;

use App\Models\Loan;
use App\Models\Collateral;
use App\Models\VehicleCollateral;
use App\Models\LandCollateral;
use App\Models\AtmCollateral; // correct class name
use App\Models\CoBorrower;
use App\Models\Files;
use App\Models\Borrower;
use App\Services\LoanService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class LoanController extends Controller
{
    protected LoanService $loanService;

    public function __construct(LoanService $loanService)
    {
        $this->loanService = $loanService;
    }

    public function store(Request $request)
    {
        // ---------------- VALIDATION ----------------
        $request->validate([
            'borrower_id' => 'required|exists:borrower,ID', // per your confirmation
            'loan_type' => 'required|string',
            'loan_amount' => 'required|numeric|min:0',
            'interest_type' => 'required|string',
            'interest_rate' => 'required|numeric|min:0',
            'repayment_frequency' => 'required|string',
            'term' => 'required|numeric|min:1',
            'collateral_type' => 'required|string|in:vehicle,land,atm',
            'ownership_proof' => 'nullable|file|max:10240',

            // Vehicle fields
            'type' => 'nullable|string|required_if:collateral_type,vehicle',
            'brand' => 'nullable|string|required_if:collateral_type,vehicle',
            'model' => 'nullable|string|required_if:collateral_type,vehicle',
            'year_model' => 'nullable|string|required_if:collateral_type,vehicle',
            'plate_no' => 'nullable|string|required_if:collateral_type,vehicle',
            'engine_no' => 'nullable|string|required_if:collateral_type,vehicle',
            'transmission_type' => 'nullable|string|required_if:collateral_type,vehicle',
            'fuel_type' => 'nullable|string|required_if:collateral_type,vehicle',

            // Land fields
            'title_no' => 'nullable|string|required_if:collateral_type,land',
            'location' => 'nullable|string|required_if:collateral_type,land',
            'area_size' => 'nullable|string|required_if:collateral_type,land',

            // ATM fields
            'bank_name' => 'nullable|string|required_if:collateral_type,atm',
            'account_no' => 'nullable|string|required_if:collateral_type,atm',
            'cardno_4digits' => 'nullable|string|required_if:collateral_type,atm',
        ]);

        DB::beginTransaction();

        try {
            // Use Borrower::findOrFail - assumes your Borrower model has $primaryKey = 'ID'
            $borrower = Borrower::findOrFail($request->borrower_id);

            // ---------------- CREATE LOAN ----------------
            $loanData = [
                'borrower_id' => $borrower->ID,
                'loan_type' => $request->loan_type,
                'principal_amount' => $request->loan_amount,
                'interest_type' => $request->interest_type,
                'interest_rate' => $request->interest_rate,
                'repayment_frequency' => $request->repayment_frequency,
                'term_months' => $request->term,
                'status' => 'Pending',
            ];

            $loan = $this->loanService->createLoan($loanData);

            // ---------------- CREATE CO-BORROWERS ----------------
            $coBorrowers = json_decode($request->input('co_borrowers', '[]'), true);
            foreach ($coBorrowers as $co) {
                CoBorrower::create([
                    'first_name' => $co['first_name'] ?? '',
                    'last_name' => $co['last_name'] ?? '',
                    'address' => $co['address'] ?? '',
                    'email' => $co['email'] ?? '',
                    'contact_no' => $co['contact'] ?? '',
                    'birth_date' => $co['birth_date'] ?? null,
                    'marital_status' => $co['marital_status'] ?? null,
                    'occupation' => $co['occupation'] ?? null,
                    'net_pay' => $co['net_pay'] ?? null,
                    'borrower_id' => $borrower->ID,
                    'loan_id' => $loan->ID, // helpful relation
                ]);
            }

            // ---------------- CREATE COLLATERAL ----------------
            $collateral = Collateral::create([
                'loan_id' => $loan->ID,
                'type' => $request->collateral_type,
                'status' => 'Pending',
                'description' => $request->description ?? null,
                'ownership_proof' => null,
                'remarks' => null,
            ]);

            // ---------------- COLLATERAL DETAILS ----------------
            switch ($request->collateral_type) {
                case 'vehicle':
                    VehicleCollateral::create([
                        'collateral_id' => $collateral->ID,
                        'type' => $request->type,
                        'brand' => $request->brand,
                        'model' => $request->model,
                        'year_model' => $request->year_model,
                        'plate_no' => $request->plate_no,
                        'engine_no' => $request->engine_no,
                        'transmission_type' => $request->transmission_type,
                        'fuel_type' => $request->fuel_type,
                    ]);
                    break;
                case 'land':
                    LandCollateral::create([
                        'collateral_id' => $collateral->ID,
                        'title_no' => $request->title_no,
                        'location' => $request->location,
                        'description' => $request->description ?? null,
                        'area_size' => $request->area_size,
                    ]);
                    break;
                case 'atm':
                    AtmCollateral::create([
                        'collateral_id' => $collateral->ID,
                        'bank_name' => $request->bank_name,
                        'account_no' => $request->account_no,
                        'cardno_4digits' => $request->cardno_4digits,
                    ]);
                    break;
            }

            // ---------------- FILE UPLOAD ----------------
            if ($request->hasFile('ownership_proof') && $request->file('ownership_proof')->isValid()) {
                $file = $request->file('ownership_proof');
                $path = $file->store('ownership_proofs', 'public');

                Files::create([
                    'borrower_id' => $borrower->ID,
                    'collateral_id' => $collateral->ID,
                    'file_type' => 'ownership_proof',
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'uploaded_at' => Carbon::now(),
                    'description' => 'Ownership proof for collateral',
                ]);

                $collateral->ownership_proof = $path;
                $collateral->save();
            }

            DB::commit();

            return redirect()->route('loans.applications')->with('success', 'Loan application created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            // Return validation-friendly error for Inertia
            return back()->withErrors(['error' => $e->getMessage()])->withInput();
        }
    }
}
    