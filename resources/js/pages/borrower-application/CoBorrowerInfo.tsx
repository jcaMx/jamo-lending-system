import React from "react";
import { Button } from "@/components/ui/button";
import StepIndicator from "./StepIndicator";
import { Users, Plus, Trash2 } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { FormField } from "@/components/FormField";
import type { CoBorrower, SharedFormData } from "./sharedFormData";

const maritalStatusOptions = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Widowed", label: "Widowed" },
  { value: "Divorced", label: "Divorced" },
];

interface CoBorrowerInfoProps {
  onNext: () => void;
  onPrev: () => void;
  formData: SharedFormData;
  setFormData: React.Dispatch<React.SetStateAction<SharedFormData>>;
  fieldErrors?: Record<string, string>;
  submitError?: string;
  stepLabels?: string[];
  stepIndex?: number;
  required?: boolean;
}

const emptyCoBorrower: CoBorrower = {
  first_name: "",
  last_name: "",
  birth_date: "",
  marital_status: "",
  mobile: "",
  dependents: "",
  address: "",
  occupation: "",
  position: "",
  employer_address: "",
};

const sanitize = {
  name: (v: string) => v.replace(/[^a-zA-Z\s]/g, ""),
  number: (v: string) => v.replace(/\D/g, ""),
  trim: (v: string) => v.trim(),
};

