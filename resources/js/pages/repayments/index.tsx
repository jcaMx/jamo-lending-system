import React, { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Repayments', href: '/repayments' },
];

type Repayment = {
  id: number;
  borrowerName: string;
  loanNo: string;
  method: string;
  collectedBy: string;
  collectionDate: string;
  amount: number;
};

type Props = {
  repayments: Repayment[];
};

export default function RepaymentsIndex({ repayments }: Props) {
  const [search, setSearch] = useState('');

  const filteredRepayments = useMemo(() => {
    return repayments.filter(r =>
      r.borrowerName.toLowerCase().includes(search.toLowerCase()) ||
      r.loanNo.toLowerCase().includes(search.toLowerCase())
    );
  }, [repayments, search]);

  return (
    <AppLayout>
      <Head title="Repayments" />
      
      {/* Header & Search */}
      <div className="m-10 flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">Repayments</h1>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or loan number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-[#FABF24] focus:ring-2 focus:ring-[#FAE6A0] focus:outline-none transition"
          />
        </div>
      </div>

      {/* Repayments Table */}
      <div className="mx-10 overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Borrower Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Loan No</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Method</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Collected By</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Collection Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Paid Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredRepayments.length > 0 ? (
              filteredRepayments.map(r => (
                <tr key={r.id} className="hover:bg-[#FFF8E6] transition-colors duration-150">
                  <td className="px-4 py-3 text-sm text-gray-600">{r.id}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.borrowerName}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.loanNo}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.method}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{r.collectedBy}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{new Date(r.collectionDate).toLocaleString('en-PH')}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{r.amount.toLocaleString('en-PH', {style: 'currency', currency: 'PHP'})}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500 text-sm italic">
                  No repayments found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}