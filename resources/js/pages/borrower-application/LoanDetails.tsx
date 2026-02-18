import { useEffect, useMemo, useState } from "react";
import { useForm } from "@inertiajs/react";
import { FormField } from "@/components/FormField";
import type { LoanProductRule, SharedFormData } from "./sharedFormData";
import { CreditCard } from "lucide-react";
import StepIndicator from "./StepIndicator";
import { Label } from '@/components/ui/required-label';

interface LoanDetailsProps {
  onNext: () => void;
  onPrev: () => void;
  formData: SharedFormData;
  setFormData: React.Dispatch<React.SetStateAction<SharedFormData>>;
}

interface LoanProductItem {
  id: number;
  name: string;
  rules: LoanProductRule;
}

interface LoanProductsApiResponse {
  data?: unknown;
}

const normalizeLoanProduct = (value: unknown): LoanProductItem | null => {
  if (!value || typeof value !== "object") {
    return null;
  }

  const row = value as Record<string, unknown>;
  const id = Number(row.id);
  const name = String(row.name ?? "").trim();
  const rulesRaw = (row.rules ?? {}) as Record<string, unknown>;

  if (!Number.isFinite(id) || !name) {
    return null;
  }

  const collateralThreshold =
    rulesRaw.collateral_required_above === null ||
    rulesRaw.collateral_required_above === undefined ||
    rulesRaw.collateral_required_above === ""
      ? null
      : Number(rulesRaw.collateral_required_above);

  return {
    id,
    name,
    rules: {
      requires_collateral:
        rulesRaw.requires_collateral === true ||
        rulesRaw.requires_collateral === 1 ||
        rulesRaw.requires_collateral === "1",
      requires_coborrower:
        rulesRaw.requires_coborrower === true ||
        rulesRaw.requires_coborrower === 1 ||
        rulesRaw.requires_coborrower === "1",
      collateral_required_above:
        collateralThreshold === null || Number.isNaN(collateralThreshold)
          ? null
          : collateralThreshold,
      dynamic_rules: Array.isArray(rulesRaw.dynamic_rules)
        ? rulesRaw.dynamic_rules
            .map((raw) => {
              if (!raw || typeof raw !== "object") return null;
              const row = raw as Record<string, unknown>;
              const ruleType = String(row.rule_type ?? "");
              if (ruleType !== "collateral" && ruleType !== "coborrower") {
                return null;
              }
              return {
                rule_type: ruleType as "collateral" | "coborrower",
                condition_key: String(row.condition_key ?? ""),
                operator: String(row.operator ?? ""),
                condition_value:
                  row.condition_value === null || row.condition_value === undefined || row.condition_value === ""
                    ? null
                    : Number(row.condition_value),
              };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null)
        : [],
    },
  };
};

const LoanDetails = ({ onNext, onPrev, formData, setFormData }: LoanDetailsProps) => {
  const initial = formData ?? {};
  const { data, setData, errors } = useForm({
    loan_type: initial.loan_type ?? "",
    loan_amount: String(initial.loan_amount ?? ""),
    interest_type: initial.interest_type ?? "",
    interest_rate: 5,
    repayment_frequency: initial.repayment_frequency ?? "",
    term: String(initial.term ?? ""),
  });

  const [loanProducts, setLoanProducts] = useState<LoanProductItem[]>([]);
  const [isLoadingLoanProducts, setIsLoadingLoanProducts] = useState(false);
  const [loanProductsError, setLoanProductsError] = useState<string>("");

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, [data, setFormData]);

  useEffect(() => {
    const controller = new AbortController();

    const loadLoanProducts = async () => {
      setIsLoadingLoanProducts(true);
      setLoanProductsError("");

      try {
        const response = await fetch("/api/loan-products", {
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Unable to load loan products (${response.status})`);
        }

        const payload = (await response.json()) as LoanProductsApiResponse | unknown[];
        const source = Array.isArray(payload)
          ? payload
          : Array.isArray((payload as LoanProductsApiResponse).data)
          ? ((payload as LoanProductsApiResponse).data as unknown[])
          : [];

        const normalized = source
          .map(normalizeLoanProduct)
          .filter((item): item is LoanProductItem => item !== null);

        setLoanProducts(normalized);
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        setLoanProducts([]);
        setLoanProductsError(error instanceof Error ? error.message : "Unable to load loan products.");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingLoanProducts(false);
        }
      }
    };

    loadLoanProducts();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!data.loan_type || loanProducts.length === 0) {
      return;
    }

    const selectedProduct = loanProducts.find((product) => product.name === data.loan_type);

    setFormData((prev) => ({
      ...prev,
      loan_product_id: selectedProduct?.id ?? null,
      loan_product_rule: selectedProduct?.rules ?? null,
    }));
  }, [data.loan_type, loanProducts, setFormData]);

  const sanitize = {
    number: (v: string) => v.replace(/\D/g, ""),
    decimal: (v: string) => v.replace(/[^0-9.]/g, ""),
  };

  const loanTypeOptions = useMemo(
    () => loanProducts.map((product) => ({ value: product.name, label: product.name })),
    [loanProducts],
  );

  const interestTypeOptions = [
    { value: "compound", label: "Compound" },
    { value: "diminishing", label: "Diminishing" },
  ];

  const repaymentFrequencyOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  const handleLoanTypeChange = (loanType: string) => {
    setData("loan_type", loanType);

    const selectedProduct = loanProducts.find((product) => product.name === loanType);

    setFormData((prev) => ({
      ...prev,
      loan_type: loanType,
      loan_product_id: selectedProduct?.id ?? null,
      loan_product_rule: selectedProduct?.rules ?? null,
    }));
  };

  const handleSubmit = () => {
    onNext();
  };

  return (
    <section title="Loan Details" className="w-full h-full flex flex-col bg-[#F7F5F3]">
      <div className="w-full max-w-full px-4 bg-[#F7F5F3] p-10 rounded-lg space-y-6 ">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard className="w-6 h-6 text-golden" />
            <h1 className="text-2xl md:text-3xl font-bold">Loan Details</h1>
          </div>
        </div>

        <StepIndicator
          currentStep={1}
          steps={[
            "Loan Details",
            "Co-Borrower",
            "Collateral",
            "Payment",
          ]}
        />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="bg-white rounded-lg shadow-sm p-6 mx-40 md:p-8 space-y-6"
        >
          <FormField
          label="Loan Type"
          name="loan_type"
          type="select"
          value={data.loan_type}
          onChange={handleLoanTypeChange}
          required
          options={loanTypeOptions}
          error={errors.loan_type}
          disabled={isLoadingLoanProducts || loanTypeOptions.length === 0}
        />

        {loanProductsError && (
          <p className="text-sm text-red-600">{loanProductsError}</p>
        )}

        <FormField
          label="Loan Amount (PHP)"
          name="loan_amount"
          value={data.loan_amount}
          onChange={(v) => setData("loan_amount", sanitize.number(v))}
          required
          error={errors.loan_amount}
        />


        <FormField
          label="Interest Type"
          name="interest_type"
          type="select"
          value={data.interest_type}
          onChange={(v) => setData("interest_type", v)}
          required
          options={interestTypeOptions}
          error={errors.interest_type}
        />

        <FormField
          label="Interest Rate (%)"
          name="interest_rate"
          value={String(data.interest_rate)}
          onChange={(v) => setData("interest_rate", parseFloat(sanitize.decimal(v)) || 0)}
          required
          error={errors.interest_rate}
          disabled={true}
        />

        <FormField
          label="Repayment Frequency"
          name="repayment_frequency"
          type="select"
          value={data.repayment_frequency}
          onChange={(v) => setData("repayment_frequency", v)}
          required
          options={repaymentFrequencyOptions}
          error={errors.repayment_frequency}
        />

        <FormField
          label="Term (months)"
          name="term"
          value={data.term}
          onChange={(v) => setData("term", sanitize.number(v))}
          required
          error={errors.term}
        />  


        </form>
        

        <div className="flex justify-between mt-6">
          <button type="button" className="px-4 py-1 border border-gray-300 rounded-md hover:bg-gray-400" onClick={onPrev}>
            Back
          </button>
          <button type="button" className="px-4 py-1 bg-golden text-black rounded-md hover:bg-golden-dark" onClick={handleSubmit}>
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default LoanDetails;
