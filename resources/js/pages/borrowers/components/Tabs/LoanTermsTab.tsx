import { Button } from "@/components/ui/button";

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
};

interface LoanTermsTabProps {
  loan: Loan;
  releasingFees?: {
    charges: Record<string, {
      charge_id?: number;
      name?: string;
      rate: number;
      amount: number;
    }>;
    total_fees: number;
  };
}

export default function LoanTermsTab({ loan, releasingFees }: LoanTermsTabProps) {
  if (!loan) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded">
        No loan terms available.
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg border-white overflow-hidden border">
      {loan.status === 'active' && (
        <div className="flex justify-end ">
          <Button className="bg-[#FABF24] text-black">Print Statement</Button>
        </div>
      )}

      <div className="m-6 gap-y-3 gap-x-8">
        <DetailRow label="Loan Status" value={loan.status || '—'} />
        <DetailRow label="Loan Type" value={loan.loan_type || '—'} />
      </div>

      <section className="px-6 py-5">
        <div className="bg-yellow-100 border-l-4 border-yellow-300 px-4 py-2 rounded-sm mb-4">
          <h3 className="font-medium text-yellow-800">Loan Terms</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
          <DetailRow label="Principal Amount" value={`₱${loan.principal.toLocaleString()}`} />
          <DetailRow label="Loan Release Date" value={loan.released || '—'} />
          <DetailRow label="Maturity Date" value={loan.maturity || '—'} />
          <DetailRow label="Interest Rate" value={loan.interest || '—'} />
          <DetailRow label="Interest Type" value={loan.interestType || '—'} />
          <DetailRow label="Repayment Frequency" value={loan.repayment_frequency || '—'} />
          <DetailRow label="Installment Due" value={`₱${loan.due.toLocaleString()}`} />
          <DetailRow label="Balance Remaining" value={`₱${loan.balance.toLocaleString()}`} />
        </div>
      </section>

      {releasingFees?.charges && (
        <section className="px-6 py-5">
          <div className="bg-yellow-100 border-l-4 border-yellow-300 px-4 py-2 rounded-sm mb-4">
            <h3 className="font-medium text-yellow-800">Loan Releasing Fees</h3>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2">
            {Object.entries(releasingFees.charges).map(([chargeName, chargeData]) => (
              <DetailRow
                key={chargeName}
                label={`${chargeName} (${(chargeData.rate * 100).toFixed(2)}%)`}
                value={`₱${chargeData.amount.toLocaleString()}`}
              />
            ))}
            <DetailRow
              label="Total Releasing Fees"
              value={`₱${releasingFees.total_fees.toLocaleString()}`}
            />
          </div>
        </section>
      )}

      

      {/* penalty not really dynamic, must be changed to be dynamic when the loan charges are implemented in the backend */}

      <section className="px-6 py-5">
        <div className="bg-yellow-100 border-l-4 border-yellow-300 px-4 py-2 rounded-sm ">
          <h3 className="font-medium text-yellow-800">System Generated Penalty</h3>
        </div>
        <div className="bg-yellow-200 border-l-4 border-yellow-300 px-4 py-2 rounded-sm mb-4">
          <h3 className="font-medium text-yellow-800">Late Repayment Penalty (6% penalty is charged on overdue amounts.)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
          <DetailRow label="Penalty Fixed Amount" value={`₱${60.00.toLocaleString()}`} /> 
          <DetailRow label="Grace Period" value={'3 days'} />
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
