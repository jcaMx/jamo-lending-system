import type { Loan } from '@/types/loan';

/**
 * Default loan object for when no active loan exists
 */
export const DEFAULT_LOAN: Loan = {
  principal_amount: 0,
  interest_rate: 0,
  interest_type: '',
  loan_type: '',
  term_months: 0,
  repayment_frequency: '',
  status: 'Pending',
  balance_remaining: 0,
  borrower: { first_name: '', last_name: '' },
};

/**
 * Converts value to array safely
 */
export const toArray = <T,>(value: T[] | Record<string, T> | null | undefined): T[] => {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, T>);
  }

  return [];
};

/**
 * Checks if loan is active
 */
export const isActiveLoan = (loan: Loan | null | undefined): boolean => {
  return loan?.status === 'Active';
};

/**
 * Formats currency value
 */
export const formatCurrency = (value: number): string => {
  return `₱${value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Formats date to YYYY-MM-DD or returns dash if invalid
 */
export const formatDate = (date: string | null | undefined): string => {
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return '-';
  }
};

/**
 * Gets status badge color
 */
export const getStatusColor = (
  status: string,
): 'bg-green-100 text-green-800' | 'bg-yellow-100 text-yellow-800' | 'bg-red-100 text-red-800' | 'bg-gray-100 text-gray-800' => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Rejected':
    case 'Bad_Debt':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
