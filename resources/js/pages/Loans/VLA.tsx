import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Loans', href: '/Loans' },
  { title: 'View Loan Applications', href: '/Loans/VLA' },
];

export default function ViewLoanApplications() {
  const [searchTerm, setSearchTerm] = useState('');

  const [loanApplications] = useState([
    {
      borrower: 'Ash Alainne',
      loanNo: 'A100365',
      principal: '1,000',
      interest: '9% per month',
      term: '6 months',
      repayment: 'Biweekly',
      interestType: 'Fixed',
      hasCollateral: true,
      hasCoborrower: false,
    },
    {
      borrower: 'John Doe',
      loanNo: 'A100366',
      principal: '2,000',
      interest: '8% per month',
      term: '12 months',
      repayment: 'Monthly',
      interestType: 'Variable',
      hasCollateral: false,
      hasCoborrower: true,
    },
    {
      borrower: 'Jane Smith',
      loanNo: 'A100367',
      principal: '1,500',
      interest: '10% per month',
      term: '6 months',
      repayment: 'Biweekly',
      interestType: 'Fixed',
      hasCollateral: true,
      hasCoborrower: true,
    },
  ]);

  const filteredApplications = loanApplications.filter((loan) =>
    loan.borrower.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (loanNo: string) => {
    console.log(`Approved Loan: ${loanNo}`);
  };

  const handleReject = (loanNo: string) => {
    console.log(`Rejected Loan: ${loanNo}`);
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
            {filteredApplications.map((loan, idx) => (
              <tr key={idx} className="border-b last:border-none">
                <td className="px-4 py-2">{loan.borrower}</td>
                <td className="px-4 py-2">{loan.loanNo}</td>
                <td className="px-4 py-2">{loan.principal}</td>
                <td className="px-4 py-2">{loan.interest}</td>
                <td className="px-4 py-2">{loan.term}</td>
                <td className="px-4 py-2">{loan.repayment}</td>
                <td className="px-4 py-2">{loan.interestType}</td>
                <td className="px-4 py-2">{loan.hasCollateral ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">{loan.hasCoborrower ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 flex gap-2">
                  <Button
                    onClick={() => handleApprove(loan.loanNo)}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleReject(loan.loanNo)}
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
