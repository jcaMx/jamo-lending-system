import React from 'react';
import type { Loan } from '@/types/loan';
import { formatCurrency, formatDate, getStatusColor } from '@/utils/loanHelpers';

interface ActiveLoanTableProps {
  loan: Loan;
  showTitle?: boolean;
}

/**
 * Displays active loan details in a table format
 */
export default function ActiveLoanTable({ loan, showTitle = true }: ActiveLoanTableProps) {
  const isNoLoan = !loan.ID;

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow mb-6">
      {showTitle && <p className="m-4 text-lg font-semibold">Active Loan</p>}
      <table className="min-w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Loan No.</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Released</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Maturity</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Repayment Freq.</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Principal</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Interest</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Interest Type</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Penalty</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Amount</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Balance</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr className={isNoLoan ? 'bg-gray-50' : 'hover:bg-gray-50'}>
            <td className="px-4 py-3 text-sm text-gray-900">{loan.ID || '-'}</td>
            <td className="px-4 py-3 text-sm text-gray-900">{formatDate(loan.start_date)}</td>
            <td className="px-4 py-3 text-sm text-gray-900">{formatDate(loan.end_date)}</td>
            <td className="px-4 py-3 text-sm text-gray-900">{loan.repayment_frequency}</td>
            <td className="px-4 py-3 text-sm text-gray-900 font-medium">
              {typeof loan.principal_amount === 'number' ? formatCurrency(loan.principal_amount) : loan.principal_amount}
            </td>
            <td className="px-4 py-3 text-sm text-gray-900">{loan.interest_rate}%</td>
            <td className="px-4 py-3 text-sm text-gray-900">{loan.interest_type}</td>
            <td className="px-4 py-3 text-sm text-gray-900">₱0.00</td>
            <td className="px-4 py-3 text-sm text-gray-900 font-medium">₱0.00</td>
            <td className="px-4 py-3 text-sm text-gray-900 font-medium">
              {typeof loan.balance_remaining === 'number' ? formatCurrency(loan.balance_remaining) : loan.balance_remaining}
            </td>
            <td className="px-4 py-3 text-sm">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                {loan.status}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
