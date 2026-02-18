export interface CoBorrower {
  first_name: string;
  last_name: string;
  birth_date: string;
  marital_status: string;
  mobile: string;
  dependents: string;
  address: string;
  occupation: string;
  position: string;
  employer_address: string;
}

export interface LoanProductRule {
  requires_collateral: boolean;
  requires_coborrower: boolean;
  collateral_required_above: number | null;
  dynamic_rules?: {
    rule_type: "collateral" | "coborrower";
    condition_key: string;
    operator: string;
    condition_value: number | null;
  }[];
}

export interface DocumentUploadItem {
  document_type_id: string;
  file: File | null;
}

export interface SharedFormData {
  // borrower_first_name?: string;
  // borrower_last_name?: string;
  // gender?: string;
  // date_of_birth?: string;
  // marital_status?: string;
  // contact_no?: string;
  // landline_number?: string;
  // dependent_child?: number | string;

  // spouse_first_name?: string;
  // spouse_last_name?: string;
  // spouse_agency_address?: string;
  // spouse_occupation?: string;
  // spouse_position?: string;
  // spouse_mobile_number?: string;

  // permanent_address?: string;
  // city?: string;
  // home_ownership?: string;

  // employment_status?: string;
  // occupation?: string;
  // position?: string;
  // monthly_income?: number | string;
  // income_source?: string;
  // agency_address?: string;

  // valid_id_type?: string;
  // valid_id_number?: string;
  // files?: FileList | null;

  coBorrowers?: CoBorrower[];

  collateral_type?: string;
  make?: string;
  vehicle_type?: string;
  transmission_type?: string;
  plate_no?: string;
  engine_no?: string;
  year_model?: string;
  series?: string;
  fuel?: string;

  certificate_of_title_no?: string;
  location?: string;
  description?: string;
  area?: string;

  bank_name?: string;
  account_no?: string;
  cardno_4digits?: string;

  estimated_value?: string;
  appraisal_date?: string;
  appraised_by?: string;
  ownership_proof?: File | null;
  documents?: {
    collateral: DocumentUploadItem[];
  };

  loan_product_id?: number | null;
  loan_product_rule?: LoanProductRule | null;
  loan_type?: string;
  loan_amount?: number | string;
  interest_type?: string;
  interest_rate?: number | string;
  repayment_frequency?: string;
  term?: number | string;
  monthly_income?: number | string;
  dti_ratio?: number | string;

  payment_method?: string;

  [key: string]: any;
}
