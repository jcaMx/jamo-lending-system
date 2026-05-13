import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';
import LoanScheduleTab from '@/pages/borrowers/components/Tabs/LoanScheduleTab';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Loans', href: '/Loans' },
  { title: 'View Loans', href: '/Loans/ViewLoans' },
  { title: 'Loan Schedule', href: '#' },
];

interface AmortizationSchedule {
  ID: number;
  installment_no: number;
  installment_amount: number;
  interest_amount: number;
  due_date: string;
  amount_paid: number;
  rebate_amount: number;
  penalty_amount: number;
  status: string;
}

interface LoanScheduleProps {
  loan: {
    ID: number;
    principal_amount: number;
    released_amount?: number;
    interest_rate: number;
    term_months: number;
    repayment_frequency: string;
    borrower: {
      ID: number;
      first_name: string;
      last_name: string;
    };
    amortizationSchedules?: AmortizationSchedule[];
  };
}

const formatCurrency = (value?: number | null) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

export default function LoanSchedule({ loan }: LoanScheduleProps) {
  const schedules = loan.amortizationSchedules || [];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Loan Amortization Schedule" />
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Loan Amortization Schedule</h1>
            <p className="mt-1 text-gray-600">
              Loan #{loan.ID} - {loan.borrower.first_name} {loan.borrower.last_name}
            </p>
          </div>
          <Button
            onClick={() => router.visit(route('loans.view-approved'))}
            className="bg-[#FABF24] text-black hover:bg-[#f8b80f]"
          >
            Back to Loans
          </Button>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Loan Summary</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-600">Principal Amount</p>
              <p className="font-medium">{formatCurrency(loan.principal_amount)}</p>
            </div>
            {loan.released_amount && (
              <div>
                <p className="text-sm text-gray-600">Released Amount</p>
                <p className="font-medium">{formatCurrency(loan.released_amount)}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Interest Rate</p>
              <p className="font-medium">{loan.interest_rate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Term</p>
              <p className="font-medium">{loan.term_months} months</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Repayment Frequency</p>
              <p className="font-medium">{loan.repayment_frequency}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Installments</p>
              <p className="font-medium">{schedules.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Amortization Schedule</h2>
          <LoanScheduleTab amortizationSchedule={schedules} loanAmount={loan.principal_amount} />
        </div>
      </div>
    </AppLayout>
  );
}
