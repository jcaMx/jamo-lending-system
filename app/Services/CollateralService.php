<?php

namespace App\Services;

use App\Factories\CollateralFactory;
use App\Repositories\Interfaces\ICollateralRepository;
use App\Models\Collateral;
use App\Models\LandCollateralDetails;
use App\Models\VehicleCollateralDetails;
use App\Models\AtmCollateralDetails;
use Illuminate\Support\Facades\DB;

class CollateralService
{
    public function __construct(
        private ICollateralRepository $repo
    ) {}

    public function registerCollateral(string $type, array $data): Collateral
    {
        return CollateralFactory::createCollateral($type, $data);
    }

    public function releaseCollateral(int $id): bool
    {
        $collateral = $this->repo->getCollateral($id);
        if (!$collateral) {
            return false;
        }

        $collateral->status = 'Released';
        $this->repo->updateCollateral($collateral, ['status' => 'Released']);
        return true;
    }

    public function listAllCollateral(?int $loanId = null): array
    {
        if ($loanId) {
            return $this->repo->getCollateralsByLoan($loanId);
        }

        return Collateral::with(['landDetails', 'vehicleDetails', 'atmDetails', 'loan', 'appraisedBy'])
            ->get()
            ->toArray();
    }

    public function updateCollateral(int $id, array $data): Collateral
    {
        $collateral = $this->repo->getCollateral($id);
        if (!$collateral) {
            throw new \Exception("Collateral not found");
        }

        return DB::transaction(function () use ($collateral, $data) {
            // Update base collateral
            $baseData = [
                'estimated_value' => $data['estimated_value'] ?? $collateral->estimated_value,
                'appraisal_date' => $data['appraisal_date'] ?? $collateral->appraisal_date,
                'status' => $data['status'] ?? $collateral->status,
                'remarks' => $data['remarks'] ?? $collateral->remarks,
                'description' => $data['description'] ?? $collateral->description,
            ];
            $this->repo->updateCollateral($collateral, $baseData);

            // Update type-specific details
            match($collateral->type) {
                'Land' => $this->updateLandDetails($collateral, $data),
                'Vehicle' => $this->updateVehicleDetails($collateral, $data),
                'ATM' => $this->updateAtmDetails($collateral, $data),
            };

            return $this->repo->getCollateral($collateral->id);
        });
    }

    private function updateLandDetails(Collateral $collateral, array $data): void
    {
        $details = $collateral->landDetails;
        if ($details && isset($data['land_details'])) {
            $details->update($data['land_details']);
        }
    }

    private function updateVehicleDetails(Collateral $collateral, array $data): void
    {
        $details = $collateral->vehicleDetails;
        if ($details && isset($data['vehicle_details'])) {
            $details->update($data['vehicle_details']);
        }
    }

    private function updateAtmDetails(Collateral $collateral, array $data): void
    {
        $details = $collateral->atmDetails;
        if ($details && isset($data['atm_details'])) {
            $details->update($data['atm_details']);
        }
    }

    public function deleteCollateral(int $id): bool
    {
        return $this->repo->deleteCollateral($id);
    }
}