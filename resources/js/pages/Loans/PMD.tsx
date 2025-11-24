import { useState } from 'react';
import dayjs from 'dayjs';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Loans', href: '/Loans' },
  { title: 'Past Maturity Loans', href: '/Loans/PMD' },
];

export default function PastMaturityLoans() {
  const [searchTerm, setSearchTerm] = useState('');

  const [data] = useState([
    { Name: 'Ash Alainne', LoanNo: 'A100365', Released: '2025-10-05', Maturity: '2025-10-06', Repayment: 'Biweekly', Principal: '1,000', Interest: '9% per month', Due: '8,650', Paid: '8,650', Balance: '8,650', LastRepayment: '8,650', Status: "Open" },
    { Name: 'John Doe', LoanNo: 'A100366', Released: '2025-10-06', Maturity: '2025-10-07', Repayment: 'Biweekly', Principal: '1,000', Interest: '9% per month', Due: '9,200', Paid: '9,200', Balance: '9,200', LastRepayment: '9,200', Status: "Open" },
    { Name: 'Jane Smith', LoanNo: 'A100367', Released: '2025-10-07', Maturity: '2025-10-08', Repayment: 'Biweekly', Principal: '1,000', Interest: '9% per month', Due: '7,800', Paid: '7,800', Balance: '7,800', LastRepayment: '7,800', Status: "Open" },
    { Name: 'Michael Brown', LoanNo: 'A100368', Released: '2025-10-08', Maturity: '2025-10-09', Repayment: 'Biweekly', Principal: '1,000', Interest: '9% per month', Due: '10,500', Paid: '10,500', Balance: '10,500', LastRepayment: '10,500', Status: "Open" },
    { Name: 'Emily Davis', LoanNo: 'A100369', Released: '2025-10-09', Maturity: '2025-10-10', Repayment: 'Biweekly', Principal: '1,000', Interest: '9% per month', Due: '6,750', Paid: '6,750', Balance: '6,750', LastRepayment: '6,750', Status: "Open" },
  ]);

  const filteredData = data.filter(
    (row) =>
      dayjs(row.Maturity).isBefore(dayjs()) &&
      row.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Past Maturity Loans" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">View Past Maturity Loans</h1>
          <Button
            onClick={() => router.visit('/Loans/AddLoan')}
            className="bg-yellow-600 text-white hover:bg-yellow-700"
          >
            Add Loan
          </Button>
        </div>

        <div className="flex mb-4 gap-2">
          <input
            type="text"
            placeholder="Search by Borrower..."
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
              <th className="px-4 py-2">Released</th>
              <th className="px-4 py-2">Maturity</th>
              <th className="px-4 py-2">Repayment</th>
              <th className="px-4 py-2">Principal</th>
              <th className="px-4 py-2">Interest</th>
              <th className="px-4 py-2">Due</th>
              <th className="px-4 py-2">Paid</th>
              <th className="px-4 py-2">Balance</th>
              <th className="px-4 py-2">Last Repayment</th>
              <th className="px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {filteredData.map((row, idx) => (
              <tr key={idx} className="border-b last:border-none">
                <td className="px-4 py-2">{row.Name}</td>
                <td className="px-4 py-2">{row.LoanNo}</td>
                <td className="px-4 py-2">{row.Released}</td>
                <td className="px-4 py-2">{row.Maturity}</td>
                <td className="px-4 py-2">{row.Repayment}</td>
                <td className="px-4 py-2">{row.Principal}</td>
                <td className="px-4 py-2">{row.Interest}</td>
                <td className="px-4 py-2">{row.Due}</td>
                <td className="px-4 py-2">{row.Paid}</td>
                <td className="px-4 py-2">{row.Balance}</td>
                <td className="px-4 py-2">{row.LastRepayment}</td>
                <td className="px-4 py-2">{row.Status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
