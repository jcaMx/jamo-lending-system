<?php

namespace App\Repositories\Eloquent;

use App\Repositories\Interfaces\ICollateralRepository;
use App\Models\Collateral;
use Illuminate\Database\Eloquent\Collection;

class CollateralRepository implements ICollateralRepository
{
    public function addCollateral(Collateral $collateral): Collateral
    {
        $collateral->save();
        return $collateral->load(['landDetails', 'vehicleDetails', 'atmDetails', 'appraisedBy']);
    }

    public function getCollateral(int $id): ?Collateral
    {
        return Collateral::with(['landDetails', 'vehicleDetails', 'atmDetails', 'loan', 'appraisedBy'])
            ->find($id);
    }

    public function updateCollateral(Collateral $collateral, array $data): Collateral
    {
        $collateral->fill($data);
        $collateral->save();
        return $collateral->load(['landDetails', 'vehicleDetails', 'atmDetails']);
    }

    public function deleteCollateral(int $id): bool
    {
        $collateral = $this->getCollateral($id);
        if (!$collateral) {
            return false;
        }
        return (bool) $collateral->delete();
    }

    public function getCollateralsByLoan(int $loanId): array
    {
        return Collateral::with(['landDetails', 'vehicleDetails', 'atmDetails', 'appraisedBy'])
            ->where('loan_id', $loanId)
            ->get()
            ->toArray();
    }
}