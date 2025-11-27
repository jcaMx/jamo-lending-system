// resources/js/types/loans.ts
import type { PageProps } from '@inertiajs/core';

// Add `co_borrowers` to Borrower so TypeScript knows about it
export interface Borrower {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  contact_no?: string;
  address?: string;
  city?: string;
  co_borrowers?: CoBorrower[]; // <-- add this
}

export interface Spouse {
  id: number;
  full_name: string;
  mobile_number?: string;
  agency_address?: string;
  occupation?: string;
}

export interface Collateral {
  id: number;
  type: string;
  description?: string;
  estimated_value?: number;
  appraisal_date?: string;
  appraised_by?: string;
  ownership_proof?: string;
}

export interface CoBorrower {
  id: number;
  first_name: string;
  last_name: string;
  birth_date?: string;
  age?: number;
  marital_status?: string;
  address?: string;
  contact_no?: string;
  occupation?: string;
  position?: string;
  agency_address?: string;
  home_ownership?: string;
}

export interface Loan {
  id: number;
  principal_amount: number;
  interest_rate: number;
  interest_type: string;
  loan_type: string;
  term_months: number;
  repayment_frequency: string;
  start_date: string;
  end_date: string;
  status: string;
  balance_remaining: number;
  borrower: Borrower;
  spouse?: Spouse;
  collateral?: Collateral;
  co_borrowers?: CoBorrower[]; // optional, because not all loans have them
}

// Keep only one definition of LoanApplicationsPageProps
export interface LoanApplicationsPageProps extends PageProps {
  loanApplications: Loan[];
  flash?: { success?: string };
}
