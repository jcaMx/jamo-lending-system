<?php
  namespace App\Services;

  use App\Models\Payment;
  use App\Repositories\Interfaces\IRepaymentRepository;

  class RepaymentService implements IRepaymentRepository {

    public function createRepayment(array $data): Payment 
    {
      return Payment::create($data);
    }

    public function getPaymentsByLoanId(int $loanId): array 
    {
      return Payment::where('loan_id', $loanId)->get();
    }
  }