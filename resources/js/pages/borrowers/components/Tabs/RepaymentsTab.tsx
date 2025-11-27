import React from "react";
import { Button } from "@/components/ui/button";

export type Repayment = {
  id?: number;
  name?: string;
  loanNo?: string;
  method?: string;
  collectedBy?: string;
  collectionDate?: string | null;
  paidAmount?: number | null;
};

type RepaymentsTabProps = {
  repayments?: Repayment[];
};

export default function RepaymentsTab({ repayments = [] }: RepaymentsTabProps) {
  const list = Array.isArray(repayments) ? repayments : [];

  const formatDate = (date?: string | null) => {
    if (!date) return "";
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString("en-PH");
  };

  return (
    <div className="w-full">
      {/* Header Button */}
      {/* <div className="flex justify-end mb-4">
        <Link href={`/Repayments/add`}>
        <Button className="bg-[#FABF24] text-black">Add Repayment</Button>
        </Link>
      </div> */}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-white rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Loan No.</th>
              <th className="px-3 py-2 text-left">Method</th>
              <th className="px-3 py-2 text-left">Collection Date</th>
              <th className="px-3 py-2 text-left">Paid Amount</th>
              <th className="px-3 py-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {list.length > 0 ? (
              list.map((r) => (
                <tr key={r.id ?? `repayment-${r.loanNo}-${r.collectionDate}`} className="border-b hover:bg-gray-50">
                  <td className="px-3 py-2">{r.name || "-"}</td>
                  <td className="px-3 py-2">{r.loanNo || "-"}</td>
                  <td className="px-3 py-2">{r.method || "-"}</td>
                  <td className="px-3 py-2">{formatDate(r.collectionDate)}</td>

                  <td className="px-3 py-2 font-semibold">
                    ₱{Number(r.paidAmount ?? 0).toLocaleString("en-PH")}
                  </td>

                  <td className="px-3 py-2 text-orange-500 cursor-pointer">
                    Edit
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-3 py-3 text-center text-gray-500"
                >
                  No repayments yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
