<?php

namespace App\Services;

use App\Models\LoanCharge;
use Illuminate\Support\Collection;

class LoanSettingService
{
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