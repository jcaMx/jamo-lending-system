import React, { useMemo, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

type DisbursementRow = {
  id: number;
  disbursement_no: string;
  loan_id: number;
  borrower_name: string;
  amount: number;
  currency: string;
  method: string;
  reference_no?: string | null;
  status: string;
  requested_at?: string | null;
  approved_at?: string | null;
  disbursed_at?: string | null;
  created_by: string;
  approved_by: string;
  processed_by: string;
  failure_code?: string | null;
  failure_reason?: string | null;
  remarks?: string | null;
};

type EligibleLoan = {
  id: number;
  borrower_name: string;
  principal_amount: number;
  released_amount: number;
  loan_type: string;
};

type Props = {
  disbursements: DisbursementRow[];
  eligibleLoans: EligibleLoan[];
  initialLoanId?: number | null;
};

export default function DisbursementsIndex({ disbursements, eligibleLoans, initialLoanId = null }: Props) {
  const PROCESSING_FEE_RATE = 0.03;
  const INSURANCE_FEE_RATE = 0.02;
  const NOTARY_FEE_RATE = 0.01;
  const SAVINGS_CONTRIBUTION_RATE = 0.02;

  const page = usePage();
  const roles = (page.props as any)?.auth?.roles ?? [];
  const isAdmin = roles.includes('admin');

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'processing' | 'completed' | 'failed'>('all');
  const [loanId, setLoanId] = useState<string>(() => {
    if (initialLoanId && eligibleLoans.some((loan) => loan.id === initialLoanId)) {
      return String(initialLoanId);
    }

    return eligibleLoans[0] ? String(eligibleLoans[0].id) : '';
  });
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<string>('');
  const [referenceNo, setReferenceNo] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  const [completionRef, setCompletionRef] = useState<Record<number, string>>({});
  const [completionDate, setCompletionDate] = useState<Record<number, string>>({});
  const [failureReason, setFailureReason] = useState<Record<number, string>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filtered = useMemo(() => {
    if (activeTab === 'all') return disbursements;
    return disbursements.filter((d) => d.status.toLowerCase() === activeTab);
  }, [activeTab, disbursements]);

  const selectedLoan = useMemo(
    () => eligibleLoans.find((l) => String(l.id) === loanId) ?? null,
    [eligibleLoans, loanId]
  );

  const grossAmount = Number(amount || 0);
  const processingFee = grossAmount * PROCESSING_FEE_RATE;
  const insuranceFee = grossAmount * INSURANCE_FEE_RATE;
  const notaryFee = grossAmount * NOTARY_FEE_RATE;
  const savingsContribution = grossAmount * SAVINGS_CONTRIBUTION_RATE;
  const totalFees = processingFee + insuranceFee + notaryFee + savingsContribution;
  const netDisbursedAmount = Math.max(grossAmount - totalFees, 0);

  const formatDate = (value?: string | null) => {
    if (!value) return 'N/A';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 'N/A' : parsed.toLocaleString('en-PH');
  };

  const submitRequest = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    if (!loanId) errors.loan_id = 'Loan is required.';
    if (!amount || Number(amount) <= 0) errors.amount = 'Amount must be greater than 0.';
    if (!method) errors.method = 'Disbursement method is required.';
    if (['Bank', 'GCash', 'Cebuana', 'Cheque Voucher'].includes(method) && !referenceNo.trim()) {
      errors.reference_no = 'Reference number is required for non-cash methods.';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    router.post('/disbursements', {
      loan_id: Number(loanId),
      amount: Number(amount),
      method,
      currency: 'PHP',
      reference_no: referenceNo || null,
      remarks: remarks || null,
    });
  };

  const approve = (id: number) => router.post(`/disbursements/${id}/approve`, {});

  const complete = (id: number) =>
    router.post(`/disbursements/${id}/complete`, {
      reference_no: completionRef[id] || null,
      disbursed_at: completionDate[id] || null,
    });

  const fail = (id: number) => {
    if (!failureReason[id]?.trim()) return alert('Failure reason is required.');
    router.post(`/disbursements/${id}/fail`, {
      failure_reason: failureReason[id],
      failure_code: null,
    });
  };

  return (
    <AppLayout>
      <Head title="Disbursements" />

      <div className="m-10 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-semibold tracking-tight text-gray-800">Disbursements</h1>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Create Disbursement Request</h2>
          <p className="mb-4 text-xs text-gray-600">
            <span className="font-semibold text-red-600">*</span> Required fields
          </p>
          <p className="mb-4 rounded border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
            Loan proceeds are released net of 8% fees: Processing (3%), Insurance (2%), Notary (1%), Savings Contribution (2%).
          </p>
          {eligibleLoans.length === 0 && (
            <p className="mb-4 rounded border border-yellow-200 bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
              No eligible approved loans available for disbursement.
            </p>
          )}
          <form onSubmit={submitRequest} className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Loan <span className="text-red-600">*</span>
              </label>
              <select
                value={loanId}
                onChange={(e) => setLoanId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Select loan</option>
                {eligibleLoans.map((loan) => (
                  <option key={loan.id} value={loan.id}>
                    #{loan.id} - {loan.borrower_name} ({loan.loan_type})
                  </option>
                ))}
              </select>
              {formErrors.loan_id && <p className="mt-1 text-xs text-red-600">{formErrors.loan_id}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Amount <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder={selectedLoan ? String(selectedLoan.principal_amount) : '0.00'}
              />
              {formErrors.amount && <p className="mt-1 text-xs text-red-600">{formErrors.amount}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Method <span className="text-red-600">*</span>
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="">Select method</option>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
                <option value="GCash">GCash</option>
                <option value="Cebuana">Cebuana</option>
                <option value="Cheque Voucher">Cheque Voucher</option>
              </select>
              {formErrors.method && <p className="mt-1 text-xs text-red-600">{formErrors.method}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Reference No.
                {['Bank', 'GCash', 'Cebuana', 'Cheque Voucher'].includes(method) && (
                  <span className="text-red-600"> *</span>
                )}
              </label>
              <input
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Required for non-cash methods"
              />
              {formErrors.reference_no && <p className="mt-1 text-xs text-red-600">{formErrors.reference_no}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Remarks</label>
              <input
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Optional remarks"
              />
            </div>
            <div className="md:col-span-3 rounded border border-gray-200 bg-gray-50 p-3 text-sm">
              <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                <p>Gross Amount: <span className="font-semibold">{grossAmount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span></p>
                <p>Processing Fee (3%): <span className="font-semibold">{processingFee.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span></p>
                <p>Insurance Fee (2%): <span className="font-semibold">{insuranceFee.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span></p>
                <p>Notary Fee (1%): <span className="font-semibold">{notaryFee.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span></p>
                <p>Savings Contribution (2%): <span className="font-semibold">{savingsContribution.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span></p>
                <p>Total Fees (8%): <span className="font-semibold">{totalFees.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span></p>
              </div>
              <p className="mt-2 border-t pt-2">
                Net Disbursed Amount: <span className="font-bold">{netDisbursedAmount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
              </p>
            </div>
            <div className="md:col-span-3">
              <button
                type="submit"
                disabled={eligibleLoans.length === 0}
                className="rounded-lg bg-[#FABF24] px-4 py-2 text-sm font-semibold text-black hover:bg-[#f8b80f]"
              >
                Submit Disbursement Request
              </button>
            </div>
          </form>
        </div>

        <div className="flex gap-2">
          {(['all', 'pending', 'processing', 'completed', 'failed'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize transition ${
                activeTab === tab ? 'bg-[#FABF24] text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-md">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">No.</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Loan</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Borrower</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Method</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Requested</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length > 0 ? (
                filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-[#FFF8E6]">
                    <td className="px-4 py-3 text-sm">{row.disbursement_no}</td>
                    <td className="px-4 py-3 text-sm">#{row.loan_id}</td>
                    <td className="px-4 py-3 text-sm">{row.borrower_name}</td>
                    <td className="px-4 py-3 text-sm font-semibold">
                      {Number(row.amount).toLocaleString('en-PH', { style: 'currency', currency: row.currency || 'PHP' })}
                    </td>
                    <td className="px-4 py-3 text-sm">{row.method}</td>
                    <td className="px-4 py-3 text-sm">{row.status}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(row.requested_at)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-2">
                        {isAdmin && row.status === 'Pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => approve(row.id)}
                              className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                            >
                              Approve
                            </button>
                            <input
                              value={failureReason[row.id] ?? ''}
                              onChange={(e) => setFailureReason((prev) => ({ ...prev, [row.id]: e.target.value }))}
                              placeholder="Failure reason"
                              className="rounded border border-gray-300 px-2 py-1 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => fail(row.id)}
                              className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                            >
                              Fail
                            </button>
                          </>
                        )}
                        {isAdmin && row.status === 'Processing' && (
                          <>                           
                            <button
                              type="button"
                              onClick={() => complete(row.id)}
                              className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                            >
                              Complete
                            </button>
                            <input
                              value={completionRef[row.id] ?? ''}
                              onChange={(e) => setCompletionRef((prev) => ({ ...prev, [row.id]: e.target.value }))}
                              placeholder="Completion ref"
                              className="rounded border border-gray-300 px-2 py-1 text-xs"
                            />                    
                            <button
                              type="button"
                              onClick={() => fail(row.id)}
                              className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                            >
                              Fail
                            </button>
                            <input
                              value={failureReason[row.id] ?? ''}
                              onChange={(e) => setFailureReason((prev) => ({ ...prev, [row.id]: e.target.value }))}
                              placeholder="Failure reason"
                              className="rounded border border-gray-300 px-2 py-1 text-xs"
                            />
                            <input
                              type="date"
                              value={completionDate[row.id] ?? ''}
                              onChange={(e) => setCompletionDate((prev) => ({ ...prev, [row.id]: e.target.value }))}
                              placeholder="Disbursed date"
                              className="rounded border border-gray-300 px-2 py-1 text-xs"
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-4 py-6 text-center text-sm italic text-gray-500">
                    No disbursements found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
