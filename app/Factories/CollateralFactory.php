<?php

namespace App\Factories;

use App\Models\AtmCollateralDetails;
use App\Models\Collateral;
use App\Models\LandCollateralDetails;
use App\Models\VehicleCollateralDetails;
use Illuminate\Support\Facades\DB;

class CollateralFactory
{
    public static function createCollateral(string $type, array $data): Collateral
    {
        if (! in_array($type, ['Land', 'Vehicle', 'ATM'])) {
            throw new \InvalidArgumentException("Invalid collateral type: {$type}");
        }

        return DB::transaction(function () use ($type, $data) {
            // Create base collateral
            $collateral = Collateral::create([
                'type' => $type,
                'estimated_value' => $data['estimated_value'] ?? null,
                'appraisal_date' => $data['appraisal_date'] ?? now(),
                'ownership_proof' => $data['ownership_proof'] ?? null,
                'status' => $data['status'] ?? 'Pending',
                'remarks' => $data['remarks'] ?? null,
                'description' => $data['description'] ?? null,
                'appraised_by' => $data['appraised_by'] ?? null,
                'loan_id' => $data['loan_id'],
            ]);

            // Create type-specific details
            match ($type) {
                'Land' => self::createLandDetails($collateral, $data),
                'Vehicle' => self::createVehicleDetails($collateral, $data),
                'ATM' => self::createAtmDetails($collateral, $data),
            };

            return $collateral->load(['landDetails', 'vehicleDetails', 'atmDetails']);
        });
    }

    private static function createLandDetails(Collateral $collateral, array $data): void
    {
        LandCollateralDetails::create([
            'collateralID' => $collateral->ID,
            'titleNo' => $data['titleNo'],
            'lotNo' => $data['lotNo'],
            'location' => $data['location'],
            'areaSize' => $data['areaSize'],
        ]);
    }

    private static function createVehicleDetails(Collateral $collateral, array $data): void
    {
        VehicleCollateralDetails::create([
            'collateral_id' => $collateral->ID,
            'type' => $data['vehicle_type'] ?? null,
            'brand' => $data['brand'],
            'model' => $data['model'],
            'year_model' => $data['year_model'] ?? null,
            'plate_no' => $data['plate_no'] ?? null,
            'engine_no' => $data['engine_no'] ?? null,
            'transmission_type' => $data['transmission_type'] ?? null,
            'fuel_type' => $data['fuel_type'] ?? null,
        ]);
    }

    private static function createAtmDetails(Collateral $collateral, array $data): void
    {
        AtmCollateralDetails::create([
            'collateral_id' => $collateral->ID,
            'bank_name' => $data['bank_name'],
            'account_no' => $data['account_no'],
            'cardno_4digits' => $data['cardno_4digits'],
        ]);
    }
}
