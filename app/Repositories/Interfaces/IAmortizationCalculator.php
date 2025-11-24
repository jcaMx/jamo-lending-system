<?php
  namespace App\Repositories\Interfaces;

  use App\Models\Loan;
  use Carbon\Carbon;

  interface IAmortizationCalculator {
    
    // Generate amortization schedule
    public function generate(Loan $loan): array;

    // Recalculate remaining schedule after partial repaymnts
    public function recalculate(Loan $loan): array;
  }