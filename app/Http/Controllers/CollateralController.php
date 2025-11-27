<?php

namespace App\Http\Controllers;

use App\Services\CollateralService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CollateralController extends Controller
{
    public function __construct(
        private CollateralService $collateralService
    ) {}

    public function index(Request $request)
    {
        $loanId = $request->query('loan_id');
        $collaterals = $this->collateralService->listAllCollateral($loanId);

        return Inertia::render('Collaterals/Index', [
            'collaterals' => $collaterals,
            'loanId' => $loanId,
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Collaterals/Create', [
            'loanId' => $request->query('loan_id'),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|in:Land,Vehicle,ATM',
            'loan_id' => 'required|exists:loan,id',
            'estimated_value' => 'nullable|numeric|min:0',
            'appraisal_date' => 'nullable|date',
            'status' => 'nullable|in:Pledged,Released,Forfeited,Pending',
            'remarks' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:100',
            'appraised_by' => 'nullable|exists:users,id',
            
            // Land specific
            'titleNo' => 'required_if:type,Land|integer',
            'lotNo' => 'required_if:type,Land|integer',
            'location' => 'required_if:type,Land|string|max:50',
            'areaSize' => 'required_if:type,Land|string|max:20',
            
            // Vehicle specific
            'brand' => 'required_if:type,Vehicle|string|max:20',
            'model' => 'required_if:type,Vehicle|string|max:20',
            'year_model' => 'nullable|integer',
            'plate_no' => 'nullable|string|max:20',
            'engine_no' => 'nullable|string|max:20',
            'vehicle_type' => 'nullable|in:Car,Motorcycle,Truck',
            'transmission_type' => 'nullable|in:Manual,Automatic',
            'fuel_type' => 'nullable|string|max:20',
            
            // ATM specific
            'bank_name' => 'required_if:type,ATM|in:BDO,BPI,LandBank,MetroBank',
            'account_no' => 'required_if:type,ATM|string|max:20',
            'cardno_4digits' => 'required_if:type,ATM|integer|digits:4',
        ]);

        $collateral = $this->collateralService->registerCollateral(
            $validated['type'],
            $validated
        );

        return redirect()->route('collaterals.index', ['loan_id' => $collateral->loan_id])
            ->with('success', 'Collateral registered successfully');
    }

    public function show(int $id)
    {
        $collateral = $this->collateralService->listAllCollateral()
            ->firstWhere('id', $id);

        if (!$collateral) {
            abort(404);
        }

        return Inertia::render('Collaterals/Show', [
            'collateral' => $collateral,
        ]);
    }

    public function edit(int $id)
    {
        $collaterals = $this->collateralService->listAllCollateral();
        $collateral = collect($collaterals)->firstWhere('id', $id);

        if (!$collateral) {
            abort(404);
        }

        return Inertia::render('Collaterals/Edit', [
            'collateral' => $collateral,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'estimated_value' => 'nullable|numeric|min:0',
            'appraisal_date' => 'nullable|date',
            'status' => 'nullable|in:Pledged,Released,Forfeited,Pending',
            'remarks' => 'nullable|string|max:100',
            'description' => 'nullable|string|max:100',
            
            'land_details' => 'nullable|array',
            'land_details.titleNo' => 'nullable|integer',
            'land_details.lotNo' => 'nullable|integer',
            'land_details.location' => 'nullable|string|max:50',
            'land_details.areaSize' => 'nullable|string|max:20',
            
            'vehicle_details' => 'nullable|array',
            'vehicle_details.brand' => 'nullable|string|max:20',
            'vehicle_details.model' => 'nullable|string|max:20',
            'vehicle_details.year_model' => 'nullable|integer',
            'vehicle_details.plate_no' => 'nullable|string|max:20',
            'vehicle_details.engine_no' => 'nullable|string|max:20',
            'vehicle_details.type' => 'nullable|in:Car,Motorcycle,Truck',
            'vehicle_details.transmission_type' => 'nullable|in:Manual,Automatic',
            'vehicle_details.fuel_type' => 'nullable|string|max:20',
            
            'atm_details' => 'nullable|array',
            'atm_details.bank_name' => 'nullable|in:BDO,BPI,LandBank,MetroBank',
            'atm_details.account_no' => 'nullable|string|max:20',
            'atm_details.cardno_4digits' => 'nullable|integer|digits:4',
        ]);

        $collateral = $this->collateralService->updateCollateral($id, $validated);

        return redirect()->route('collaterals.index', ['loan_id' => $collateral->loan_id])
            ->with('success', 'Collateral updated successfully');
    }

    public function destroy(int $id)
    {
        $collateral = $this->collateralService->listAllCollateral()
            ->firstWhere('id', $id);
        
        $loanId = $collateral['loan_id'] ?? null;
        
        $this->collateralService->deleteCollateral($id);

        return redirect()->route('collaterals.index', ['loan_id' => $loanId])
            ->with('success', 'Collateral deleted successfully');
    }
}