import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

type ChequePrintProps = {
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

const LabeledLine = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="grid grid-cols-[140px_1fr] items-end gap-3">
    <span className="text-sm font-semibold uppercase tracking-[0.12em] text-gray-700">{label}</span>
    <span className="min-h-5 border-b border-black text-base">{value || ''}</span>
  </div>
);

export default function ChequePrint({ voucher, disbursement, borrower }: ChequePrintProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.print();
    }, 250);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Head title={`Cheque ${voucher.cheque.cheque_no}`} />

      <style>{`
        @page {
          size: A4 portrait;
          margin: 16mm;
        }

        body {
          background:
            radial-gradient(circle at top left, rgba(191, 211, 232, 0.22), transparent 30%),
            radial-gradient(circle at bottom right, rgba(199, 227, 205, 0.18), transparent 28%),
            linear-gradient(180deg, #f5f8fc 0%, #eef4f9 100%);
          color: #111827;
          font-family: "Times New Roman", serif;
        }

        .print-shell {
          max-width: 900px;
          margin: 0 auto;
          padding: 24px;
        }

        .paper {
          background: #ffffff;
          border: 1px solid #1f2937;
          box-shadow: 0 18px 35px rgba(15, 23, 42, 0.12);
          padding: 24px;
        }

        .cheque-board {
          border: 2px solid #0f172a;
          border-radius: 24px;
          padding: 22px 24px;
          background:
            linear-gradient(135deg, rgba(219, 234, 254, 0.55), rgba(255, 255, 255, 0.96)),
            linear-gradient(180deg, rgba(236, 253, 245, 0.45), transparent);
          position: relative;
          overflow: hidden;
        }

        .cheque-board::before {
          content: "";
          position: absolute;
          inset: 10px;
          border: 1px solid rgba(15, 23, 42, 0.16);
          border-radius: 18px;
          pointer-events: none;
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

        .micro-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #475569;
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

          .paper {
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
            className="rounded border border-[#BFD3E8] bg-[#EEF6FF] px-4 py-2 text-sm font-medium text-gray-900"
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

        <div className="paper space-y-5">
          <section className="cheque-board space-y-6">
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
                <LabeledLine label="Pay To The Order Of" value={voucher.payee_name || borrower.name} />
                <LabeledLine label="Account Name" value={voucher.cheque.account_name} />
              </div>
              <div className="rounded-xl border border-slate-800 bg-white px-4 py-4 text-right">
                <div className="micro-label">Amount</div>
                <div className="mt-2 text-3xl font-bold text-slate-900">{formatMoney(voucher.gross_amount)}</div>
              </div>
            </div>

            <div className="grid grid-cols-[1fr_220px] gap-5">
              <div className="space-y-4">
                <LabeledLine label="Account Number" value={voucher.cheque.account_number} />
                <LabeledLine label="Cheque Date" value={formatDate(voucher.cheque.cheque_date)} />
              </div>
              <div className="rounded-xl border border-dashed border-slate-500 bg-white/70 px-4 py-4 text-sm">
                <div className="micro-label">Cheque Date</div>
                <div className="mt-2 font-semibold text-slate-900">{formatDate(voucher.cheque.cheque_date)}</div>
                <div className="mt-3 micro-label">Cheque Number</div>
                <div className="mt-2 text-slate-900">{voucher.cheque.cheque_no}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
