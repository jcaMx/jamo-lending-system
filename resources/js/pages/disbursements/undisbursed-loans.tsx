import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Eye, HandCoins } from 'lucide-react';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Disbursements', href: '/disbursements' },
  { title: 'Undisbursed Loans', href: '/disbursements/undisbursed-loans' },
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
  released_amount?: number | null;
  start_date?: string | null;
  end_date?: string | null;
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
}

interface UndisbursedLoansProps {
  loans: Loan[];
}

const isUndisbursedLoan = (loan: Loan) => {
  const releasedAmount = Number(loan.released_amount ?? 0);

  return loan.status === 'Active' && releasedAmount <= 0;
};

export default function UndisbursedLoans({ loans }: UndisbursedLoansProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLoans = loans
    .filter(isUndisbursedLoan)
    .filter((loan) =>
      `${loan.borrower.first_name} ${loan.borrower.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Undisbursed Loans" />

      <div className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Undisbursed Loans</h1>
        </div>

        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search Borrower..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 rounded border px-4 py-2 shadow-sm"
          />
        </div>

        <table className="min-w-full rounded bg-white shadow">
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
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {filteredLoans.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-8 text-center text-gray-500">
                  No undisbursed loans found
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
                  <td className="px-4 py-2">P{loan.principal_amount.toLocaleString()}</td>
                  <td className="px-4 py-2">{loan.interest_rate}%</td>
                  <td className="px-4 py-2">{loan.interest_type}</td>
                  <td className="px-4 py-2">{loan.term_months} months</td>
                  <td className="px-4 py-2">{loan.repayment_frequency}</td>
                  <td className="px-4 py-2">P{loan.balance_remaining.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <span className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800">
                      Undisbursed
                    </span>
                  </td>
                  <td className="px-4 py-2">{loan.collateral?.type || 'N/A'}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => router.visit(route('loans.show', loan.ID))}
                        className="text-black hover:bg-gray-100 hover:text-gray"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => router.visit(`/disbursements?loan_id=${loan.ID}`)}
                        className="text-black hover:bg-gray-100 hover:text-gray"
                      >
                        <HandCoins className="h-4 w-4" />
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
