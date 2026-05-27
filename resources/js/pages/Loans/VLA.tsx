import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { LoanApplicationsPageProps } from '@/types/loan';
import { route } from 'ziggy-js';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { LoanDetailsView, type LoanDetailsProps } from './components/LoanDetailsView';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Loans', href: '/Loans' },
  { title: 'View Loan Applications', href: '/Loans/VLA' },
];

const pendingDetailsBreadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Loans', href: '/Loans' },
  { title: 'View Loan Applications', href: '/Loans/VLA' },
  { title: 'Loan Details', href: '#' },
];

const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return 'N/A';
  return `P${Number(value).toLocaleString()}`;
};

export function PendingLoanDetails({ loan }: LoanDetailsProps) {
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    mode: 'approve' | 'reject' | null;
  }>({ open: false, title: '', description: '', mode: null });
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectionError, setRejectionError] = useState('');

  const closeConfirmDialog = () => {
    setConfirmDialog((prev) => ({ ...prev, open: false, mode: null }));
    setRejectionReason('');
    setRejectionError('');
  };

  const handleApprove = () => {
    setConfirmDialog({
      open: true,
      title: 'Approve Loan',
      description:
        'Are you sure you want to approve this loan? Disbursement and schedule generation will be handled in the Disbursements module.',
      mode: 'approve',
    });
  };

  const handleReject = () => {
    setRejectionReason('');
    setRejectionError('');

    setConfirmDialog({
      open: true,
      title: 'Reject Loan',
      description: 'Enter the reason for rejection before confirming.',
      mode: 'reject',
    });
  };

  const handleConfirm = () => {
    if (confirmDialog.mode === 'approve') {
      router.post(route('loans.approve', loan.ID), {}, {
        onSuccess: () => {
          closeConfirmDialog();
          router.visit(route('loans.view-approved'));
        },
        onError: (errors) => {
          console.error('Approval failed:', errors);
          closeConfirmDialog();
        },
      });

      return;
    }

    if (confirmDialog.mode === 'reject') {
      const trimmedReason = rejectionReason.trim();

      if (!trimmedReason) {
        setRejectionError('Reason for rejection is required.');
        return;
      }

      router.post(route('loans.reject', loan.ID), { rejection_reason: trimmedReason }, {
        onSuccess: () => {
          closeConfirmDialog();
          router.visit(route('loans.view-rejected'));
        },
        onError: (errors) => {
          console.error('Rejection failed:', errors);
        },
      });
    }
  };

  return (
    <LoanDetailsView
      loan={loan}
      breadcrumbs={pendingDetailsBreadcrumbs}
      headTitle="Loan Application Details"
      pageTitle="Loan Application Details"
      headerActions={
        <>
          <Button onClick={handleApprove} className="bg-green-600 text-white hover:bg-green-700">
            Approve Loan
          </Button>
          <Button onClick={handleReject} className="bg-red-600 text-white hover:bg-red-700">
            Reject
          </Button>
        </>
      }
      onBack={() => router.visit(route('loans.view'))}
      extraDialogs={
        <ConfirmDialog
          open={confirmDialog.open}
          title={confirmDialog.title}
          description={confirmDialog.description}
          onConfirm={handleConfirm}
          onCancel={closeConfirmDialog}
          confirmText="Confirm"
          cancelText="Cancel"
          confirmDisabled={confirmDialog.mode === 'reject' && !rejectionReason.trim()}
        >
          {confirmDialog.mode === 'reject' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="rejection_reason">
                Reason for rejection <span className="text-red-600">*</span>
              </label>
              <textarea
                id="rejection_reason"
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  if (rejectionError) {
                    setRejectionError('');
                  }
                }}
                rows={4}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
                placeholder="Enter the reason for rejection"
              />
              {rejectionError && (
                <p className="text-xs text-red-600">{rejectionError}</p>
              )}
            </div>
          )}
        </ConfirmDialog>
      }
    />
  );
}

export default function ViewLoanApplications() {
  const { props } = usePage<LoanApplicationsPageProps>();
  const loanApplications = props.loanApplications || [];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApplications = loanApplications
    .filter((loan) => loan.status === 'Pending')
    .filter((loan) =>
      `${loan.borrower?.first_name || ''} ${loan.borrower?.last_name || ''}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="View Loan Applications" />

      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Pending Loans</h1>

        <input
          type="text"
          placeholder="Search Borrower..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded shadow-sm w-full max-w-md"
        />

        {filteredApplications.length === 0 ? (
          <div className="rounded-lg border bg-white p-6 text-sm text-gray-500">
            No pending loan applications found.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Borrower</th>
                  <th className="px-4 py-3 text-left">Loan No.</th>
                  <th className="px-4 py-3 text-left">Principal</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((loan) => {
                  const loanId = loan.id || loan.ID || 0;
                  return (
                    <tr key={loanId} className="border-t">
                      <td className="px-4 py-3">
                        {loan.borrower?.first_name} {loan.borrower?.last_name}
                      </td>
                      <td className="px-4 py-3">{loanId || 'N/A'}</td>
                      <td className="px-4 py-3">{formatCurrency(loan.principal_amount)}</td>
                      <td className="px-4 py-3">{loan.status}</td>
                      <td className="px-4 py-3">
                        {loanId > 0 && (
                          <Button
                            onClick={() => router.visit(route('loans.show', loanId))}
                            className="bg-yellow-400 text-black hover:bg-yellow-500"
                          >
                            View Details
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
