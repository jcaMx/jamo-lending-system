import React, { useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

type DcprRow = {
  Date: string;
  OR: string;
  Account: string;
  Amount: number;
  PAYOR: string;
  PaidAmount: number;
};

type DcprFilterField = 'Date' | 'OR' | 'Account' | 'PAYOR';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Reports', href: '/Reports' },
  { title: 'Daily Cash Position Report', href: '/Reports/DCPR' },
];

export default function DCPR() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<DcprFilterField>('Date');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);

  const pageSize = 8;
  const printRef = useRef<HTMLDivElement>(null);

  const data: DcprRow[] = [
    { Date: '10/15/2025', OR: '4002', Account: 'JAMO NH', Amount: 8650, PAYOR: 'Ash Alainne', PaidAmount: 8650 },
    { Date: '10/15/2025', OR: '4003', Account: 'Dental', Amount: 5000, PAYOR: 'Marco Cruz', PaidAmount: 5000 },
    // ... more rows
  ];

  // Filtered data
  const filteredData = data.filter((row) =>
    row[filterType].toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = filteredData.reduce((acc, row) => acc + row.Amount, 0);
  const totalPaid = filteredData.reduce((acc, row) => acc + row.PaidAmount, 0);

  // Export CSV
  const exportToCSV = () => {
    const headers = ['Date', 'OR', 'Account', 'Amount', 'PAYOR', 'PaidAmount'];
    const rows = filteredData.map((row) => [
      row.Date, row.OR, row.Account, row.Amount, row.PAYOR, row.PaidAmount
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map((r) => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = 'Monthly_Report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDropdownOpen(false);
  };

  // Export PDF via Laravel DOMPDF
  const exportToPDF = async () => {
    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
      const response = await fetch('/reports/dcpr/export-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRF-TOKEN': token },
        body: JSON.stringify({ rows: filteredData }),
      });

      if (!response.ok) throw new Error('PDF export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Monthly_Report.pdf';
      link.click();
      setDropdownOpen(false);
    } catch (error) {
      console.error(error);
      alert('Failed to export PDF. Check Laravel logs and ensure DOMPDF is installed.');
    }
  };

  // Print
  const printPage = () => {
    if (!printRef.current) return;
    const printWindow = window.open('', '', 'width=900,height=650');
    if (!printWindow) return;

    const style = `
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #666; padding: 6px; text-align: left; }
        th { background: #f3f3f3; }
        tfoot td { font-weight: bold; background: #f9f9f9; }
      </style>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Daily Cash Position Report</title>
          ${style}
        </head>
        <body class="p-10 font-sans text-gray-800">
          <header class="text-center border-b pb-6 mb-8">
            <div style="display: flex; justify-content: center;">
              <img src="/images/jamo-logo-2.png" class="h-20 mb-3" alt="Logo" />
            </div>
            <h1 class="text-2xl font-bold tracking-wide">Daily Cash Position Report</h1>
            <p class="text-sm text-gray-600 mt-1">Purok 1B Kisante, Makilala, North Cotabato Philippines</p>
            <p class="text-sm text-gray-600 mt-1">+639120313776</p>
          </header>
          <main class="prose max-w-none">${printRef.current.innerHTML}</main>
          <footer class="mt-12 text-center text-xs text-gray-500 border-t pt-4">Page 1</footer>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  // Pagination helpers
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const gotoPrev = () => setPage((p) => Math.max(p - 1, 1));
  const gotoNext = () => setPage((p) => Math.min(p + 1, totalPages));
  const gotoPage = (n: number) => setPage(n);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Daily Cash Position Report" />
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Daily Cash Position Report</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <select
            className="px-3 py-2 border rounded shadow-sm"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as DcprFilterField)}
          >
            {['Date', 'OR', 'Account', 'PAYOR'].map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border rounded shadow-sm w-64"
          />
        </div>

        {/* Table */}
        <div ref={printRef}>
          <table className="min-w-full bg-white rounded shadow">
            <thead className="bg-gray-100 text-left text-sm font-medium text-gray-700">
              <tr>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">OR</th>
                <th className="px-4 py-2">Account</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">PAYOR</th>
                <th className="px-4 py-2">Paid Amount</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-800">
              {paginatedData.map((row, idx) => (
                <tr key={idx} className="border-b last:border-none hover:bg-gray-50">
                  <td className="px-4 py-2">{row.Date}</td>
                  <td className="px-4 py-2">{row.OR}</td>
                  <td className="px-4 py-2">{row.Account}</td>
                  <td className="px-4 py-2">₱{row.Amount.toLocaleString()}</td>
                  <td className="px-4 py-2">{row.PAYOR}</td>
                  <td className="px-4 py-2">₱{row.PaidAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 font-semibold">
              <tr>
                <td colSpan={3} className="px-4 py-2 text-right">Totals:</td>
                <td className="px-4 py-2">₱{totalAmount.toLocaleString()}</td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2">₱{totalPaid.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>



        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-sm text-gray-600">
              Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filteredData.length)} of {filteredData.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={gotoPrev}
              className="px-3 py-1 border rounded disabled:opacity-50"
              disabled={page === 1}
            >
              Prev
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                return (
                  <button
                    key={n}
                    onClick={() => gotoPage(n)}
                    className={`px-3 py-1 rounded ${n === page ? 'bg-[#FDE68A]' : 'border'}`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
            <button
              onClick={gotoNext}
              className="px-3 py-1 border rounded"
              disabled={page === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </div>

          {/* Actions */}
          <div className="flex justify-end mt-4 gap-2 relative">
          <button
            onClick={printPage}
            className="px-4 py-2 bg-[#D97706] text-white rounded shadow hover:bg-[#C49518]"
          >
            Print
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-4 py-2 bg-[#FABF24] text-white rounded shadow hover:bg-[#C49518]"
            >
              Export
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
                <button onClick={exportToPDF} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  PDF
                </button>
                <button onClick={exportToCSV} className="block w-full px-4 py-2 text-left hover:bg-gray-100">
                  CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
