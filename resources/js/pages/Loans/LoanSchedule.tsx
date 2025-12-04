import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

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

export default function LoanSchedule({ loan }: LoanScheduleProps) {
  const schedules = loan.amortizationSchedules || [];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Loan Amortization Schedule" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-800">Loan Amortization Schedule</h1>
            <p className="text-gray-600 mt-1">
              Loan #{loan.ID} - {loan.borrower.first_name} {loan.borrower.last_name}
            </p>
          </div>
          <Button
            onClick={() => router.visit(route('loans.view-approved'))}
            className="bg-gray-600 text-white hover:bg-gray-700"
          >
            Back to Loans
          </Button>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Loan Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Principal Amount</p>
              <p className="font-medium">₱{loan.principal_amount.toLocaleString()}</p>
            </div>
            {loan.released_amount && (
              <div>
                <p className="text-sm text-gray-600">Released Amount</p>
                <p className="font-medium">₱{loan.released_amount.toLocaleString()}</p>
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

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Amortization Schedule</h2>
          {schedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No amortization schedule available for this loan.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>#</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Installment Amount</TableHead>
                    <TableHead className="text-right">Interest Amount</TableHead>
                    <TableHead className="text-right">Penalty Amount</TableHead>
                    <TableHead className="text-right">Amount Paid</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedules.map((schedule) => (
                    <TableRow key={schedule.ID}>
                      <TableCell>{schedule.installment_no}</TableCell>
                      <TableCell>
                        {schedule.due_date ? new Date(schedule.due_date).toLocaleDateString() : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        ₱{schedule.installment_amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ₱{schedule.interest_amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ₱{schedule.penalty_amount.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        ₱{schedule.amount_paid.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded text-xs ${
                          schedule.status === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : schedule.status === 'Overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {schedule.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

