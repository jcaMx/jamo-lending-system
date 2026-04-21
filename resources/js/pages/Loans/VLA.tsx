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
    onConfirm: () => void;
  }>({ open: false, title: '', description: '', onConfirm: () => {} });

  const handleApprove = () => {
    setConfirmDialog({
      open: true,
      title: 'Approve Loan',
      description:
        'Are you sure you want to approve this loan? Disbursement and schedule generation will be handled in the Disbursements module.',
      onConfirm: () => {
        router.post(route('loans.approve', loan.ID), {}, {
          onSuccess: () => {
            setConfirmDialog({ ...confirmDialog, open: false });
            router.visit(route('loans.view-approved'));
          },
          onError: (errors) => {
            console.error('Approval failed:', errors);
            setConfirmDialog({ ...confirmDialog, open: false });
          },
        });
      },
    });
  };

  const handleReject = () => {
    setConfirmDialog({
      open: true,
      title: 'Reject Loan',
      description: 'Are you sure you want to reject this loan?',
      onConfirm: () => {
        router.post(route('loans.reject', loan.ID), {}, {
          onSuccess: () => {
            setConfirmDialog({ ...confirmDialog, open: false });
            router.visit(route('loans.view-rejected'));
          },
          onError: (errors) => {
            console.error('Rejection failed:', errors);
            setConfirmDialog({ ...confirmDialog, open: false });
          },
        });
      },
    });
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
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
          confirmText="Confirm"
          cancelText="Cancel"
        />
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
