import { Button } from "@/components/ui/button";

type ReleasingFees = {
  gross_amount: number;
  processing_fee: number;
  insurance_fee: number;
  notary_fee: number;
  savings_contribution: number;
  total_fees: number;
  net_disbursed_amount: number;
};

type Loan = {
  loanNo: string;
  released: string;
  maturity: string;
  repayment_frequency: string;
  principal: number;
  interest: string;
  interestType: string;
  loan_type: string;
  due: number;
  balance: number;
  status: string;
  releasing_fees?: ReleasingFees;
};

interface LoanTermsTabProps {
  loan: Loan;
}

export default function LoanTermsTab({ loan }: LoanTermsTabProps) {
  if (!loan) {
    return (
      <div className="rounded bg-gray-50 p-6 text-center text-gray-500">
        No loan terms available.
      </div>
    );
  }

  const releasingFees = loan.releasing_fees;

  return (
    <div className="overflow-hidden rounded-lg border border-white bg-white shadow-md">
      {loan.status === "active" && (
        <div className="flex justify-end">
          <Button className="bg-[#FABF24] text-black">Print Statement</Button>
        </div>
      )}

      <div className="m-6 gap-x-8 gap-y-3">
        <DetailRow label="Loan Status" value={loan.status || "-"} />
        <DetailRow label="Loan Type" value={loan.loan_type || "-"} />
      </div>

      <section className="px-6 py-5">
        <div className="mb-4 rounded-sm border-l-4 border-yellow-300 bg-yellow-100 px-4 py-2">
          <h3 className="font-medium text-yellow-800">Loan Terms</h3>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
          <DetailRow label="Principal Amount" value={formatCurrency(loan.principal)} />
          <DetailRow label="Loan Release Date" value={loan.released || "-"} />
          <DetailRow label="Maturity Date" value={loan.maturity || "-"} />
          <DetailRow label="Interest Rate" value={loan.interest || "-"} />
          <DetailRow label="Interest Type" value={loan.interestType || "-"} />
          <DetailRow label="Repayment Frequency" value={loan.repayment_frequency || "-"} />
          <DetailRow label="Installment Due" value={formatCurrency(loan.due)} />
          <DetailRow label="Balance Remaining" value={formatCurrency(loan.balance)} />
        </div>
      </section>

      <section className="px-6 py-5">
        <div className="mb-4 rounded-sm border-l-4 border-yellow-300 bg-yellow-100 px-4 py-2">
          <h3 className="font-medium text-yellow-800">Loan Releasing Fees</h3>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
          <DetailRow label="Processing Fee (3%)" value={formatCurrency(releasingFees?.processing_fee ?? 0)} />
          <DetailRow label="Insurance Fee (2%)" value={formatCurrency(releasingFees?.insurance_fee ?? 0)} />
          <DetailRow label="Notary Fee (1%)" value={formatCurrency(releasingFees?.notary_fee ?? 0)} />
          <DetailRow label="Savings Contribution (2%)" value={formatCurrency(releasingFees?.savings_contribution ?? 0)} />
          <DetailRow label="Total Releasing Fees" value={formatCurrency(releasingFees?.total_fees ?? 0)} />
        </div>
      </section>

      <section className="px-6 py-5">
        <div className="rounded-sm border-l-4 border-yellow-300 bg-yellow-100 px-4 py-2">
          <h3 className="font-medium text-yellow-800">System Generated Penalty</h3>
        </div>
        <div className="mb-4 rounded-sm border-l-4 border-yellow-300 bg-yellow-200 px-4 py-2">
          <h3 className="font-medium text-yellow-800">Late Repayment Penalty (6% penalty is charged on overdue amounts.)</h3>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
          <DetailRow label="Penalty Fixed Amount" value={formatCurrency(60)} />
          <DetailRow label="Grace Period" value="3 days" />
        </div>
      </section>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value || 0);
}
