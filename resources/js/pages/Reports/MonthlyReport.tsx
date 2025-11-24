// resources/js/Pages/Reports/MCPR.tsx  (or wherever you put it)
import { useMemo, useRef, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';

type Row = {
  month: string; // e.g. "2025-11" or "November 2025"
  loanReleased: number;
  sixPercentDeduction: number;
  advanceTenPercentDeduction: number;
  LPP: number; // Loan Principal Payment
  LIP: number; // Loan Interest Payment
  interestType: '5%' | '10%';
};

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Reports', href: '/Reports' },
  { title: 'Monthly Report', href: '/Reports/MonthlyReport' },
];

export default function MCPR() {
  const [searchTerm, setSearchTerm] = useState('');
  const [interestFilter, setInterestFilter] = useState<'ALL' | '5%' | '10%'>('ALL');
  const [monthFilter, setMonthFilter] = useState<string>(''); // yyyy-mm (input type="month")
  const [yearFilter, setYearFilter] = useState<string>('');
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const printRef = useRef<HTMLDivElement | null>(null);

  // Sample data (replace with your real data)
  const data: Row[] = [
    { month: '2025-11', loanReleased: 800000, sixPercentDeduction: 48000, advanceTenPercentDeduction: 80000, LPP: 400000, LIP: 40000, interestType: '10%' },
    { month: '2025-12', loanReleased: 750000, sixPercentDeduction: 0, advanceTenPercentDeduction: 75000, LPP: 350000, LIP: 35000, interestType: '10%' },
    { month: '2026-01', loanReleased: 600000, sixPercentDeduction: 30000, advanceTenPercentDeduction: 0, LPP: 300000, LIP: 30000, interestType: '5%' },
    { month: '2026-02', loanReleased: 700000, sixPercentDeduction: 42000, advanceTenPercentDeduction: 70000, LPP: 380000, LIP: 32000, interestType: '5%' },
    // add more rows to test pagination
    { month: '2026-03', loanReleased: 900000, sixPercentDeduction: 54000, advanceTenPercentDeduction: 90000, LPP: 500000, LIP: 45000, interestType: '10%' },
    { month: '2026-04', loanReleased: 550000, sixPercentDeduction: 33000, advanceTenPercentDeduction: 0, LPP: 260000, LIP: 26000, interestType: '5%' },
    { month: '2026-05', loanReleased: 680000, sixPercentDeduction: 40800, advanceTenPercentDeduction: 68000, LPP: 340000, LIP: 34000, interestType: '10%' },
    { month: '2026-06', loanReleased: 720000, sixPercentDeduction: 43200, advanceTenPercentDeduction: 72000, LPP: 360000, LIP: 36000, interestType: '10%' },
    { month: '2026-07', loanReleased: 610000, sixPercentDeduction: 36600, advanceTenPercentDeduction: 0, LPP: 305000, LIP: 30500, interestType: '5%' },
    { month: '2026-08', loanReleased: 790000, sixPercentDeduction: 47400, advanceTenPercentDeduction: 79000, LPP: 395000, LIP: 39500, interestType: '10%' },
  ];

  // Derived filtered data
  const filtered = useMemo(() => {
    return data.filter((r) => {
      const monthLabel = formatMonthLabel(r.month); // human-friendly
      const matchSearch = monthLabel.toLowerCase().includes(searchTerm.toLowerCase());
      const matchInterest = interestFilter === 'ALL' || r.interestType === interestFilter;
      const monthPart = r.month.split('-')[1]; // "YYYY-MM" -> "MM"
      const matchMonthPicker =
        !monthFilter || monthPart === String(monthFilter).padStart(2, '0');
      const matchYear =
        !yearFilter || r.month.startsWith(String(yearFilter));
      return matchSearch && matchInterest && matchMonthPicker && matchYear;
    });
  }, [data, searchTerm, interestFilter, monthFilter, yearFilter]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Totals (for filtered dataset)
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

  // UTIL: format month label (yyyy-mm -> "Month Year")
  function formatMonthLabel(mm: string) {
    try {
      // mm expected 'YYYY-MM'
      const [y, m] = mm.split('-').map(Number);
      const d = new Date(y, (m ?? 1) - 1, 1);
      return d.toLocaleString('default', { month: 'long', year: 'numeric' });
    } catch {
      return mm;
    }
  }

  // CSV Export (exports all filtered rows, not only current page)
  const exportToCSV = () => {
    const headers = ['Month', 'Loan Released', '6% Deduction', 'Advance 10% Interest', 'Loan Principal Payment', 'Loan Interest Payment', 'Interest Type'];
    const rows = filtered.map((r) => [
      formatMonthLabel(r.month),
      r.loanReleased.toFixed(2),
      r.sixPercentDeduction.toFixed(2),
      r.advanceTenPercentDeduction.toFixed(2),
      r.LPP.toFixed(2),
      r.LIP.toFixed(2),
      r.interestType,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].map((r) => r.join(',')).join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = 'monthly_report.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDropdownOpen(false);
  };

  // PDF export (call Laravel route; make sure server route exists)
  const exportToPDF = async () => {
    try {
      const resp = await fetch('/reports/mcpr/export-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '',
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
      setDropdownOpen(false);
    } catch (err) {
      console.error(err);
      alert('PDF export failed — check Laravel route and logs.');
    }
  };

  // Print (styled)
  const printPage = () => {
    if (!printRef.current) return;
    const content = printRef.current.innerHTML;
    const style = `
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      <style>
        body{font-family: Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;}
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #bdbdbd; padding: 8px; text-align: left; font-size: 12px; }
        th { background: #f3f4f6; font-weight: 600; }
        tfoot td { font-weight: 700; background: #f9fafb; }
        .header { text-align:center; margin-bottom: 16px; }
      </style>
    `;
    const w = window.open('', '', 'width=900,height=700');
    if (!w) return;
    w.document.write(`
      <html>
        <head><title>Monthly Report</title>${style}</head>
        <body class="p-8">
          <div class="header">
            <img src="/images/jamo-logo-2.png" alt="logo" style="height:60px;margin-bottom:8px" />
            <div style="font-weight:700;font-size:18px">Monthly Cash Position Report</div>
            <div style="font-size:12px;color:#6b7280">Municipality / Office · Address · Contact</div>
            <hr style="margin:12px 0;border:none;border-top:1px solid #e5e7eb"/>
          </div>
          ${content}
          <div style="text-align:center;margin-top:20px;font-size:11px;color:#6b7280">Page 1</div>
        </body>
      </html>
    `);

    w.document.close();
    w.onload = () => {
      w.focus();
      w.print();
    }

  };

  // helpers for pagination UI
  const gotoPrev = () => setPage((p) => Math.max(1, p - 1));
  const gotoNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const gotoPage = (n: number) => setPage(() => Math.min(Math.max(1, n), totalPages));

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Monthly Report" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Monthly Report</h1>


        </div>

                {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border space-y-4">

        <h2 className="text-lg font-semibold text-gray-700">Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Month */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Month
            </label>
            <select
              value={monthFilter}
              onChange={(e) => { setMonthFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border rounded-md shadow-sm bg-white 
                        focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="">All Months</option>
              {[
                'January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'
              ].map((m, idx) => (
                <option key={idx} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* Year */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Year
            </label>
            <select
              value={yearFilter}
              onChange={(e) => { setYearFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border rounded-md shadow-sm bg-white 
                        focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="">All Years</option>

              {Array.from({ length: 8 }).map((_, i) => {
                const year = new Date().getFullYear() - i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Interest Type */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Interest Type
            </label>
            <select
              value={interestFilter}
              onChange={(e) => { setInterestFilter(e.target.value as 'ALL' | '5%' | '10%'); setPage(1); }}
              className="px-3 py-2 border rounded-md shadow-sm bg-white 
                        focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            >
              <option value="ALL">All Interest Types</option>
              <option value="5%">5% Interest</option>
              <option value="10%">10% Interest</option>
            </select>
          </div>

          {/* Search (Optional) */}
          {/* <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Search (optional)
            </label>
            <input
              type="text"
              placeholder="Search keyword..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              className="px-3 py-2 border rounded-md shadow-sm w-full 
                        focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
            />
          </div> */}

        </div>
        </div>



        {/* Table (printRef wraps the printable table content) */}
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
                {paged.map((r, i) => (
                  <tr key={i} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{formatMonthLabel(r.month)}</td>
                    <td className="px-4 py-2">₱{r.loanReleased.toLocaleString()}</td>
                    <td className="px-4 py-2">₱{r.sixPercentDeduction.toLocaleString()}</td>
                    <td className="px-4 py-2">₱{r.advanceTenPercentDeduction.toLocaleString()}</td>
                    <td className="px-4 py-2">₱{r.LPP.toLocaleString()}</td>
                    <td className="px-4 py-2">₱{r.LIP.toLocaleString()}</td>
                    <td className="px-4 py-2">{r.interestType}</td>
                  </tr>
                ))}

                {/* Totals row (shown on table -- totals reflect all filtered rows) */}
                <tr className="bg-gray-50 font-semibold">
                  <td className="px-4 py-2 text-right">Totals:</td>
                  <td className="px-4 py-2">₱{totals.loanReleased.toLocaleString()}</td>
                  <td className="px-4 py-2">₱{totals.sixPercentDeduction.toLocaleString()}</td>
                  <td className="px-4 py-2">₱{totals.advanceTenPercentDeduction.toLocaleString()}</td>
                  <td className="px-4 py-2">₱{totals.LPP.toLocaleString()}</td>
                  <td className="px-4 py-2">₱{totals.LIP.toLocaleString()}</td>
                  <td className="px-4 py-2"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-600">
              Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={gotoPrev} className="px-3 py-1 border rounded disabled:opacity-50" disabled={page === 1}>Prev</button>

            {/* page numbers */}
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
            <button
              className="px-4 py-2 bg-[#D97706] text-white rounded shadow hover:bg-[#C49518]"
              onClick={printPage}
            >
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
