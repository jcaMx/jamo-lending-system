import React, { useEffect, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
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

interface Props {
  rows: DcprRow[];
  reportDate: string;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Reports', href: '/Reports' },
  { title: 'Daily Cash Position Report', href: '/Reports/DCPR' },
];

export default function DCPR({ rows = [], reportDate }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<DcprFilterField>('Date');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [dateFilter, setDateFilter] = useState(reportDate || '');

  const pageSize = 8;
  const printRef = useRef<HTMLDivElement>(null);

  const filteredData = rows.filter((row) =>
    row[filterType].toString().toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setPage(1);
  }, [searchTerm, filterType, dateFilter]);

  const totalAmount = filteredData.reduce((acc, row) => acc + row.Amount, 0);
  const totalPaid = filteredData.reduce((acc, row) => acc + row.PaidAmount, 0);

  const exportToCSV = () => {
    const headers = ['Date', 'OR', 'Account', 'Amount', 'PAYOR', 'PaidAmount'];
    const csvRows = filteredData.map((row) => [
      row.Date,
      row.OR,
      row.Account,
      row.Amount,
      row.PAYOR,
      row.PaidAmount,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...csvRows].map((r) => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = 'Daily_Cash_Position_Report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDropdownOpen(false);
  };

  const exportToPDF = async () => {
    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
      const response = await fetch('/Reports/dcpr/export-pdf', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ rows: filteredData }),
      });

      if (!response.ok) throw new Error('PDF export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Daily_Cash_Position_Report.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
      setDropdownOpen(false);
    } catch (error) {
      console.error(error);
      alert('Failed to export PDF. Check Laravel logs and ensure DOMPDF is installed.');
    }
  };

  const printPage = () => {
    if (!printRef.current) return;
    const printWindow = window.open('', '', 'width=900,height=650');
    if (!printWindow) return;

    const style = `
      <style>
        body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
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
        <body>
          <header style="text-align:center;border-bottom:1px solid #d1d5db;padding-bottom:12px;margin-bottom:16px;">
            <img src="/images/jamo-logo-2.png" style="height:56px;margin-bottom:6px" alt="Logo" />
            <h1 style="font-size:20px;margin:0;">Daily Cash Position Report</h1>
            <p style="font-size:12px;color:#4b5563;">Date: ${dateFilter || reportDate}</p>
          </header>
          ${printRef.current.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const applyDateFilter = () => {
    router.get('/Reports/DCPR', { date: dateFilter || undefined }, { preserveState: true, replace: true });
  };

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paginatedData = filteredData.slice((page - 1) * pageSize, page * pageSize);

  const gotoPrev = () => setPage((p) => Math.max(p - 1, 1));
  const gotoNext = () => setPage((p) => Math.min(p + 1, totalPages));
  const gotoPage = (n: number) => setPage(n);

  const showFrom = filteredData.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showTo = filteredData.length === 0 ? 0 : Math.min(page * pageSize, filteredData.length);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Daily Cash Position Report" />
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Daily Cash Position Report</h1>

        <div className="flex flex-wrap gap-2 items-center">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border rounded shadow-sm"
          />
          <button
            onClick={applyDateFilter}
            className="px-4 py-2 bg-yellow-600 text-white rounded shadow hover:bg-yellow-700"
          >
            Filter Date
          </button>

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
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">No records found.</td>
                </tr>
              ) : paginatedData.map((row, idx) => (
                <tr key={idx} className="border-b last:border-none hover:bg-gray-50">
                  <td className="px-4 py-2">{row.Date}</td>
                  <td className="px-4 py-2">{row.OR}</td>
                  <td className="px-4 py-2">{row.Account}</td>
                  <td className="px-4 py-2">PHP {row.Amount.toLocaleString()}</td>
                  <td className="px-4 py-2">{row.PAYOR}</td>
                  <td className="px-4 py-2">PHP {row.PaidAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-100 font-semibold">
              <tr>
                <td colSpan={3} className="px-4 py-2 text-right">Totals:</td>
                <td className="px-4 py-2">PHP {totalAmount.toLocaleString()}</td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2">PHP {totalPaid.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-sm text-gray-600">
              Showing {showFrom} - {showTo} of {filteredData.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={gotoPrev} className="px-3 py-1 border rounded disabled:opacity-50" disabled={page === 1}>Prev</button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                return (
                  <button key={n} onClick={() => gotoPage(n)} className={`px-3 py-1 rounded ${n === page ? 'bg-[#FDE68A]' : 'border'}`}>
                    {n}
                  </button>
                );
              })}
            </div>
            <button onClick={gotoNext} className="px-3 py-1 border rounded" disabled={page === totalPages || totalPages === 0}>Next</button>
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-2 relative">
          <button onClick={printPage} className="px-4 py-2 bg-[#D97706] text-white rounded shadow hover:bg-[#C49518]">
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
                <button onClick={exportToPDF} className="block w-full px-4 py-2 text-left hover:bg-gray-100">PDF</button>
                <button onClick={exportToCSV} className="block w-full px-4 py-2 text-left hover:bg-gray-100">CSV</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
