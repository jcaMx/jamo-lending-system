import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Reports', href: '/Reports' },
  { title: 'Monthly Report', href: '/Reports/MonthlyReport' },
];

export default function MCPR() {
  const [searchTerm, setSearchTerm] = useState('');

  const data = [
    { month: 'November 2025', loanReleased: '₱800,000', sixPercentDeduction: '₱48,000', advanceTenPercentDeduction: '₱80,000', LPP: '₱400,000', LIP: '₱40,000' },
    { month: 'November 2025', loanReleased: '₱800,000', sixPercentDeduction: '₱48,000', advanceTenPercentDeduction: '₱80,000', LPP: '₱400,000', LIP: '₱40,000' },
    { month: 'November 2025', loanReleased: '₱800,000', sixPercentDeduction: '₱48,000', advanceTenPercentDeduction: '₱80,000', LPP: '₱400,000', LIP: '₱40,000' },
    { month: 'November 2025', loanReleased: '₱800,000', sixPercentDeduction: '₱48,000', advanceTenPercentDeduction: '₱80,000', LPP: '₱400,000', LIP: '₱40,000' },
    { month: 'November 2025', loanReleased: '₱800,000', sixPercentDeduction: '₱48,000', advanceTenPercentDeduction: '₱80,000', LPP: '₱400,000', LIP: '₱40,000' },
    { month: 'November 2025', loanReleased: '₱800,000', sixPercentDeduction: '₱48,000', advanceTenPercentDeduction: '₱80,000', LPP: '₱400,000', LIP: '₱40,000' },
    { month: 'November 2025', loanReleased: '₱800,000', sixPercentDeduction: '₱48,000', advanceTenPercentDeduction: '₱80,000', LPP: '₱400,000', LIP: '₱40,000' },
    { month: 'November 2025', loanReleased: '₱800,000', sixPercentDeduction: '₱48,000', advanceTenPercentDeduction: '₱80,000', LPP: '₱400,000', LIP: '₱40,000' },
    { month: 'November 2025', loanReleased: '₱800,000', sixPercentDeduction: '₱48,000', advanceTenPercentDeduction: '₱80,000', LPP: '₱400,000', LIP: '₱40,000' },
    { month: 'November 2025', loanReleased: '₱800,000', sixPercentDeduction: '₱48,000', advanceTenPercentDeduction: '₱80,000', LPP: '₱400,000', LIP: '₱40,000' },
    { month: 'November 2025', loanReleased: '₱800,000', sixPercentDeduction: '₱48,000', advanceTenPercentDeduction: '₱80,000', LPP: '₱400,000', LIP: '₱40,000' },
    { month: 'November 2025', loanReleased: '₱800,000', sixPercentDeduction: '₱48,000', advanceTenPercentDeduction: '₱80,000', LPP: '₱400,000', LIP: '₱40,000' },
    { month: 'November 2025', loanReleased: '₱800,000', sixPercentDeduction: '₱48,000', advanceTenPercentDeduction: '₱80,000', LPP: '₱400,000', LIP: '₱40,000' },
    { month: 'November 2025', loanReleased: '₱800,000', sixPercentDeduction: '₱48,000', advanceTenPercentDeduction: '₱80,000', LPP: '₱400,000', LIP: '₱40,000' },

   
  ];

  
  const filteredData = data.filter(
    (row) =>
      row.month.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const exportToCSV = () => {
    const headers = ['Month', 'Loan Released', '6% Deduction', 'Advance 10% Interest', 'Loan Principal Payment', 'Loan Interest Payment'];
    const rows = filteredData.map(row => [row.month, row.loanReleased, row.sixPercentDeduction, row.advanceTenPercentDeduction, row.LPP, row.LIP]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'monthly_cash_position_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Monthly Report" />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Monthly Report</h1>

        
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

        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-100 text-left text-sm font-medium text-gray-700">
              <th className="px-4 py-2">Month</th>
              <th className="px-4 py-2">Loan Released</th>
              <th className="px-4 py-2">6% Deduction</th>
              <th className="px-4 py-2">Advance 10% Interest</th>
              <th className="px-4 py-2">Loan Principal Payment</th>
              <th className="px-4 py-2">Loan Interest Payment</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {filteredData.map((row, idx) => (
              <tr key={idx} className="border-b last:border-none">
                <td className="px-4 py-2">{row.month}</td>
                <td className="px-4 py-2">{row.loanReleased}</td>
                <td className="px-4 py-2">{row.sixPercentDeduction}</td>
                <td className="px-4 py-2">{row.advanceTenPercentDeduction}</td>
                <td className="px-4 py-2">{row.LPP}</td>
                <td className="px-4 py-2">{row.LIP}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <button
            onClick={exportToCSV}
            className="px-4 py-2 bg-yellow-600 text-white rounded shadow hover:bg-yellow-700"
          >
            Export
          </button>
        </div>
      </div>
    </AppLayout>
  );
}