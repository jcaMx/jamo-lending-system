type ScheduleRow = {
  installment_no: number;
  due_date: string;
  interest_amount?: number;
  penalty_amount?: number;
  installment_amount?: number;
  amount_paid?: number;
  status: string;
};

interface LoanScheduleTabProps {
  amortizationSchedule: ScheduleRow[];
}

export default function LoanScheduleTab({ amortizationSchedule }: LoanScheduleTabProps) {
  if (!amortizationSchedule.length) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded">
        No amortization schedule available for this loan.
      </div>
    );
  }

  return (
    <div className=" border-white overflow-x-auto">
      <table className="min-w-full bg-white border rounded-lg shadow-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-3 py-2 text-left">#</th>
            <th className="px-3 py-2 text-left">Due Date</th>
            <th className="px-3 py-2 text-left">Interest</th>
            <th className="px-3 py-2 text-left">Penalty</th>
            <th className="px-3 py-2 text-left">Installment</th>
            <th className="px-3 py-2 text-left">Amount Paid</th>
            <th className="px-3 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {amortizationSchedule.map((row) => (
            <tr key={row.installment_no} className="border-b hover:bg-gray-50">
              <td className="px-3 py-2">{row.installment_no}</td>
              <td className="px-3 py-2">
                {row.due_date ? new Date(row.due_date).toLocaleDateString() : '—'}
              </td>
              <td className="px-3 py-2">
                ₱{Number(row.interest_amount ?? 0).toLocaleString()}
              </td>
              <td className="px-3 py-2">
                ₱{Number(row.penalty_amount ?? 0).toLocaleString()}
              </td>
              <td className="px-3 py-2">
                ₱{Number(row.installment_amount ?? 0).toLocaleString()}
              </td>
              <td className="px-3 py-2">
                ₱{Number(row.amount_paid ?? 0).toLocaleString()}
              </td>
              <td className="px-3 py-2">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
