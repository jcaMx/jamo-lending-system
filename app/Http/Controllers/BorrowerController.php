<?php

    namespace App\Http\Controllers;

    use App\Http\Controllers\Controller;
    use App\Models\Borrower;
    use Illuminate\Http\Request;
    use Inertia\Inertia;
    use App\Services\BorrowerService; // ✅ Add this


    class BorrowerController extends Controller
    {
        public function __construct(
            private BorrowerService $borrowerService,
        ) {}

        public function index()
        {
            $borrowers = Borrower::with('loan')->get()->map(function ($b) {
                return [
                    'id' => $b->ID,
                    'first_name' => $b->first_name,
                    'last_name' => $b->last_name,
                    'email' => $b->email,
                    'city' => $b->city,
                    'gender' => $b->gender,
                    'occupation' => $b->occupation,
                    'contact_no' => $b->contact_no,
                    'loan' => $b->loan ? [
                        'status' => $b->loan->status,
                    ] : null,
                ];
            });

            return Inertia::render('borrowers/index', [
                'borrowers' => $this->borrowerService->getBorrowersForIndex(),
            ]);
        }

        public function add()
        {
            return Inertia::render('borrowers/add');
        }

        public function show(int $id)
        {
            $payload = $this->borrowerService->getBorrowerForShow($id);

            return Inertia::render('borrowers/show', [
                'borrower' => $payload['borrower'],
                'collaterals' => $payload['collaterals'],
                'activeLoan' => $payload['activeLoan'],
                'repayments' => $payload['repayments'],
            ]);
        }
        
        public function store(Request $request)
    {
        $validated = $request->validate([
            'borrowerFirstName' => 'required|string|max:255',
            'borrowerLastName'  => 'required|string|max:255',
            'gender'            => 'required|string|max:255',
            'dateOfBirth'       => 'required|date|before_or_equal:' . now()->subYears(18)->format('Y-m-d'),
            'maritalStatus'     => 'nullable|string|in:Single,Married,Separated,Widowed',
            'homeOwnership'     => 'nullable|string|in:Owned,Mortgage,Rented',
            'permanentAddress'  => 'nullable|string|max:255',
            'city'              => 'nullable|string|max:255',
            'mobileNumber'      => ['required','regex:/^09\d{9}$/'],
            'landlineNumber'    => ['nullable','regex:/^0\d{1,2}-\d{7,8}$/'],
            'email'             => ['required','email'],
            'occupation'        => 'nullable|string|max:255',
            'dependentChild'    => 'nullable|integer|min:0',
            'netPay'            => 'nullable|numeric|min:0',
        ]);

        // Normalize the names
        $firstName = trim(strtolower($validated['borrowerFirstName']));
        $lastName  = trim(strtolower($validated['borrowerLastName']));
        $birthDate = $validated['dateOfBirth'];

        // Check for existing borrower
        $exists = Borrower::whereRaw("LOWER(TRIM(first_name)) = ?", [$firstName])
            ->whereRaw("LOWER(TRIM(last_name)) = ?", [$lastName])
            ->whereDate('birth_date', $birthDate)
            ->exists();

        if ($exists) {
            return back()->withErrors(['borrowerFirstName' => 'Borrower already exists.'])->withInput();
        }

        $borrower = $this->borrowerService->createBorrower($validated);

        return redirect()->route('borrowers.show', $borrower->ID)
            ->with('success', 'Borrower added successfully!');
    }

        
        public function update(Request $request, Borrower $borrower)
        {
            $validated = $request->validate([
                'address' => 'nullable|string|max:50',
                'city' => 'nullable|string|max:50',
                'zipcode' => 'nullable|string|max:10',
                'email' => 'nullable|email|max:100',
                'mobile' => 'nullable|string|max:20',
                'landline' => 'nullable|string|max:20',
                'occupation' => 'nullable|string|max:50',
                'gender' => 'nullable|string|in:Male,Female',
                'age' => 'nullable|integer|min:0',
            ]);

            $this->service->update($borrower, $validated);

            return redirect()->back()->with('success', 'Borrower updated successfully');
            $borrower = Borrower::with('loan')->findOrFail($id);

            return Inertia::render('borrowers/show', [
                'borrower' => [
                    'id' => $borrower->ID,
                    'first_name' => $borrower->first_name,
                    'last_name' => $borrower->last_name,
                    'email' => $borrower->email,
                    'city' => $borrower->city,
                    'gender' => $borrower->gender,
                    'occupation' => $borrower->occupation,
                    'contact_no' => $borrower->contact_no,
                    'loan' => $borrower->loan ? [
                        'status' => $borrower->loan->status,
                    ] : null,
                ],
            ]);
        }

            public function search(Request $request)
        {
        $query = trim($request->input('query'));

        if (empty($query)) {
            return response()->json(['message' => 'Query cannot be empty'], 400);
        }

        $borrower = Borrower::where('ID', intval($query))
            ->orWhere(function($q) use ($query) {
                $q->where('first_name', 'like', "%{$query}%")
                  ->orWhere('last_name', 'like', "%{$query}%")
                  ->orWhereRaw("CONCAT(first_name, ' ', last_name) like ?", ["%{$query}%"]);
            })->first();

        if ($borrower) {
            return response()->json([
                'borrower_id' => $borrower->ID,
                'borrower_name' => $borrower->first_name . ' ' . $borrower->last_name,
            ]);
        }

        return response()->json(['message' => 'Borrower not found'], 404);
    }




    }
