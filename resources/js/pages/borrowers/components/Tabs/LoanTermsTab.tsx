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
  repayment: string;
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

type Repayment = {
  id?: number;
  name?: string;
  loanNo?: string;
  method?: string;
  collectedBy?: string;
  collectionDate?: string | null;
  paidAmount?: number | null;
};

interface LoanTermsTabProps {
  loan: Loan;
  repayments?: Repayment[];
  borrowerName?: string;
}

export default function LoanTermsTab({ loan, repayments = [], borrowerName }: LoanTermsTabProps) {
  if (!loan) {
    return (
      <div className="rounded bg-gray-50 p-6 text-center text-gray-500">
        No loan terms available.
      </div>
    );
  }

  const releasingFees = loan.releasing_fees;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value || 0);
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString("en-PH");
  };

  const printStatement = () => {
    const totalPaid = (repayments || []).reduce((sum, r) => sum + (r.paidAmount ?? 0), 0);

    const printWindow = window.open("", "_blank", "width=900,height=700");
    if (!printWindow) {
      alert("Unable to open print preview. Please allow pop-ups for this site.");
      return;
    }

    const rows = (repayments || [])
      .map(
        (r) => `
        <tr>
          <td style="border:1px solid #ddd;padding:8px">${formatDate(r.collectionDate)}</td>
          <td style="border:1px solid #ddd;padding:8px">${r.loanNo || loan.loanNo}</td>
          <td style="border:1px solid #ddd;padding:8px">${r.method || "-"}</td>
          <td style="border:1px solid #ddd;padding:8px">${formatCurrency(r.paidAmount ?? 0)}</td>
          <td style="border:1px solid #ddd;padding:8px">${r.collectedBy || "-"}</td>
        </tr>
      `
      )
      .join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Statement of Account</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #111827; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #111827; padding-bottom: 12px; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 5px 0; color: #666; font-size: 14px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
            .info-box { border: 1px solid #ddd; padding: 12px; border-radius: 8px; }
            .info-box h3 { margin: 0 0 10px 0; font-size: 16px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .info-row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
            .label { font-weight: 600; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background: #f5f5f5; font-weight: 600; }
            tfoot td { font-weight: bold; background: #f9f9f9; }
            .footer { margin-top: 30px; display: flex; justify-content: space-between; }
            .signature-box { width: 200px; text-align: center; }
            .signature-line { border-top: 1px solid #000; margin-top: 50px; padding-top: 5px; font-size: 14px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>JAMO LENDING CORP.</h1>
            <p>Statement of Account</p>
            <p>Date: ${new Date().toLocaleDateString("en-PH")}</p>
          </div>

          <div class="info-grid">
            <div class="info-box">
              <h3>Borrower Information</h3>
              <div class="info-row"><span class="label">Name:</span><span>${borrowerName || "-"}</span></div>
              <div class="info-row"><span class="label">Loan No.:</span><span>${loan.loanNo}</span></div>
              <div class="info-row"><span class="label">Loan Type:</span><span>${loan.loan_type}</span></div>
              <div class="info-row"><span class="label">Status:</span><span>${loan.status}</span></div>
            </div>
            <div class="info-box">
              <h3>Loan Summary</h3>
              <div class="info-row"><span class="label">Principal:</span><span>${formatCurrency(loan.principal)}</span></div>
              <div class="info-row"><span class="label">Interest Rate:</span><span>${loan.interest}</span></div>
              <div class="info-row"><span class="label">Released:</span><span>${formatDate(loan.released)}</span></div>
              <div class="info-row"><span class="label">Maturity:</span><span>${formatDate(loan.maturity)}</span></div>
            </div>
          </div>

          <div class="info-box" style="margin-bottom:20px">
            <h3>Financial Overview</h3>
            <div class="info-row"><span class="label">Principal Amount:</span><span>${formatCurrency(loan.principal)}</span></div>
            <div class="info-row"><span class="label">Total Paid:</span><span>${formatCurrency(totalPaid)}</span></div>
            <div class="info-row"><span class="label">Balance Remaining:</span><span>${formatCurrency(loan.balance)}</span></div>
            <div class="info-row"><span class="label">Next Due Amount:</span><span>${formatCurrency(loan.due)}</span></div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Loan No</th>
                <th>Method</th>
                <th>Paid Amount</th>
                <th>Collected By</th>
              </tr>
            </thead>
            <tbody>
              ${(repayments || []).length === 0
                ? '<tr><td colspan="5" style="text-align:center">No payments yet.</td></tr>'
                : rows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="text-align:right">Total Paid:</td>
                <td colspan="2">${formatCurrency(totalPaid)}</td>
              </tr>
            </tfoot>
          </table>

          <div class="footer">
            <div class="signature-box">
              <div class="signature-line">Prepared By</div>
            </div>
            <div class="signature-box">
              <div class="signature-line">Borrower Signature</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="overflow-hidden rounded-lg border border-white bg-white shadow-md">
      {loan.status === "active" && (
        <div className="flex justify-end">
          <Button className="bg-[#FABF24] text-black" onClick={printStatement}>
            Print Statement
          </Button>
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
