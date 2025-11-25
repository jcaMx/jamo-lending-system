<?php
  namespace App\Repositories\Interfaces;

  use App\Models\Loan;

  interface IPenaltyCalculator
  {
    public function calculate(Loan $loan): float;
  }