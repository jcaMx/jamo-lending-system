import React from 'react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { LoanDetailsView, type LoanDetailsProps } from './components/LoanDetailsView';
import { PendingLoanDetails } from './VLA';

const activeBreadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Loans', href: '/Loans' },
  { title: 'View All Loans', href: '/Loans/VAL' },
  { title: 'Loan Details', href: '#' },
];

export default function ShowLoan({ loan }: LoanDetailsProps) {
  if (loan.status === 'Pending') {
    return <PendingLoanDetails loan={loan} />;
  }

  return (
    <LoanDetailsView
      loan={loan}
      breadcrumbs={activeBreadcrumbs}
      headerActions={
        loan.status === 'Active' && !loan.has_completed_disbursement ? (
          <Button
            onClick={() => router.visit(`/disbursements?loan_id=${loan.ID}`)}
            className="bg-[#FABF24] text-black hover:bg-[#f8b80f]"
          >
            Disburse Loan
          </Button>
        ) : null
      }
      onBack={() => router.visit(route('loans.view-all'))}
    />
  );
}
