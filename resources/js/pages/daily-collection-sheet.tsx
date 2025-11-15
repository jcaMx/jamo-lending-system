import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Daily Collection Sheet', href: '/dcs' },
];

export default function DailyCollectionSheet({ due_loans }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Daily Collection Sheet" />

      <div className="bg-white rounded-lg shadow-lg border p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Daily Collection Sheet</h2>
          <Button
            onClick={() => window.print()}
            className="px-4 py-2"
          >
            Print Sheet
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">#</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Borrower</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Loan No</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Payment Method</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Collector</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Collection Date</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Total Due (₱)</th>
              </tr>
            </thead>
            <tbody>
              {due_loans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No due loans found.
                  </td>
                </tr>
              ) : (
                due_loans.map((loan, index) => (
                  <tr key={loan.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{index + 1}</td>
                    <td className="px-4 py-2">{loan.name}</td>
                    <td className="px-4 py-2">{loan.loanNo}</td>
                    <td className="px-4 py-2">{loan.principal}</td>
                    <td className="px-4 py-2">{loan.interest}</td>
                    <td className="px-4 py-2">{loan.penalty}</td>
                    <td className="px-4 py-2">{loan.total_due.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
