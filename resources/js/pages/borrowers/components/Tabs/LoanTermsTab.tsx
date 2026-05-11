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

  const handlePrintStatement = () => {
    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) return;

    const releasingFeesHTML = releasingFees?.charges
      ? `
        <div class="section">
          <div class="section-header">Loan Releasing Fees</div>
          <table>
            ${Object.entries(releasingFees.charges)
              .map(
                ([chargeName, chargeData]) => `
              <tr>
                <td>${chargeName} (${(chargeData.rate * 100).toFixed(2)}%)</td>
                <td class="value">₱${chargeData.amount.toLocaleString()}</td>
              </tr>
            `
              )
              .join("")}
            <tr class="total-row">
              <td><strong>Total Releasing Fees</strong></td>
              <td class="value"><strong>₱${releasingFees.total_fees.toLocaleString()}</strong></td>
            </tr>
          </table>
        </div>
      `
      : "";

    const printContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>Loan Statement – ${loan.loanNo}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

          * { margin: 0; padding: 0; box-sizing: border-box; }

          body {
            font-family: 'Inter', sans-serif;
            font-size: 13px;
            color: #1a1a1a;
            background: #fff;
            padding: 40px;
          }

          /* ── Header ── */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #FABF24;
            padding-bottom: 20px;
            margin-bottom: 28px;
          }
          .org-info h1 {
            font-size: 22px;
            font-weight: 700;
            color: #111;
            letter-spacing: -0.3px;
          }
          .org-info p {
            color: #666;
            font-size: 12px;
            margin-top: 2px;
          }
          .statement-meta {
            text-align: right;
          }
          .statement-meta .badge {
            display: inline-block;
            background: #FABF24;
            color: #000;
            font-weight: 700;
            font-size: 11px;
            padding: 4px 10px;
            border-radius: 4px;
            letter-spacing: 0.5px;
            margin-bottom: 6px;
          }
          .statement-meta p {
            font-size: 12px;
            color: #555;
          }
          .statement-meta .loan-no {
            font-weight: 700;
            font-size: 14px;
            color: #111;
          }

          /* ── Status strip ── */
          .status-strip {
            display: flex;
            gap: 24px;
            background: #fafafa;
            border: 1px solid #eee;
            border-radius: 8px;
            padding: 14px 20px;
            margin-bottom: 24px;
          }
          .status-item label {
            display: block;
            font-size: 11px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 3px;
          }
          .status-item span {
            font-weight: 600;
            font-size: 13px;
            color: #111;
          }
          .status-badge {
            display: inline-block;
            padding: 2px 10px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
          }
          .status-active  { background: #dcfce7; color: #166534; }
          .status-closed  { background: #fee2e2; color: #991b1b; }
          .status-pending { background: #fef9c3; color: #854d0e; }

          /* ── Sections ── */
          .section { margin-bottom: 24px; }

          .section-header {
            background: #fef9c3;
            border-left: 4px solid #FABF24;
            padding: 8px 14px;
            font-weight: 600;
            font-size: 13px;
            color: #78350f;
            border-radius: 2px;
            margin-bottom: 12px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }
          tr { border-bottom: 1px solid #f0f0f0; }
          tr:last-child { border-bottom: none; }
          td {
            padding: 8px 4px;
            color: #444;
            font-size: 13px;
          }
          td.value {
            text-align: right;
            font-weight: 600;
            color: #111;
          }
          tr.total-row {
            border-top: 2px solid #FABF24;
            background: #fffbeb;
          }
          tr.total-row td { padding-top: 10px; }

          /* ── Penalty sub-header ── */
          .penalty-sub {
            background: #fde68a;
            border-left: 4px solid #FABF24;
            padding: 6px 14px;
            font-size: 12px;
            font-weight: 500;
            color: #78350f;
            border-radius: 2px;
            margin-bottom: 10px;
          }

          /* ── Summary box ── */
          .summary-box {
            border: 2px solid #FABF24;
            border-radius: 8px;
            padding: 16px 20px;
            margin-top: 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fffbeb;
          }
          .summary-box .label {
            font-size: 13px;
            color: #78350f;
            font-weight: 500;
          }
          .summary-box .amount {
            font-size: 22px;
            font-weight: 700;
            color: #111;
          }

          /* ── Footer ── */
          .footer {
            margin-top: 36px;
            padding-top: 16px;
            border-top: 1px solid #eee;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
            color: #aaa;
          }

          @media print {
            @page {
              size: A4 portrait;
              margin: 8mm 10mm;
            }
            html, body {
              width: 100%;
              height: 100%;
            }
            .page-wrapper {
              transform-origin: top left;
            }
          }
        </style>
      </head>
      <body>
        <div class="page-wrapper" id="pageWrapper">

        <!-- Header -->
        <div class="header">
          <div class="org-info">
            <h1>Loan Statement</h1>
            <p>Official document generated by the Loan Management System</p>
          </div>
          <div class="statement-meta">
            <div class="badge">OFFICIAL STATEMENT</div>
            <p class="loan-no">${loan.loanNo}</p>
            <p>Printed: ${new Date().toLocaleDateString("en-PH", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}</p>
          </div>
        </div>

        <!-- Status strip -->
        <div class="status-strip">
          <div class="status-item">
            <label>Loan Status</label>
            <span class="status-badge ${
              loan.status === "Active"
                ? "status-active"
                : loan.status === "Closed"
                ? "status-closed"
                : "status-pending"
            }">${loan.status}</span>
          </div>
          <div class="status-item">
            <label>Loan Type</label>
            <span>${loan.loan_type || "—"}</span>
          </div>
          <div class="status-item">
            <label>Loan No.</label>
            <span>${loan.loanNo || "—"}</span>
          </div>
        </div>

        <!-- Loan Terms -->
        <div class="section">
          <div class="section-header">Loan Terms</div>
          <table>
            <tr>
              <td>Principal Amount</td>
              <td class="value">₱${loan.principal.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Loan Release Date</td>
              <td class="value">${loan.released || "—"}</td>
            </tr>
            <tr>
              <td>Maturity Date</td>
              <td class="value">${loan.maturity || "—"}</td>
            </tr>
            <tr>
              <td>Interest Rate</td>
              <td class="value">${loan.interest || "—"}</td>
            </tr>
            <tr>
              <td>Interest Type</td>
              <td class="value">${loan.interestType || "—"}</td>
            </tr>
            <tr>
              <td>Repayment Frequency</td>
              <td class="value">${loan.repayment_frequency || "—"}</td>
            </tr>
            <tr>
              <td>Installment Due</td>
              <td class="value">₱${loan.due.toLocaleString()}</td>
            </tr>
            <tr>
              <td>Balance Remaining</td>
              <td class="value">₱${loan.balance.toLocaleString()}</td>
            </tr>
          </table>
        </div>

        <!-- Releasing Fees (conditional) -->
        ${releasingFeesHTML}

        <!-- Penalty -->
        <div class="section">
          <div class="section-header">System Generated Penalty</div>
          <div class="penalty-sub">Late Repayment Penalty — 6% penalty is charged on overdue amounts.</div>
          <table>
            <tr>
              <td>Penalty Fixed Amount</td>
              <td class="value">₱60.00</td>
            </tr>
            <tr>
              <td>Grace Period</td>
              <td class="value">3 days</td>
            </tr>
          </table>
        </div>

        <!-- Summary -->
        <div class="summary-box">
          <div>
            <div class="label">Outstanding Balance</div>
          </div>
          <div class="amount">₱${loan.balance.toLocaleString()}</div>
        </div>

        <!-- Footer -->
        <div class="footer">
          <span>This is a system-generated statement and requires no signature.</span>
          <span>Loan No: ${loan.loanNo} · ${new Date().toLocaleDateString("en-PH")}</span>
        </div>

        </div><!-- /page-wrapper -->

        <script>
          window.onload = function () {
            const wrapper = document.getElementById('pageWrapper');
            const A4_HEIGHT_PX = 1122; // A4 at 96dpi
            const bodyPadding = 80;
            const contentHeight = wrapper.scrollHeight;

            if (contentHeight > A4_HEIGHT_PX - bodyPadding) {
              const scale = (A4_HEIGHT_PX - bodyPadding) / contentHeight;
              wrapper.style.transform = 'scale(' + scale + ')';
              wrapper.style.transformOrigin = 'top left';
              wrapper.style.width = (100 / scale) + '%';
              document.body.style.overflow = 'hidden';
            }

            window.print();
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  return (
    <div className="bg-white shadow-md rounded-lg border-white overflow-hidden border">
      {loan.status === "Active" && (
        <div className="flex justify-end">
          <Button
            onClick={handlePrintStatement}
            className="bg-[#FABF24] hover:border-[#FABF24] border cursor-pointer text-black"
          >
            Print Statement
          </Button>
        </div>
      )}

      <div className="m-6 gap-y-3 gap-x-8">
        <DetailRow label="Loan Status" value={loan.status || "—"} />
        <DetailRow label="Loan Type" value={loan.loan_type || "—"} />
      </div>

      <section className="px-6 py-5">
        <div className="bg-yellow-100 border-l-4 border-yellow-300 px-4 py-2 rounded-sm mb-4">
          <h3 className="font-medium text-yellow-800">Loan Terms</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
          <DetailRow label="Principal Amount" value={`₱${loan.principal.toLocaleString()}`} />
          <DetailRow label="Loan Release Date" value={loan.released || "—"} />
          <DetailRow label="Maturity Date" value={loan.maturity || "—"} />
          <DetailRow label="Interest Rate" value={loan.interest || "—"} />
          <DetailRow label="Interest Type" value={loan.interestType || "—"} />
          <DetailRow label="Repayment Frequency" value={loan.repayment_frequency || "—"} />
          <DetailRow label="Installment Due" value={`₱${loan.due.toLocaleString()}`} />
          <DetailRow label="Balance Remaining" value={`₱${loan.balance.toLocaleString()}`} />
        </div>
      </section>

      {releasingFees?.charges && (
        <section className="px-6 py-5">
          <div className="bg-yellow-100 border-l-4 border-yellow-300 px-4 py-2 rounded-sm mb-4">
            <h3 className="font-medium text-yellow-800">Loan Releasing Fees</h3>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-3 md:grid-cols-2 mb-3">
            {Object.entries(releasingFees.charges).map(([chargeName, chargeData]) => (
              <DetailRow
                key={chargeName}
                label={`${chargeName} (${(chargeData.rate * 100).toFixed(2)}%)`}
                value={`₱${chargeData.amount.toLocaleString()}`}
              />
            ))}
          </div>
          <DetailRow
            label="Total Releasing Fees"
            value={`₱${releasingFees.total_fees.toLocaleString()}`}
          />
        </section>
      )}

      {/* penalty not really dynamic, must be changed to be dynamic when the loan charges are implemented in the backend */}
      <section className="px-6 py-5">
        <div className="bg-yellow-100 border-l-4 border-yellow-300 px-4 py-2 rounded-sm">
          <h3 className="font-medium text-yellow-800">System Generated Penalty</h3>
        </div>
        <div className="bg-yellow-200 border-l-4 border-yellow-300 px-4 py-2 rounded-sm mb-4">
          <h3 className="font-medium text-yellow-800">
            Late Repayment Penalty (6% penalty is charged on overdue amounts.)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
          <DetailRow label="Penalty Fixed Amount" value={`₱${(60.0).toLocaleString()}`} />
          <DetailRow label="Grace Period" value={"3 days"} />
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