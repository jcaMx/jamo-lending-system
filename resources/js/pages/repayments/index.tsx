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
      <div className="m-4 bg-white p-6 rounded-lg space-y-4 ">
        {/* Breadcrumb */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Repayments</h2>
          <div className="flex gap-2 items-center m-4">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or loan number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Loan No</th>
                <th className="px-4 py-2 border">Method</th>
                <th className="px-4 py-2 border">Collected By</th>
                <th className="px-4 py-2 border">Collection Date</th>
                <th className="px-4 py-2 border">Paid Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredRepayments.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{r.id}</td>
                  <td className="px-4 py-2 border">{r.borrowerName}</td>
                  <td className="px-4 py-2 border">{r.loanNo}</td>
                  <td className="px-4 py-2 border">{r.method}</td>
                  <td className="px-4 py-2 border">{r.collectedBy}</td>
                  <td className="px-4 py-2 border">{new Date (r.collectionDate).toLocaleString('en-PH')}</td>
                  <td className="px-4 py-2 border">{r.amount.toLocaleString('en-PH', {style: 'currency', currency: 'PHP'})}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}