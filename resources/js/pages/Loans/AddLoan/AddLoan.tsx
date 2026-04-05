import { useCallback, useEffect, useMemo, useState } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import BorrowerStep from "./BorrowerStep";
import CoBorrowerInfo from "@/pages/borrower-application/CoBorrowerInfo";
import Collateral from "@/pages/borrower-application/Collateral";
import LoanDetails from "@/pages/borrower-application/LoanDetails";
import type { SharedFormData } from "@/pages/borrower-application/sharedFormData";
import type { BorrowerDocumentTypeOption } from "@/pages/borrowers/components/RenderDocumentUploader";
import type { BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import { store } from "@/actions/App/Http/Controllers/LoanController";
import { route } from 'ziggy-js';

// AYAW TAROGI ni nga file  

interface Borrower {
  id: number;
  name: string;
  has_active_or_pending_loan?: boolean;
  has_active_loan?: boolean;
  loan_status?: string;
}

interface AddLoanProps {
  borrowers?: Borrower[];
  documentTypesByCategory?: Record<string, BorrowerDocumentTypeOption[]>;
}

type StepKey = "borrower" | "loan" | "collateral" | "coborrower" | "review";

interface StepConfig {
  key: StepKey;
  label: string;
  stepIndex: number;
  render: () => JSX.Element;
}

interface ReviewStepProps {
  formData: SharedFormData;
  onPrev: () => void;
  onSubmit: () => void;
  processing: boolean;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Loans", href: "/Loans" },
  { title: "Add Loan", href: "/Loans/AddLoan" },
];

const toNumber = (value: unknown): number => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeInterestType = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (normalized === "compound") return "Compound";
  if (normalized === "diminishing") return "Diminishing";
  return value.trim();
};

const normalizeRepaymentFrequency = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (normalized === "weekly") return "Weekly";
  if (normalized === "monthly") return "Monthly";
  if (normalized === "yearly") return "Yearly";
  return value.trim();
};
const getCsrfToken = () =>
  document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ?? "";

