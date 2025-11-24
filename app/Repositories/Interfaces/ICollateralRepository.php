<?php
namespace App\Repositories\Interfaces;

use App\Models\Collateral;

interface ICollateralRepository
{
    public function addCollateral(Collateral $collateral): Collateral;
    public function getCollateral(int $id): ?Collateral;
    public function updateCollateral(Collateral $collateral, array $data): Collateral;
    public function deleteCollateral(int $id): bool;
    public function getCollateralsByLoan(int $loanId): array;
}