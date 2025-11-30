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
  { title: 'View Loan Applications', href: '/Loans/VLA' },
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

  // Approve and Reject actions are now handled in ShowLoan page
  // where released_amount can be entered before approval

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
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {filteredApplications.map((loan) => {
              const loanId = loan.id || loan.ID || 0;
              const displayId = loan.id || loan.ID || 'N/A';
              return (
              <tr key={loanId} className="border-b last:border-none">
                <td className="px-4 py-2">
                  {loan.borrower.first_name} {loan.borrower.last_name}
                </td>
                <td className="px-4 py-2">{displayId}</td>
                <td className="px-4 py-2">{loan.principal_amount}</td>
                <td className="px-4 py-2">{loan.interest_rate}%</td>
                <td className="px-4 py-2">{loan.term_months} months</td>
                <td className="px-4 py-2">{loan.repayment_frequency}</td>
                <td className="px-4 py-2">{loan.interest_type}</td>
                <td className="px-4 py-2">{loan.collateral ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">
                  {loan.borrower.co_borrowers?.length ? 'Yes' : 'No'}
                </td>
                <td className="px-4 py-2">
                  {loanId > 0 && (
                  <Button
                      onClick={() => router.visit(route('loans.show', loanId))}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                      View & Approve
                  </Button>
                  )}
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
