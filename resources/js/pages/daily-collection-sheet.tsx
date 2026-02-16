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

interface Collection {
  id: number | string;
  name: string;
  loanNo: string;
  amount: number;
  method: string;
  reference_no?: string;
  collected_by: string;
  collection_date: string;
  schedule_no: number | string;
  due_date?: string;
}

interface Props {
  due_loans: Loan[];
  collections?: Collection[];
  collectors: string[];
  date?: string;
}

export default function DailyCollectionSheet({ due_loans, collections = [], collectors, date }: Props) {
  const [searchCollector, setSearchCollector] = useState('');
  const [searchDate, setSearchDate] = useState(date || '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'due' | 'collections'>('due');
  const printRef = useRef<HTMLDivElement>(null);

  const loansToDisplay = due_loans;
  const totalCollections = collections.reduce((sum, c) => sum + c.amount, 0);
  const totalDueAmount = loansToDisplay.reduce((sum, loan) => sum + (loan.total_due ?? 0), 0);
  const reportDate = searchDate || date || new Date().toISOString().slice(0, 10);

  const formatCurrency = (amount: number) =>
    `PHP ${Number(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const handleFilterChange = () => {
    router.get('/daily-collections', {
      collector: searchCollector || undefined,
      date: searchDate || undefined,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const exportToCSV = () => {
    const headers = activeTab === 'due'
      ? ['#', 'Borrower', 'Loan No', 'Principal', 'Interest', 'Penalty', 'Total Due (PHP)']
      : ['#', 'Borrower', 'Loan No', 'Schedule #', 'Due Date', 'Amount (PHP)', 'Method', 'Reference No', 'Collected By', 'Date'];

    const rows = activeTab === 'due'
      ? loansToDisplay.map((loan, index) => [
          index + 1,
          loan.name ?? '',
          loan.loanNo ?? '',
          loan.principal ?? 0,
          loan.interest ?? 0,
          loan.penalty ?? 0,
          loan.total_due ?? 0,
        ])
      : collections.map((collection, index) => [
          index + 1,
          collection.name ?? '',
          collection.loanNo ?? '',
          collection.schedule_no ?? '',
          collection.due_date ?? '',
          collection.amount ?? 0,
          collection.method ?? '',
          collection.reference_no || 'N/A',
          collection.collected_by ?? '',
          collection.collection_date ?? '',
        ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map((r) => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = activeTab === 'due' ? 'Daily_Collection_Due_Loans.csv' : 'Daily_Collection_Collections.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDropdownOpen(false);
  };

  const exportToPDF = async () => {
    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
      const response = await fetch('/daily-collections/export-pdf', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/pdf',
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          collector: searchCollector || undefined,
          date: searchDate || undefined,
          tab: activeTab,
        }),
      });

      if (!response.ok) {
        throw new Error('PDF export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = activeTab === 'due' ? 'Daily_Collection_Due_Loans.pdf' : 'Daily_Collection_Collections.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
      setDropdownOpen(false);
    } catch (error) {
      console.error(error);
      alert('Failed to export PDF. Check Laravel logs and ensure DOMPDF is installed.');
    }
  };

  const printSelectedTab = () => {
    if (!printRef.current) return;

    const reportTitle = activeTab === 'due' ? 'Daily Collection Sheet - Due Loans' : 'Daily Collection Sheet - Collections';
    const reportSummary = activeTab === 'due'
      ? `Records: ${loansToDisplay.length} | Total Due: ${formatCurrency(totalDueAmount)}`
      : `Records: ${collections.length} | Total Collected: ${formatCurrency(totalCollections)}`;

    const printWindow = window.open('', '_blank', 'width=1024,height=768');
    if (!printWindow) {
      alert('Unable to open print preview. Please allow pop-ups for this site.');
      return;
    }

    const tableMarkup = printRef.current.innerHTML;
    printWindow.document.write(`
      <html>
        <head>
          <title>${reportTitle}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 24px; color: #111827; }
            .report-header { border-bottom: 2px solid #111827; padding-bottom: 12px; margin-bottom: 16px; }
            .report-title { font-size: 20px; font-weight: 700; margin: 0; }
            .report-meta { margin-top: 6px; font-size: 12px; color: #4b5563; }
            .report-summary { margin-top: 8px; font-size: 12px; font-weight: 600; color: #111827; }
            table { width: 100%; border-collapse: collapse; font-size: 12px; }
            th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            th { background: #f3f4f6; font-weight: 700; }
            tr:nth-child(even) td { background: #f9fafb; }
          </style>
        </head>
        <body>
          <div class="report-header">
            <h1 class="report-title">${reportTitle}</h1>
            <div class="report-meta">Date: ${reportDate}${searchCollector ? ` | Collector: ${searchCollector}` : ''}</div>
            <div class="report-summary">${reportSummary}</div>
          </div>
          ${tableMarkup}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Daily Collection Sheet" />
      <div className="bg-white rounded-lg p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Daily Collection Sheet</h2>

          <div className="flex gap-2 items-center">
            <select
              value={searchCollector}
              onChange={(e) => setSearchCollector(e.target.value)}
              className="px-3 py-2 border rounded shadow-sm"
            >
              <option value="">All Collectors</option>
              {collectors.map((collector) => (
                <option key={collector} value={collector}>{collector}</option>
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
              className="px-4 py-2 bg-yellow-600 text-white rounded shadow hover:bg-yellow-700"
            >
              Filter
            </Button>
          </div>
        </div>

        <div className="border-b mb-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('due')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'due'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Due Loans ({loansToDisplay.length})
            </button>
            <button
              onClick={() => setActiveTab('collections')}
              className={`px-4 py-2 font-medium ${
                activeTab === 'collections'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Collections ({collections.length})
            </button>
          </div>
        </div>

        <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-lg font-semibold text-gray-800">
                {activeTab === 'due' ? 'Due Loans Print Sheet' : 'Collections Print Sheet'}
              </p>
              <p className="text-sm text-gray-600">
                Date: {reportDate}{searchCollector ? ` | Collector: ${searchCollector}` : ''}
              </p>
            </div>
            <div className="text-sm font-medium text-gray-700">
              {activeTab === 'due'
                ? `Records: ${loansToDisplay.length} | Total Due: ${formatCurrency(totalDueAmount)}`
                : `Records: ${collections.length} | Total Collected: ${formatCurrency(totalCollections)}`}
            </div>
          </div>
        </div>

        <div ref={printRef} className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
          {activeTab === 'due' ? (
            <table className="min-w-full overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">#</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Borrower</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Loan No</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Principal</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Interest</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Penalty</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Total Due (PHP)</th>
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
                      <td className="px-4 py-2">{formatCurrency(loan.principal)}</td>
                      <td className="px-4 py-2">{formatCurrency(loan.interest)}</td>
                      <td className="px-4 py-2">{formatCurrency(loan.penalty)}</td>
                      <td className="px-4 py-2 font-semibold">{formatCurrency(loan.total_due)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="min-w-full overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">#</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Borrower</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Loan No</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Schedule #</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Due Date</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Amount</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Method</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Reference No</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Collected By</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
                </tr>
              </thead>
              <tbody>
                {collections.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-6 text-gray-500">
                      No collections found for this date.
                    </td>
                  </tr>
                ) : (
                  collections.map((collection, index) => (
                    <tr key={collection.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{collection.name}</td>
                      <td className="px-4 py-2">{collection.loanNo}</td>
                      <td className="px-4 py-2">{collection.schedule_no}</td>
                      <td className="px-4 py-2">{collection.due_date ?? 'N/A'}</td>
                      <td className="px-4 py-2 font-semibold">{formatCurrency(collection.amount)}</td>
                      <td className="px-4 py-2">{collection.method}</td>
                      <td className="px-4 py-2">{collection.reference_no || 'N/A'}</td>
                      <td className="px-4 py-2">{collection.collected_by}</td>
                      <td className="px-4 py-2">{collection.collection_date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-4 relative">
          <Button
            onClick={printSelectedTab}
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
