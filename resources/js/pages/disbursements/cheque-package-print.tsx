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
      account_name?: string | null;
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

  return (
    <>
      <Head title={`Cheque Package ${voucher.voucher_no}`} />

      <style>{`
        @page {
          size: A4 portrait;
          margin: 16mm;
        }

        body {
          background:
            linear-gradient(180deg, #fbf7ea 0%, #f2f6fb 100%);
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

        .cheque-face {
          border: 2px solid #0f172a;
          border-radius: 24px;
          padding: 22px 24px;
          background:
            linear-gradient(135deg, rgba(219, 234, 254, 0.55), rgba(255, 255, 255, 0.96)),
            linear-gradient(180deg, rgba(236, 253, 245, 0.45), transparent);
          position: relative;
          overflow: hidden;
        }

        .cheque-face::before {
          content: "";
          position: absolute;
          inset: 10px;
          border: 1px solid rgba(15, 23, 42, 0.16);
          border-radius: 18px;
          pointer-events: none;
        }

        .micro-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #475569;
        }

        .cheque-meta {
          display: grid;
          grid-template-columns: 140px 1fr 180px;
          gap: 18px;
          align-items: end;
        }

        .cheque-stamp {
          border: 1px solid #0f172a;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.88);
          padding: 12px 14px;
          text-align: center;
        }

        .field-line {
          display: grid;
          grid-template-columns: 140px 1fr;
          gap: 12px;
          align-items: end;
        }

        .no-print {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-bottom: 16px;
        }

        @media print {
          body {
            background: #ffffff;
          }

          .print-shell {
            max-width: none;
            padding: 0;
          }

          .sheet {
            border: none;
            box-shadow: none;
            padding: 0;
          }

          .no-print {
            display: none;
          }
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

        <section className="sheet space-y-5">
          <div className="cheque-face space-y-6">
            <div className="cheque-meta">
              <div>
                <div className="micro-label">Bank</div>
                <div className="mt-2 text-xl font-bold uppercase text-slate-900">{voucher.cheque.bank_name}</div>
                {voucher.cheque.account_name && (
                  <div className="mt-1 text-sm text-slate-700">{voucher.cheque.account_name}</div>
                )}
              </div>
              <div className="text-center">
                <div className="micro-label">Cheque Release Instrument</div>
                <div className="mt-2 text-3xl font-bold uppercase tracking-[0.18em] text-slate-900">JAMO LENDING CORP.</div>
              </div>
              <div className="cheque-stamp">
                <div className="micro-label">Cheque No.</div>
                <div className="mt-2 text-2xl font-bold text-slate-900">{voucher.cheque.cheque_no}</div>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_220px] gap-5">
              <div className="space-y-4">
                <div className="field-line">
                  <span className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-700">Pay To The Order Of</span>
                  <span className="min-h-5er-b border-black text-base">{voucher.payee_name || borrower.name}</span>
                </div>
                <div className="field-line">
                  <span className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-700">Account Name</span>
                  <span className="min-h-5 border-b border-black text-base">{voucher.cheque.account_name || ''}</span>
                </div>
              </div>
              <div className="rounded-xl border border-slate-800 bg-white px-4 py-4 text-right">
                <div className="micro-label">Amount</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{formatMoney(voucher.gross_amount)}</div>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_220px] gap-5">
              <div className="space-y-4">
                <div className="field-line">
                  <span className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-700">Account Number</span>
                  <span className="min-h-5 border-b border-black text-base">{voucher.cheque.account_number || ''}</span>
                </div>
                <div className="field-line">
                  <span className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-700">Cheque Date</span>
                  <span className="min-h-5 border-b border-black text-base">{formatDate(voucher.cheque.cheque_date)}</span>
                </div>
              </div>
              <div className="rounded-xl border border-dashed border-slate-500 bg-white/70 px-4 py-4 text-sm">
                <div className="micro-label">Cheque Date</div>
                <div className="mt-2 font-semibold text-slate-900">{formatDate(voucher.cheque.cheque_date)}</div>
                <div className="mt-3 micro-label">Cheque Number</div>
                <div className="mt-2 text-slate-900">{voucher.cheque.cheque_no}</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
