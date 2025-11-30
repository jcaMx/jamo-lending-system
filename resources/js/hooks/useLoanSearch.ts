import { useState, useMemo } from 'react';

interface Loan {
  borrower: {
    first_name: string;
    last_name: string;
  };
  [key: string]: any;
}

export function useLoanSearch<T extends Loan>(loans: T[]) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLoans = useMemo(() => {
    if (!searchTerm.trim()) {
      return loans;
    }

    const lowerSearch = searchTerm.toLowerCase();
    return loans.filter((loan) => {
      const borrowerName = `${loan.borrower.first_name} ${loan.borrower.last_name}`.toLowerCase();
      return borrowerName.includes(lowerSearch);
    });
  }, [loans, searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    filteredLoans,
  };
}

