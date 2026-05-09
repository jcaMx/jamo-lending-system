<?php

namespace App\Services;

use App\Models\LoanCharge;
use App\Models\SystemSetting;
use Illuminate\Support\Collection;

class LoanSettingService
{
    /**
     * Build the loan settings payload for the single settings page.
     */
    public function getSections(): array
    {
        return [
            'general' => [
                'key' => 'general',
                'title' => 'General Settings',
                'description' => 'Manage global system configurations like rebates.',
                'items' => $this->getGeneralSettings(),
            ],
            'releasingFees' => [
                'key' => 'releasingFees',
                'title' => 'Releasing Fees',
                'description' => 'Manage charges applied during loan releasing.',
                'items' => $this->getAllFees(),
            ],
        ];
    }

    public function getGeneralSettings(): array
    {
        return [
            'enable_rebates' => SystemSetting::getValue('enable_rebates', false),
            'rebate_percentage' => SystemSetting::getValue('rebate_percentage', 0),
            'rebate_basis' => SystemSetting::getValue('rebate_basis', 'interest'),
            'rebate_min_days_early' => (int) SystemSetting::getValue('rebate_min_days_early', 0),
            'rebate_apply_to_full_payoff' => SystemSetting::getValue('rebate_apply_to_full_payoff', true),
            'rebate_require_good_standing' => SystemSetting::getValue('rebate_require_good_standing', true),
        ];
    }

    public function updateGeneralSettings(array $data): void
    {
        if (isset($data['enable_rebates'])) {
            SystemSetting::setValue('enable_rebates', $data['enable_rebates']);
        }
        if (isset($data['rebate_percentage'])) {
            SystemSetting::setValue('rebate_percentage', $data['rebate_percentage']);
        }
        if (isset($data['rebate_basis'])) {
            SystemSetting::setValue('rebate_basis', $data['rebate_basis']);
        }
        if (isset($data['rebate_min_days_early'])) {
            SystemSetting::setValue('rebate_min_days_early', $data['rebate_min_days_early']);
        }
        if (isset($data['rebate_apply_to_full_payoff'])) {
            SystemSetting::setValue('rebate_apply_to_full_payoff', $data['rebate_apply_to_full_payoff']);
        }
        if (isset($data['rebate_require_good_standing'])) {
            SystemSetting::setValue('rebate_require_good_standing', $data['rebate_require_good_standing']);
        }
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
