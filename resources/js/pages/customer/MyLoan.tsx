import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import NoLoansPlaceholder from '@/components/dashboard/NoLoansPlaceholder';
import LoanScheduleTab from '@/pages/borrowers/components/Tabs/LoanScheduleTab';
import LoanCollateralTab from '@/pages/borrowers/components/Tabs/LoanCollateralTab';
import LoanTermsTab from '@/pages/borrowers/components/Tabs/LoanTermsTab';

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
  penalty: number;
  rebate: number;
  releasing_fees?: {
    gross_amount: number;
    charges: Record<
      string,
      {
        charge_id?: number;
        name?: string;
        rate: number;
        amount: number;
      }
    >;
    total_fees: number;
    net_disbursed_amount: number;
  };
};

type Collateral = {
  id: number;
  type: 'Land' | 'Vehicle' | 'ATM';
  estimated_value: number;
  appraisal_date?: string;
  status: 'Pledged' | 'Released' | 'Forfeited' | 'Pending';
  description?: string;
  remarks?: string;
  land_details?: {
    titleNo: number;
    lotNo: number;
    location: string;
    areaSize: string;
  };
  vehicle_details?: {
    type: 'Car' | 'Motorcycle' | 'Truck';
    brand: string;
    model: string;
    year_model?: number;
    plate_no?: string;
    engine_no?: string;
    transmission_type?: 'Manual' | 'Automatic';
    fuel_type?: string;
  };
  atm_details?: {
    bank_name: 'BDO' | 'BPI' | 'LandBank' | 'MetroBank';
    account_no: string;
    cardno_4digits: number;
  };
};

const toArray = <T,>(value: T[] | Record<string, T> | null | undefined): T[] => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return Object.values(value as Record<string, T>);
  return [];
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
  }).format(amount);

export default function MyLoan({
  authUser,
  collaterals = [],
  activeLoan = null,
  hasLoan = true,
}: {
  authUser: any;
  collaterals: Collateral[];
  activeLoan: Loan | null;
  hasLoan?: boolean;
}) {
  type TabKey = 'loanTerms' | 'loanSchedule' | 'loanCollateral';
  const [activeTab, setActiveTab] = useState<TabKey>('loanSchedule');

  if (!hasLoan) {
    return (
      <DashboardLayout>
        <Head title="My Loan Details" />
        <div className="m-4">
          <NoLoansPlaceholder message="You don't have a loans yet. Please apply for a loan to create one." />
        </div>
      </DashboardLayout>
    );
  }

  if (!authUser) {
    return (
      <DashboardLayout>
        <Head title="My Loan Details" />
        <div className="m-4">
          <NoLoansPlaceholder message="No borrower profile found." />
        </div>
      </DashboardLayout>
    );
  }

  const normalizedData = useMemo(
    () => ({
      ...authUser,
      loans: toArray<Loan>(authUser.loans),
      amortizationSchedule: toArray(authUser.amortizationSchedule),
    }),
    [authUser],
  );

  const safeLoan: Loan = activeLoan ?? normalizedData.loans[0] ?? {
    loanNo: '-',
    released: '-',
    maturity: '-',
    repayment_frequency: '-',
    principal: 0,
    interest: '-',
    interestType: '-',
    loan_type: '-',
    due: 0,
    balance: 0,
    status: 'N/A',
    penalty: 0,
    rebate: 0,
    releasing_fees: undefined,
  };

  const tabItems = useMemo(
    () => [
      {
        key: 'loanSchedule' as TabKey,
        label: 'Payment Schedule',
        content: (
          <LoanScheduleTab
            amortizationSchedule={normalizedData.amortizationSchedule}
            loanAmount={safeLoan.principal}
            interestType={safeLoan.interestType}
          />
        ),
      },
      {
        key: 'loanTerms' as TabKey,
        label: 'Loan Terms',
        content: <LoanTermsTab loan={safeLoan} releasingFees={safeLoan.releasing_fees} />,
      },
      {
        key: 'loanCollateral' as TabKey,
        label: 'Collateral',
        content: <LoanCollateralTab collaterals={toArray(collaterals)} />,
      },
    ],
    [collaterals, normalizedData.amortizationSchedule, safeLoan],
  );

  const currentTab = tabItems.find((tab) => tab.key === activeTab);

  return (
    <DashboardLayout>
      <Head title="My Loan Details" />

      <div className="space-y-6">
        <div className="space-y-1.5">
          <p className="text-xl font-semibold text-gray-900 md:text-2xl">My Loan</p>
          <p className="max-w-xl text-sm text-gray-600">
            Get detailed information about your loan terms, payment schedule, and collateral.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="flex flex-col gap-4 bg-navy p-5 text-white sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Loan Number</p>
              <h2 className="text-lg font-bold text-white sm:hidden">Current Loan Overview</h2>
              <h3 className="text-2xl font-bold sm:text-3xl">#{safeLoan.loanNo}</h3>
            </div>
            <div className="sm:text-right">
              <p className="hidden text-lg font-bold text-white sm:block">Current Loan Overview</p>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">Status</p>
              <span className="inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                {safeLoan.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-5 lg:gap-8 lg:p-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Principal Amount</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(safeLoan.principal)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Interest Rate</p>
              <p className="text-xl font-bold text-gray-900">
                {safeLoan.interest}% <span className="ml-1 text-xs font-normal text-gray-500">({safeLoan.interestType})</span>
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">Current Balance</p>
              <p className="text-xl font-bold text-orange-600">{formatCurrency(safeLoan.balance)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500">Accrued Penalty</p>
              <p className="text-xl font-bold text-rose-600">{formatCurrency(safeLoan.penalty)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">Total Rebates</p>
              <p className="text-xl font-bold text-emerald-600">{formatCurrency(safeLoan.rebate)}</p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="flex overflow-x-auto border-b bg-gray-50/50 no-scrollbar">
            {tabItems.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`border-b-2 px-4 py-4 text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all sm:px-6 ${
                  activeTab === tab.key
                    ? 'border-orange-600 bg-white text-orange-600'
                    : 'border-transparent text-gray-400 hover:bg-gray-100/50 hover:text-gray-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-5">{currentTab?.content}</div>
        </div>
      </div>
    </DashboardLayout>
  );
}
