import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

type ChequePackagePrintProps = {
  voucher: {
    id: number;
    voucher_no: string;
    voucher_type: string;
    voucher_date?: string | null;
    payee_name: string;
    payee_address?: string | null;
    payee_tin?: string | null;
    particulars: string;
    gross_amount: number;
    status: string;
    received_by_name?: string | null;
    received_at?: string | null;
    remarks?: string | null;
    prepared_by?: string | null;
    approved_by?: string | null;
    checked_by?: string | null;
    cheque: {
      bank_account_id?: number | null;
      bank_name: string;
      account_number?: string | null;
      cheque_no: string;
      cheque_date?: string | null;
    };
  };
  disbursement: {
    id: number;
    disbursement_no: string;
    method: string;
    reference_no?: string | null;
    disbursed_at?: string | null;
    remarks?: string | null;
  };
  loan: {
    id?: number | null;
    loan_type?: string | null;
  };
  borrower: {
    name: string;
  };
};

const formatMoney = (amount: number) =>
  `PHP ${Number(amount || 0).toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const formatDate = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-PH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const amountToWords = (amount: number): string => {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const toWords = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return ones[n] + ' ';
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '') + ' ';
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred ' + toWords(n % 100);
    if (n < 1000000) return toWords(Math.floor(n / 1000)) + 'Thousand ' + toWords(n % 1000);
    if (n < 1000000000) return toWords(Math.floor(n / 1000000)) + 'Million ' + toWords(n % 1000000);
    return toWords(Math.floor(n / 1000000000)) + 'Billion ' + toWords(n % 1000000000);
  };

  const pesos = Math.floor(amount);
  const centavos = Math.round((amount - pesos) * 100);
  let result = toWords(pesos).trim() + ' Pesos';
  if (centavos > 0) result += ' and ' + toWords(centavos).trim() + ' Centavos';
  result += ' Only';
  return result.toUpperCase();
};

const SignatureBlock = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex-1 text-center">
    <div className="mx-auto min-h-[18px] w-full border-b border-black text-sm font-medium">{value || ''}</div>
    <div className="mt-2 text-sm">{label}</div>
  </div>
);

export default function ChequePackagePrint({ voucher, disbursement, loan, borrower }: ChequePackagePrintProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.print();
    }, 250);
    return () => window.clearTimeout(timer);
  }, []);

  const raw = voucher.cheque.cheque_date;
  const chequeDate = raw ? new Date(raw) : null;
  const isValidDate = chequeDate && !isNaN(chequeDate.getTime());
  const mm = isValidDate ? String(chequeDate!.getMonth() + 1).padStart(2, '0') : '';
  const dd = isValidDate ? String(chequeDate!.getDate()).padStart(2, '0') : '';
  const yyyy = isValidDate ? String(chequeDate!.getFullYear()) : '';
  const amountWords = amountToWords(voucher.gross_amount);

  return (
    <>
      <Head title={`Cheque Package ${voucher.voucher_no}`} />

      <style>{`
        @page {
          size: A4 portrait;
          margin: 16mm;
        }

        body {
          background: linear-gradient(180deg, #fbf7ea 0%, #f2f6fb 100%);
          color: #111827;
          font-family: "Times New Roman", serif;
        }

        .print-shell {
          max-width: 940px;
          margin: 0 auto;
          padding: 24px;
        }

        .sheet {
          background: #ffffff;
          border: 1px solid #1f2937;
          box-shadow: 0 18px 35px rgba(15, 23, 42, 0.1);
          padding: 24px;
        }

        .voucher-sheet {
          break-after: page;
        }

        .block-card {
          border: 1px solid #2f2a22;
          border-radius: 14px;
          background: #fffdf7;
          padding: 16px;
        }

        .section-title {
          margin-bottom: 8px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #475569;
        }

        .line-fill {
          display: inline-block;
          min-height: 18px;
          border-bottom: 1px solid #111827;
          width: 100%;
          vertical-align: bottom;
          line-height: 1.25rem;
        }

        .amount-head {
          display: grid;
          grid-template-columns: 1fr 220px;
          border: 1px solid #2f2a22;
          border-bottom: none;
          background: linear-gradient(90deg, #f1df9b 0%, #f7edc6 100%);
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.12em;
          font-size: 15px;
        }

        .amount-body {
          display: grid;
          grid-template-columns: 1fr 220px;
          border: 1px solid #2f2a22;
        }

        /* ── Cheque face ── */
        .cheque-face {
          border: 1px solid #b0a060;
          padding: 20px 28px 0 28px;
          background: linear-gradient(90deg,
            rgba(255, 248, 196, 0.88) 0%,
            rgba(255, 250, 217, 0.96) 18%,
            rgba(252, 250, 221, 0.96) 84%,
            rgba(255, 247, 192, 0.9) 100%);
          position: relative;
          overflow: hidden;
        }

        .cheque-face::before {
          content: "";
          position: absolute;
          inset: 10px 10px 44px 10px;
          border: 1px solid rgba(15, 23, 42, 0.14);
          pointer-events: none;
        }

        .micro-label {
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #475569;
        }

        .cheque-amount-box {
          border: 1px solid #111827;
          background: rgba(255, 255, 255, 0.92);
          padding: 3px 10px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
          border-radius: 2px;
        }

        .words-line {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          border-bottom: 1px solid #111827;
          min-height: 22px;
          width: 100%;
          padding-bottom: 2px;
        }

        .words-fill {
          flex: 1;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.03em;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: clip;
        }

        .words-asterisks {
          font-size: 10px;
          color: #374151;
          letter-spacing: 0.1em;
          flex-shrink: 0;
        }

        .micr-text {
          font-family: "Courier New", monospace;
          font-size: 11px;
          letter-spacing: 0.16em;
          color: #374151;
        }

        .micr-label {
          font-family: "Courier New", monospace;
          font-size: 7px;
          letter-spacing: 0.1em;
          color: #9ca3af;
          text-transform: uppercase;
        }

        .no-print {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-bottom: 16px;
        }

        @media print {
          body { background: #ffffff; }
          .print-shell { max-width: none; padding: 0; }
          .sheet { border: none; box-shadow: none; padding: 0; }
          .no-print { display: none; }
        }
      `}</style>

      <div className="print-shell">
        <div className="no-print">
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded border border-[#C7E3CD] bg-[#F1FBF3] px-4 py-2 text-sm font-medium text-gray-900"
          >
            Print
          </button>
          <button
            type="button"
            onClick={() => window.close()}
            className="rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
          >
            Close
          </button>
        </div>

        {/* ── VOUCHER SHEET ── */}
        <section className="sheet voucher-sheet space-y-5">
          <div className="flex items-end justify-between gap-6 rounded-xl border border-[#3f3422] bg-[#fff4d6] px-5 py-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-600">Cheque Package</div>
              <h1 className="mt-2 text-3xl font-bold tracking-[0.08em] text-gray-900">JAMO LENDING CORP.</h1>
              <p className="mt-1 text-sm">Prk. 1-B Kisante 9401 Makilala (N. Cotabato) Philippines</p>
              <h2 className="mt-2 text-2xl font-bold uppercase tracking-[0.2em] text-gray-900">Cheque Voucher</h2>
            </div>
            <div className="min-w-[210px] rounded-xl border border-gray-900 bg-gray-900 px-4 py-3 text-right text-white">
              <div className="text-xs uppercase tracking-[0.25em]">Voucher No.</div>
              <div className="mt-1 text-2xl font-bold">{voucher.voucher_no}</div>
            </div>
          </div>

          <div className="grid grid-cols-[1.2fr_0.8fr] gap-5">
            <div className="block-card">
              <div className="section-title">Payee Profile</div>
              <div className="space-y-2 text-base">
                <div className="flex items-end gap-3">
                  <span className="w-24 font-semibold">Name:</span>
                  <span className="line-fill">{voucher.payee_name || borrower.name}</span>
                </div>
                <div className="flex items-end gap-3">
                  <span className="w-24 font-semibold">Address:</span>
                  <span className="line-fill">{voucher.payee_address || ''}</span>
                </div>
                <div className="flex items-end gap-3">
                  <span className="w-24 font-semibold">TIN:</span>
                  <span className="line-fill">{voucher.payee_tin || ''}</span>
                </div>
              </div>
            </div>

            <div className="block-card">
              <div className="section-title">Control Details</div>
              <div className="space-y-2 text-base">
                <div className="flex items-end gap-3">
                  <span className="w-16 font-semibold">Date:</span>
                  <span className="line-fill">{formatDate(voucher.voucher_date)}</span>
                </div>
                <div className="flex items-end gap-3">
                  <span className="w-16 font-semibold">Loan:</span>
                  <span className="line-fill">{loan.id ? `#${loan.id}` : ''}</span>
                </div>
                <div className="flex items-end gap-3">
                  <span className="w-16 font-semibold">Type:</span>
                  <span className="line-fill">{loan.loan_type || ''}</span>
                </div>
                <div className="flex items-end gap-3">
                  <span className="w-16 font-semibold">Release:</span>
                  <span className="line-fill">{formatDate(disbursement.disbursed_at)}</span>
                </div>
                <div className="flex items-end gap-3">
                  <span className="w-16 font-semibold">Ref:</span>
                  <span className="line-fill">{disbursement.disbursement_no}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="amount-head text-center">
              <div className="border-r border-black py-3">Particulars</div>
              <div className="py-3">Amount</div>
            </div>
            <div className="amount-body text-base">
              <div className="border-r border-black p-4 whitespace-pre-wrap">{voucher.particulars}</div>
              <div className="flex items-end justify-end p-4 text-xl font-bold text-gray-900">
                {formatMoney(voucher.gross_amount)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 rounded-xl border border-[#3f3422] bg-[#fffdf7] p-4">
            <SignatureBlock label="Prepared By:" value={voucher.prepared_by} />
            <SignatureBlock label="Approved By:" value={voucher.approved_by} />
            <SignatureBlock label="Received By:" value={voucher.received_by_name} />
          </div>
        </section>

        {/* ── CHEQUE FACE SHEET ── */}
        <section className="sheet space-y-4 mt-6">
          <div className="cheque-face">

            {/* Row 1: Bank name + logo placeholder | spacer | Cheque No. + Date */}
            <div className="grid grid-cols-[1fr_260px] items-start gap-4 mb-3">
              <div>
                <div className="text-[28px] font-black leading-none tracking-tight text-slate-800">
                  {voucher.cheque.bank_name || 'Any Bank'}
                </div>
                <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Branch / Makati City
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {/* Cheque No. */}
                <div className="flex items-center gap-2">
                  <span className="micro-label">Cheque No.</span>
                  <span
                    className="border-b border-black text-center font-bold text-sm"
                    style={{ minWidth: '120px' }}
                  >
                    {voucher.cheque.cheque_no}
                  </span>
                </div>
                {/* Date MM / DD / YYYY */}
                <div className="flex items-end gap-2">
                  <span className="micro-label">Date</span>
                  <div className="flex gap-1">
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="border border-gray-400 bg-white/80 w-10 h-6 flex items-center justify-center text-sm font-semibold rounded-sm">
                        {mm}
                      </div>
                      <span className="text-[7px] uppercase tracking-[0.18em] text-slate-500">MM</span>
                    </div>
                    <span className="text-slate-400 text-sm self-center pb-3">/</span>
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="border border-gray-400 bg-white/80 w-10 h-6 flex items-center justify-center text-sm font-semibold rounded-sm">
                        {dd}
                      </div>
                      <span className="text-[7px] uppercase tracking-[0.18em] text-slate-500">DD</span>
                    </div>
                    <span className="text-slate-400 text-sm self-center pb-3">/</span>
                    <div className="flex flex-col items-center gap-0.5">
                      <div className="border border-gray-400 bg-white/80 w-16 h-6 flex items-center justify-center text-sm font-semibold rounded-sm">
                        {yyyy}
                      </div>
                      <span className="text-[7px] uppercase tracking-[0.18em] text-slate-500">YYYY</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-black/10 mb-3" />

            {/* Row 2: Pay To The Order Of | Payee Name */}
            <div className="grid grid-cols-[140px_1fr] items-end gap-3 mb-1">
              <div className="text-[12px] font-bold uppercase leading-[1.3] text-slate-700">
                <div>Pay To The</div>
                <div>Order Of</div>
              </div>
              <span className="line-fill text-lg font-semibold">
                {voucher.payee_name || borrower.name}
              </span>
            </div>

            {/* Row 3: Amount in numbers — right-aligned box */}
            <div className="flex justify-end mb-2">
              <div className="cheque-amount-box" style={{ minWidth: '220px' }}>
                <span className="text-xs font-bold text-slate-500">PHP</span>
                <span className="text-base font-bold text-gray-900">
                  {Number(voucher.gross_amount || 0).toLocaleString('en-PH', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Row 4: Amount in words */}
            <div className="grid grid-cols-[60px_1fr] items-end gap-2 mb-1">
              <div className="text-[11px] font-bold uppercase text-slate-700">Pesos</div>
              <div className="words-line">
                <span className="words-fill">{amountWords}</span>
                <span className="words-asterisks">{'*'.repeat(10)}</span>
              </div>
            </div>

            {/* Second words line (overflow / blank) */}
            <div className="grid grid-cols-[60px_1fr] items-end gap-2 mb-3">
              <div />
              <div className="words-line" />
            </div>

            {/* Row 5: Account No. | spacer | Authorized Signature */}
            <div className="grid grid-cols-[200px_1fr_200px] items-end gap-4 mb-4">
              <div>
                <div className="micro-label mb-1">Account No.</div>
                <span className="line-fill text-sm">
                  {voucher.cheque.account_number || ''}
                </span>
              </div>
              <div />
              <div>
                <div className="micro-label mb-1 text-right">Authorized Signature</div>
                <div className="line-fill" />
              </div>
            </div>

          </div>
        </section>
      </div>
    </>
  );
}