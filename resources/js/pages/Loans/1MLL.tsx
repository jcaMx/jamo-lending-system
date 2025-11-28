import { useState } from 'react';
import dayjs from 'dayjs';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Loans', href: '/Loans' },
  { title: '1 Month Late Loans', href: '/loans/3mll' },
];

export default function OneMonthLateLoans() {
  const [searchTerm, setSearchTerm] = useState('');

  const [data] = useState([
    { Name: 'Ash Alainne', LoanNo: 'A100365', Released: '2025-08-05', Maturity: '2025-09-06', Repayment: 'Biweekly', Principal: '1,000', Interest: '9% per month', Due: '8,650', Paid: '8,650', Balance: '8,650', LastRepayment: '8,650', Status: "Open" },
    { Name: 'John Doe', LoanNo: 'A100366', Released: '2025-09-06', Maturity: '2025-09-15', Repayment: 'Biweekly', Principal: '1,000', Interest: '9% per month', Due: '9,200', Paid: '9,200', Balance: '9,200', LastRepayment: '9,200', Status: "Open" },
    { Name: 'Jane Smith', LoanNo: 'A100367', Released: '2025-10-07', Maturity: '2025-10-08', Repayment: 'Biweekly', Principal: '1,000', Interest: '9% per month', Due: '7,800', Paid: '7,800', Balance: '7,800', LastRepayment: '7,800', Status: "Open" },
    { Name: 'Michael Brown', LoanNo: 'A100368', Released: '2025-07-08', Maturity: '2025-08-09', Repayment: 'Biweekly', Principal: '1,000', Interest: '9% per month', Due: '10,500', Paid: '10,500', Balance: '10,500', LastRepayment: '10,500', Status: "Open" },
    { Name: 'Emily Davis', LoanNo: 'A100369', Released: '2025-10-09', Maturity: '2025-10-10', Repayment: 'Biweekly', Principal: '1,000', Interest: '9% per month', Due: '6,750', Paid: '6,750', Balance: '6,750', LastRepayment: '6,750', Status: "Open" },
  ]);

  // Filter loans more than 1 month past maturity AND apply search to all fields
  const filteredData = data.filter(
    (row) =>
      dayjs().diff(dayjs(row.Maturity), 'month') >= 1 &&
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="1 Month Late Loans" />

      <div className="p-6">
        {/* Header + Add Loan Button */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">1 Month Late Loans</h1>
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
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded shadow-sm w-64"
          />
        </div>

        {/* Loans Table */}
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
