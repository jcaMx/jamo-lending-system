import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import NoLoansPlaceholder from '@/components/dashboard/NoLoansPlaceholder';
import BorrowerInfoCard from '@/pages/borrowers/BorrowerInfoCard'; 
// import RepaymentsTab from '@/pages/borrowers/components/Tabs/RepaymentsTab';
import LoanScheduleTab from '@/pages/borrowers/components/Tabs/LoanScheduleTab';
import LoanCollateralTab from '@/pages/borrowers/components/Tabs/LoanCollateralTab';
import LoanTermsTab from '@/pages/borrowers/components/Tabs/LoanTermsTab';

// Customer side usually doesn't see internal admin comments, 
// so we've removed LoanCommentsTab for privacy.

// type Repayment = { id: number; name: string; loanNo: string; method: string; collectedBy: string; collectionDate: string; paidAmount: number };
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

export default function MyLoan({ authUser, collaterals = [], activeLoan = null }: { authUser: any; collaterals: Collateral[]; activeLoan: Loan | null }) {
  type TabKey = 'loanTerms' | 'loanSchedule' | 'loanCollateral';
  const [activeTab, setActiveTab] = useState<TabKey>('loanSchedule');

  if (!authUser) {
    return (
      <DashboardLayout>
        <Head title="My Loan Details" />
        <div className="m-4">
          <NoLoansPlaceholder message="You don't have a borrower profile yet. Please apply for a loan to create one." />
        </div>
      </DashboardLayout>
    );
  }

  // Logic to handle user data
  const normalizedData = useMemo(() => ({
    ...authUser,
    loans: toArray<Loan>(authUser.loans),
    amortizationSchedule: toArray(authUser.amortizationSchedule),
  }), [authUser]);

  const safeLoan: Loan = activeLoan ?? normalizedData.loans[0] ?? {
    loanNo: '-', released: '-', maturity: '-', repayment: '-', principal: 0,
    interest: '-', interestType: '-', loan_type: '-', penalty: 0, due: 0, balance: 0, status: 'N/A',
  };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'My Loan Details', href: '/my-loan' },
  ];

  const tabItems = useMemo(() => [
    // {
    //   key: 'repayments' as TabKey,
    //   label: 'My Payments',
    //   content: <RepaymentsTab repayments={toArray(authUser.repayments)} />,
    // },
    {
      key: 'loanSchedule' as TabKey,
      label: 'Payment Schedule',
      content: <LoanScheduleTab amortizationSchedule={normalizedData.amortizationSchedule} />,
    },
    {
      key: 'loanTerms' as TabKey,
      label: 'Loan Terms',
      content: <LoanTermsTab loan={safeLoan} />,
    },
    {
      key: 'loanCollateral' as TabKey,
      label: 'Collateral',
      content: <LoanCollateralTab collaterals={toArray(collaterals)} />,
    },
  ], [authUser, safeLoan, normalizedData, collaterals]);

  const currentTab = tabItems.find((tab) => tab.key === activeTab);

  return (
    <DashboardLayout>
      <Head title="My Loan Details" />

      {/* User profile summary */}
      {/* <BorrowerInfoCard borrower={authUser} /> */}
      <div className="space-y-1.5 m-3">
        <p className="text-xl md:text-2xl font-semibold text-gray-900">My Loan</p>
        <p className="text-sm text-gray-600 max-w-xl">
           Get detailed information about your loan terms, payment schedule, and collateral.
        </p>
      </div>
      {/* Main Loan Overview */}
      <div className="m-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className='text-xl font-bold text-gray-800 mb-4'>Current Loan Overview</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b text-gray-500 text-sm">
                <th className="px-3 py-3 text-left">Loan No.</th>
                <th className="px-3 py-3 text-left">Principal</th>
                <th className="px-3 py-3 text-left">Interest</th>
                <th className="px-3 py-3 text-left">Balance</th>
                <th className="px-3 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="px-3 py-4 font-medium">{safeLoan.loanNo}</td>
                <td className="px-3 py-4 text-gray-600">₱{safeLoan.principal.toLocaleString()}</td>
                <td className="px-3 py-4 text-gray-600">{safeLoan.interest}%</td>
                <td className="px-3 py-4 font-bold text-[#D97706]">₱{safeLoan.balance.toLocaleString()}</td>
                <td className="px-3 py-4">
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 uppercase">
                    {safeLoan.status}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Tabs */}
      <div className="m-4 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex bg-gray-50 border-b">
          {tabItems.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-3 text-sm font-semibold transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-[#D97706] border-t-2 border-[#D97706]'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4">{currentTab?.content}</div>
      </div>
    </DashboardLayout>
  );
}
