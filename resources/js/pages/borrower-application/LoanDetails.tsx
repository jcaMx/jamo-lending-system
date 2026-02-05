
import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { FormField, SectionHeader } from "@/components/FormField";
import type { SharedFormData } from "./sharedFormData";
import { User, Users, Home, DollarSign, CreditCard } from "lucide-react";
import StepIndicator from "./StepIndicator";

const icons = [User, Users, Home, DollarSign, CreditCard];


interface LoanDetailsProps {
  onNext: () => void;
  onPrev: () => void;
  formData: SharedFormData;
  setFormData: React.Dispatch<React.SetStateAction<SharedFormData>>;
}

const LoanDetails = ({ onNext, onPrev, formData, setFormData }: LoanDetailsProps) => {
  const initial = formData ?? {};
  const { data, setData, errors } = useForm({
    loan_type: initial.loan_type ?? "",
    loan_amount: String(initial.loan_amount ?? ""),
    interest_type: initial.interest_type ?? "",
    interest_rate: 5, // default interest rate
    repayment_frequency: initial.repayment_frequency ?? "",
    term: String(initial.term ?? ""),
  });

  // keep parent in sync
  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, [data, setFormData]);

  const sanitize = {
    number: (v: string) => v.replace(/\D/g, ""),
    decimal: (v: string) => v.replace(/[^0-9.]/g, ""),
  };

  const loanTypeOptions = [
    { value: "personal", label: "Personal Loan" },
    { value: "business", label: "Business Loan" },
    { value: "home", label: "Home Loan" },
    { value: "education", label: "Education Loan" },
  ];

  const interestTypeOptions = [
    { value: "compound", label: "Compound" },
    { value: "diminishing", label: "Diminishing" },
  ];

  const repaymentFrequencyOptions = [
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
  ];

  const handleSubmit = () => {
    onNext();
  };

  return (
    
    <section title="Loan Details" className="w-full h-full flex flex-col m-3">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg space-y-6">

        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard className="w-6 h-6 text-golden" />
            <h1 className="text-2xl md:text-3xl font-bold">Loan Details</h1>
          </div>
        </div>

        <StepIndicator
          currentStep={4}
          steps={[
            "Borrower",
            "Co-Borrower",
            "Collateral",
            "Loan Details",
            "Payment",
          ]}
        />
      <FormField
        label="Loan Type"
        name="loan_type"
        type="select"
        value={data.loan_type}
        onChange={(v) => setData("loan_type", v)}
        required
        options={loanTypeOptions}
        error={errors.loan_type}
      />

      <FormField
        label="Loan Amount (₱)"
        name="loan_amount"
        value={data.loan_amount}
        onChange={(v) =>
          setData("loan_amount", sanitize.number(v))
        }
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
        onChange={(v) => setData("interest_rate", parseFloat(sanitize.decimal(v)) || 0) }
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
        onChange={(v) =>
          setData("term", sanitize.number(v))
        }
        required
        error={errors.term}
      />

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
