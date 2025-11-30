// resources/js/types/loans.ts
import type { PageProps } from '@inertiajs/core';

// Add `co_borrowers` to Borrower so TypeScript knows about it
export interface Borrower {
  id?: number;
  ID?: number;
  first_name: string;
  last_name: string;
  email?: string;
  contact_no?: string;
  address?: string;
  city?: string;
  co_borrowers?: CoBorrower[];
  coBorrowers?: CoBorrower[];
  spouse?: Spouse;
  borrowerEmployment?: BorrowerEmployment;
  borrowerAddress?: BorrowerAddress;
}

export interface BorrowerEmployment {
  employer_name?: string;
  position?: string;
  monthly_income?: number;
}

export interface BorrowerAddress {
  address?: string;
  city?: string;
  province?: string;
}

export interface Spouse {
  id?: number;
  ID?: number;
  full_name?: string;
  mobile_number?: string;
  agency_address?: string;
  occupation?: string;
}

export interface Collateral {
  id?: number;
  ID?: number;
  type: string;
  description?: string;
  estimated_value?: number;
  appraisal_date?: string;
  appraised_by?: string;
  ownership_proof?: string;
  landDetails?: LandCollateralDetails;
  vehicleDetails?: VehicleCollateralDetails;
  atmDetails?: AtmCollateralDetails;
}

export interface LandCollateralDetails {
  titleNo?: string;
  lotNo?: number;
  location?: string;
  areaSize?: string;
}

export interface VehicleCollateralDetails {
  type?: string;
  brand?: string;
  model?: string;
  year_model?: number;
  plate_no?: string;
  engine_no?: string;
  transmission_type?: string;
  fuel_type?: string;
}

export interface AtmCollateralDetails {
  bank_name?: string;
  account_no?: string;
  cardno_4digits?: number;
}

export interface CoBorrower {
  id?: number;
  ID?: number;
  first_name: string;
  last_name: string;
  birth_date?: string;
  age?: number;
  marital_status?: string;
  address?: string;
  contact_no?: string;
  email?: string;
  occupation?: string;
  position?: string;
  agency_address?: string;
  home_ownership?: string;
}

export interface AmortizationSchedule {
  id?: number;
  ID?: number;
  installment_no: number;
  installment_amount: number;
  interest_amount: number;
  due_date: string;
  amount_paid: number;
  penalty_amount: number;
  status: string;
}

export interface Loan {
  id?: number;
  ID?: number;
  principal_amount: number;
  interest_rate: number;
  interest_type: string;
  loan_type: string;
  term_months: number;
  repayment_frequency: string;
  start_date?: string;
  end_date?: string;
  status: string;
  balance_remaining: number;
  borrower: Borrower;
  collateral?: Collateral;
  co_borrowers?: CoBorrower[];
  amortizationSchedules?: AmortizationSchedule[];
}

// Keep only one definition of LoanApplicationsPageProps
export interface LoanApplicationsPageProps extends PageProps {
  loanApplications: Loan[];
  flash?: { success?: string; error?: string };
}

export interface LoansPageProps extends PageProps {
  loans: Loan[];
  flash?: { success?: string; error?: string };
}

export interface LoanDetailsPageProps extends PageProps {
  loan: Loan;
  flash?: { success?: string; error?: string };
}
