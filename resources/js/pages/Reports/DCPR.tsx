import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Reports', href: '/Reports' },
  { title: 'Daily Cash Position Report', href: '/Reports/DCPR' },
];

export default function DCPR() {
  const [searchTerm, setSearchTerm] = useState('');

  const data = [
    { Date: '10/15/2025', OR: '4002', Account: 'JAMO NH', Amount: '₱8,650', PAYOR: 'Ash Alainne', PaidAmount: '8,650' },
    { Date: '10/15/2025', OR: '4002', Account: 'JAMO NH', Amount: '₱8,650', PAYOR: 'Ash Alainne', PaidAmount: '8,650' },
    { Date: '10/15/2025', OR: '4002', Account: 'JAMO NH', Amount: '₱8,650', PAYOR: 'Ash Alainne', PaidAmount: '8,650' },
    { Date: '10/15/2025', OR: '4002', Account: 'JAMO NH', Amount: '₱8,650', PAYOR: 'Ash Alainne', PaidAmount: '8,650' },
    { Date: '10/15/2025', OR: '4002', Account: 'JAMO NH', Amount: '₱8,650', PAYOR: 'Ash Alainne', PaidAmount: '8,650' },
    { Date: '10/15/2025', OR: '4002', Account: 'JAMO NH', Amount: '₱8,650', PAYOR: 'Ash Alainne', PaidAmount: '8,650' },
    { Date: '10/15/2025', OR: '4002', Account: 'JAMO NH', Amount: '₱8,650', PAYOR: 'Ash Alainne', PaidAmount: '8,650' },
    { Date: '10/15/2025', OR: '4002', Account: 'JAMO NH', Amount: '₱8,650', PAYOR: 'Ash Alainne', PaidAmount: '8,650' },
    { Date: '10/15/2025', OR: '4002', Account: 'JAMO NH', Amount: '₱8,650', PAYOR: 'Ash Alainne', PaidAmount: '8,650' },
    { Date: '10/15/2025', OR: '4002', Account: 'JAMO NH', Amount: '₱8,650', PAYOR: 'Ash Alainne', PaidAmount: '8,650' },
  ];

  
  const filteredData = data.filter(
    (row) =>
      row.Date.toLowerCase().includes(searchTerm.toLowerCase()) 
  );

  const exportToCSV = () => {
    const headers = ['Date', 'OR', 'Account', 'Amount', 'PAYOR', 'PaidAmount'];
    const rows = filteredData.map(row => [row.Date, row.OR, row.Account, row.Amount, row.PAYOR, row.PaidAmount]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows].map(e => e.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'daily_cash_position_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Daily Cash Position Report" />

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Daily Cash Position Report</h1>

        
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
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">OR</th>
              <th className="px-4 py-2">Account</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">PAYOR</th>
              <th className="px-4 py-2">Paid Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {filteredData.map((row, idx) => (
              <tr key={idx} className="border-b last:border-none">
                <td className="px-4 py-2">{row.Date}</td>
                <td className="px-4 py-2">{row.OR}</td>
                <td className="px-4 py-2">{row.Account}</td>
                <td className="px-4 py-2">{row.Amount}</td>
                <td className="px-4 py-2">{row.PAYOR}</td>
                <td className="px-4 py-2">{row.PaidAmount}</td>
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
