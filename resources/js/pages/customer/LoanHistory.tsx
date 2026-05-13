import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import LoanScheduleTab from '@/pages/borrowers/components/Tabs/LoanScheduleTab';
import { ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';

type ScheduleRow = {
  installment_no: number;
  due_date: string;
  interest_amount?: number | string;
  penalty_amount?: number | string;
  installment_amount?: number | string;
  amount_paid?: number | string;
  rebate_amount?: number | string;
  status: string;
};

type HistoryLoan = {
  id: number;
  loanNo: string;
  released: string;
  maturity: string;
  repayment_frequency: string;
  principal: number;
  interest: string;
  interestType: string;
  loan_type: string;
  penalty: number;
  rebate: number;
  due: number;
  balance: number;
  status: string;
  totalPaid: number;
  amortizationSchedule: ScheduleRow[];
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);

const formatDate = (dateStr: string) => {
  if (!dateStr || dateStr === '-') return '-';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function LoanHistory({ loans = [] }: { loans: HistoryLoan[] }) {
  const [expandedLoan, setExpandedLoan] = useState<number | null>(null);

  const toggleLoan = (id: number) => {
    setExpandedLoan(expandedLoan === id ? null : id);
  };

  return (
    <DashboardLayout>
      <Head title="Loan History" />

      <div className="space-y-6">
        <div className="space-y-1.5">
          <p className="text-xl font-semibold text-gray-900 md:text-2xl">Loan History</p>
          <p className="max-w-xl text-sm text-gray-600">
            View all your fully paid loans and their complete payment schedules.
          </p>
        </div>

        {loans.length === 0 ? (
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 border border-dashed border-gray-200">
                <CheckCircle2 className="h-8 w-8 text-gray-300" />
              </div>
              <p className="text-sm font-medium text-gray-400">No fully paid loans found.</p>
              <p className="mt-1 text-xs text-gray-400">
                Once you fully pay a loan, it will appear here.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {loans.map((loan) => {
              const isExpanded = expandedLoan === loan.id;

              return (
                <div
                  key={loan.id}
                  className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-200"
                >
                  {/* Loan Header — clickable */}
                  <button
                    onClick={() => toggleLoan(loan.id)}
                    className="flex w-full items-center justify-between bg-navy p-5 text-left text-white transition-colors hover:bg-[#1e2a42] sm:p-6"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-lg font-bold">#{loan.loanNo}</p>
                        <p className="mt-0.5 text-xs text-white/60">
                          {formatDate(loan.released)} — {formatDate(loan.maturity)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden text-right sm:block">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                          Total Paid
                        </p>
                        <p className="text-lg font-bold">{formatCurrency(loan.totalPaid)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          Fully Paid
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="h-5 w-5 text-white/60" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-white/60" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div>
                      {/* Summary Stats */}
                      <div className="grid grid-cols-2 gap-4 border-b border-gray-100 p-5 sm:grid-cols-4 sm:p-6">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                            Principal
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(loan.principal)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                            Interest Rate
                          </p>
                          <p className="text-lg font-bold text-gray-900">
                            {loan.interest}%{' '}
                            <span className="text-xs font-normal text-gray-500">
                              ({loan.interestType})
                            </span>
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500">
                            Total Penalty
                          </p>
                          <p className="text-lg font-bold text-rose-600">
                            {formatCurrency(loan.penalty)}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">
                            Total Rebate
                          </p>
                          <p className="text-lg font-bold text-emerald-600">
                            {formatCurrency(loan.rebate)}
                          </p>
                        </div>
                      </div>

                      {/* Payment Schedule */}
                      <div className="p-4 sm:p-5">
                        <LoanScheduleTab
                          amortizationSchedule={loan.amortizationSchedule}
                          loanAmount={loan.principal}
                          interestType={loan.interestType}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
