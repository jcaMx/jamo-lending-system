<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LoanCharge;
use App\Services\LoanSettingService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LoanSettingController extends Controller
{
    protected LoanSettingService $loanSettingService;

    public function __construct(LoanSettingService $loanSettingService)
    {
        $this->loanSettingService = $loanSettingService;
    }

    /**
     * Display the list of fees.
     */
    public function index(): Response
    {
        return Inertia::render('Loans/LoanSettings', [
            'sections' => $this->loanSettingService->getSections(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:loan_charges,name',
            'description' => 'nullable|string',
            'rate' => 'required|numeric',
            'is_active' => 'required|boolean',
        ]);

        $this->loanSettingService->createFee($validated);

        return redirect()->route('loan-settings.index')
            ->with('success', 'Fee created successfully.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, LoanCharge $releasingFee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:loan_charges,name,' . $releasingFee->id,
            'description' => 'nullable|string',
            'rate' => 'required|numeric',
            'is_active' => 'required|boolean',
        ]);

        // Convert percentage → decimal (e.g. 5 → 0.05)
        // $validated['rate'] = $validated['rate'] / 100;

        $this->loanSettingService->updateFee($releasingFee, $validated);

        return redirect()->back()->with('success', 'Fee updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(LoanCharge $releasingFee)
    {
        $this->loanSettingService->deleteFee($releasingFee);

        return redirect()->route('loan-settings.index')
            ->with('success', 'Fee deleted successfully.');
    }
}
