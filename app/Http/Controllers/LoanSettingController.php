<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\LoanCharge;
use App\Models\LoanProductDocumentRequirement;
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

    public function updateGeneral(Request $request)
    {
        $validated = $request->validate([
            'enable_rebates' => 'nullable|boolean',
            'rebate_percentage' => 'nullable|numeric|min:0|max:100',
            'rebate_basis' => 'nullable|string|in:interest,principal,total',
        ]);

        $this->loanSettingService->updateGeneralSettings($validated);

        return redirect()->back()->with('success', 'Rebates settings updated successfully.');
    }

    public function storeRequirement(Request $request)
    {
        $validated = $request->validate([
            'loan_product_id' => 'required|exists:loan_products,id',
            'requirement_type' => 'required|in:category,document_type',
            'document_type_id' => 'nullable|required_if:requirement_type,document_type|exists:document_types,id',
            'document_category' => 'nullable|required_if:requirement_type,category|string|max:100',
            'subject_type' => 'required|string|max:50',
            'collateral_type' => 'nullable|string|max:50',
            'is_required' => 'required|boolean',
            'min_count' => 'required|integer|min:0',
            'max_count' => 'nullable|integer|min:0',
            'sort_order' => 'required|integer',
            'notes' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        $this->loanSettingService->createRequirement($validated);

        return redirect()->back()->with('success', 'Requirement created successfully.');
    }

    public function updateRequirement(Request $request, LoanProductDocumentRequirement $requirement)
    {
        $validated = $request->validate([
            'loan_product_id' => 'required|exists:loan_products,id',
            'requirement_type' => 'required|in:category,document_type',
            'document_type_id' => 'nullable|required_if:requirement_type,document_type|exists:document_types,id',
            'document_category' => 'nullable|required_if:requirement_type,category|string|max:100',
            'subject_type' => 'required|string|max:50',
            'collateral_type' => 'nullable|string|max:50',
            'is_required' => 'required|boolean',
            'min_count' => 'required|integer|min:0',
            'max_count' => 'nullable|integer|min:0',
            'sort_order' => 'required|integer',
            'notes' => 'nullable|string|max:255',
            'is_active' => 'required|boolean',
        ]);

        $this->loanSettingService->updateRequirement($requirement, $validated);

        return redirect()->back()->with('success', 'Requirement updated successfully.');
    }

    public function destroyRequirement(LoanProductDocumentRequirement $requirement)
    {
        $this->loanSettingService->deleteRequirement($requirement);

        return redirect()->back()->with('success', 'Requirement deleted successfully.');
    }
    public function storeDocumentType(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:document_types,code',
            'name' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'is_active' => 'required|boolean',
        ]);

        $this->loanSettingService->createDocumentType($validated);

        return redirect()->back()->with('success', 'Document type created successfully.');
    }

    public function updateDocumentType(Request $request, \App\Models\DocumentType $documentType)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:document_types,code,' . $documentType->id,
            'name' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'is_active' => 'required|boolean',
        ]);

        $this->loanSettingService->updateDocumentType($documentType, $validated);

        return redirect()->back()->with('success', 'Document type updated successfully.');
    }

    public function destroyDocumentType(\App\Models\DocumentType $documentType)
    {
        // Delete only if it is not heavily used, or soft delete it in the future if needed.
        // For now, allow simple delete per user request.
        $this->loanSettingService->deleteDocumentType($documentType);

        return redirect()->back()->with('success', 'Document type deleted successfully.');
    }
}
