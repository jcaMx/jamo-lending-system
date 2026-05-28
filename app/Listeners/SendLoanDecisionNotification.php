<?php

namespace App\Listeners;

use App\Events\LoanApproved;
use App\Events\LoanRejected;
use App\Notifications\NotifyUser;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class SendLoanDecisionNotification implements ShouldQueue
{
    use InteractsWithQueue;

    public bool $afterCommit = true;

    public function handle(LoanApproved|LoanRejected $event): void
    {
        $loan = $event->loan->loadMissing('borrower');
        $borrower = $loan->borrower;

        if (! $borrower || empty($borrower->email)) {
            return;
        }

        $isApproved = $event instanceof LoanApproved;
        $borrowerName = trim(($borrower->first_name ?? '').' '.($borrower->last_name ?? ''));

        $subject = $isApproved
            ? 'Your Loan Application is Approved'
            : 'Your Loan Application has been Rejected';

        $message = $isApproved
            ? "Dear {$borrowerName},\n\nYour loan application has been approved.\n\nLoan Details:\n- Loan Number: {$loan->ID}\n- Borrower: {$borrowerName}\n- Loan Amount: PHP {$loan->principal_amount}\n\nFor more information, please log in to your account in JAMO Lending System."
            : "Dear {$borrowerName},\n\nWe regrettably inform you that your loan application has been rejected.\n\nReason for rejection: {$event->rejectionReason}\n\nPlease log in to your account in JAMO Lending System and try again, or contact us for further assistance.\n\nThank you!";

        $borrower->notify(new NotifyUser(
            message: $message,
            subject: $subject,
            email: $borrower->email,
        ));
    }
}
