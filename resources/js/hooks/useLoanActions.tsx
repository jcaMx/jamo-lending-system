import React from 'react';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function useLoanActions() {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({
    open: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  const handleApprove = (loanId: number) => {
    setConfirmDialog({
      open: true,
      title: 'Approve Loan',
      description: `Are you sure you want to approve loan #${loanId}? This action will activate the loan and generate amortization schedules.`,
      onConfirm: () => {
        router.post(
          route('loans.approve', loanId),
          {},
          {
            onSuccess: () => {
              setConfirmDialog((prev) => ({ ...prev, open: false }));
            },
            onError: (errors) => {
              console.error('Approval failed:', errors);
              setConfirmDialog((prev) => ({ ...prev, open: false }));
            },
          }
        );
      },
    });
  };

  const handleReject = (loanId: number) => {
    setConfirmDialog({
      open: true,
      title: 'Reject Loan',
      description: `Are you sure you want to reject loan #${loanId}? This action cannot be undone.`,
      onConfirm: () => {
        router.post(
          route('loans.reject', loanId),
          {},
          {
            onSuccess: () => {
              setConfirmDialog((prev) => ({ ...prev, open: false }));
            },
            onError: (errors) => {
              console.error('Rejection failed:', errors);
              setConfirmDialog((prev) => ({ ...prev, open: false }));
            },
          }
        );
      },
    });
  };

  const handleView = (loanId: number) => {
    router.visit(route('loans.show', loanId));
  };

  const ConfirmDialog: React.FC = () => (
    <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
          <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmDialog.onConfirm}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    handleApprove,
    handleReject,
    handleView,
    ConfirmDialog,
  };
}

