import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Loans', href: '/Loans' },
  { title: '3 Month Late Loans', href: '/Loans/3MLL' },
];

interface Loan {
  ID: number;
  principal_amount: number;
  interest_rate: number;
  term_months: number;
  repayment_frequency: string;
  status: string;
  balance_remaining: number;
  start_date?: string;
  end_date?: string;
  borrower: {
    ID: number;
    first_name: string;
    last_name: string;
    contact_no?: string;
  };
  collateral?: {
    type: string;
  };
}

interface ThreeMonthLateLoansProps {
  loans: Loan[];
}

export default function ThreeMonthLateLoans({ loans }: ThreeMonthLateLoansProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLoans = loans.filter((loan) =>
    `${loan.borrower.first_name} ${loan.borrower.last_name}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="3 Month Late Loans" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">3 Month Late Loans</h1>
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
              <th className="px-4 py-2">Principal</th>
              <th className="px-4 py-2">Interest Rate</th>
              <th className="px-4 py-2">Term</th>
              <th className="px-4 py-2">Balance</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Collateral</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {filteredLoans.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No 3-month late loans found
                </td>
              </tr>
            ) : (
              filteredLoans.map((loan) => (
                <tr key={loan.ID} className="border-b last:border-none">
                  <td className="px-4 py-2">
                    {loan.borrower.first_name} {loan.borrower.last_name}
                  </td>
                  <td className="px-4 py-2">{loan.ID}</td>
                  <td className="px-4 py-2">₱{loan.principal_amount.toLocaleString()}</td>
                  <td className="px-4 py-2">{loan.interest_rate}%</td>
                  <td className="px-4 py-2">{loan.term_months} months</td>
                  <td className="px-4 py-2">₱{loan.balance_remaining.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      loan.status === 'Bad_Debt' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {loan.status}
                    </span>
                  </td>
                  <td className="px-4 py-2">{loan.collateral?.type || 'N/A'}</td>
                  <td className="px-4 py-2">
                    <Button
                      onClick={() => router.visit(route('loans.show', loan.ID))}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      View
                    </Button>
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
