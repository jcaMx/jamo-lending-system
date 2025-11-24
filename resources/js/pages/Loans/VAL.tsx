import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Loans', href: '/Loans' },
  { title: 'View All Loans', href: '/Loans/VAL' },
];

export default function VAL() {
  const [searchTerm, setSearchTerm] = useState('');

  const [data] = useState([
    { Name: 'Ash Alainne', LoanNo: 'A100365', Released: '10/05/25', Maturity: '10/06/25', Repayment: 'Biweekly', Principal: '1,000', Interest: '9% per month', Due: '8,650', Paid: '8,650', Balance: '8,650', LastRepayment: '8,650', Status: "Open" },
    { Name: 'John Doe', LoanNo: 'A100366', Released: '10/06/25', Maturity: '10/07/25', Repayment: 'Biweekly', Principal: '1,000', Interest: '9% per month', Due: '9,200', Paid: '9,200', Balance: '9,200', LastRepayment: '9,200', Status: "Open" },
    { Name: 'Jane Smith', LoanNo: 'A100367', Released: '10/07/25', Maturity: '10/08/25', Repayment: 'Biweekly', Principal: '1,000', Interest: '9% per month', Due: '7,800', Paid: '7,800', Balance: '7,800', LastRepayment: '7,800', Status: "Open" },
    { Name: 'Michael Brown', LoanNo: 'A100368', Released: '10/08/25', Maturity: '10/09/25', Repayment: 'Biweekly', Principal: '1,000', Interest: '9% per month', Due: '10,500', Paid: '10,500', Balance: '10,500', LastRepayment: '10,500', Status: "Open" },
    { Name: 'Emily Davis', LoanNo: 'A100369', Released: '10/09/25', Maturity: '10/10/25', Repayment: 'Biweekly', Principal: '1,000', Interest: '9% per month', Due: '6,750', Paid: '6,750', Balance: '6,750', LastRepayment: '6,750', Status: "Open" },
  ]);

  const filteredData = data.filter(
    (row) => row.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="View All Loans" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">View All Loans</h1>
          <button
            onClick={() => router.visit('/Loans/AddLoan')}
            className="px-4 py-2 bg-yellow-600 text-white rounded shadow hover:bg-yellow-700"
          >
            Add Loan
          </button>
        </div>

        {/* Search bar */}
        <div className="flex mb-4 gap-2">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded shadow-sm w-64"
          />
          <button
            onClick={() => {}}
            className="px-4 py-2 bg-yellow-600 text-white rounded shadow hover:bg-yellow-700"
          >
            Search
          </button>
        </div>

        {/* Loans Table */}
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">OR</th>
              <th className="px-4 py-2">Account</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">PAYOR</th>
              <th className="px-4 py-2">Paid Amount</th>
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
