import { Button } from "@/components/ui/button";

type Loan = {
  loanNo: string;
  released: string;
  maturity: string;
  repayment: string;
  principal: number;
  interest: string;
  interestType: string;
  due: number;
  balance: number;
  status: string;
  loan_type: string;
};

interface LoanTermsTabProps {
  loan: Loan;
}

export default function LoanTermsTab({ loan }: LoanTermsTabProps) {
  if (!loan) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 rounded">
        No loan terms available.
      </div>
    );
  }

  return (
    
    <div className="bg-white shadow-md rounded-lg border-white overflow-hidden border">
      <div className="flex justify-end mb-4">
        <Button className="bg-[#FABF24] text-black">Print Statement</Button>
      </div>
      <div className="flex justify-end mb-4">
        <Button className="border-2 bg-white border-[#FABF24] text-[#FABF24]">Edit Loan</Button>
      </div>
 


     <div className="m-6  gap-y-3 gap-x-8">
          <DetailRow label="Loan Status" value={loan.status || '—'} />
          <DetailRow label="Loan Type" value={loan.loan_type || '—'} />


        </div>

      <div className="" />



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
          <DetailRow label="Repayment Frequency" value={loan.repayment || '—'} />
          <DetailRow label="Installment Due" value={`₱${loan.due.toLocaleString()}`} />
          <DetailRow label="Balance Remaining" value={`₱${loan.balance.toLocaleString()}`} />
        </div>
      </section>
      <section className="px-6 py-5">
        <div className="bg-yellow-100 border-l-4 border-yellow-300 px-4 py-2 rounded-sm mb-4">
          <h3 className="font-medium text-yellow-800">Loan Releasing Fees</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
          <DetailRow label="Processing Fee (3%)" value={`₱${loan.principal.toLocaleString()}`} /> 
          <DetailRow label="Insurance Fee (2%)" value={loan.released || '—'} />
          <DetailRow label="Notary Fee (1%)" value={loan.maturity || '—'} />
          <DetailRow label="Savings Contribution (2%)" value={loan.interest || '—'} />
          <DetailRow label="Total Releasing Fees" value={`₱${loan.balance.toLocaleString()}`} />

        </div>
      </section>
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