import { useEffect, useMemo, useState } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { FormField } from "@/components/FormField";
import type { DocumentUploadItem, LoanProductRule, SharedFormData } from "./sharedFormData";
import { CreditCard } from "lucide-react";
import StepIndicator from "./StepIndicator";
import type { BorrowerDocumentTypeOption } from "@/pages/borrowers/components/RenderDocumentUploader";

interface LoanDetailsProps {
  onNext: () => void;
  onPrev: () => void;
  formData: SharedFormData;
  setFormData: React.Dispatch<React.SetStateAction<SharedFormData>>;
  documentTypesByCategory?: Record<string, BorrowerDocumentTypeOption[]>;
  fieldErrors?: Record<string, string>;
  submitError?: string;
  stepLabels?: string[];
  stepIndex?: number;
  ruleRequirements?: { collateral: boolean; coborrower: boolean };
}

interface LoanProductItem {
  id: number;
  name: string;
  rules: LoanProductRule;
}

interface LoanProductsApiResponse {
  data?: unknown;
}

const inputClass =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FABF24] focus:border-transparent";

const toTitleCase = (value: string) =>
  value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");

type LoanProductUploadRow = DocumentUploadItem & { document_category?: string | null };

type DisplayLoanProductRow = LoanProductUploadRow & {
  slot_key: string;
  source_index: number | null;
};

const areLoanProductRowsEqual = (
  left: LoanProductUploadRow[],
  right: LoanProductUploadRow[],
) =>
  left.length === right.length &&
  left.every((row, index) => {
    const other = right[index];
    return (
      String(row.document_type_id) === String(other.document_type_id) &&
      row.file === other.file &&
      String(row.document_category ?? "") === String(other.document_category ?? "")
    );
  });

const hasMeaningfulLoanProductRow = (row: LoanProductUploadRow) =>
  String(row.document_type_id ?? "").trim() !== "" || row.file !== null;

const buildLoanProductRow = (
  row: Partial<LoanProductUploadRow>,
  category: string,
): LoanProductUploadRow => ({
  document_type_id: String(row.document_type_id ?? ""),
  file: row.file ?? null,
  document_category: category,
});

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
            const ruleRow = raw as Record<string, unknown>;
            const ruleType = String(ruleRow.rule_type ?? "");
            if (ruleType !== "collateral" && ruleType !== "coborrower") {
              return null;
            }

            return {
              rule_type: ruleType as "collateral" | "coborrower",
              condition_key: String(ruleRow.condition_key ?? ""),
              operator: String(ruleRow.operator ?? ""),
              condition_value:
                ruleRow.condition_value === null ||
                  ruleRow.condition_value === undefined ||
                  ruleRow.condition_value === ""
                  ? null
                  : Number(ruleRow.condition_value),
            };
          })
          .filter((item): item is NonNullable<typeof item> => item !== null)
        : [],
    },
  };
};

const normalizeInterestRate = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return 5;
  }

  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 5;
};

