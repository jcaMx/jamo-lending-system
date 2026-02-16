import { useCallback, useEffect, useMemo, useState } from "react";
import BorrowerInfo from "./borrower-application/BorrowerInfo";
import CoBorrowerInfo from "./borrower-application/CoBorrowerInfo";
import Collateral from "./borrower-application/Collateral";
import LoanDetails from "./borrower-application/LoanDetails";
import Confirmation from "./borrower-application/Confirmation";
import type { LoanProductRule, SharedFormData } from "./borrower-application/sharedFormData";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import type { BorrowerDocumentTypeOption } from "./borrowers/components/RenderDocumentUploader";

interface BorrowerApplicationProps {
  application?: {
    id: number;
    created_at: string;
    borrower?: { first_name: string; last_name: string };
    co_borrower?: { full_name: string };
    loan?: { loan_amount: number; term: number };
    collateral?: { collateral_type: string };
    payment_method?: string;
  };
  documentTypesByCategory?: Record<string, BorrowerDocumentTypeOption[]>;
}

type StepKey = "borrower" | "loan" | "coborrower" | "collateral" | "confirmation";

interface StepConfig {
  key: StepKey;
  label: string;
  render: () => JSX.Element;
}

const FALLBACK_RULES_BY_LOAN_TYPE: Record<string, LoanProductRule> = {
  personal: {
    requires_collateral: false,
    requires_coborrower: true,
    collateral_required_above: null,
  },
  home: {
    requires_collateral: true,
    requires_coborrower: true,
    collateral_required_above: null,
  },
  business: {
    requires_collateral: true,
    requires_coborrower: true,
    collateral_required_above: null,
  },
};

const toLoanTypeKey = (loanType: string | undefined) =>
  (loanType ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+loan$/i, "")
    .replace(/[\s-]+/g, "_");

const normalizeRule = (value: unknown): LoanProductRule | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const row = value as Record<string, unknown>;
  const threshold = row.collateral_required_above;

  return {
    requires_collateral:
      row.requires_collateral === true || row.requires_collateral === 1 || row.requires_collateral === "1",
    requires_coborrower:
      row.requires_coborrower === true || row.requires_coborrower === 1 || row.requires_coborrower === "1",
    collateral_required_above:
      threshold === null || threshold === undefined || threshold === ""
        ? null
        : Number.isFinite(Number(threshold))
        ? Number(threshold)
        : null,
  };
};

const BorrowerApplication = ({ application, documentTypesByCategory = {} }: BorrowerApplicationProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState<SharedFormData>({
    coBorrowers: [],
    collateral_type: "",
    make: "",
    vehicle_type: "",
    transmission_type: "",
    plate_no: "",
    engine_no: "",
    year_model: "",
    series: "",
    fuel: "",
    certificate_of_title_no: "",
    location: "",
    description: "",
    area: "",
    bank_name: "",
    account_no: "",
    cardno_4digits: "",
    estimated_value: "",
    appraisal_date: "",
    appraised_by: "",
    ownership_proof: null,
    documents: {
      collateral: [{ document_type_id: "", file: null }],
    },
    loan_product_id: null,
    loan_product_rule: null,
    loan_type: "",
    loan_amount: "",
    interest_type: "",
    interest_rate: "",
    repayment_frequency: "",
    term: "",
    payment_method: "",
  });

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const selectedLoanRule = useMemo(() => {
    const ruleFromSelectedProduct = normalizeRule(formData.loan_product_rule);

    if (ruleFromSelectedProduct) {
      return ruleFromSelectedProduct;
    }

    const fallbackKey = toLoanTypeKey(formData.loan_type);
    return FALLBACK_RULES_BY_LOAN_TYPE[fallbackKey] ?? null;
  }, [formData.loan_product_rule, formData.loan_type]);

  const loanAmountValue = useMemo(() => {
    const parsed = Number(formData.loan_amount ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  }, [formData.loan_amount]);

  const needsCollateral = useMemo(() => {
    if (!selectedLoanRule?.requires_collateral) {
      return false;
    }

    if (selectedLoanRule.collateral_required_above === null) {
      return true;
    }

    return loanAmountValue > selectedLoanRule.collateral_required_above;
  }, [loanAmountValue, selectedLoanRule]);

  const needsCoBorrower = !!selectedLoanRule?.requires_coborrower;

  const steps = useMemo<StepConfig[]>(() => {
    const stepDefinitions: Array<StepConfig & { include: boolean }> = [
      {
        key: "loan",
        label: "Loan Details",
        include: true,
        render: () => (
          <LoanDetails
            onNext={nextStep}
            onPrev={prevStep}
            formData={formData}
            setFormData={setFormData}
          />
        ),
      },
      {
        key: "coborrower",
        label: "Co-borrower",
        include: needsCoBorrower,
        render: () => (
          <CoBorrowerInfo
            onNext={nextStep}
            onPrev={prevStep}
            formData={formData}
            setFormData={setFormData}
          />
        ),
      },
      {
        key: "collateral",
        label: "Collateral",
        include: needsCollateral,
        render: () => (
          <Collateral
            onNext={nextStep}
            onPrev={prevStep}
            formData={formData}
            setFormData={setFormData}
            documentTypesByCategory={documentTypesByCategory}
          />
        ),
      },
      {
        key: "confirmation",
        label: "Confirmation",
        include: true,
        render: () => (
          <Confirmation
            onPrev={prevStep}
            application={application}
            formData={formData}
            setFormData={setFormData}
          />
        ),
      },
    ];

    return stepDefinitions.filter((step) => step.include).map(({ include: _include, ...step }) => step);
  }, [application, formData, needsCoBorrower, needsCollateral, nextStep, prevStep]);

  useEffect(() => {
    setCurrentStep((prev) => Math.min(prev, steps.length - 1));
  }, [steps.length]);

  const activeStep = steps[currentStep];

  return (
    <DashboardLayout>
      <div className="min-h-screen">{activeStep?.render()}</div>
    </DashboardLayout>
  );
};

export default BorrowerApplication;
