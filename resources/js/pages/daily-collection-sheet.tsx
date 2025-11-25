import React, { useState, useRef } from 'react';
import { router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Daily Collection Sheet', href: '/daily-collections' },
];

interface Loan {
  id: number;
  name: string;
  loanNo: string;
  principal: number;
  interest: number;
  penalty: number;
  total_due: number;
  collector: string;
  collection_date: string;
}

interface Props {
  due_loans: Loan[];
  collectors: string[];
}

export default function DailyCollectionSheet({ due_loans, collectors }: Props) {
  const [searchCollector, setSearchCollector] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const loansToDisplay = due_loans;

  const handleFilterChange = () => {
    router.get('/daily-collections', {
      collector: searchCollector || undefined,
      date: searchDate || undefined,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  // CSV Export
  const exportToCSV = () => {
    const headers = ['#', 'Borrower', 'Loan No', 'Principal', 'Interest', 'Penalty', 'Total Due (₱)'];
    const rows = loansToDisplay.map((loan, index) => [
      index + 1,
      loan.name ?? '',
      loan.loanNo ?? '',
      loan.principal ?? 0,
      loan.interest ?? 0,
      loan.penalty ?? 0,
      loan.total_due ?? 0,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map(r => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = 'Daily_Collection_Sheet.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDropdownOpen(false);
  };

  // PDF Export (simple approach using print)
  const exportToPDF = () => {
    if (!printRef.current) return;
    const printWindow = window.open('', '', 'width=900,height=650');
    if (!printWindow) return;

    const style = `
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #666; padding: 6px; text-align: left; }
        th { background: #f3f3f3; }
      </style>
    `;

    printWindow.document.write(`
      <html>
        <head>
          <title>Daily Collection Sheet</title>
          ${style}
        </head>
        <body class="p-10 font-sans text-gray-800">
          <header class="text-center border-b pb-6 mb-8">
            <div style="display: flex; justify-content: center;">
              <img src="/images/jamo-logo-2.png" class="h-20 mb-3" alt="Logo" />
            </div>
            <h1 class="text-2xl font-bold tracking-wide">Daily Collection Sheet</h1>
            <p class="text-sm text-gray-600 mt-1">Purok 1B Kisante, Makilala, North Cotabato Philippines</p>
            <p class="text-sm text-gray-600 mt-1">+639120313776</p>
          </header>
          <main class="prose max-w-none">${printRef.current.innerHTML}</main>
          <footer class="mt-12 text-center text-xs text-gray-500 border-t pt-4">Page 1</footer>
        </body>
      </html>
    `);

    printWindow.document.close();
    
    printWindow.onload = () => printWindow.print();
    setDropdownOpen(false);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Daily Collection Sheet" />
      <div className="bg-white rounded-lg  p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Daily Collection Sheet</h2>

          {/* Filters */}
          <div className="flex gap-2">
            {/* Collector Dropdown */}
            <select
              value={searchCollector}
              onChange={(e) => setSearchCollector(e.target.value)}
              className="px-3 py-2 border rounded shadow-sm"
            >
              <option value="">All Collectors</option>
              {collectors.map((collector) => (
                <option key ={collector} value={collector}>{collector}</option>
              ))}
            </select>

            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="px-3 py-2 border rounded shadow-sm"
            />
            <Button
              onClick={handleFilterChange}
              className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
            >
              Filter
            </Button>
          </div>
        </div>

        <div ref={printRef} className="overflow-x-auto">
          <table className="min-w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">#</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Borrower</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Loan No</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Principal</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Interest</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Penalty</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Total Due (₱)</th>
              </tr>
            </thead>
            <tbody>
              {loansToDisplay.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No due loans found.
                  </td>
                </tr>
              ) : (
                loansToDisplay.map((loan, index) => (
                  <tr key={loan.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{loan.name ?? ''}</td>
                    <td className="px-4 py-2">{loan.loanNo ?? ''}</td>
                    <td className="px-4 py-2">{loan.principal.toLocaleString()}</td>
                    <td className="px-4 py-2">{loan.interest.toLocaleString()}</td>
                    <td className="px-4 py-2">{loan.penalty.toLocaleString()}</td>
                    <td className="px-4 py-2">{loan.total_due.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-4 relative">
          <Button
            onClick={() => window.print()}
            className="px-4 py-2 bg-[#D97706] text-sm text-white rounded shadow hover:bg-[#C49518]"
          >
            Print Sheet
          </Button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-4 py-2 bg-[#FABF24] text-sm text-white rounded shadow hover:bg-[#C49518]"
            >
              Export
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-10">
                <button
                  onClick={exportToPDF}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  PDF
                </button>
                <button
                  onClick={exportToCSV}
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                >
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
