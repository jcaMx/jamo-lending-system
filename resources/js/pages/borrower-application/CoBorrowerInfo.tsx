import React from "react";
import { Button } from "@/components/ui/button";
import StepIndicator from "./StepIndicator";
import { Users, Plus, Trash2 } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { FormField } from "@/components/FormField";
import type { CoBorrower, SharedFormData } from "./sharedFormData";

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
  birth_date: "1990-01-01",
  marital_status: "",
  mobile: "09000000000",
  dependents: "",
  address: "N/A",
  occupation: "",
  position: "",
  employer_address: "",
  is_existing: false,
};

const sanitize = {
  name: (v: string) => v.replace(/[^a-zA-Z\s]/g, ""),
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
      const res = await fetch(`/co-borrowers?search=${query}${borrowerParam}`);
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

    // Find first empty one or append if none
    const indexToUpdate = updated.findIndex((co) => !co.first_name && !co.last_name);
    const targetIndex = indexToUpdate !== -1 ? indexToUpdate : updated.length;

    if (targetIndex >= 2) {
      setStepError("Maximum limit of 2 co-makers reached.");
      return;
    }

    updated[targetIndex] = {
      first_name: item.first_name || "",
      last_name: item.last_name || "",
      birth_date: item.birth_date || "1990-01-01",
      marital_status: item.marital_status || "",
      mobile: item.mobile || "09000000000",
      dependents: item.dependents || "",
      address: item.address || "N/A",
      occupation: item.occupation || "",
      position: item.position || "",
      employer_address: item.employer_address || "",
      is_existing: true, // mark as existing to make non-editable
    };

    setData("coBorrowers", updated);
    setFormData?.((prev) => ({ ...prev, coBorrowers: updated }));

    setResults([]);
    setSearch("");
    setStepError("");
  };

  const handleChange = (index: number, field: keyof CoBorrower, value: string) => {
    const updated = [...data.coBorrowers];

    if (["first_name", "last_name"].includes(field)) {
      value = sanitize.name(value);
    }

    (updated[index] as Record<string, any>)[field] = sanitize.trim(value);
    setData("coBorrowers", updated);
    setFormData?.((prev) => ({ ...prev, coBorrowers: updated }));
  };

  const addCoBorrower = () => {
    if (data.coBorrowers.length >= 2) {
      setStepError("Maximum limit of 2 co-makers reached.");
      return;
    }
    const updated = [...data.coBorrowers, emptyCoBorrower];
    setData("coBorrowers", updated);
    setFormData?.((prev) => ({ ...prev, coBorrowers: updated }));
    setStepError("");
  };

  const removeCoBorrower = (index: number) => {
    const updated = data.coBorrowers.filter((_, i) => i !== index);
    setData("coBorrowers", updated);
    setFormData?.((prev) => ({ ...prev, coBorrowers: updated }));
    setStepError("");
  };

  const isCoBorrowerEmpty = (co: CoBorrower) =>
    !String(co.first_name ?? "").trim() && !String(co.last_name ?? "").trim();

  const hasMissingRequired = (co: CoBorrower) =>
    !String(co.first_name ?? "").trim() || !String(co.last_name ?? "").trim();

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

    if (nonEmptyBorrowers.length > 2) {
      setStepError("Maximum of 2 co-makers are allowed.");
      return;
    }

    if (nonEmptyBorrowers.some(hasMissingRequired)) {
      setStepError("Please provide both First Name and Last Name.");
      const firstIncompleteIndex = data.coBorrowers.findIndex(
        (co) => !isCoBorrowerEmpty(co) && hasMissingRequired(co),
      );

      if (firstIncompleteIndex >= 0) {
        const targetCo = data.coBorrowers[firstIncompleteIndex];
        const firstMissingField =
          !String(targetCo.first_name ?? "").trim() ? "first_name" : "last_name";

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
              Co-Maker / Co-Borrower Information
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
          {stepError && <p className="text-red-600 text-sm font-medium">{stepError}</p>}
          {/* Requirement hint for optional vs required behavior */}
          <p className={`text-sm ${required ? "text-red-600" : "text-green-700"}`}>
            {required ? "Co-maker / Co-borrower required for this loan product." : "Optional — you may skip this step."}
          </p>

          {/* 🔍 SEARCH UI */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Search Existing Borrower to Add as Co-Maker
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-golden"
              placeholder="Search by name..."
            />

            {loading && <p className="text-sm text-gray-500">Searching...</p>}

            {results.length > 0 && (
              <div className="border rounded bg-white max-h-40 overflow-y-auto shadow-sm">
                {results.map((item, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
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
            <div key={i} className="relative border p-5 rounded-lg bg-gray-50 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                <span className="text-sm font-semibold text-gray-700">Co-Maker #{i + 1}</span>
                {data.coBorrowers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeCoBorrower(i)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {co.is_existing && (
                <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                  Existing Borrower details selected (Read-Only)
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  label="First Name"
                  name={`coBorrowers.${i}.first_name`}
                  value={co.first_name}
                  onChange={(v) => handleChange(i, "first_name", v)}
                  required={true}
                  htmlRequired={required}
                  disabled={co.is_existing}
                  error={fieldErrors[`coBorrowers.${i}.first_name`]}
                />

                <FormField
                  label="Last Name"
                  name={`coBorrowers.${i}.last_name`}
                  value={co.last_name}
                  onChange={(v) => handleChange(i, "last_name", v)}
                  required={true}
                  htmlRequired={required}
                  disabled={co.is_existing}
                  error={fieldErrors[`coBorrowers.${i}.last_name`]}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onPrev}>
              Previous
            </Button>

            {data.coBorrowers.length < 2 && (
              <Button type="button" onClick={addCoBorrower} variant="outline" className="border-golden text-golden hover:bg-golden/10">
                <Plus size={14} className="mr-1" /> Add Co-Borrower
              </Button>
            )}

            <Button type="submit" className="bg-golden text-black hover:bg-yellow-600">
              Next
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CoBorrowerInfo;
