import React from "react";
import { Button } from "@/components/ui/button";

export default function RepaymentsTab({ repayments }) {
  return (
    <div className="overflow-x-auto">

      <table className="min-w-full bg-white border rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-left">Name</th>
            <th className="px-3 py-2 text-left">Loan No.</th>
            <th className="px-3 py-2 text-left">Method</th>
            <th className="px-3 py-2 text-left">Collected By</th>
            <th className="px-3 py-2 text-left">Collection Date</th>
            <th className="px-3 py-2 text-left">Paid Amount</th>
            <th className="px-3 py-2 text-left">Action</th>
          </tr>
        </thead>

        <tbody>
          {repayments.length > 0 ? (
            repayments.map((r, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="px-3 py-2">{r.name}</td>
                <td className="px-3 py-2">{r.loanNo}</td>
                <td className="px-3 py-2">{r.method}</td>
                <td className="px-3 py-2">{r.collectedBy}</td>
                <td className="px-3 py-2">{r.collectionDate}</td>
                <td className="px-3 py-2 font-semibold">
                  ₱{r.paidAmount.toLocaleString()}
                </td>
                <td className="px-3 py-2 text-orange-500 cursor-pointer">
                  Edit
                </td>
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

      <div className="flex justify-end mb-2">
        <Button className="bg-[#FABF24] text-black mt-5">Add Repayment</Button>
      </div>
    </div>
  );
}
