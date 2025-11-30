import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { LoanStatusBadge } from './LoanStatusBadge';
import { router } from '@inertiajs/react';
import { route } from 'ziggy-js';

interface Loan {
  ID: number;
  principal_amount: number;
  interest_rate: number;
  interest_type?: string;
  loan_type?: string;
  term_months: number;
  repayment_frequency: string;
  status: string;
  balance_remaining: number;
  borrower: {
    ID: number;
    first_name: string;
    last_name: string;
  };
  collateral?: {
    type: string;
  };
}

interface LoanTableProps {
  loans: Loan[];
  columns: Array<{
    key: keyof Loan | 'borrower_name' | 'actions';
    label: string;
    render?: (loan: Loan) => React.ReactNode;
  }>;
  onView?: (loanId: number) => void;
  onApprove?: (loanId: number) => void;
  onReject?: (loanId: number) => void;
  emptyMessage?: string;
}

export function LoanTable({ loans, columns, onView, onApprove, onReject, emptyMessage = 'No loans found' }: LoanTableProps) {
  const getLoanValue = (loan: Loan, key: string) => {
    if (key === 'borrower_name') {
      return `${loan.borrower.first_name} ${loan.borrower.last_name}`;
    }
    if (key === 'actions') {
      return null; // Handled separately
    }
    return loan[key as keyof Loan];
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loans.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            loans.map((loan) => (
              <TableRow key={loan.ID}>
                {columns.map((column) => {
                  if (column.key === 'actions') {
                    return (
                      <TableCell key={column.key}>
                        <div className="flex gap-2">
                          {onView && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onView(loan.ID)}
                            >
                              View
                            </Button>
                          )}
                          {onApprove && loan.status === 'Pending' && (
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => onApprove(loan.ID)}
                            >
                              Approve
                            </Button>
                          )}
                          {onReject && loan.status === 'Pending' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onReject(loan.ID)}
                            >
                              Reject
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    );
                  }

                  if (column.key === 'status') {
                    return (
                      <TableCell key={column.key}>
                        <LoanStatusBadge status={loan.status} />
                      </TableCell>
                    );
                  }

                  if (column.render) {
                    return (
                      <TableCell key={column.key}>{column.render(loan)}</TableCell>
                    );
                  }

                  const value = getLoanValue(loan, column.key);
                  return (
                    <TableCell key={column.key}>
                      {typeof value === 'number' && column.key.includes('amount')
                        ? `₱${value.toLocaleString()}`
                        : String(value ?? 'N/A')}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

