import { useEffect, useMemo, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

type Row = {
  month: string;
  loanReleased: number;
  sixPercentDeduction: number;
  advanceTenPercentDeduction: number;
  LPP: number;
  LIP: number;
  interestType: string;
};

interface Props {
  rows: Row[];
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Reports', href: '/Reports' },
  { title: 'Monthly Report', href: '/Reports/MonthlyReport' },
];

export default function MCPR({ rows = [] }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [interestFilter, setInterestFilter] = useState<'ALL' | '5%' | '10%'>('ALL');
  const [monthFilter, setMonthFilter] = useState<string>('');
  const [yearFilter, setYearFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const printRef = useRef<HTMLDivElement | null>(null);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const monthLabel = formatMonthLabel(r.month);
      const matchSearch = monthLabel.toLowerCase().includes(searchTerm.toLowerCase());
      const matchInterest = interestFilter === 'ALL' || r.interestType === interestFilter;
      const monthPart = r.month.split('-')[1] ?? '';
      const matchMonth = !monthFilter || monthPart === String(monthFilter).padStart(2, '0');
      const matchYear = !yearFilter || r.month.startsWith(String(yearFilter));
      return matchSearch && matchInterest && matchMonth && matchYear;
    });
  }, [rows, searchTerm, interestFilter, monthFilter, yearFilter]);

  useEffect(() => {
    setPage(1);
  }, [searchTerm, interestFilter, monthFilter, yearFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  const totals = useMemo(() => {
    return filtered.reduce(
      (acc, r) => {
        acc.loanReleased += r.loanReleased;
        acc.sixPercentDeduction += r.sixPercentDeduction;
        acc.advanceTenPercentDeduction += r.advanceTenPercentDeduction;
        acc.LPP += r.LPP;
        acc.LIP += r.LIP;
        return acc;
      },
      { loanReleased: 0, sixPercentDeduction: 0, advanceTenPercentDeduction: 0, LPP: 0, LIP: 0 }
    );
  }, [filtered]);

  function formatMonthLabel(mm: string) {
    try {
      const [y, m] = mm.split('-').map(Number);
      const d = new Date(y, (m ?? 1) - 1, 1);
      return d.toLocaleString('default', { month: 'long', year: 'numeric' });
    } catch {
      return mm;
    }
  }

  const exportToCSV = () => {
    const headers = ['Month', 'Loan Released', '6% Deduction', 'Advance 10% Interest', 'Loan Principal Payment', 'Loan Interest Payment', 'Interest Type'];
    const csvRows = filtered.map((r) => [
      formatMonthLabel(r.month),
      r.loanReleased.toFixed(2),
      r.sixPercentDeduction.toFixed(2),
      r.advanceTenPercentDeduction.toFixed(2),
      r.LPP.toFixed(2),
      r.LIP.toFixed(2),
      r.interestType,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...csvRows].map((r) => r.join(',')).join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = 'Monthly_Report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDropdownOpen(false);
  };

  const exportToPDF = async () => {
    try {
      const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
      const resp = await fetch('/Reports/monthly/export-pdf', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ rows: filtered }),
      });
      if (!resp.ok) throw new Error(`Export failed (${resp.status})`);
      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Monthly_Report.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setDropdownOpen(false);
    } catch (err) {
      console.error(err);
      alert('PDF export failed - check Laravel route and logs.');
    }
  };

  const printPage = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const style = `
      <style>
        body{font-family: Arial, sans-serif; margin: 24px; color:#111827;}
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #bdbdbd; padding: 8px; text-align: left; font-size: 12px; }
        th { background: #f3f4f6; font-weight: 600; }
        tfoot td { font-weight: 700; background: #f9fafb; }
      </style>
    `;
    const w = window.open('', '', 'width=900,height=700');
    if (!w) return;
    w.document.write(`
      <html>
        <head><title>Monthly Report</title>${style}</head>
        <body>
          <div style="text-align:center;margin-bottom:16px;border-bottom:1px solid #e5e7eb;padding-bottom:10px;">
            <img src="/images/jamo-logo-2.png" alt="logo" style="height:56px;margin-bottom:8px" />
            <div style="font-weight:700;font-size:18px">Monthly Cash Position Report</div>
          </div>
          ${content}
        </body>
      </html>
    `);

    w.document.close();
    w.focus();
    w.print();
  };

  const gotoPrev = () => setPage((p) => Math.max(1, p - 1));
  const gotoNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const gotoPage = (n: number) => setPage(() => Math.min(Math.max(1, n), totalPages));

  const showFrom = filtered.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const showTo = filtered.length === 0 ? 0 : Math.min(page * pageSize, filtered.length);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Monthly Report" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Monthly Report</h1>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Month</label>
              <select
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
                className="px-3 py-2 border rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >
                <option value="">All Months</option>
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((m, idx) => (
                  <option key={idx} value={idx + 1}>{m}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Year</label>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-3 py-2 border rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >
                <option value="">All Years</option>
                {Array.from({ length: 8 }).map((_, i) => {
                  const year = new Date().getFullYear() - i;
                  return <option key={year} value={year}>{year}</option>;
                })}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Interest Type</label>
              <select
                value={interestFilter}
                onChange={(e) => setInterestFilter(e.target.value as 'ALL' | '5%' | '10%')}
                className="px-3 py-2 border rounded-md shadow-sm bg-white focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              >
                <option value="ALL">All Interest Types</option>
                <option value="5%">5% Interest</option>
                <option value="10%">10% Interest</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1">Search Month</label>
              <input
                type="text"
                placeholder="Search month..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-2 border rounded-md shadow-sm w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
            </div>
          </div>
        </div>

        <div ref={printRef}>
          <div className="overflow-hidden rounded-lg border shadow bg-white">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 text-left text-sm text-gray-700">
                  <th className="px-4 py-3">Month</th>
                  <th className="px-4 py-3">Loan Released</th>
                  <th className="px-4 py-3">6% Deduction</th>
                  <th className="px-4 py-3">Advance 10% Interest</th>
                  <th className="px-4 py-3">Loan Principal Payment</th>
                  <th className="px-4 py-3">Loan Interest Payment</th>
                  <th className="px-4 py-3">Interest Type</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-gray-500">No records found.</td>
                  </tr>
                ) : paged.map((r, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{formatMonthLabel(r.month)}</td>
                    <td className="px-4 py-2">PHP {r.loanReleased.toLocaleString()}</td>
                    <td className="px-4 py-2">PHP {r.sixPercentDeduction.toLocaleString()}</td>
                    <td className="px-4 py-2">PHP {r.advanceTenPercentDeduction.toLocaleString()}</td>
                    <td className="px-4 py-2">PHP {r.LPP.toLocaleString()}</td>
                    <td className="px-4 py-2">PHP {r.LIP.toLocaleString()}</td>
                    <td className="px-4 py-2">{r.interestType}</td>
                  </tr>
                ))}

                <tr className="bg-gray-50 font-semibold">
                  <td className="px-4 py-2 text-right">Totals:</td>
                  <td className="px-4 py-2">PHP {totals.loanReleased.toLocaleString()}</td>
                  <td className="px-4 py-2">PHP {totals.sixPercentDeduction.toLocaleString()}</td>
                  <td className="px-4 py-2">PHP {totals.advanceTenPercentDeduction.toLocaleString()}</td>
                  <td className="px-4 py-2">PHP {totals.LPP.toLocaleString()}</td>
                  <td className="px-4 py-2">PHP {totals.LIP.toLocaleString()}</td>
                  <td className="px-4 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-600">Showing {showFrom} - {showTo} of {filtered.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={gotoPrev} className="px-3 py-1 border rounded disabled:opacity-50" disabled={page === 1}>Prev</button>
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
            <button onClick={gotoNext} className="px-3 py-1 border rounded" disabled={page === totalPages}>Next</button>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button className="px-4 py-2 bg-[#D97706] text-white rounded shadow hover:bg-[#C49518]" onClick={printPage}>
            Print
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen((s) => !s)}
              className="px-4 py-2 bg-[#FABF24] text-white rounded shadow hover:bg-[#C49518]"
            >
              Export
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-20">
                <button onClick={exportToPDF} className="w-full text-left px-4 py-2 hover:bg-gray-100">PDF</button>
                <button onClick={exportToCSV} className="w-full text-left px-4 py-2 hover:bg-gray-100">CSV</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
