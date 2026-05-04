import React, { useEffect, useMemo, useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  voucher?: {
    voucher_no: string;
    voucher_type: string;
    voucher_date?: string | null;
    payee_name: string;
    particulars: string;
    gross_amount: number;
    status: string;
    received_by_name?: string | null;
    received_at?: string | null;
    cheque?: {
      bank_account_id?: number | null;
      bank_name: string;
      account_name?: string | null;
      account_number?: string | null;
      cheque_no: string;
      cheque_date?: string | null;
    } | null;
  } | null;
};

type EligibleLoan = {
  id: number;
  borrower_name: string;
  borrower_address?: string;
  principal_amount: number;
  released_amount: number;
  loan_type: string;
};

type BankAccount = {
  id: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  branch?: string | null;
};

type FeeCharge = {
  charge_id?: number;
  name?: string;
  rate: number;
  amount: number;
};

type Props = {
  disbursements: DisbursementRow[];
  eligibleLoans: EligibleLoan[];
  bankAccounts: BankAccount[];
  initialLoanId?: number | null;
  feeConfig: {
    charges: Record<string, FeeCharge>;
    total_fees: number;
    gross_amount: number;
    net_disbursed_amount: number;
  };
};

type ActionModalState =
  | {
      mode: 'approve' | 'release' | 'fail';
      row: DisbursementRow;
    }
  | null;

