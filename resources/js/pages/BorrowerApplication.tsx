import { useCallback, useEffect, useMemo, useState } from "react";
import CoBorrowerInfo from "./borrower-application/CoBorrowerInfo";
import Collateral from "./borrower-application/Collateral";
import LoanDetails from "./borrower-application/LoanDetails";
import Confirmation from "./borrower-application/Confirmation";
import type { SharedFormData } from "./borrower-application/sharedFormData";
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
  borrowerRuleContext?: {
    monthly_income?: number | null;
    dti_ratio?: number | null;
  };
}

type StepKey = "borrower" | "loan" | "coborrower" | "collateral" | "confirmation";

interface StepConfig {
  key: StepKey;
  label: string;
  render: () => JSX.Element;
}

const toNumber = (value: unknown): number => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const BorrowerApplication = ({
  application,
  documentTypesByCategory = {},
  borrowerRuleContext,
}: BorrowerApplicationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [ruleRequirements, setRuleRequirements] = useState<{ collateral: boolean; coborrower: boolean }>({
    collateral: false,
    coborrower: false,
  });

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
    monthly_income:
      borrowerRuleContext?.monthly_income !== null && borrowerRuleContext?.monthly_income !== undefined
        ? String(borrowerRuleContext.monthly_income)
        : "",
    dti_ratio:
      borrowerRuleContext?.dti_ratio !== null && borrowerRuleContext?.dti_ratio !== undefined
        ? String(borrowerRuleContext.dti_ratio)
        : "",
    payment_method: "",
  });

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => prev + 1);
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const loanAmountValue = useMemo(() => toNumber(formData.loan_amount), [formData.loan_amount]);
  const termValue = useMemo(() => toNumber(formData.term), [formData.term]);
  const monthlyIncomeValue = useMemo(() => toNumber(formData.monthly_income), [formData.monthly_income]);
  const providedDtiRatio = useMemo(() => toNumber(formData.dti_ratio), [formData.dti_ratio]);
  const computedDtiRatio = useMemo(() => {
    if (monthlyIncomeValue <= 0 || termValue <= 0) {
      return 0;
    }

    const monthlyObligation = loanAmountValue / termValue;
    return (monthlyObligation / monthlyIncomeValue) * 100;
  }, [loanAmountValue, monthlyIncomeValue, termValue]);
  const dtiRatioValue = useMemo(
    () => (providedDtiRatio > 0 ? providedDtiRatio : computedDtiRatio),
    [computedDtiRatio, providedDtiRatio],
  );

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      dti_ratio: Number(dtiRatioValue.toFixed(2)),
    }));
  }, [dtiRatioValue, setFormData]);

  useEffect(() => {
    const loanProductId = Number(formData.loan_product_id ?? 0);
    const loanType = String(formData.loan_type ?? "").trim();
    const hasRuleInput = loanProductId > 0 || loanType !== "";

    if (!hasRuleInput) {
      setRuleRequirements({ collateral: false, coborrower: false });
      return;
    }

    const controller = new AbortController();
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ?? "";

    const run = async () => {
      try {
        const response = await fetch("/api/evaluate-loan-rules", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            ...(csrfToken ? { "X-CSRF-TOKEN": csrfToken } : {}),
          },
          body: JSON.stringify({
            loan_product_id: loanProductId > 0 ? loanProductId : null,
            loan_type: loanType || null,
            loan_amount: loanAmountValue,
            term: termValue,
            monthly_income: monthlyIncomeValue,
            dti_ratio: dtiRatioValue,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Rule evaluation failed (${response.status})`);
        }

        const payload = (await response.json()) as Partial<{ collateral: boolean; coborrower: boolean }>;
        setRuleRequirements({
          collateral: !!payload.collateral,
          coborrower: !!payload.coborrower,
        });
      } catch (error) {
        if ((error as { name?: string })?.name === "AbortError") {
          return;
        }
        setRuleRequirements({ collateral: false, coborrower: false });
      }
    };

    const timeoutId = window.setTimeout(() => {
      void run();
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [
    formData.loan_product_id,
    formData.loan_type,
    loanAmountValue,
    termValue,
    monthlyIncomeValue,
    dtiRatioValue,
  ]);

  const needsCollateral = ruleRequirements.collateral;
  const needsCoBorrower = ruleRequirements.coborrower;

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