const CoBorrowerInfo = ({
  onNext,
  onPrev,
  formData,
  setFormData,
  fieldErrors = {},
  submitError = "",
  stepLabels,
  stepIndex,
  required = false,
}: CoBorrowerInfoProps) => {
  const initial =
    formData?.coBorrowers && formData.coBorrowers.length > 0
      ? formData.coBorrowers
      : [emptyCoBorrower];

  const { data, setData } = useForm({
    coBorrowers: initial,
  });

  const [stepError, setStepError] = React.useState("");

  // 🔍 SEARCH STATES
  const [search, setSearch] = React.useState("");
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  const defaultStepLabels = ["Loan Details", "Co-Borrower", "Collateral", "Payment"];
  const indicatorLabels = stepLabels && stepLabels.length > 0 ? stepLabels : defaultStepLabels;
  const indicatorIndex = stepIndex ?? 2;

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

  // 🔍 HANDLE SEARCH
  const handleSearch = async (query: string) => {
    setSearch(query);

    if (!query) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);

      const borrowerParam = formData?.borrower_id ? `&borrower_id=${formData.borrower_id}` : '';
      const res = await fetch(`/co-borrowers?search=${query}${borrowerParam}`)
      const data = await res.json();

      setResults(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ SELECT RESULT → AUTO FILL
  const selectCoBorrower = (item: any) => {
    const updated = [...data.coBorrowers];

    updated[0] = {
      first_name: item.first_name || "",
      last_name: item.last_name || "",
      birth_date: item.birth_date || "",
      marital_status: item.marital_status || "",
      mobile: item.mobile || "",
      dependents: item.dependents || "",
      address: item.address || "",
      occupation: item.occupation || "",
      position: item.position || "",
      employer_address: item.employer_address || "",
    };

    setData("coBorrowers", updated);
    setFormData((prev) => ({ ...prev, coBorrowers: updated }));

    setResults([]);
    setSearch("");
  };

  const handleChange = (index: number, field: keyof CoBorrower, value: string) => {
    const updated = [...data.coBorrowers];

    if (["first_name", "last_name"].includes(field))
      value = sanitize.name(value);

    if (["mobile", "dependents"].includes(field))
      value = sanitize.number(value);

    updated[index][field] = sanitize.trim(value);
    setData("coBorrowers", updated);
    setFormData((prev) => ({ ...prev, coBorrowers: updated }));
  };

  const addCoBorrower = () => {
    const updated = [...data.coBorrowers, emptyCoBorrower];
    setData("coBorrowers", updated);
    setFormData((prev) => ({ ...prev, coBorrowers: updated }));
  };

  const removeCoBorrower = (index: number) => {
    const updated = data.coBorrowers.filter((_, i) => i !== index);
    setData("coBorrowers", updated);
    setFormData((prev) => ({ ...prev, coBorrowers: updated }));
  };

  const isCoBorrowerEmpty = (co: CoBorrower) =>
    Object.values(co).every((value) => !String(value ?? "").trim());

  const hasMissingRequired = (co: CoBorrower) => {
    const requiredFields: Array<keyof CoBorrower> = [
      "first_name",
      "last_name",
      "birth_date",
      "marital_status",
      "mobile",
      "dependents",
      "address",
      "occupation",
    ];

    return requiredFields.some((field) => !String(co[field] ?? "").trim());
  };

  const submit = () => {
    const nonEmptyBorrowers = data.coBorrowers.filter((co) => !isCoBorrowerEmpty(co));

    if (nonEmptyBorrowers.length === 0) {
      if (required) {
        setStepError("At least one co-borrower is required.");
        focusField("coBorrowers.0.first_name");
        return;
      }
      setStepError("");
      onNext();
      return;
    }

    if (nonEmptyBorrowers.some(hasMissingRequired)) {
      setStepError("Complete all required fields or remove entry.");
      const firstIncompleteIndex = data.coBorrowers.findIndex(
        (co) => !isCoBorrowerEmpty(co) && hasMissingRequired(co),
      );

      if (firstIncompleteIndex >= 0) {
        const targetCo = data.coBorrowers[firstIncompleteIndex];
        const firstMissingField =
          !String(targetCo.first_name ?? "").trim()
            ? "first_name"
            : !String(targetCo.last_name ?? "").trim()
              ? "last_name"
              : !String(targetCo.birth_date ?? "").trim()
                ? "birth_date"
                : !String(targetCo.marital_status ?? "").trim()
                  ? "marital_status"
                  : !String(targetCo.mobile ?? "").trim()
                    ? "mobile"
                    : !String(targetCo.dependents ?? "").trim()
                      ? "dependents"
                      : !String(targetCo.address ?? "").trim()
                        ? "address"
                        : "occupation";

        focusField(`coBorrowers.${firstIncompleteIndex}.${firstMissingField}`);
      }
      return;
    }

    setStepError("");
    onNext();
  };

  return (
    <section className="py-8 md:py-16 px-6 md:px-12 bg-[#F7F5F3]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
            <Users className="w-6 h-6 text-golden" />
            <h1 className="text-2xl md:text-3xl font-bold">
              Co-Borrower Information
            </h1>
          </div>
        </div>

        <StepIndicator currentStep={indicatorIndex} steps={indicatorLabels} />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="bg-white rounded-lg p-6 md:p-8 space-y-6"
        >
          {stepError && <p className="text-red-600 text-sm">{stepError}</p>}
          {/* Requirement hint for optional vs required behavior */}
          <p className={`text-sm ${required ? "text-red-600" : "text-green-700"}`}>
            {required ? "Co-borower required for this loan product." : "Optional — you may skip this step."}
          </p>
          {/* 🔍 SEARCH UI */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Search Existing Co-Borrower
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
              placeholder="Search by name..."
            />

            {loading && <p className="text-sm">Searching...</p>}

            {results.length > 0 && (
              <div className="border rounded bg-white max-h-40 overflow-y-auto">
                {results.map((item, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => selectCoBorrower(item)}
                  >
                    {item.first_name} {item.last_name} {item.type ? `(${item.type})` : ''}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FORM */}
          {data.coBorrowers.map((co, i) => (
            <div key={i} className="relative border p-4 rounded-lg space-y-4">
              {data.coBorrowers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCoBorrower(i)}
                  className="absolute top-2 right-2 text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  name={`coBorrowers.${i}.first_name`}
                  value={co.first_name}
                  onChange={(v) => handleChange(i, "first_name", v)}
                  required
                  error={fieldErrors[`coBorrowers.${i}.first_name`]}
                />

                <FormField
                  label="Last Name"
                  name={`coBorrowers.${i}.last_name`}
                  value={co.last_name}
                  onChange={(v) => handleChange(i, "last_name", v)}
                  required
                  error={fieldErrors[`coBorrowers.${i}.last_name`]}
                />
              </div>

              <FormField
                label="Birth Date"
                name={`coBorrowers.${i}.birth_date`}
                type="date"
                value={co.birth_date}
                onChange={(v) => handleChange(i, "birth_date", v)}
                required
                error={fieldErrors[`coBorrowers.${i}.birth_date`]}
              />

              <FormField
                label="Marital Status"
                name={`coBorrowers.${i}.marital_status`}
                type="select"
                value={co.marital_status}
                onChange={(v) => handleChange(i, "marital_status", v)}
                options={maritalStatusOptions}
                required
                error={fieldErrors[`coBorrowers.${i}.marital_status`]}
              />

              <FormField
                label="Mobile Number"
                name={`coBorrowers.${i}.mobile`}
                value={co.mobile}
                onChange={(v) => handleChange(i, "mobile", v)}
                maxLength={11}
                required
                error={fieldErrors[`coBorrowers.${i}.mobile`] || fieldErrors[`coBorrowers.${i}.contact`]}
              />

              <FormField
                label="No. of Dependents"
                name={`coBorrowers.${i}.dependents`}
                type="number"
                value={co.dependents}
                onChange={(v) => handleChange(i, "dependents", v)}
                required
                error={fieldErrors[`coBorrowers.${i}.dependents`]}
              />

              <FormField
                label="Home Address"
                name={`coBorrowers.${i}.address`}
                value={co.address}
                onChange={(v) => handleChange(i, "address", v)}
                required
                error={fieldErrors[`coBorrowers.${i}.address`]}
              />

              <FormField
                label="Occupation"
                name={`coBorrowers.${i}.occupation`}
                value={co.occupation}
                onChange={(v) => handleChange(i, "occupation", v)}
                required
                error={fieldErrors[`coBorrowers.${i}.occupation`]}
              />

              <FormField
                label="Position"
                name={`coBorrowers.${i}.position`}
                value={co.position}
                onChange={(v) => handleChange(i, "position", v)}
                error={fieldErrors[`coBorrowers.${i}.position`]}
              />

              <FormField
                label="Employer Address"
                name={`coBorrowers.${i}.employer_address`}
                value={co.employer_address}
                onChange={(v) => handleChange(i, "employer_address", v)}
                error={fieldErrors[`coBorrowers.${i}.employer_address`]}
              />
            </div>
          ))}

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onPrev}>
              Previous
            </Button>

            <Button type="button" onClick={addCoBorrower}>
              <Plus size={14} /> Add Co-Borrower
            </Button>

            <Button type="submit" className="bg-golden text-black">
              Next
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CoBorrowerInfo;