export default function DisbursementsIndex({ disbursements, eligibleLoans, bankAccounts, initialLoanId = null, feeConfig }: Props) {
  const page = usePage();
  const roles = (page.props as any)?.auth?.roles ?? [];
  const isAdmin = roles.includes('admin');
  const csrfToken = typeof document !== 'undefined'
    ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''
    : '';

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [bankAccountOptions, setBankAccountOptions] = useState<BankAccount[]>(bankAccounts);
  const [loanId, setLoanId] = useState<string>(() => {
    if (initialLoanId && eligibleLoans.some((loan) => loan.id === initialLoanId)) {
      return String(initialLoanId);
    }

    return eligibleLoans[0] ? String(eligibleLoans[0].id) : '';
  });
  const [method, setMethod] = useState<string>('');
  const [referenceNo, setReferenceNo] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [voucherDate, setVoucherDate] = useState<string>('');
  const [payeeName, setPayeeName] = useState<string>('');
  const [payeeAddress, setPayeeAddress] = useState<string>('');
  const [payeeTin, setPayeeTin] = useState<string>('');
  const [particulars, setParticulars] = useState<string>('');
  const [bankAccountId, setBankAccountId] = useState<string>('');
  const [chequeDate, setChequeDate] = useState<string>('');
  const [selectedChargeIds, setSelectedChargeIds] = useState<number[]>([]);

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [actionModal, setActionModal] = useState<ActionModalState>(null);
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});
  const [modalReferenceNo, setModalReferenceNo] = useState<string>('');
  const [modalReleaseDate, setModalReleaseDate] = useState<string>('');
  const [modalReceivedBy, setModalReceivedBy] = useState<string>('');
  const [modalFailureReason, setModalFailureReason] = useState<string>('');
  const [showBankAccountModal, setShowBankAccountModal] = useState(false);
  const [bankAccountForm, setBankAccountForm] = useState({
    bank_name: '',
    account_name: '',
    account_number: '',
    branch: '',
  });
  const [bankAccountErrors, setBankAccountErrors] = useState<Record<string, string>>({});
  const [bankAccountGeneralError, setBankAccountGeneralError] = useState('');
  const [savingBankAccount, setSavingBankAccount] = useState(false);

  const filtered = useMemo(() => {
    if (activeTab === 'all') return disbursements;
    return disbursements.filter((d) => d.status.toLowerCase() === activeTab);
  }, [activeTab, disbursements]);

  const selectedLoan = useMemo(
    () => eligibleLoans.find((l) => String(l.id) === loanId) ?? null,
    [eligibleLoans, loanId]
  );

  const selectedBankAccount = useMemo(
    () => bankAccountOptions.find((account) => String(account.id) === bankAccountId) ?? null,
    [bankAccountOptions, bankAccountId]
  );

  useEffect(() => {
    if (!selectedLoan) {
      return;
    }

    setPayeeName(selectedLoan.borrower_name);
    setPayeeAddress(selectedLoan.borrower_address ?? '');
    setParticulars(`Loan proceeds for Loan #${selectedLoan.id} (${selectedLoan.loan_type})`);
  }, [selectedLoan]);

  useEffect(() => {
    setBankAccountOptions(bankAccounts);
  }, [bankAccounts]);

  useEffect(() => {
    const allChargeIds = Object.values(feeConfig?.charges ?? {})
      .map((charge) => Number(charge.charge_id))
      .filter((chargeId) => Number.isFinite(chargeId) && chargeId > 0);

    setSelectedChargeIds(allChargeIds);
  }, [feeConfig]);

  const grossAmount = selectedLoan ? Number(selectedLoan.principal_amount || 0) : 0;
  const feeBreakdown = useMemo(() => {
    const charges = Object.fromEntries(
      Object.entries(feeConfig?.charges ?? {})
        .filter(([, charge]) => {
          const chargeId = Number(charge.charge_id);

          return Number.isFinite(chargeId) && selectedChargeIds.includes(chargeId);
        })
        .map(([chargeName, charge]) => {
        const chargeAmount = Number((grossAmount * Number(charge.rate || 0)).toFixed(2));

        return [chargeName, {
          ...charge,
          amount: chargeAmount,
        }];
      })
    );

    const totalFees = Number(
      Object.values(charges).reduce((sum, charge) => sum + Number(charge.amount || 0), 0).toFixed(2)
    );

    return {
      charges,
      totalFees,
      netDisbursedAmount: Math.max(Number((grossAmount - totalFees).toFixed(2)), 0),
    };
  }, [feeConfig, grossAmount, selectedChargeIds]);

  const toggleCharge = (chargeId?: number) => {
    const normalizedChargeId = Number(chargeId);

    if (!Number.isFinite(normalizedChargeId) || normalizedChargeId <= 0) {
      return;
    }

    setSelectedChargeIds((prev) =>
      prev.includes(normalizedChargeId)
        ? prev.filter((id) => id !== normalizedChargeId)
        : [...prev, normalizedChargeId]
    );
  };

  const formatDate = (value?: string | null) => {
    if (!value) return 'N/A';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 'N/A' : parsed.toLocaleString('en-PH');
  };

  const submitRequest = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};

    if (!loanId) errors.loan_id = 'Loan is required.';
    if (!selectedLoan || grossAmount <= 0) errors.amount = 'Selected loan amount must be greater than 0.';
    if (!method) errors.method = 'Disbursement method is required.';
    if (['Cash', 'Cheque Voucher'].includes(method)) {
      if (!voucherDate) errors.voucher_date = 'Voucher date is required.';
      if (!payeeName.trim()) errors.payee_name = 'Payee name is required.';
      if (!particulars.trim()) errors.particulars = 'Particulars are required.';
    }
    if (method === 'Cheque Voucher') {
      if (!bankAccountId) errors.bank_account_id = 'Bank account is required.';
      if (!chequeDate) errors.cheque_date = 'Cheque date is required.';
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    router.post('/disbursements', {
      loan_id: Number(loanId),
      selected_charge_ids: selectedChargeIds,
      method,
      currency: 'PHP',
      reference_no: referenceNo || null,
      remarks: remarks || null,
      voucher_date: voucherDate || null,
      payee_name: payeeName || null,
      payee_address: payeeAddress || null,
      payee_tin: payeeTin || null,
      particulars: particulars || null,
      bank_account_id: bankAccountId ? Number(bankAccountId) : null,
      cheque_date: chequeDate || null,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setFormErrors({});
        setMethod('');
        setReferenceNo('');
        setRemarks('');
        setVoucherDate('');
        setPayeeTin('');
        setBankAccountId('');
        setChequeDate('');
        setSelectedChargeIds(
          Object.values(feeConfig?.charges ?? {})
            .map((charge) => Number(charge.charge_id))
            .filter((chargeId) => Number.isFinite(chargeId) && chargeId > 0)
        );
      },
      onError: (errors) => {
        const normalizedErrors = Object.entries(errors).reduce<Record<string, string>>((carry, [key, value]) => {
          if (typeof value === 'string' && value.trim()) {
            carry[key] = value;
          }

          return carry;
        }, {});

        setFormErrors((prev) => ({
          ...prev,
          ...normalizedErrors,
        }));
      },
    });
  };

  const closeBankAccountModal = () => {
    setShowBankAccountModal(false);
    setBankAccountForm({
      bank_name: '',
      account_name: '',
      account_number: '',
      branch: '',
    });
    setBankAccountErrors({});
    setBankAccountGeneralError('');
    setSavingBankAccount(false);
  };

  const submitBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: Record<string, string> = {};
    if (!bankAccountForm.bank_name.trim()) errors.bank_name = 'Bank name is required.';
    if (!bankAccountForm.account_name.trim()) errors.account_name = 'Account name is required.';
    if (!bankAccountForm.account_number.trim()) errors.account_number = 'Account number is required.';

    setBankAccountErrors(errors);
    setBankAccountGeneralError('');

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSavingBankAccount(true);

    try {
      const response = await fetch('/disbursements/bank-accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
        },
        body: JSON.stringify({
          ...bankAccountForm,
          branch: bankAccountForm.branch.trim() || null,
          is_active: true,
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 422 && payload.errors) {
          const normalizedErrors = Object.entries(payload.errors).reduce<Record<string, string>>((carry, [key, value]) => {
            if (Array.isArray(value) && value[0]) {
              carry[key] = String(value[0]);
            } else if (typeof value === 'string' && value.trim()) {
              carry[key] = value;
            }

            return carry;
          }, {});

          setBankAccountErrors(normalizedErrors);
        } else {
          setBankAccountGeneralError(payload.message || 'Failed to add bank account.');
        }

        return;
      }

      const createdAccount = payload.bankAccount as BankAccount | undefined;
      if (createdAccount) {
        setBankAccountOptions((prev) => {
          const next = [...prev, createdAccount];
          next.sort((a, b) => {
            const byBank = a.bank_name.localeCompare(b.bank_name);
            return byBank !== 0 ? byBank : a.account_name.localeCompare(b.account_name);
          });
          return next;
        });
        setBankAccountId(String(createdAccount.id));
      }

      closeBankAccountModal();
    } catch {
      setBankAccountGeneralError('Failed to add bank account. Please try again.');
    } finally {
      setSavingBankAccount(false);
    }
  };

  const closeActionModal = () => {
    setActionModal(null);
    setActionErrors({});
    setModalReferenceNo('');
    setModalReleaseDate('');
    setModalReceivedBy('');
    setModalFailureReason('');
  };

  const openActionModal = (mode: NonNullable<ActionModalState>['mode'], row: DisbursementRow) => {
    setActionErrors({});
    setActionModal({ mode, row });
    setModalReferenceNo(row.reference_no ?? '');
    setModalReleaseDate('');
    setModalReceivedBy(row.voucher?.received_by_name ?? '');
    setModalFailureReason('');
  };

  const submitAction = () => {
    if (!actionModal) return;

    if (actionModal.mode === 'approve') {
      const errors: Record<string, string> = {};
      if ((actionModal.row.method === 'Cash' || actionModal.row.method === 'Cheque Voucher') && !modalReceivedBy.trim()) {
        errors.received_by_name = 'Received by / signatory is required.';
      }
      setActionErrors(errors);
      if (Object.keys(errors).length > 0) {
        return;
      }

      router.post(`/disbursements/${actionModal.row.id}/approve`, {
        reference_no: modalReferenceNo || null,
        disbursed_at: modalReleaseDate || null,
        received_by_name: modalReceivedBy || null,
        received_at: modalReleaseDate || null,
      }, {
        preserveScroll: true,
        onSuccess: () => closeActionModal(),
        onError: (errors) => {
          const normalizedErrors = Object.entries(errors).reduce<Record<string, string>>((carry, [key, value]) => {
            if (typeof value === 'string' && value.trim()) {
              carry[key] = value;
            }

            return carry;
          }, {});

          setActionErrors(normalizedErrors);
        },
      });
      return;
    }

    if (actionModal.mode === 'release') {
      router.post(
        `/disbursements/${actionModal.row.id}/complete`,
        {
          reference_no: modalReferenceNo || null,
          disbursed_at: modalReleaseDate || null,
          received_by_name: modalReceivedBy || null,
          received_at: modalReleaseDate || null,
        },
        {
          preserveScroll: true,
          onSuccess: () => closeActionModal(),
          onError: (errors) => {
            const normalizedErrors = Object.entries(errors).reduce<Record<string, string>>((carry, [key, value]) => {
              if (typeof value === 'string' && value.trim()) {
                carry[key] = value;
              }

              return carry;
            }, {});

            setActionErrors(normalizedErrors);
          },
        },
      );
      return;
    }

    const errors: Record<string, string> = {};
    if (!modalFailureReason.trim()) {
      errors.failure_reason = 'Failure reason is required.';
    }
    setActionErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    router.post(
      `/disbursements/${actionModal.row.id}/fail`,
      {
        failure_reason: modalFailureReason,
        failure_code: null,
      },
      {
        preserveScroll: true,
        onSuccess: () => closeActionModal(),
        onError: (errors) => {
          const normalizedErrors = Object.entries(errors).reduce<Record<string, string>>((carry, [key, value]) => {
            if (typeof value === 'string' && value.trim()) {
              carry[key] = value;
            }

            return carry;
          }, {});

          setActionErrors((prev) => ({
            ...prev,
            ...normalizedErrors,
          }));
        },
      },
    );
  };

  const deleteDisbursement = (row: DisbursementRow) => {
    const confirmed = window.confirm(`Delete disbursement ${row.disbursement_no}? This cannot be undone.`);

    if (!confirmed) {
      return;
    }

    router.delete(`/disbursements/${row.id}`, {
      preserveScroll: true,
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
          {formErrors.error && (
            <div className="mb-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {formErrors.error}
            </div>
          )}
          <p className="mb-4 text-xs text-gray-600">
            <span className="font-semibold text-red-600">*</span> Required fields
          </p>
          <p className="mb-4 rounded border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs text-yellow-800">
            Loan proceeds are released net of the currently configured releasing fees.
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
                type="text"
                value={selectedLoan ? grossAmount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }) : ''}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Select loan first"
                readOnly
              />
              {formErrors.amount && <p className="mt-1 text-xs text-red-600">{formErrors.amount}</p>}
              <p className="mt-1 text-xs text-gray-500">Auto-filled from the selected loan.</p>
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
                <option value="Cheque Voucher">Cheque Voucher</option>
              </select>
              {formErrors.method && <p className="mt-1 text-xs text-red-600">{formErrors.method}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Reference No.
              </label>
              <input
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Optional"
              />
              {formErrors.reference_no && <p className="mt-1 text-xs text-red-600">{formErrors.reference_no}</p>}
            </div>
            {['Cash', 'Cheque Voucher'].includes(method) && (
              <>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Voucher No.
                    </label>
                    <input
                    value={method === 'Cheque Voucher' ? 'Auto-generated as CHV-2026-000001' : method === 'Cash' ? 'Auto-generated as CV-2026-000001' : ''}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      placeholder="Select method first"
                      readOnly
                  />
                  <p className="mt-1 text-xs text-gray-500">Generated by the system when the request is created.</p>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Voucher Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={voucherDate}
                    onChange={(e) => setVoucherDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  {formErrors.voucher_date && <p className="mt-1 text-xs text-red-600">{formErrors.voucher_date}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Payee Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    value={payeeName}
                    onChange={(e) => setPayeeName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    placeholder="Borrower name"
                  />
                  {formErrors.payee_name && <p className="mt-1 text-xs text-red-600">{formErrors.payee_name}</p>}
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Payee TIN</label>
                  <input
                    value={payeeTin}
                    onChange={(e) => setPayeeTin(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Payee Address</label>
                  <input
                    value={payeeAddress}
                    onChange={(e) => setPayeeAddress(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Particulars <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    value={particulars}
                    onChange={(e) => setParticulars(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                    rows={2}
                    placeholder="Purpose / description"
                  />
                  {formErrors.particulars && <p className="mt-1 text-xs text-red-600">{formErrors.particulars}</p>}
                </div>
              </>
            )}
            {method === 'Cheque Voucher' && (
              <>
                <div>
                  <div className="mb-1 flex items-center justify-between gap-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Company Bank Account <span className="text-red-600">*</span>
                    </label>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => setShowBankAccountModal(true)}
                        className="inline-flex items-center gap-1 rounded-md border border-[#E8D7A3] bg-[#FFFBF0] px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:bg-[#FFF3CE]"
                      >
                        <Plus size={14} />
                        Add Bank Account
                      </button>
                    )}
                  </div>
                  <select
                    value={bankAccountId}
                    onChange={(e) => setBankAccountId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="">Select bank account</option>
                    {bankAccountOptions.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.bank_name} - {account.account_name}
                      </option>
                    ))}
                  </select>
                  {formErrors.bank_account_id && <p className="mt-1 text-xs text-red-600">{formErrors.bank_account_id}</p>}
                </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Cheque No.
                    </label>
                    <input
                      value="Auto-generated as CHQ-2026-000001"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                      placeholder="System-generated on request creation"
                      readOnly
                    />
                    <p className="mt-1 text-xs text-gray-500">Generated by the system when the cheque voucher request is created.</p>
                  </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Cheque Date <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    value={chequeDate}
                    onChange={(e) => setChequeDate(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                  />
                  {formErrors.cheque_date && <p className="mt-1 text-xs text-red-600">{formErrors.cheque_date}</p>}
                </div>
                {selectedBankAccount && (
                  <div className="md:col-span-3 rounded border border-[#E8D7A3] bg-[#FFFBF0] p-3 text-sm text-gray-700">
                    <div className="grid grid-cols-1 gap-1 md:grid-cols-3">
                      <p>
                        Bank: <span className="font-semibold">{selectedBankAccount.bank_name}</span>
                      </p>
                      <p>
                        Account Name: <span className="font-semibold">{selectedBankAccount.account_name}</span>
                      </p>
                      <p>
                        Account Number: <span className="font-semibold">{selectedBankAccount.account_number}</span>
                      </p>
                    </div>
                    {selectedBankAccount.branch && (
                      <p className="mt-1">
                        Branch: <span className="font-semibold">{selectedBankAccount.branch}</span>
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
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
              <p>Gross Amount: <span className="font-semibold">{grossAmount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span></p>
              <div className="grid grid-cols-1 gap-1 md:grid-cols-2">
                
                {Object.entries(feeConfig?.charges ?? {}).map(([chargeName, charge]) => {
                  const chargeId = Number(charge.charge_id);
                  const isChecked = selectedChargeIds.includes(chargeId);
                  const computedAmount = Number((grossAmount * Number(charge.rate || 0)).toFixed(2));

                  return (
                    <label key={chargeName} className="flex items-center justify-between gap-3 rounded px-2 py-1 hover:bg-gray-100">
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCharge(charge.charge_id)}
                          className="h-4 w-4 rounded border-gray-300 text-[#FABF24] focus:ring-[#FABF24]"
                        />
                        <span>
                          {charge.name ?? chargeName} ({(Number(charge.rate) * 100).toFixed(2)}%)
                        </span>
                      </span>
                      <span className="font-semibold">
                        {computedAmount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                      </span>
                    </label>
                  );
                })}
                <p>Total Fees: <span className="font-semibold">{feeBreakdown.totalFees.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span></p>
              </div>
              <p className="mt-2 border-t pt-2">
                Net Disbursed Amount: <span className="font-bold">{feeBreakdown.netDisbursedAmount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</span>
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
          {(['all', 'pending', 'completed', 'failed'] as const).map((tab) => (
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
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Voucher</th>
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
                    <td className="px-4 py-3 text-sm">
                      {row.voucher?.voucher_no ? (
                        <div className="space-y-1">
                          <div className="font-medium">{row.voucher.voucher_no}</div>
                          <div className="text-xs text-gray-600">
                            {row.voucher.voucher_type?.toUpperCase()} • {row.voucher.status}
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm">{row.status}</td>
                    <td className="px-4 py-3 text-sm">{formatDate(row.requested_at)}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex flex-wrap gap-2">
                        {isAdmin && row.status === 'Pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => openActionModal('approve', row)}
                              className="rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                            >
                              Approve & Release
                            </button>
                            <button
                              type="button"
                              onClick={() => openActionModal('fail', row)}
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
                              onClick={() => openActionModal('release', row)}
                              className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                            >
                              Release
                            </button>
                            <button
                              type="button"
                              onClick={() => openActionModal('fail', row)}
                              className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                            >
                              Fail
                            </button>
                          </>
                        )}
                        {row.voucher && row.status === 'Completed' && (
                          <button
                            type="button"
                            onClick={() =>
                              window.open(
                                row.method === 'Cheque Voucher' && row.voucher?.cheque
                                  ? `/disbursements/${row.id}/package`
                                  : `/disbursements/${row.id}/voucher`,
                                '_blank',
                                'noopener,noreferrer',
                              )
                            }
                            className={`rounded px-3 py-1 text-xs font-medium text-gray-800 ${
                              row.method === 'Cheque Voucher' && row.voucher?.cheque
                                ? 'border border-[#C7E3CD] bg-[#F1FBF3] hover:bg-[#E2F7E6]'
                                : 'border border-[#D9C895] bg-[#FFF4D6] hover:bg-[#FBE7B0]'
                            }`}
                          >
                            {row.method === 'Cheque Voucher' && row.voucher?.cheque ? 'Print Voucher + Cheque' : 'Print Voucher'}
                          </button>
                        )}
                        {isAdmin && row.status === 'Failed' && (
                          <button
                            type="button"
                            onClick={() => deleteDisbursement(row)}
                            className="rounded border border-red-200 bg-red-50 p-2 text-red-600 hover:bg-red-100"
                            title="Delete disbursement"
                            aria-label="Delete disbursement"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
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

      <Dialog open={!!actionModal} onOpenChange={(open) => !open && closeActionModal()}>
        <DialogContent className="border-[#E8D7A3] bg-[#FFFBF0] shadow-2xl sm:max-w-xl">
          <DialogHeader className="rounded-lg border border-[#F1E3B8] bg-[#FFF4D6] p-4">
            <DialogTitle className="text-gray-900">
              {actionModal?.mode === 'approve' && 'Approve & Release Disbursement'}
              {actionModal?.mode === 'release' && 'Release Disbursement'}
              {actionModal?.mode === 'fail' && 'Fail Disbursement'}
            </DialogTitle>
            <DialogDescription className="text-gray-700">
              {actionModal && (
                <>
                  {actionModal.row.disbursement_no} for loan #{actionModal.row.loan_id} - {actionModal.row.borrower_name}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          {actionModal?.mode === 'approve' && (
            <div className="grid grid-cols-1 gap-4 rounded-lg border border-[#D6E7FF] bg-[#F5F9FF] p-4 md:grid-cols-2">
              {actionErrors.error && (
                <div className="md:col-span-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {actionErrors.error}
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Reference No.</label>
                <input
                  value={modalReferenceNo}
                  onChange={(e) => setModalReferenceNo(e.target.value)}
                  className="w-full rounded-lg border border-[#BFD3E8] bg-white px-3 py-2 text-sm"
                  placeholder="Optional external reference"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Release Date</label>
                <input
                  type="date"
                  value={modalReleaseDate}
                  onChange={(e) => setModalReleaseDate(e.target.value)}
                  className="w-full rounded-lg border border-[#BFD3E8] bg-white px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">Blank uses the current date and time.</p>
                {actionErrors.disbursed_at && <p className="mt-1 text-xs text-red-600">{actionErrors.disbursed_at}</p>}
              </div>
              {(actionModal.row.method === 'Cash' || actionModal.row.method === 'Cheque Voucher') && (
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">Received By / Signatory</label>
                  <input
                    value={modalReceivedBy}
                    onChange={(e) => setModalReceivedBy(e.target.value)}
                    className="w-full rounded-lg border border-[#BFD3E8] bg-white px-3 py-2 text-sm"
                    placeholder="Borrower or authorized representative"
                  />
                  <p className="mt-1 text-xs text-gray-500">This will finalize the release and set the voucher as released.</p>
                  {actionErrors.received_by_name && <p className="mt-1 text-xs text-red-600">{actionErrors.received_by_name}</p>}
                </div>
              )}
            </div>
          )}

          {actionModal?.mode === 'release' && (
            <div className="grid grid-cols-1 gap-4 rounded-lg border border-[#EFE2B6] bg-[#FFFCF4] p-4 md:grid-cols-2">
              {actionErrors.error && (
                <div className="md:col-span-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {actionErrors.error}
                </div>
              )}
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Reference No.</label>
                <input
                  value={modalReferenceNo}
                  onChange={(e) => setModalReferenceNo(e.target.value)}
                  className="w-full rounded-lg border border-[#D9C895] bg-white px-3 py-2 text-sm"
                  placeholder="Optional reference"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Release Date</label>
                <input
                  type="date"
                  value={modalReleaseDate}
                  onChange={(e) => setModalReleaseDate(e.target.value)}
                  className="w-full rounded-lg border border-[#D9C895] bg-white px-3 py-2 text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">Blank uses the current date and time.</p>
                {actionErrors.disbursed_at && <p className="mt-1 text-xs text-red-600">{actionErrors.disbursed_at}</p>}
              </div>
              {(actionModal.row.method === 'Cash' || actionModal.row.method === 'Cheque Voucher') && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Received By / Signatory</label>
                  <input
                    value={modalReceivedBy}
                    onChange={(e) => setModalReceivedBy(e.target.value)}
                    className="w-full rounded-lg border border-[#D9C895] bg-white px-3 py-2 text-sm"
                    placeholder="Borrower or authorized representative"
                  />
                  <p className="mt-1 text-xs text-gray-500">The voucher receipt date will follow the release date automatically.</p>
                  {actionErrors.received_by_name && <p className="mt-1 text-xs text-red-600">{actionErrors.received_by_name}</p>}
                </div>
              )}
            </div>
          )}

          {actionModal?.mode === 'fail' && (
            <div className="rounded-lg border border-[#F3C8C8] bg-[#FFF6F6] p-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Failure Reason <span className="text-red-600">*</span>
              </label>
              <textarea
                value={modalFailureReason}
                onChange={(e) => setModalFailureReason(e.target.value)}
                className="w-full rounded-lg border border-[#E1B4B4] bg-white px-3 py-2 text-sm"
                rows={3}
                placeholder="State why this disbursement failed"
              />
              {actionErrors.failure_reason && (
                <p className="mt-1 text-xs text-red-600">{actionErrors.failure_reason}</p>
              )}
            </div>
          )}

          <DialogFooter className="border-t border-[#EFE2B6] pt-4">
            <Button type="button" variant="outline" onClick={closeActionModal} className="border-[#D9C895] bg-white text-gray-800 hover:bg-[#FFF4D6]">
              Cancel
            </Button>
            <Button
              type="button"
              onClick={submitAction}
              className={
                actionModal?.mode === 'fail'
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : actionModal?.mode === 'release'
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
              }
            >
              {actionModal?.mode === 'approve' && 'Confirm Approve & Release'}
              {actionModal?.mode === 'release' && 'Confirm Release'}
              {actionModal?.mode === 'fail' && 'Confirm Failure'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showBankAccountModal} onOpenChange={(open) => !open && closeBankAccountModal()}>
        <DialogContent className="border-[#E8D7A3] bg-[#FFFBF0] shadow-2xl sm:max-w-lg">
          <DialogHeader className="rounded-lg border border-[#F1E3B8] bg-[#FFF4D6] p-4">
            <DialogTitle className="text-gray-900">Add Bank Account</DialogTitle>
            <DialogDescription className="text-gray-700">
              Add a company bank account for cheque voucher disbursements.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={submitBankAccount} className="space-y-4">
            {bankAccountGeneralError && (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {bankAccountGeneralError}
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Bank Name <span className="text-red-600">*</span>
              </label>
              <input
                value={bankAccountForm.bank_name}
                onChange={(e) => setBankAccountForm((prev) => ({ ...prev, bank_name: e.target.value }))}
                className="w-full rounded-lg border border-[#D9C895] bg-white px-3 py-2 text-sm"
                placeholder="e.g. BDO Unibank"
              />
              {bankAccountErrors.bank_name && <p className="mt-1 text-xs text-red-600">{bankAccountErrors.bank_name}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Account Name <span className="text-red-600">*</span>
              </label>
              <input
                value={bankAccountForm.account_name}
                onChange={(e) => setBankAccountForm((prev) => ({ ...prev, account_name: e.target.value }))}
                className="w-full rounded-lg border border-[#D9C895] bg-white px-3 py-2 text-sm"
                placeholder="e.g. JAMO LENDING CORP."
              />
              {bankAccountErrors.account_name && <p className="mt-1 text-xs text-red-600">{bankAccountErrors.account_name}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Account Number <span className="text-red-600">*</span>
              </label>
              <input
                value={bankAccountForm.account_number}
                onChange={(e) => setBankAccountForm((prev) => ({ ...prev, account_number: e.target.value }))}
                className="w-full rounded-lg border border-[#D9C895] bg-white px-3 py-2 text-sm"
              />
              {bankAccountErrors.account_number && <p className="mt-1 text-xs text-red-600">{bankAccountErrors.account_number}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Branch</label>
              <input
                value={bankAccountForm.branch}
                onChange={(e) => setBankAccountForm((prev) => ({ ...prev, branch: e.target.value }))}
                className="w-full rounded-lg border border-[#D9C895] bg-white px-3 py-2 text-sm"
                placeholder="Optional"
              />
              {bankAccountErrors.branch && <p className="mt-1 text-xs text-red-600">{bankAccountErrors.branch}</p>}
            </div>

            <DialogFooter className="border-t border-[#EFE2B6] pt-4">
              <Button type="button" variant="outline" onClick={closeBankAccountModal} className="border-[#D9C895] bg-white text-gray-800 hover:bg-[#FFF4D6]">
                Cancel
              </Button>
              <Button type="submit" className="bg-[#FABF24] text-black hover:bg-[#f8b80f]" disabled={savingBankAccount}>
                {savingBankAccount ? 'Saving...' : 'Save Bank Account'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