const ReviewStep = ({ formData, onPrev, onSubmit, processing }: ReviewStepProps) => {
  const coBorrowers = Array.isArray(formData.coBorrowers) ? formData.coBorrowers : [];

  return (
    <section className="py-8 md:py-16 px-6 md:px-12 bg-[#F7F5F3]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Review</h1>
          
          <p className="text-sm text-gray-600">Please confirm the details before submitting.</p>
        </div>

        <div className="bg-white rounded-lg p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">Borrower</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
              <div>
                <span className="font-medium">Name:</span> {formData.borrower_name || "-"}
              </div>
              <div>
                <span className="font-medium">Borrower ID:</span> {formData.borrower_id || "-"}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">Loan Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
              <div>
                <span className="font-medium">Loan Type:</span> {formData.loan_type || "-"}
              </div>
              <div>
                <span className="font-medium">Loan Amount:</span> {formData.loan_amount || "-"}
              </div>
              <div>
                <span className="font-medium">Interest Type:</span> {formData.interest_type || "-"}
              </div>
              <div>
                <span className="font-medium">Interest Rate:</span>{" "}
                {formData.interest_rate !== undefined && formData.interest_rate !== null
                  ? `${formData.interest_rate}%`
                  : "-"}
              </div>
              <div>
                <span className="font-medium">Repayment:</span> {formData.repayment_frequency || "-"}
              </div>
              <div>
                <span className="font-medium">Term:</span> {formData.term || "-"}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">Collateral</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
              <div>
                <span className="font-medium">Type:</span> {formData.collateral_type || "-"}
              </div>
              {formData.collateral_type === "vehicle" && (
                <>
                  <div>
                    <span className="font-medium">Make:</span> {formData.make || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Vehicle Type:</span> {formData.vehicle_type || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Transmission:</span> {formData.transmission_type || "-"}
                  </div>
                </>
              )}
              {formData.collateral_type === "land" && (
                <>
                  <div>
                    <span className="font-medium">Title No:</span> {formData.certificate_of_title_no || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {formData.location || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Area:</span> {formData.area || "-"}
                  </div>
                </>
              )}
              {formData.collateral_type === "atm" && (
                <>
                  <div>
                    <span className="font-medium">Bank:</span> {formData.bank_name || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Account No:</span> {formData.account_no || "-"}
                  </div>
                  <div>
                    <span className="font-medium">Card Last 4:</span> {formData.cardno_4digits || "-"}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-700">Co-Borrowers</h2>
            {coBorrowers.length === 0 ? (
              <p className="text-sm text-gray-600">No co-borrowers provided.</p>
            ) : (
              <div className="space-y-3 text-sm text-gray-700">
                {coBorrowers.map((co, index) => (
                  <div key={`${co.first_name}-${co.last_name}-${index}`} className="rounded border p-3">
                    <div className="font-medium">Co-Borrower {index + 1}</div>
                    <div>
                      <span className="font-medium">Name:</span> {co.first_name} {co.last_name}
                    </div>
                    <div>
                      <span className="font-medium">Mobile:</span> {co.mobile || "-"}
                    </div>
                    <div>
                      <span className="font-medium">Address:</span> {co.address || "-"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onPrev}>
              Previous
            </Button>
            <Button type="button" className="bg-golden text-black" onClick={onSubmit} disabled={processing}>
              {processing ? "Submitting..." : "Submit Loan"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function AddLoan({ borrowers = [], documentTypesByCategory = {} }: AddLoanProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [ruleRequirements, setRuleRequirements] = useState({
    collateral: false,
    coborrower: false,
  });
  const [isEvaluatingRules, setIsEvaluatingRules] = useState(false);

  const [formData, setFormData] = useState<SharedFormData>({
    borrower_id: "",
    borrower_name: "",
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
      collateral: [],
    },
    loan_product_id: null,
    loan_product_rule: null,
    loan_type: "",
    loan_amount: "",
    interest_type: "",
    interest_rate: 5,
    repayment_frequency: "",
    term: "",
    monthly_income: "",
    dti_ratio: "",
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
    if (!Number.isFinite(dtiRatioValue)) return;
    setFormData((prev) => ({
      ...prev,
      dti_ratio: Number(dtiRatioValue.toFixed(2)),
    }));
  }, [dtiRatioValue, setFormData]);

  useEffect(() => {
    const hasProduct =
      Boolean(formData.loan_product_id) || Boolean(String(formData.loan_type ?? "").trim());

    if (!hasProduct) {
      setRuleRequirements({ collateral: false, coborrower: false });
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setIsEvaluatingRules(true);

      try {
        const response = await fetch("/api/staff/evaluate-loan-rules", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": getCsrfToken(),
          },
          signal: controller.signal,
          body: JSON.stringify({
            borrower_id: formData.borrower_id || null,
            loan_product_id: formData.loan_product_id,
            loan_type: formData.loan_type,
            loan_amount: loanAmountValue,
            term: termValue,
            monthly_income: monthlyIncomeValue,
            dti_ratio: dtiRatioValue,
          }),
        });

        if (!response.ok) {
          setIsEvaluatingRules(false);
          return;
        }

        const payload = (await response.json()) as {
          collateral?: boolean;
          coborrower?: boolean;
        };

        setRuleRequirements({
          collateral: Boolean(payload?.collateral),
          coborrower: Boolean(payload?.coborrower),
        });
      } catch {
        // Keep previous requirements if request fails.
      } finally {
        setIsEvaluatingRules(false);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [
    formData.borrower_id,
    formData.loan_product_id,
    formData.loan_type,
    loanAmountValue,
    termValue,
    monthlyIncomeValue,
    dtiRatioValue,
  ]);

  const hasCollateralPayload = useMemo(() => {
    const hasDocs = Boolean(formData.documents?.collateral?.length);
    return Boolean(formData.collateral_type || formData.ownership_proof || hasDocs);
  }, [formData.collateral_type, formData.documents, formData.ownership_proof]);

  const hasCoBorrowerPayload = useMemo(() => {
    if (!Array.isArray(formData.coBorrowers)) return false;
    return formData.coBorrowers.some((co) =>
      Object.values(co ?? {}).some((value) => String(value ?? "").trim() !== ""),
    );
  }, [formData.coBorrowers]);

  const showCollateralStep = ruleRequirements.collateral || hasCollateralPayload;
  const showCoBorrowerStep = ruleRequirements.coborrower || hasCoBorrowerPayload;

  const stepLabels = useMemo(() => {
    const labels = ["Borrower", "Loan Details"];
    if (showCollateralStep) labels.push("Collateral");
    if (showCoBorrowerStep) labels.push("Co-Borrowers");
    labels.push("Review");
    return labels;
  }, [showCollateralStep, showCoBorrowerStep]);

  const steps = useMemo<StepConfig[]>(() => {
    let index = 1;
    const items: StepConfig[] = [];

    const borrowerStepIndex = index++;
    items.push({
      key: "borrower",
      label: "Borrower",
      stepIndex: borrowerStepIndex,
      render: () => (
        <BorrowerStep
          borrowers={borrowers}
          formData={formData}
          setFormData={setFormData}
          onNext={nextStep}
          stepLabels={stepLabels}
          stepIndex={borrowerStepIndex}
        />
      ),
    });

    const loanStepIndex = index++;
    items.push({
      key: "loan",
      label: "Loan Details",
      stepIndex: loanStepIndex,
      render: () => (
        <LoanDetails
          onNext={nextStep}
          onPrev={prevStep}
          formData={formData}
          setFormData={setFormData}
          stepLabels={stepLabels}
          stepIndex={loanStepIndex}
        />
      ),
    });

    if (showCollateralStep) {
      const collateralStepIndex = index++;
      items.push({
        key: "collateral",
        label: "Collateral",
        stepIndex: collateralStepIndex,
        render: () => (
          <Collateral
            onNext={nextStep}
            onPrev={prevStep}
            formData={formData}
            setFormData={setFormData}
            documentTypesByCategory={documentTypesByCategory}
            stepLabels={stepLabels}
            stepIndex={collateralStepIndex}
            required={ruleRequirements.collateral}
          />
        ),
      });
    }

    if (showCoBorrowerStep) {
      const coBorrowerStepIndex = index++;
      items.push({
        key: "coborrower",
        label: "Co-Borrowers",
        stepIndex: coBorrowerStepIndex,
        render: () => (
          <CoBorrowerInfo
            onNext={nextStep}
            onPrev={prevStep}
            formData={formData}
            setFormData={setFormData}
            stepLabels={stepLabels}
            stepIndex={coBorrowerStepIndex}
            required={ruleRequirements.coborrower}
          />
        ),
      });
    }

    const reviewStepIndex = index++;
    items.push({
      key: "review",
      label: "Review",
      stepIndex: reviewStepIndex,
      render: () => (
        <ReviewStep
          formData={formData}
          onPrev={prevStep}
          processing={processing}
          onSubmit={() => {
            if (processing) return;
            setProcessing(true);

            const payload = new FormData();
            const appendIfPresent = (key: string, value: unknown) => {
              if (value === undefined || value === null || value === "") return;
              payload.append(key, String(value));
            };

            appendIfPresent("borrower_id", formData.borrower_id);
            appendIfPresent("borrower_name", formData.borrower_name);
            appendIfPresent("loan_product_id", formData.loan_product_id);
            appendIfPresent("loan_type", formData.loan_type);
            appendIfPresent("loan_amount", loanAmountValue);
            appendIfPresent("interest_type", normalizeInterestType(String(formData.interest_type ?? "")));
            appendIfPresent("interest_rate", toNumber(formData.interest_rate));
            appendIfPresent(
              "repayment_frequency",
              normalizeRepaymentFrequency(String(formData.repayment_frequency ?? "")),
            );
            appendIfPresent("term", termValue);
            appendIfPresent("monthly_income", formData.monthly_income);
            appendIfPresent("dti_ratio", dtiRatioValue);

            appendIfPresent("collateral_type", formData.collateral_type);
            appendIfPresent("make", formData.make);
            appendIfPresent("vehicle_type", formData.vehicle_type);
            appendIfPresent("transmission_type", formData.transmission_type);
            appendIfPresent("plate_no", formData.plate_no);
            appendIfPresent("engine_no", formData.engine_no);
            appendIfPresent("year_model", formData.year_model);
            appendIfPresent("series", formData.series);
            appendIfPresent("fuel", formData.fuel);
            appendIfPresent("certificate_of_title_no", formData.certificate_of_title_no);
            appendIfPresent("location", formData.location);
            appendIfPresent("description", formData.description);
            appendIfPresent("area", formData.area);
            appendIfPresent("bank_name", formData.bank_name);
            appendIfPresent("account_no", formData.account_no);
            appendIfPresent("cardno_4digits", formData.cardno_4digits);

            if (formData.ownership_proof) {
              payload.append("ownership_proof", formData.ownership_proof);
            }

            if (formData.documents?.collateral?.length) {
              formData.documents.collateral.forEach((row, index) => {
                if (row.document_type_id) {
                  payload.append(
                    `documents[collateral][${index}][document_type_id]`,
                    String(row.document_type_id),
                  );
                }
                if (row.file) {
                  payload.append(`documents[collateral][${index}][file]`, row.file);
                }
              });
            }

            if (formData.coBorrowers?.length) {
              formData.coBorrowers.forEach((co, index) => {
                const payloadCo = {
                  first_name: co.first_name,
                  last_name: co.last_name,
                  address: co.address,
                  email: (co as any).email ?? "",
                  contact: (co as any).contact ?? co.mobile ?? "",
                  birth_date: co.birth_date,
                  marital_status: co.marital_status,
                  occupation: co.occupation,
                  net_pay: (co as any).net_pay ?? "",
                };

                Object.entries(payloadCo).forEach(([key, value]) => {
                  if (value === undefined || value === null || value === "") return;
                  payload.append(`coBorrowers[${index}][${key}]`, String(value));
                });
              });
            }

            router.post(store.url(), payload, {
              forceFormData: true,
              preserveScroll: true,
              onFinish: () => setProcessing(false),
              onError: () => setProcessing(false),
              onSuccess: (page) => {
                const loanId = toNumber((page as any).props?.loanId);
                if (!loanId) {
                  return;
                }

                router.visit(route("loans.show", loanId));
              },

            });
          }}
        />
      ),
    });

    return items;
  }, [
    borrowers,
    documentTypesByCategory,
    formData,
    nextStep,
    prevStep,
    processing,
    loanAmountValue,
    termValue,
    dtiRatioValue,
    ruleRequirements.collateral,
    ruleRequirements.coborrower,
    showCollateralStep,
    showCoBorrowerStep,
    stepLabels,
  ]);

  useEffect(() => {
    setCurrentStep((prev) => Math.min(prev, steps.length - 1));
  }, [steps.length]);

  const activeStep = steps[currentStep];

  return (
    <div className="bg-[#F7F5F3] min-h-screen">
      <AppLayout breadcrumbs={breadcrumbs}>
        
        <Head title="Add Loan Application" />
        {isEvaluatingRules && (
          <div className="max-w-4xl mx-auto px-6 pt-4 text-xs text-gray-500">
            Checking loan product rules...
          </div>
        )}
        <div className="bg-[#F7F5F3]">{activeStep?.render()}</div>
      </AppLayout>

    </div>

  );
}
