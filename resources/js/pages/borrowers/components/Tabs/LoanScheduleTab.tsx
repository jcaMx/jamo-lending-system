import React from "react";
import { Button } from "@/components/ui/button";

export default function RepaymentsTab({ amortizationSchedule }) {
  return (
    <div className="overflow-x-auto">

      <table className="min-w-full bg-white border rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-left">#</th>
            <th className="px-3 py-2 text-left">Date</th>
            <th className="px-3 py-2 text-left">Principal</th>
            <th className="px-3 py-2 text-left">Interest</th>
            <th className="px-3 py-2 text-left">Penalty</th>
            <th className="px-3 py-2 text-left">Total Due Amount</th>
            <th className="px-3 py-2 text-left">Balance</th>
            <th className="px-3 py-2 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {amortizationSchedule.length > 0 ? (
            amortizationSchedule.map((r, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">{r.date}</td>
                <td className="px-3 py-2">{r.principal}</td>
                <td className="px-3 py-2">{r.interest}</td>
                <td className="px-3 py-2">{r.penalty}</td>
                <td className="px-3 py-2">{r.totalDueAmount}</td>
                <td className="px-3 py-2">{r.balance}</td>
                <td className="px-3 py-2">{r.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="px-3 py-3 text-center text-gray-500">
                No repayments yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
}
