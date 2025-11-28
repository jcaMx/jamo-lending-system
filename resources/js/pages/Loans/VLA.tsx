import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, usePage, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { LoanApplicationsPageProps } from '@/types/loan'; // <-- import the interface
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Loans', href: '/Loans' },
  { title: 'View Loan Applications', href: '/loans/vla' },
];

export default function ViewLoanApplications() {
  const { props } = usePage<LoanApplicationsPageProps>();
  const loanApplications = props.loanApplications || [];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredApplications = loanApplications
    .filter((loan) => loan.status === 'Pending') // Only Pending loans
    .filter((loan) =>
      `${loan.borrower.first_name} ${loan.borrower.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
    );

  const handleApprove = (loanId: number) => {
    router.post(route('loans.approve', loanId), {}, {
      onSuccess: () => alert(`Loan ${loanId} approved successfully!`),
      onError: (errors) => console.error(errors),
    });
  };

  const handleReject = (loanId: number) => {
    router.post(route('loans.reject', loanId), {}, {
      onSuccess: () => alert(`Loan ${loanId} rejected successfully!`),
      onError: (errors) => console.error(errors),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="View Loan Applications" />

      <div className="p-6">
        {/* Header + Add Loan Button */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Pending Loans</h1>
          <Button
            onClick={() => router.visit('/Loans/AddLoan')}
            className="bg-yellow-600 text-white hover:bg-yellow-700"
          >
            Add Loan
          </Button>
        </div>

        {/* Search */}
        <div className="flex mb-4 gap-2">
          <input
            type="text"
            placeholder="Search Borrower..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded shadow-sm w-64"
          />
        </div>

        {/* Loan Applications Table */}
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
              <th className="px-4 py-2">Borrower</th>
              <th className="px-4 py-2">Loan No.</th>
              <th className="px-4 py-2">Principal</th>
              <th className="px-4 py-2">Interest</th>
              <th className="px-4 py-2">Term</th>
              <th className="px-4 py-2">Repayment</th>
              <th className="px-4 py-2">Interest Type</th>
              <th className="px-4 py-2">Collateral</th>
              <th className="px-4 py-2">Co-borrower</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {filteredApplications.map((loan) => (
              <tr key={loan.id} className="border-b last:border-none">
                <td className="px-4 py-2">
                  {loan.borrower.first_name} {loan.borrower.last_name}
                </td>
                <td className="px-4 py-2">{loan.id}</td>
                <td className="px-4 py-2">{loan.principal_amount}</td>
                <td className="px-4 py-2">{loan.interest_rate}%</td>
                <td className="px-4 py-2">{loan.term_months} months</td>
                <td className="px-4 py-2">{loan.repayment_frequency}</td>
                <td className="px-4 py-2">{loan.interest_type}</td>
                <td className="px-4 py-2">{loan.collateral ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">
                  {loan.borrower.co_borrowers?.length ? 'Yes' : 'No'}
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <Button
                    onClick={() => handleApprove(loan.id)}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(loan.id)}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
