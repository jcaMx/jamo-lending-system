import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import RepaymentsTab from './components/Tabs/RepaymentsTab';
import LoanTermsTab from './components/Tabs/LoanTermsTab';
import LoanScheduleTab from './components/Tabs/LoanScheduleTab';
import LoanCollateralTab from './components/Tabs/LoanCollateralTab';
import LoanFilesTab from './components/Tabs/LoanFilesTab';
import CoBorrowerTab from './components/Tabs/CoBorrowerTab';
import LoanCommentsTab from './components/Tabs/LoanCommentsTab';


type Repayment = { id: number; name: string; loanNo: string; method: string; collectedBy: string; collectionDate: string; paidAmount: number };

type Loan = {
  loanNo: string;
  released: string;
  maturity: string;
  repayment: string;
  principal: number;
  interest: string;
  interestType: string;
  penalty: number;
  due: number;
  balance: number;
  status: string;
};
// Add after line 8 in show.tsx
type Collateral = {
  id: number;
  type: 'Land' | 'Vehicle' | 'ATM';
  estimated_value: number;
  appraisal_date: string;
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
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, T>);
  }

  return [];
};

export default function Show({ borrower, collaterals = [], activeLoan = null, repayments = [] }: { borrower: any; collaterals: Collateral[]; activeLoan: Loan | null; repayments: Repayment[] }) {
  type TabKey = 'repayments' | 'loanTerms' | 'loanSchedule' | 'loanCollateral' | 'loanFiles' | 'coBorrower' | 'loanComments';
  const [activeTab, setActiveTab] = useState<TabKey>('repayments');

  // fallback safety if borrower is undefined
  if (!borrower) {
    return <div className="p-6">No borrower data provided.</div>;
  }

  const normalizedBorrower = useMemo(
    () => ({
      ...borrower,
      loans: toArray<Loan>(borrower.loans),
      files: toArray(borrower.files),
      coBorrowers: toArray(borrower.coBorrowers),
      comments: toArray(borrower.comments),
      amortizationSchedule: toArray(borrower.amortizationSchedule),
    }),
    [borrower],
  );

  const safeCollaterals = toArray<Collateral>(collaterals);
  const safeRepayments: Repayment[] = toArray(repayments ?? borrower.repayments);

  const safeLoan: Loan =
    activeLoan ??
    normalizedBorrower.loans[0] ?? {
      loanNo: '-',
      released: '',
      maturity: '',
      repayment: '',
      principal: 0,
      interest: '',
      interestType: '',
      penalty: 0,
      due: 0,
      balance: 0,
      status: '',
    };

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Borrowers', href: '/borrowers' },
    { title: borrower.name, href: `/borrowers/${borrower.id}` },
  ];

  const amortizationSchedule = normalizedBorrower.amortizationSchedule;

  const tabItems = useMemo(
    () => [
      {
        key: 'repayments' as TabKey,
        label: 'Repayments',
        content: <RepaymentsTab repayments={safeRepayments} />,
      },
      {
        key: 'loanTerms' as TabKey,
        label: 'Loan Terms',
        content: <LoanTermsTab loan={safeLoan} />,
      },
      {
        key: 'loanSchedule' as TabKey,
        label: 'Loan Schedule',
        content: <LoanScheduleTab amortizationSchedule={amortizationSchedule} />,
      },
      {
        key: 'loanCollateral' as TabKey,
        label: 'Loan Collateral',
        content: <LoanCollateralTab collaterals={safeCollaterals} />,
      },
      {
        key: 'loanFiles' as TabKey,
        label: 'Loan Files',
        content: <LoanFilesTab borrower={normalizedBorrower} />,
      },
      {
        key: 'coBorrower' as TabKey,
        label: 'Co-Borrower',
        content: <CoBorrowerTab borrower={normalizedBorrower} />,
      },
      {
        key: 'loanComments' as TabKey,
        label: 'Loan Comments',
        content: <LoanCommentsTab comments={borrower.comments ?? []} />,
      },
    ],
    [safeRepayments, safeLoan, amortizationSchedule, safeCollaterals, normalizedBorrower],
  );

  const currentTab = tabItems.find((tab) => tab.key === activeTab);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Borrower: ${borrower.name}`} />

      {/* Borrower Info Card */}
      <div className="m-4 bg-white p-6 rounded-lg shadow space-y-2 mb-6 border border-gray-100">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
            <img src="https://via.placeholder.com/80" alt={borrower.name} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 w-full">
            {/* Name full width on top */}
            <div className="col-span-1 md:col-span-3 font-semibold text-lg mb-1">{borrower.name}</div>
            {/* Column 1 */}
            <div className="flex flex-col gap-1">
              <p>
                <span className="font-medium">Occupation:</span> {borrower.occupation}
              </p>
              <p>
                <span className="font-medium">Gender:</span> {borrower.gender}
              </p>
              <p>
                <span className="font-medium">Age:</span> {borrower.age} yrs old
              </p>
            </div>
            {/* Column 2 */}
            <div className="flex flex-col gap-1">
              <p>
                <span className="font-medium">Address:</span> {borrower.address}
              </p>
              <p>
                <span className="font-medium">City:</span> {borrower.city}
              </p>
              <p>
                <span className="font-medium">Zipcode:</span> {borrower.zipcode}
              </p>
            </div>
            {/* Column 3 */}
            <div className="flex flex-col gap-1">
              <p>
                <span className="font-medium">Email:</span> {borrower.email}
              </p>
              <p>
                <span className="font-medium">Mobile:</span> {borrower.mobile}
              </p>
              <p>
                <span className="font-medium">Landline:</span> {borrower.landline}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Loan Table */}
      <div className="m-4 overflow-x-auto mb-4">
        <p className='m-2 text-1xl font-semibold'>Active Loan</p>
        <table className="min-w-full bg-white border border-white rounded-lg shadow-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Loan No.</th>
              <th className="px-3 py-2 text-left">Released</th>
              <th className="px-3 py-2 text-left">Maturity</th>
              <th className="px-3 py-2 text-left">Repayment</th>
              <th className="px-3 py-2 text-left">Principal</th>
              <th className="px-3 py-2 text-left">Interest</th>
              <th className="px-3 py-2 text-left">Interest Type</th>
              <th className="px-3 py-2 text-left">Penalty</th>
              <th className="px-3 py-2 text-left">Due</th>
              <th className="px-3 py-2 text-left">Balance</th>
              <th className="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
          <tr>
              <td className="px-3 py-2">{safeLoan.loanNo}</td>
              <td className="px-3 py-2">{safeLoan.released}</td>
              <td className="px-3 py-2">{safeLoan.maturity}</td>
              <td className="px-3 py-2">{safeLoan.repayment}</td>
              <td className="px-3 py-2">₱{safeLoan.principal.toLocaleString()}</td>
              <td className="px-3 py-2">{safeLoan.interest}</td>
              <td className="px-3 py-2">{safeLoan.interestType}</td>
              <td className="px-3 py-2">{safeLoan.penalty}</td>
              <td className="px-3 py-2">₱{safeLoan.due.toLocaleString()}</td>
              <td className="px-3 py-2">₱{safeLoan.balance.toLocaleString()}</td>
              <td className="px-3 py-2">{safeLoan.status}</td>
            </tr>
          </tbody>
        </table>
      </div>


      {/* TABS  */}
      <div className="m-4 bg-white rounded-lg shadow space-y-2 mb-6 border border-gray-100">
        <div className="flex gap-2 overflow-hidden">
          {tabItems.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 font-medium whitespace-nowrap transition-colors duration-150 ${
                activeTab === tab.key
                  ? 'bg-[#D97706] text-white border-b-2 border-orange-500 shadow-sm'
                  : 'bg-white text-gray-600 border-b-2 border-transparent hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mx-2">{currentTab?.content}</div>
      </div>
      
    </AppLayout>
  );
}
