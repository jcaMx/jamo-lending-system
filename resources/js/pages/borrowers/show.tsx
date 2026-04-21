import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import BorrowerInfoCard from './BorrowerInfoCard';
import RepaymentsTab from './components/Tabs/RepaymentsTab';
import LoanTermsTab from './components/Tabs/LoanTermsTab';
import LoanScheduleTab from './components/Tabs/LoanScheduleTab';
import LoanCollateralTab from './components/Tabs/LoanCollateralTab';
import LoanFilesTab from './components/Tabs/LoanFilesTab';
import CoBorrowerTab from './components/Tabs/CoBorrowerTab';
import LoanCommentsTab from './components/Tabs/LoanCommentsTab';
import TabSwitcher from '@/components/TabSwitcher';

type Repayment = { id: number; name: string; loanNo: string; method: string; collectedBy: string; collectionDate: string; paidAmount: number };

type Loan = {
  ID: number;
  loanNo: string;
  released: string;
  maturity: string;
  repayment: string;
  repayment_frequency: string;
  principal: number;
  interest: string;
  interest_type: string;
  interestType: string;
  loan_type: string;
  penalty: number;
  due: number;
  balance: number;
  status: string;
  releasing_fees?: {
    gross_amount: number;
    processing_fee: number;
    insurance_fee: number;
    notary_fee: number;
    savings_contribution: number;
    total_fees: number;
    net_disbursed_amount: number;
  };
};

type FileItem = {
  ID?: number;
  id?: number;
  file_name?: string;
  file_type?: string;
  file_path?: string;
  uploaded_at?: string;
  description?: string;
  source?: string;
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
  files?: FileItem[] | FileItem;
};

const toArray = <T,>(value: T[] | T | Record<string, T> | null | undefined): T[] => {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') {
    const values = Object.values(value as Record<string, T>);
    if (values.length > 0) return values;
  }
  return value ? [value as T] : [];
};

export default function Show({ borrower, collaterals = [], activeLoan = null, repayments = [] }: { borrower: any; collaterals: Collateral[]; activeLoan: Loan | null; repayments: Repayment[] }) {
  type TabKey = 'repayments' | 'loanTerms' | 'loanSchedule' | 'loanCollateral' | 'loanFiles' | 'coBorrower' | 'loanComments';
  const [activeTab, setActiveTab] = useState<TabKey>('repayments');

  if (!borrower) {
    return <div className="p-6">No borrower data provided.</div>;
  }

  const normalizedBorrower = useMemo(() => ({
    ...borrower,
    loans: toArray<Loan>(borrower.loans),
    files: toArray(borrower.files),
    coBorrowers: toArray(borrower.coBorrowers),
    comments: toArray(borrower.comments),
    amortizationSchedule: toArray(borrower.amortizationSchedule),
  }), [borrower]);

  const safeCollaterals = toArray<Collateral>(collaterals);
  const safeRepayments: Repayment[] = toArray(repayments ?? borrower.repayments);
  const borrowerFiles = toArray<FileItem>(normalizedBorrower.files);
  const collateralFiles = safeCollaterals.flatMap((collateral) => toArray<FileItem>(collateral.files));
  const allFiles = [
    ...borrowerFiles.map((f) => ({ ...f, source: f.source ?? 'Borrower', ID: f.ID ?? 0 })),
    ...collateralFiles.map((f) => ({ ...f, source: f.source ?? 'Collateral', ID: f.ID ?? 0 })),
  ];

  const safeLoan: Loan =
    activeLoan ??
    normalizedBorrower.loans[0] ?? {
      ID: 0,
      loanNo: '-',
      released: '',
      maturity: '',
      repayment: '',
      principal: 0,
      interest: '',
      interest_type: '',
      interestType: '',
      loan_type: '',
      releasing_fees: undefined,
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

  const tabItems = useMemo(() => {
    const tabs = [
      {
        key: 'repayments' as TabKey,
        label: 'Repayments',
        content: <RepaymentsTab repayments={safeRepayments} />,
      },
      {
        key: 'loanTerms' as TabKey,
        label: 'Loan Terms',
        content: <LoanTermsTab loan={safeLoan} repayments={safeRepayments} borrowerName={borrower.name} />,
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
        content: <LoanFilesTab files={allFiles} />,
      },
      {
        key: 'coBorrower' as TabKey,
        label: 'Co-Borrower',
        content: <CoBorrowerTab borrower={normalizedBorrower} />,
      },
    ];

    // Only add Loan Comments tab if there is a real active loan
    if (safeLoan.ID > 0) {
      tabs.push({
        key: 'loanComments' as TabKey,
        label: 'Loan Comments',
        content: <LoanCommentsTab 
          comments={borrower.comments ?? []}
          loanId={safeLoan.ID}
          canDelete={true} 
        />,
      });
    } else {
      tabs.push({
        key: 'loanComments' as TabKey,
        label: 'Loan Comments',
        content: <p className="p-2 text-gray-500">No active loan to show comments.</p>,
      });
    }

    return tabs;
  }, [safeRepayments, safeLoan, amortizationSchedule, safeCollaterals, normalizedBorrower, borrower.comments]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Borrower: ${borrower.name}`} />

      {/* Borrower Card */}
      <BorrowerInfoCard borrower={borrower} />

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
              <td className="px-3 py-2">{safeLoan.repayment_frequency}</td>
              <td className="px-3 py-2">₱{safeLoan.principal.toLocaleString()}</td>
              <td className="px-3 py-2">{safeLoan.interest}</td>
              <td className="px-3 py-2">{safeLoan.interest_type}</td>
              <td className="px-3 py-2">{safeLoan.penalty}</td>
              <td className="px-3 py-2">₱{safeLoan.due.toLocaleString()}</td>
              <td className="px-3 py-2">₱{safeLoan.balance.toLocaleString()}</td>
              <td className="px-3 py-2">{safeLoan.status}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* TABS */}
      <TabSwitcher items={tabItems} activeKey={activeTab} onChange={setActiveTab} />
      
    </AppLayout>
  );
}
