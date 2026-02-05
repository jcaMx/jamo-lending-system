import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Search } from 'lucide-react';

type Repayment = {
  id: number;
  loanNo: string;
  method: string;
  collectionDate: string | null;
  amount: number;
  receiptNumber?: string;
};

interface Props {
  repayments: Repayment[];
}

export default function CustomerRepaymentsIndex({ repayments }: Props) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return repayments;

    return repayments.filter(r =>
      r.loanNo.toLowerCase().includes(search.toLowerCase()) ||
      r.receiptNumber?.toLowerCase().includes(search.toLowerCase())
    );
  }, [repayments, search]);

  return (
    <CustomerLayout>
      <Head title="My Repayments" />

      {/* Header */}
      <div className="m-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-semibold text-gray-800">
          My Repayments
        </h1>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by loan or receipt no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm
              focus:border-[#FABF24] focus:ring-2 focus:ring-[#FAE6A0]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="mx-10 overflow-x-auto bg-white rounded-xl border border-gray-200 shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Receipt</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Loan No</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Method</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
              <th className="px-4 py-3 text-right text-sm font-semibold">Amount</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filtered.length ? (
              filtered.map(r => (
                <tr key={r.id} className="hover:bg-[#FFF8E6]">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {r.receiptNumber ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {r.loanNo}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {r.method}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {r.collectionDate
                      ? new Date(r.collectionDate).toLocaleDateString('en-PH')
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">
                    ₱{r.amount.toLocaleString('en-PH')}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500 italic">
                  No repayments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </CustomerLayout>
  );
}
