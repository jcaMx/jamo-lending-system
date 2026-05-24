type ScheduleRow = {
  installment_no: number;
  due_date?: string | null;
  interest_amount?: number | string;
  penalty_amount?: number | string;
  installment_amount?: number | string;
  amount_paid?: number | string;
  rebate_amount?: number | string;
  status: string;
};

interface LoanScheduleTabProps {
  amortizationSchedule: ScheduleRow[];
  loanAmount?: number | string | null;
  interestType?: string | null;
}

const toNumber = (value?: number | string | null) => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const money = (value?: number | string | null) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toNumber(value));

const dateLabel = (value?: string | null) => {
  if (!value) return 'Pending release';

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime())
    ? 'N/A'
    : parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
};

const statusClass = (status?: string | null) => {
  const normalized = (status ?? '').trim().toLowerCase();

  if (normalized === 'paid') return 'bg-green-100 text-green-800';
  if (normalized === 'overdue') return 'bg-red-100 text-red-800';
  if (normalized === 'unpaid') return 'bg-yellow-100 text-yellow-800';

  return 'bg-gray-100 text-gray-700';
};

export default function LoanScheduleTab({ amortizationSchedule, loanAmount, interestType }: LoanScheduleTabProps) {
  if (!amortizationSchedule.length) {
    return (
      <div className="rounded bg-gray-50 p-6 text-center text-gray-500">
        No amortization schedule available for this loan.
      </div>
    );
  }

  const derivedPrincipal = amortizationSchedule.reduce(
    (sum, row) => sum + Math.max(0, toNumber(row.installment_amount) - toNumber(row.interest_amount)),
    0,
  );
  const totalPrincipal = loanAmount !== undefined && loanAmount !== null ? toNumber(loanAmount) : derivedPrincipal;

  const rows = amortizationSchedule.reduce<
    Array<
      ScheduleRow & {
        beginningBalance: number;
        endingBalance: number;
        scheduledPayment: number;
        amountDue: number;
        principalAmount: number;
      }
    >
  >((items, row, index) => {
    const principal = toNumber(row.installment_amount);
    const interest = toNumber(row.interest_amount);
    const derivedPrincipalAmount = Math.max(0, principal - interest);
    const penalty = toNumber(row.penalty_amount);
    const rebate = toNumber(row.rebate_amount);
    const amountPaid = toNumber(row.amount_paid);
    const beginningBalance = items.length ? items[items.length - 1].endingBalance : totalPrincipal;
    const principalAmount =
      index === amortizationSchedule.length - 1
        ? beginningBalance
        : Math.min(beginningBalance, derivedPrincipalAmount);
    const endingBalance = Math.max(0, beginningBalance - principalAmount);

    items.push({
      ...row,
      beginningBalance,
      endingBalance: endingBalance < 0.01 ? 0 : endingBalance,
      principalAmount,
      scheduledPayment: principal,
      amountDue: Math.max(0, principal + penalty - rebate - amountPaid),
    });

    return items;
  }, []);

  const totalBeginningBalance = rows.reduce((sum, row) => sum + row.beginningBalance, 0);
  const totalInterest = rows.reduce((sum, row) => sum + toNumber(row.interest_amount), 0);
  const totalPenalty = rows.reduce((sum, row) => sum + toNumber(row.penalty_amount), 0);
  const totalRebate = rows.reduce((sum, row) => sum + toNumber(row.rebate_amount), 0);
  const scheduledTotal = rows.reduce((sum, row) => sum + row.scheduledPayment, 0);
  const totalAmountDue = rows.reduce((sum, row) => sum + row.amountDue, 0);
  const scheduledPayment = rows[0]?.scheduledPayment ?? 0;
  const normalizedInterestType = (interestType ?? '').trim().toLowerCase();
  const fixedPaymentLabel = 'Periodical payment';
  const fixedPaymentValue = scheduledPayment;
  const showPenalty = rows.some((row) => toNumber(row.penalty_amount) > 0);
  const showRebate = rows.some((row) => toNumber(row.rebate_amount) > 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Loan amount', totalPrincipal],
          [fixedPaymentLabel, fixedPaymentValue],
          ['Total interest', totalInterest],
          ['Total amount to be paid', scheduledTotal],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg bg-[#F7F5F3] px-5 py-4">
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <p className="mt-2 text-xl font-semibold text-gray-950">{money(value as number)}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse bg-white text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs font-semibold text-gray-600">
              <th className="px-3 py-3">Term</th>
              <th className="px-3 py-3">Date</th>
              <th className="px-3 py-3 text-right">Beginning Balance</th>
              <th className="px-3 py-3 text-right">Scheduled Payment</th>
              <th className="px-3 py-3 text-right">
                <span className="rounded-full bg-[#FFF4D6] px-2.5 py-1 text-[#A47B06]">Principal</span>
              </th>
              <th className="px-3 py-3 text-right">
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-800">Interest</span>
              </th>
              {showPenalty && <th className="px-3 py-3 text-right">Penalty</th>}
              {showRebate && <th className="px-3 py-3 text-right">Rebate</th>}
              <th className="px-3 py-3 text-right">Amount Due</th>
              <th className="px-3 py-3 text-right">Ending Balance</th>
              <th className="px-3 py-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.installment_no} className="border-b border-gray-200 hover:bg-[#FFF8E6]">
                <td className="px-3 py-3 text-gray-700">{row.installment_no}</td>
                <td className="px-3 py-3 font-semibold text-gray-950">{dateLabel(row.due_date)}</td>
                <td className="px-3 py-3 text-right text-gray-950">{money(row.beginningBalance)}</td>
                <td className="px-3 py-3 text-right font-semibold text-gray-950">{money(row.scheduledPayment)}</td>
                <td className="px-3 py-3 text-right font-semibold text-[#A47B06]">{money(row.principalAmount)}</td>
                <td className="px-3 py-3 text-right font-medium text-amber-800">{money(row.interest_amount)}</td>
                {showPenalty && (
                  <td className="px-3 py-3 text-right font-medium text-red-700">{money(row.penalty_amount)}</td>
                )}
                {showRebate && (
                  <td className="px-3 py-3 text-right font-medium text-green-700">{money(row.rebate_amount)}</td>
                )}
                <td className="px-3 py-3 text-right font-semibold text-gray-950">{money(row.amountDue)}</td>
                <td className="px-3 py-3 text-right text-gray-950">{money(row.endingBalance)}</td>
                <td className="px-3 py-3 text-center">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass(row.status)}`}>
                    {row.status || 'Unpaid'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-300 bg-[#F7F5F3] font-semibold">
              <td className="px-3 py-3" colSpan={2}>
                Total
              </td>
              <td className="px-3 py-3" />
              <td className="px-3 py-3 text-right">{money(scheduledTotal)}</td>
              <td className="px-3 py-3 text-right text-[#A47B06]">{money(totalPrincipal)}</td>
              <td className="px-3 py-3 text-right text-amber-800">{money(totalInterest)}</td>
              {showPenalty && <td className="px-3 py-3 text-right text-red-700">{money(totalPenalty)}</td>}
              {showRebate && <td className="px-3 py-3 text-right text-green-700">{money(totalRebate)}</td>}
              <td className="px-3 py-3 text-right">{money(totalAmountDue)}</td>
              <td className="px-3 py-3" />
              <td className="px-3 py-3" />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
