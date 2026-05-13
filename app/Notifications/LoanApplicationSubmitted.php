<?php

namespace App\Notifications;

use App\Models\Loan;
use Illuminate\Notifications\Notification;

class LoanApplicationSubmitted extends Notification
{
    public function __construct(private readonly Loan $loan)
    {
        //
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $borrower = $this->loan->borrower;
        $borrowerName = trim(implode(' ', array_filter([
            $borrower?->first_name,
            $borrower?->last_name,
        ])));

        return [
            'kind' => 'loan_application_submitted',
            'loan_id' => $this->loan->ID,
            'borrower_id' => $borrower?->ID,
            'borrower_name' => $borrowerName !== '' ? $borrowerName : 'A borrower',
            'loan_type' => $this->loan->loan_type,
            'principal_amount' => (float) $this->loan->principal_amount,
            'message' => sprintf(
                '%s submitted a %s loan application.',
                $borrowerName !== '' ? $borrowerName : 'A borrower',
                $this->loan->loan_type ?? 'new'
            ),
            'url' => route('loans.show', $this->loan->ID),
            'submitted_at' => $this->loan->created_at?->toISOString(),
        ];
    }
}
