import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';

type VoucherPrintProps = {
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
    cheque?: {
      bank_account_id?: number | null;
      bank_name: string;
      account_name?: string | null;
      account_number?: string | null;
      cheque_no: string;
      cheque_date?: string | null;
    } | null;
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

const SignatureLine = ({ label, value }: { label: string; value?: string | null }) => (
  <div className="flex-1 text-center">
    <div className="mx-auto min-h-[18px] w-full border-b border-black text-sm font-medium">{value || ''}</div>
    <div className="mt-2 text-sm">{label}</div>
  </div>
);

export default function VoucherPrint({ voucher, disbursement, loan, borrower }: VoucherPrintProps) {
  const isCheque = voucher.voucher_type === 'cheque';

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.print();
    }, 250);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Head title={`${isCheque ? 'Cheque' : 'Cash'} Voucher ${voucher.voucher_no}`} />

      <style>{`
        @page {
          size: A4 portrait;
          margin: 16mm;
        }

        body {
          background:
            radial-gradient(circle at top left, rgba(250, 191, 36, 0.15), transparent 28%),
            radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.08), transparent 24%),
            linear-gradient(180deg, #fbf5e7 0%, #f4ecda 100%);
          color: #111827;
          font-family: "Times New Roman", serif;
        }

        .print-shell {
          max-width: 900px;
          margin: 0 auto;
          padding: 24px;
        }

        .paper {
          background:
            linear-gradient(180deg, rgba(255, 245, 218, 0.78) 0%, rgba(255, 253, 247, 1) 16%, rgba(255, 253, 247, 1) 100%);
          border: 1px solid #2f2a22;
          box-shadow: 0 18px 35px rgba(0, 0, 0, 0.12);
          padding: 22px 24px;
          position: relative;
          overflow: hidden;
        }

        .line-fill {
          display: inline-block;
          min-height: 18px;
          border-bottom: 1px solid #111827;
          width: 100%;
          vertical-align: bottom;
        }

        .document-banner {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 20px;
          align-items: end;
          border: 1px solid #3f3422;
          background:
            linear-gradient(135deg, rgba(168, 85, 247, 0.06), transparent 40%),
            linear-gradient(90deg, #fff0c3 0%, #fff8e4 52%, #f7ebc9 100%);
          padding: 14px 16px;
          position: relative;
        }

        .document-chip {
          border: 1px solid #3f3422;
          background:
            linear-gradient(180deg, #1f2937 0%, #111827 100%);
          color: #fff8e4;
          padding: 10px 14px;
          min-width: 180px;
          text-align: right;
          box-shadow: inset 0 0 0 1px rgba(255, 248, 228, 0.15);
        }

        .document-ribbon {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 5px 10px;
          border: 1px solid #3f3422;
          background: #fff7dc;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #4b5563;
          margin-bottom: 10px;
        }

        .document-grid {
          display: grid;
          gap: 12px;
        }

        .meta-card {
          border: 1px solid #3f3422;
          background:
            linear-gradient(180deg, rgba(255, 252, 244, 0.96) 0%, rgba(255, 250, 238, 0.92) 100%);
          border-radius: 12px;
          padding: 14px 16px;
          position: relative;
        }

        .meta-card::before {
          content: "";
          position: absolute;
          inset: 10px;
          border: 1px solid rgba(63, 52, 34, 0.08);
          border-radius: 8px;
          pointer-events: none;
        }

        .section-heading {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #374151;
        }

        .section-heading::before {
          content: "";
          width: 24px;
          height: 1px;
          background: #3f3422;
        }

        .amount-panel {
          display: grid;
          grid-template-columns: 1fr 220px;
          overflow: hidden;
          border: 1px solid #2f2a22;
          border-radius: 14px;
          background: #fffdf7;
        }

        .amount-head {
          display: grid;
          grid-template-columns: 1fr 220px;
          border-bottom: 1px solid #2f2a22;
          background: linear-gradient(90deg, #f1df9b 0%, #f7edc6 100%);
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.12em;
          font-size: 15px;
        }

        .sign-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          border: 1px solid #3f3422;
          border-radius: 14px;
          background:
            linear-gradient(180deg, rgba(255, 252, 244, 0.92) 0%, rgba(255, 250, 238, 0.9) 100%);
          padding: 20px 16px 16px;
        }

        .no-print {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 16px;
          gap: 12px;
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

          .meta-card,
          .amount-panel,
          .sign-grid {
            break-inside: avoid;
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
            className="rounded border border-[#D9C895] bg-[#FFF4D6] px-4 py-2 text-sm font-medium text-gray-900"
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

        <div className="paper">
          {!isCheque ? (
            <section className="document-grid">
              <header className="document-banner">
                <div>
                  <div className="document-ribbon">Official Release Document</div>
                  <h1 className="text-3xl font-bold tracking-[0.08em] text-gray-900">JAMO LENDING CORP.</h1>
                  <p className="mt-1 text-sm">Prk. 1-B Kisante 9401 Makilala (N. Cotabato) Philippines</p>
                  <p className="text-sm">NonVat Reg. TIN: 600-979-658-00000</p>
                  <h2 className="mt-2 text-2xl font-bold uppercase tracking-[0.2em] text-gray-900">Cash Voucher</h2>
                </div>
                <div className="document-chip">
                  <div className="text-xs uppercase tracking-[0.2em]">Voucher No.</div>
                  <div className="mt-1 text-2xl font-bold">{voucher.voucher_no}</div>
                </div>
              </header>

              <div className="grid grid-cols-[1.2fr_0.8fr] gap-5">
                <div className="meta-card">
                  <div className="section-heading">Payee Profile</div>
                  <div className="space-y-2 text-base">
                    <div className="flex items-end gap-3">
                      <span className="w-24 font-semibold">Name:</span>
                      <span className="line-fill">{voucher.payee_name}</span>
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

                <div className="meta-card">
                  <div className="section-heading">Loan Snapshot</div>
                  <div className="space-y-2 text-base">
                    <div className="flex items-end gap-3">
                      <span className="w-16 font-semibold">Date:</span>
                      <span className="line-fill">{formatDate(voucher.voucher_date)}</span>
                    </div>
                    <div className="flex items-end gap-3">
                      <span className="w-16 font-semibold">Loan:</span>
                      <span className="line-fill">#{loan.id || ''}</span>
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

              <div className="overflow-hidden rounded-[14px]">
                <div className="amount-head text-center">
                  <div className="border-r border-black py-3">Particulars</div>
                  <div className="py-3">Amount</div>
                </div>
                <div className="amount-panel text-base">
                  <div className="border-r border-black p-4 whitespace-pre-wrap">{voucher.particulars}</div>
                  <div className="flex flex-col justify-between p-4">
                    <div className="text-right text-xl font-bold text-gray-900">{formatMoney(voucher.gross_amount)}</div>
                    <div className="border-t border-dashed border-gray-400 pt-3 text-right text-xs uppercase tracking-[0.14em] text-gray-500">
                      Gross Release Amount
                    </div>
                  </div>
                </div>
              </div>

              <div className="sign-grid">
                <SignatureLine label="Prepared By:" value={voucher.prepared_by} />
                <SignatureLine label="Approved By:" value={voucher.approved_by} />
                <SignatureLine label="Received By:" value={voucher.received_by_name} />
              </div>
            </section>
          ) : (
            <section className="document-grid">
              <header className="document-banner">
                <div>
                  <div className="document-ribbon">Controlled Cheque Release</div>
                  <div className="text-xs font-semibold uppercase tracking-[0.35em] text-gray-700">Jamo Lending Corp.</div>
                  <h1 className="mt-1 text-2xl font-bold uppercase tracking-[0.22em] text-gray-900">Check Voucher</h1>
                  <p className="mt-1 text-xs text-gray-700">Cheque issue, control, and payee acknowledgement details</p>
                </div>
                <div className="document-chip">
                  <div className="text-xs uppercase tracking-[0.2em]">Voucher No.</div>
                  <div className="mt-1 text-2xl font-bold">{voucher.voucher_no}</div>
                </div>
              </header>

              <div className="grid grid-cols-[1.1fr_0.9fr] gap-5">
                <div className="meta-card">
                  <div className="section-heading">Payee Details</div>
                  <div className="space-y-2 text-base">
                    <div className="grid grid-cols-[90px_1fr] items-end gap-2">
                      <span className="font-semibold uppercase">Payee:</span>
                      <span className="line-fill">{voucher.payee_name}</span>
                    </div>
                    <div className="grid grid-cols-[90px_1fr] items-end gap-2">
                      <span className="font-semibold uppercase">Category:</span>
                      <span className="line-fill">{loan.loan_type || ''}</span>
                    </div>
                    <div className="grid grid-cols-[90px_1fr] items-end gap-2">
                      <span className="font-semibold uppercase">Address:</span>
                      <span className="line-fill">{voucher.payee_address || borrower.name}</span>
                    </div>
                    <div className="grid grid-cols-[90px_1fr] items-end gap-2">
                      <span className="font-semibold uppercase">TIN:</span>
                      <span className="line-fill">{voucher.payee_tin || ''}</span>
                    </div>
                  </div>
                </div>

                <div className="meta-card">
                  <div className="section-heading">Voucher Control</div>
                  <div className="space-y-2 text-base">
                    <div className="grid grid-cols-[70px_1fr] items-end gap-2">
                      <span className="font-semibold uppercase">No.:</span>
                      <span className="line-fill">{voucher.voucher_no}</span>
                    </div>
                    <div className="grid grid-cols-[70px_1fr] items-end gap-2">
                      <span className="font-semibold uppercase">Date:</span>
                      <span className="line-fill">{formatDate(voucher.voucher_date)}</span>
                    </div>
                    <div className="grid grid-cols-[70px_1fr] items-end gap-2">
                      <span className="font-semibold uppercase">Terms:</span>
                      <span className="line-fill">{disbursement.method}</span>
                    </div>
                    <div className="grid grid-cols-[70px_1fr] items-end gap-2">
                      <span className="font-semibold uppercase">Release:</span>
                      <span className="line-fill">{formatDate(disbursement.disbursed_at)}</span>
                    </div>
                    <div className="grid grid-cols-[70px_1fr] items-end gap-2">
                      <span className="font-semibold uppercase">Ref:</span>
                      <span className="line-fill">{disbursement.disbursement_no}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[1fr_260px] gap-5">
                <div className="meta-card">
                  <div className="section-heading">Particulars</div>
                  <div className="min-h-[72px] border-b border-black text-sm leading-6 whitespace-pre-wrap">{voucher.particulars}</div>
                </div>

                <div className="meta-card">
                  <div className="section-heading">Amount</div>
                  <div className="flex min-h-[72px] items-end justify-end text-right text-2xl font-bold text-gray-900">
                    {formatMoney(voucher.gross_amount)}
                  </div>
                </div>
              </div>

              <div className="meta-card">
                <div className="section-heading">Check Issued</div>
                <table className="w-full border-collapse border border-black text-sm">
                  <thead>
                    <tr className="bg-[#f7e8bb]">
                      <th className="border border-black px-2 py-2 uppercase">Bank</th>
                      <th className="border border-black px-2 py-2 uppercase">Account Number</th>
                      <th className="border border-black px-2 py-2 uppercase">Check Number</th>
                      <th className="border border-black px-2 py-2 uppercase">Check Date</th>
                      <th className="border border-black px-2 py-2 uppercase">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-black px-2 py-3">{voucher.cheque?.bank_name || ''}</td>
                      <td className="border border-black px-2 py-3">{voucher.cheque?.account_number || ''}</td>
                      <td className="border border-black px-2 py-3">{voucher.cheque?.cheque_no || ''}</td>
                      <td className="border border-black px-2 py-3">{formatDate(voucher.cheque?.cheque_date)}</td>
                      <td className="border border-black px-2 py-3 text-right font-semibold">{formatMoney(voucher.gross_amount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="sign-grid">
                <SignatureLine label="Prepared by:" value={voucher.prepared_by} />
                <SignatureLine label="Approved by:" value={voucher.approved_by} />
                <SignatureLine label="Received by:" value={voucher.received_by_name} />
              </div>

              <div className="meta-card">
                <div className="section-heading">Receipt Date</div>
                <div className="grid grid-cols-[120px_1fr] items-end gap-2">
                  <span className="text-sm font-semibold uppercase tracking-[0.12em]">Date Received:</span>
                  <span className="line-fill">{formatDate(voucher.received_at)}</span>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
