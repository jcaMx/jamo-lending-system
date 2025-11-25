<?php
  namespace App\Repositories\Interfaces;

  use App\Models\Payment;

  interface IRepaymentRepository {

    public function createRepayment(array $data): Payment;
    public function getPaymentsByLoanId(int $loanId): array;
    
  }