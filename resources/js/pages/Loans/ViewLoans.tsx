import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Loans', href: '/Loans' },
  { title: 'View Loans', href: '/Loans/ViewLoans' },
];

interface Loan {
  ID: number;
  principal_amount: number;
  interest_rate: number;
  interest_type: string;
  loan_type: string;
  term_months: number;
  repayment_frequency: string;
  status: string;
  balance_remaining: number;
  released_amount?: number;
  start_date?: string;
  end_date?: string;
  borrower: {
    ID: number;
    first_name: string;
    last_name: string;
    contact_no?: string;
    borrowerAddress?: {
      address?: string;
      city?: string;
    };
  };
  collateral?: {
    type: string;
  };
  amortizationSchedules?: Array<{
    ID: number;
    installment_no: number;
    due_date: string;
    installment_amount: number;
    interest_amount: number;
    penalty_amount: number;
    amount_paid: number;
    status: string;
  }>;
}

interface ViewLoansProps {
  loans: Loan[];
}

export default function ViewLoans({ loans }: ViewLoansProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLoans = loans.filter((loan) =>
    `${loan.borrower.first_name} ${loan.borrower.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="View Loans" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Approved Loans</h1>
        </div>

        <div className="flex mb-4 gap-2">
          <input
            type="text"
            placeholder="Search Borrower..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded shadow-sm w-64"
          />
        </div>

        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
              <th className="px-4 py-2">Borrower</th>
              <th className="px-4 py-2">Loan No.</th>
              <th className="px-4 py-2">Loan Type</th>
              <th className="px-4 py-2">Principal</th>
              <th className="px-4 py-2">Interest Rate</th>
              <th className="px-4 py-2">Interest Type</th>
              <th className="px-4 py-2">Term</th>
              <th className="px-4 py-2">Repayment</th>
              <th className="px-4 py-2">Balance</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Collateral</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {filteredLoans.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                  No approved loans found
                </td>
              </tr>
            ) : (
              filteredLoans.map((loan) => (
                <tr key={loan.ID} className="border-b last:border-none">
                  <td className="px-4 py-2">
                    {loan.borrower.first_name} {loan.borrower.last_name}
                  </td>
                  <td className="px-4 py-2">{loan.ID}</td>
                  <td className="px-4 py-2">{loan.loan_type}</td>
                  <td className="px-4 py-2">₱{loan.principal_amount.toLocaleString()}</td>
                  <td className="px-4 py-2">{loan.interest_rate}%</td>
                  <td className="px-4 py-2">{loan.interest_type}</td>
                  <td className="px-4 py-2">{loan.term_months} months</td>
                  <td className="px-4 py-2">{loan.repayment_frequency}</td>
                  <td className="px-4 py-2">₱{loan.balance_remaining.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{loan.collateral?.type || 'N/A'}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => router.visit(route('loans.show', loan.ID))}
                        className="bg-yellow-400 text-black hover:bg-yellow-700"
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => router.visit(route('loans.schedule', loan.ID))}
                        className="bg-yellow-600 text-white hover:bg-yellow-700"
                      >
                        Schedule
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}

