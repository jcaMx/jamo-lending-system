import React, { useMemo, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

import BorrowerHeader from './components/BorrowerHeader';
import ActiveLoanTable from './components/ActiveLoanTable';
import RepaymentsTab from '@/pages/borrowers/components/Tabs/RepaymentsTab';
import LoanTermsTab from '@/pages/borrowers/components/Tabs/LoanTermsTab';
import LoanScheduleTab from '@/pages/borrowers/components/Tabs/LoanScheduleTab';
import LoanCollateralTab from '@/pages/borrowers/components/Tabs/LoanCollateralTab';
import LoanFilesTab from '@/pages/borrowers/components/Tabs/LoanFilesTab';
import CoBorrowerTab from '@/pages/borrowers/components/Tabs/CoBorrowerTab';
import LoanCommentsTab from '@/pages/borrowers/components/Tabs/LoanCommentsTab';


import type { Borrower, Loan, Collateral } from '@/types/loan';
import { toArray, DEFAULT_LOAN } from '@/utils/loanHelpers';

type TabKey = 'repayments' | 'loanTerms' | 'loanSchedule' | 'loanCollateral' | 'loanFiles' | 'coBorrower' | 'loanComments';

interface CustomerLoanProps {
  borrower: Borrower | null;
  collaterals?: Collateral[];
  activeLoan?: Loan | null;
  repayments?: any[];
}

/**
 * Customer Loan Dashboard
 * Displays borrower information and active loan details with tabbed interface
 */
export default function CustomerLoan({
  borrower,
  collaterals = [],
  activeLoan = null,
  repayments = [],
}: CustomerLoanProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('repayments');

  // Normalize borrower data
  const normalizedBorrower = useMemo(
    () => ({
      ...borrower,
      loans: toArray((borrower as any)?.loans),
      files: toArray((borrower as any)?.files),
      coBorrowers: toArray(borrower?.coBorrowers || []),
      comments: toArray((borrower as any)?.comments),
      amortizationSchedule: toArray((borrower as any)?.amortizationSchedule),
    }),
    [borrower],
  );

  // Normalize data arrays
  const safeCollaterals = useMemo(() => toArray<Collateral>(collaterals), [collaterals]);
  const safeRepayments = useMemo(() => toArray(repayments), [repayments]);

  // Determine active loan with fallback
  const safeLoan: Loan = useMemo(
    () => activeLoan ?? normalizedBorrower.loans[0] ?? (DEFAULT_LOAN as Loan),
    [activeLoan, normalizedBorrower.loans],
  );

  // Prepare breadcrumbs
  const breadcrumbs: BreadcrumbItem[] = borrower
    ? [
        { title: 'Borrowers', href: '/borrowers' },
        { title: `${borrower.first_name} ${borrower.last_name}`, href: `/borrowers/${borrower.id || borrower.ID}` },
      ]
    : [];

  const amortizationSchedule = normalizedBorrower.amortizationSchedule;

  // Tab configuration
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
        key: 'coBorrower' as TabKey,
        label: 'Co-Borrower',
        content: <CoBorrowerTab borrower={normalizedBorrower} />,
      },
      {
        key: 'loanComments' as TabKey,
        label: 'Loan Comments',
        content: <LoanCommentsTab comments={toArray((borrower as any)?.comments ?? [])} />,
      },
    ],
    [safeRepayments, safeLoan, amortizationSchedule, safeCollaterals, normalizedBorrower],
  );

  const currentTab = tabItems.find((tab) => tab.key === activeTab);

  return (
    <AppLayout>
      <Head title={`Loan - ${borrower ? `${borrower.first_name} ${borrower.last_name}` : 'Customer'}`} />

      {/* Borrower Header */}
      <BorrowerHeader borrower={borrower} />

      {borrower && (
        <>
          {/* Active Loan Table */}
          <ActiveLoanTable loan={safeLoan} />

          {/* Tabs Section */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            {/* Tab Navigation */}
            <div className="flex gap-0 overflow-x-auto border-b border-gray-200">
              {tabItems.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-3 font-medium whitespace-nowrap transition-colors duration-150 border-b-2 ${
                    activeTab === tab.key
                      ? 'bg-white text-amber-600 border-amber-600'
                      : 'bg-white text-gray-600 border-transparent hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">{currentTab?.content}</div>
          </div>
        </>
      )}
    </AppLayout>
  );
}
