import React from "react";
import { Button } from "@/components/ui/button";
import StepIndicator from "./StepIndicator";
import { Users, Plus, Trash2, Home, CreditCard, DollarSign} from "lucide-react";
import { useForm } from "@inertiajs/react";
import { FormField, SectionHeader } from "@/components/FormField";
import type { CoBorrower, SharedFormData } from "./sharedFormData";


const maritalStatusOptions = [
  { value: "Single", label: "Single" },
  { value: "Married", label: "Married" },
  { value: "Widowed", label: "Widowed" },
  { value: "Divorced", label: "Divorced" },
];

const occupationOptions = [
  { value: "Employee", label: "Employee" },
  { value: "Self-Employed", label: "Self-Employed" },
  { value: "Unemployed", label: "Unemployed" },
  { value: "Retired", label: "Retired" },
];

interface CoBorrowerInfoProps {
  onNext: () => void;
  onPrev: () => void;
  formData: SharedFormData;
  setFormData: React.Dispatch<React.SetStateAction<SharedFormData>>;

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

const CoBorrowerInfo = ({ onNext, onPrev, formData, setFormData }: CoBorrowerInfoProps) => {
  const initial =
    formData?.coBorrowers && formData.coBorrowers.length > 0
      ? formData.coBorrowers
      : [emptyCoBorrower];
  const { data, setData } = useForm({
    coBorrowers: initial,
  });

  const handleChange = (index: number, field: keyof CoBorrower, value: string) => {
    const updated = [...data.coBorrowers];

    if (["first_name", "last_name"].includes(field))
      value = sanitize.name(value);

    if (["mobile", "dependents"].includes(field))
      value = sanitize.number(value);

    updated[index][field] = sanitize.trim(value);
    setData("coBorrowers", updated);
    // sync parent
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

  const submit = () => {
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

        <StepIndicator
          currentStep={2}
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
            submit();
          }}
          className="bg-white rounded-lg p-6 md:p-8 space-y-6"
        >
          <SectionHeader title="Co-Borrowers" />

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
                  name="first_name"
                  value={co.first_name}
                  onChange={(v) => handleChange(i, "first_name", v)}
                  required
                />

                <FormField
                  label="Last Name"
                  name="last_name"
                  value={co.last_name}
                  onChange={(v) => handleChange(i, "last_name", v)}
                  required
                />
              </div>

              <FormField
                label="Birth Date"
                name="birth_date"
                type="date"
                value={co.birth_date}
                onChange={(v) => handleChange(i, "birth_date", v)}
              />

              <FormField
                label="Marital Status"
                name="marital_status"
                type="select"
                value={co.marital_status}
                onChange={(v) => handleChange(i, "marital_status", v)}
                options={maritalStatusOptions}
              />

              <FormField
                label="Mobile Number"
                name="mobile"
                value={co.mobile}
                onChange={(v) => handleChange(i, "mobile", v)}
                maxLength={11}
              />

              <FormField
                label="No. of Dependents"
                name="dependents"
                type="number"
                value={co.dependents}
                onChange={(v) => handleChange(i, "dependents", v)}
              />

              <FormField
                label="Home Address"
                name="address"
                value={co.address}
                onChange={(v) => handleChange(i, "address", v)}
              />

              <FormField
                label="Occupation"
                name="occupation"
                type="select"
                value={co.occupation}
                onChange={(v) => handleChange(i, "occupation", v)}
                options={occupationOptions}
              />

              <FormField
                label="Position"
                name="position"
                value={co.position}
                onChange={(v) => handleChange(i, "position", v)}
              />

              <FormField
                label="Employer Address"
                name="employer_address"
                value={co.employer_address}
                onChange={(v) => handleChange(i, "employer_address", v)}
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
