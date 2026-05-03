<?php

namespace App\Services;

use App\Models\LoanCharge;
use Illuminate\Support\Collection;

class LoanSettingService
{
    /**
     * Build the loan settings payload for the single settings page.
     */
    public function getSections(): array
    {
        return [
            'releasingFees' => [
                'key' => 'releasingFees',
                'title' => 'Releasing Fees',
                'description' => 'Manage charges applied during loan releasing.',
                'items' => $this->getAllFees(),
            ],
        ];
    }

    /**
     * Get all releasing fees with basic sorting.
     */
    public function getAllFees(): Collection
    {
        return LoanCharge::orderBy('created_at', 'desc')->get();
    }

    /**
     * Store a new releasing fee.
     */
    public function createFee(array $data): LoanCharge
    {
        return LoanCharge::create($data);
    }

    /**
     * Update an existing fee.
     */
    public function updateFee(LoanCharge $fee, array $data): bool
    {
        return $fee->update($data);
    }

    /**
     * Delete a fee.
     */
    public function deleteFee(LoanCharge $fee): bool
    {
        return $fee->delete();
    }
}
