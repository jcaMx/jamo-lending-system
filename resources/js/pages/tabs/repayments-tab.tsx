// resources/js/Pages/Borrowers/Tabs/RepaymentsTab.tsx
import React from 'react';
import { Card, CardContent, Button } from '@/components/ui/card';

export default function RepaymentsTab({ repayments = [] }: any) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-end mb-4">
          <button className="bg-yellow-400 text-black px-4 py-2 rounded">Add Repayment</button>
        </div>
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr>
              <th>Name</th><th>Loan No.</th><th>Method</th><th>Collected By</th><th>Date</th><th>Paid Amount</th><th></th>
            </tr>
          </thead>
          <tbody>
            {repayments.map((r: any) => (
              <tr key={r.id} className="border-t">
                <td className="py-3">{r.name}</td>
                <td>{r.loan_number}</td>
                <td>{r.method}</td>
                <td>{r.collected_by}</td>
                <td>{r.paid_amount}</td>
                <td>{r.collection_date}</td>
                <td className="font-semibold">{r.paid_amount}</td>
                <td className="text-right"><a className="text-orange-500">Edit</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