const LoanDetails = ({
  onNext,
  onPrev,
  formData,
  setFormData,
  documentTypesByCategory = {},
  fieldErrors = {},
  submitError = "",
  stepLabels,
  stepIndex,
  ruleRequirements,
}: LoanDetailsProps) => {
  const { props } = usePage();
  const roles = ((props as { auth?: { roles?: string[] } })?.auth?.roles ?? []).map((role) =>
    String(role).toLowerCase(),
  );
  const canEditInterestRate = roles.includes("admin");

  const initial = formData ?? {};
  const { data, setData, errors } = useForm({
    loan_type: initial.loan_type ?? "",
    loan_amount: String(initial.loan_amount ?? ""),
    interest_type: initial.interest_type ?? "",
    interest_rate: normalizeInterestRate(initial.interest_rate),
    repayment_frequency: initial.repayment_frequency ?? "",
    term: String(initial.term ?? ""),
    documents: {
      loan_product: initial.documents?.loan_product?.length ? initial.documents.loan_product : [],
    },
  });

  const [loanProducts, setLoanProducts] = useState<LoanProductItem[]>([]);
  const [isLoadingLoanProducts, setIsLoadingLoanProducts] = useState(false);
  const [loanProductsError, setLoanProductsError] = useState("");
  const [stepError, setStepError] = useState("");

  useEffect(() => {
    if (!canEditInterestRate && !String(data.interest_rate ?? "").trim()) {
      setData("interest_rate", 5);
    }
  }, [canEditInterestRate, data.interest_rate, setData]);

  useEffect(() => {
    setFormData((prev) => {
      const nextLoanProductRows = data.documents.loan_product ?? [];
      const prevLoanProductRows = prev.documents?.loan_product ?? [];

      const hasSameFields =
        prev.loan_type === data.loan_type &&
        String(prev.loan_amount ?? "") === String(data.loan_amount ?? "") &&
        prev.interest_type === data.interest_type &&
        Number(prev.interest_rate ?? 0) === Number(data.interest_rate ?? 0) &&
        prev.repayment_frequency === data.repayment_frequency &&
        String(prev.term ?? "") === String(data.term ?? "") &&
        areLoanProductRowsEqual(prevLoanProductRows, nextLoanProductRows);

      if (hasSameFields) {
        return prev;
      }

      return {
        ...prev,
        loan_type: data.loan_type,
        loan_amount: data.loan_amount,
        interest_type: data.interest_type,
        interest_rate: data.interest_rate,
        repayment_frequency: data.repayment_frequency,
        term: data.term,
        documents: {
          ...(prev.documents ?? { collateral: [], loan_product: [] }),
          loan_product: nextLoanProductRows,
        },
      };
    });
  }, [
    data.documents.loan_product,
    data.interest_rate,
    data.interest_type,
    data.loan_amount,
    data.loan_type,
    data.repayment_frequency,
    data.term,
    setFormData,
  ]);

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

    void loadLoanProducts();

    return () => controller.abort();
  }, []);

  const selectedProduct = useMemo(
    () => loanProducts.find((product) => product.name === data.loan_type) ?? null,
    [data.loan_type, loanProducts],
  );

  useEffect(() => {
    setFormData((prev) => {
      const nextLoanProductId = selectedProduct?.id ?? null;
      const nextLoanProductRule = selectedProduct?.rules ?? null;

      if (
        prev.loan_product_id === nextLoanProductId &&
        prev.loan_product_rule === nextLoanProductRule
      ) {
        return prev;
      }

      return {
        ...prev,
        loan_product_id: nextLoanProductId,
        loan_product_rule: nextLoanProductRule,
      };
    });
  }, [selectedProduct, setFormData]);

  const sanitize = {
    number: (value: string) => value.replace(/\D/g, ""),
    decimal: (value: string) => value.replace(/[^0-9.]/g, ""),
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
  };

  const defaultStepLabels = ["Loan Details", "Co-Borrower", "Collateral", "Payment"];
  const indicatorLabels = stepLabels && stepLabels.length > 0 ? stepLabels : defaultStepLabels;
  const indicatorIndex = stepIndex ?? 1;
  const { collateral: needsCollateral, coborrower: needsCoBorrower } = ruleRequirements ?? {
    collateral: false,
    coborrower: false,
  };

  const isBusinessLoan = useMemo(
    () => String(data.loan_type ?? "").trim().toLowerCase() === "business loan",
    [data.loan_type],
  );

  const requiredLoanProductRequirements = useMemo(
    () =>
      !isBusinessLoan
        ? []
        : (formData.loan_product_requirements ?? [])
          .filter(
            (requirement) => {
              if (
                requirement.requirement_type !== "category" ||
                !requirement.is_required ||
                !requirement.document_category
              ) {
                return false;
              }

              return String(requirement.subject_type).toLowerCase() === "business";
            },
          )
          .slice()
          .sort((left, right) => left.sort_order - right.sort_order),
    [formData.loan_product_requirements, isBusinessLoan],
  );

  const loanProductRowsByCategory = useMemo(() => {
    const grouped = new Map<string, Array<{ row: LoanProductUploadRow; index: number }>>();

    (data.documents.loan_product ?? []).forEach((row, index) => {
      const category = String(row.document_category ?? "");
      if (!category) {
        return;
      }

      const current = grouped.get(category) ?? [];
      current.push({ row, index });
      grouped.set(category, current);
    });

    return grouped;
  }, [data.documents.loan_product]);

  const displayRowsByCategory = useMemo(() => {
    const grouped = new Map<string, DisplayLoanProductRow[]>();

    requiredLoanProductRequirements.forEach((requirement) => {
      const category = String(requirement.document_category ?? "");
      const uploadedRows = loanProductRowsByCategory.get(category) ?? [];
      const slotCount = Math.max(requirement.min_count, uploadedRows.length, 1);

      const displayRows = Array.from({ length: slotCount }, (_, index) => {
        const existing = uploadedRows[index];

        if (existing) {
          return {
            ...existing.row,
            slot_key: `${category}-existing-${existing.index}`,
            source_index: existing.index,
          };
        }

        return {
          document_type_id: "",
          file: null,
          document_category: category,
          slot_key: `${category}-empty-${index}`,
          source_index: null,
        };
      });

      grouped.set(category, displayRows);
    });

    return grouped;
  }, [loanProductRowsByCategory, requiredLoanProductRequirements]);

  const updateLoanProductDocument = (
    category: string,
    sourceIndex: number | null,
    patch: Partial<LoanProductUploadRow>,
  ) => {
    const currentRows = data.documents.loan_product ?? [];
    const nextRows = [...currentRows];

    if (sourceIndex !== null && sourceIndex >= 0 && sourceIndex < nextRows.length) {
      const updatedRow = buildLoanProductRow(
        {
          ...nextRows[sourceIndex],
          ...patch,
        },
        category,
      );

      if (hasMeaningfulLoanProductRow(updatedRow)) {
        nextRows[sourceIndex] = updatedRow;
      } else {
        nextRows.splice(sourceIndex, 1);
      }
    } else {
      const newRow = buildLoanProductRow(patch, category);
      if (!hasMeaningfulLoanProductRow(newRow)) {
        return;
      }
      nextRows.push(newRow);
    }

    if (areLoanProductRowsEqual(currentRows, nextRows)) {
      return;
    }

    setData("documents", {
      loan_product: nextRows,
    });
  };

  const isMissingLoanDetails = () =>
    !String(data.loan_type ?? "").trim() ||
    !String(data.loan_amount ?? "").trim() ||
    !String(data.interest_type ?? "").trim() ||
    !String(data.interest_rate ?? "").trim() ||
    !String(data.repayment_frequency ?? "").trim() ||
    !String(data.term ?? "").trim();

  const hasMissingLoanProductDocs = () => {
    for (const requirement of requiredLoanProductRequirements) {
      const category = String(requirement.document_category ?? "");
      const rows = (data.documents.loan_product ?? []).filter(
        (row) => String(row.document_category ?? "") === category,
      );
      const completedRows = rows.filter((row) => row.document_type_id && row.file);
      const selectedTypeIds = completedRows.map((row) => String(row.document_type_id));
      const uniqueTypeCount = new Set(selectedTypeIds).size;

      if (completedRows.length < requirement.min_count) {
        return `Please upload at least ${requirement.min_count} required document(s) for ${category.replaceAll("_", " ")}.`;
      }

      if (uniqueTypeCount !== selectedTypeIds.length) {
        return `Please avoid duplicate document types under ${category.replaceAll("_", " ")}.`;
      }
    }

    return "";
  };

  const focusField = (fieldName: string) => {
    if (typeof document === "undefined") return;

    window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>(`[data-field="${fieldName}"]`);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      if ("focus" in target) {
        target.focus();
      }
    }, 100);
  };

  const handleSubmit = () => {
    const firstMissingField =
      !String(data.loan_type ?? "").trim()
        ? "loan_type"
        : !String(data.loan_amount ?? "").trim()
          ? "loan_amount"
          : !String(data.interest_type ?? "").trim()
            ? "interest_type"
            : !String(data.interest_rate ?? "").trim()
              ? "interest_rate"
              : !String(data.repayment_frequency ?? "").trim()
                ? "repayment_frequency"
                : !String(data.term ?? "").trim()
                  ? "term"
                  : "";

    if (isMissingLoanDetails()) {
      setStepError("Please complete all required loan details before proceeding.");
      if (firstMissingField) {
        focusField(firstMissingField);
      }
      return;
    }

    const missingLoanProductDocsMessage = hasMissingLoanProductDocs();
    if (missingLoanProductDocsMessage) {
      setStepError(missingLoanProductDocsMessage);
      return;
    }

    setStepError("");
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

        <StepIndicator currentStep={indicatorIndex} steps={indicatorLabels} />
        <form
          onSubmit={(event) => {
            event.preventDefault();
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
            error={fieldErrors.loan_type || errors.loan_type}
            disabled={isLoadingLoanProducts || loanTypeOptions.length === 0}
          />

          {loanProductsError && <p className="text-sm text-red-600">{loanProductsError}</p>}
          {stepError && <p className="text-sm text-red-600">{stepError}</p>}

          <FormField
            label="Loan Amount (PHP)"
            name="loan_amount"
            value={data.loan_amount}
            onChange={(value) => setData("loan_amount", sanitize.number(value))}
            required
            error={fieldErrors.loan_amount || errors.loan_amount}
          />

          <FormField
            label="Monthly Income (PHP)"
            name="monthly_income"
            value={String(formData.monthly_income ?? "")}
            onChange={() => { }}
            placeholder="Auto-filled from borrower"
            disabled
          />

          <FormField
            label="Interest Type"
            name="interest_type"
            type="select"
            value={data.interest_type}
            onChange={(value) => setData("interest_type", value)}
            required
            options={interestTypeOptions}
            error={errors.interest_type}
          />

          <FormField
            label="Interest Type"
            name="interest_type"
            type="select"
            value={data.interest_type}
            onChange={(v) => setData("interest_type", v)}
            required
            options={interestTypeOptions}
            error={fieldErrors.interest_type || errors.interest_type}
          />

          <FormField
            label="Interest Rate (%)"
            name="interest_rate"
            value={String(data.interest_rate)}
            onChange={(v) => setData("interest_rate", parseFloat(sanitize.decimal(v)) || 0)}
            required
            error={fieldErrors.interest_rate || errors.interest_rate}
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
            error={fieldErrors.repayment_frequency || errors.repayment_frequency}
          />

          <FormField
            label="Term (months)"
            name="term"
            value={data.term}
            onChange={(v) => setData("term", sanitize.number(v))}
            required
            error={fieldErrors.term || errors.term}
          />

          <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm">
            <p className={needsCollateral ? "text-red-600" : "text-green-700"}>
              {needsCollateral ? "Collateral required" : "No collateral required"}
            </p>
            <p className={needsCoBorrower ? "text-red-600" : "text-green-700"}>
              {needsCoBorrower ? "Co-borrower required" : "No co-borrower required"}
            </p>
          </div>

          {
            isBusinessLoan && (
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-gray-700">Required Loan Product Documents</h3>
                </div>

                {!requiredLoanProductRequirements.length && (
                  <p className="text-sm text-gray-600">
                    No additional business documents are configured for this product.
                  </p>
                )}

                {requiredLoanProductRequirements.map((requirement) => {
                  const category = String(requirement.document_category ?? "");
                  const options = documentTypesByCategory[category] ?? [];
                  const displayRows = displayRowsByCategory.get(category) ?? [];

                  return (
                    <div key={requirement.id} className="rounded-md border border-gray-200 bg-white p-4 space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {toTitleCase(category)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Upload at least {requirement.min_count} document(s).
                        </p>
                        {requirement.notes && <p className="text-xs text-gray-500 mt-1">{requirement.notes}</p>}
                      </div>

                      {!options.length && (
                        <p className="text-xs text-amber-700">
                          No document types are available for this category yet.
                        </p>
                      )}

                      {displayRows.map((row) => (
                        <div key={row.slot_key} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                          <div className="md:col-span-5">
                            <label className="block text-sm font-medium mb-1">Document Type</label>
                            <select
                              value={row.document_type_id}
                              onChange={(event) =>
                                updateLoanProductDocument(category, row.source_index, {
                                  document_type_id: event.target.value,
                                })
                              }
                              className={inputClass}
                            >
                              <option value="">Select document type</option>
                              {options.map((option) => (
                                <option key={option.id} value={String(option.id)}>
                                  {option.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="md:col-span-7">
                            <label className="block text-sm font-medium mb-1">File</label>
                            <input
                              type="file"
                              className={inputClass}
                              accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                              onChange={(event) =>
                                updateLoanProductDocument(category, row.source_index, {
                                  file: event.target.files?.[0] ?? null,
                                })
                              }
                            />
                            {row.file && (
                              <p className="mt-1 text-xs text-gray-600">Selected: {row.file.name}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            )
          }

          <div className="flex justify-between mt-6">
            <button
              type="button"
              className="px-4 py-1 border border-gray-300 rounded-md hover:bg-gray-400"
              onClick={onPrev}
            >
              Back
            </button>
            <button
              type="button"
              className="px-4 py-1 bg-golden text-black rounded-md hover:bg-golden-dark"
              onClick={handleSubmit}
            >
              Next
            </button>
          </div>
        </form >
      </div >
    </section >
  );
};

export default LoanDetails;
