import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StepIndicator from "./StepIndicator";
import { CreditCard } from "lucide-react";
import { router, useForm } from "@inertiajs/react";
import { route } from "ziggy-js";
import type { SharedFormData } from "./sharedFormData";

interface ConfirmationProps {
  onPrev: () => void;
  application?: {
    id: number;
    created_at: string;
    borrower?: { first_name: string; last_name: string };
    co_borrower?: { full_name: string };
    loan?: { loan_amount: number; term: number };
    collateral?: { collateral_type: string };
    payment_method?: string;
  };
  formData: SharedFormData;
  setFormData: React.Dispatch<React.SetStateAction<SharedFormData>>;
}

const Confirmation = ({ onPrev, application, formData, setFormData }: ConfirmationProps) => {
  const initialPayment = formData?.payment_method ?? application?.payment_method ?? "";
  const { data, setData, errors } = useForm({
    payment_method: initialPayment,
  });

  const errorEntries = Object.entries(errors);

  const appendIfPresent = (payload: FormData, key: string, value: any) => {
    if (value === undefined || value === null || value === "") return;
    payload.append(key, String(value));
  };

  const appendBorrower = (payload: FormData) => {
    appendIfPresent(payload, "borrower_first_name", formData.borrower_first_name);
    appendIfPresent(payload, "borrower_last_name", formData.borrower_last_name);
    appendIfPresent(payload, "gender", formData.gender);
    appendIfPresent(payload, "date_of_birth", formData.date_of_birth);
    appendIfPresent(payload, "marital_status", formData.marital_status);
    appendIfPresent(payload, "contact_no", formData.contact_no);
    appendIfPresent(payload, "landline_number", formData.landline_number);
    appendIfPresent(payload, "dependent_child", formData.dependent_child);
    appendIfPresent(payload, "permanent_address", formData.permanent_address);
    appendIfPresent(payload, "city", formData.city);
    appendIfPresent(payload, "home_ownership", formData.home_ownership);
  };

  const appendSpouse = (payload: FormData) => {
    appendIfPresent(payload, "spouse_first_name", formData.spouse_first_name);
    appendIfPresent(payload, "spouse_last_name", formData.spouse_last_name);
    appendIfPresent(payload, "spouse_mobile_number", formData.spouse_mobile_number);
    appendIfPresent(payload, "spouse_occupation", formData.spouse_occupation);
    appendIfPresent(payload, "spouse_position", formData.spouse_position);
    appendIfPresent(payload, "spouse_agency_address", formData.spouse_agency_address);
  };

  const appendEmployment = (payload: FormData) => {
    appendIfPresent(payload, "employment_status", formData.employment_status);
    appendIfPresent(payload, "income_source", formData.income_source);
    appendIfPresent(payload, "occupation", formData.occupation);
    appendIfPresent(payload, "position", formData.position);
    appendIfPresent(payload, "monthly_income", formData.monthly_income);
    appendIfPresent(payload, "agency_address", formData.agency_address);
  };

  const appendBorrowerId = (payload: FormData) => {
    appendIfPresent(payload, "valid_id_type", formData.valid_id_type);
    appendIfPresent(payload, "valid_id_number", formData.valid_id_number);

    if (formData.files && formData.files.length) {
      for (let i = 0; i < formData.files.length; i += 1) {
        payload.append("files[]", formData.files[i]);
      }
    }
  };

  const appendCoBorrowers = (payload: FormData) => {
    if (!formData.coBorrowers || !formData.coBorrowers.length) return;

    const filtered = formData.coBorrowers.filter((co) =>
      Object.values(co).some((value) => value !== undefined && value !== null && String(value).trim() !== "")
    );

    filtered.forEach((co, index) => {
      Object.entries(co).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        payload.append(`coBorrowers[${index}][${key}]`, String(value));
      });
    });
  };

  const appendCollateral = (payload: FormData) => {
    appendIfPresent(payload, "collateral_type", formData.collateral_type);
    appendIfPresent(payload, "make", formData.make);
    appendIfPresent(payload, "vehicle_type", formData.vehicle_type);
    appendIfPresent(payload, "transmission_type", formData.transmission_type);
    appendIfPresent(payload, "plate_no", formData.plate_no);
    appendIfPresent(payload, "engine_no", formData.engine_no);
    appendIfPresent(payload, "year_model", formData.year_model);
    appendIfPresent(payload, "series", formData.series);
    appendIfPresent(payload, "fuel", formData.fuel);
    appendIfPresent(payload, "certificate_of_title_no", formData.certificate_of_title_no);
    appendIfPresent(payload, "location", formData.location);
    appendIfPresent(payload, "description", formData.description);
    appendIfPresent(payload, "area", formData.area);
    appendIfPresent(payload, "bank_name", formData.bank_name);
    appendIfPresent(payload, "account_no", formData.account_no);
    appendIfPresent(payload, "cardno_4digits", formData.cardno_4digits);
    appendIfPresent(payload, "estimated_value", formData.estimated_value);
    appendIfPresent(payload, "appraisal_date", formData.appraisal_date);
    appendIfPresent(payload, "appraised_by", formData.appraised_by);

    if (formData.ownership_proof) {
      payload.append("ownership_proof", formData.ownership_proof);
    }
  };

  const appendLoan = (payload: FormData) => {
    appendIfPresent(payload, "loan_type", formData.loan_type);
    appendIfPresent(payload, "loan_amount", formData.loan_amount);
    appendIfPresent(payload, "interest_type", formData.interest_type);
    appendIfPresent(payload, "interest_rate", formData.interest_rate);
    appendIfPresent(payload, "repayment_frequency", formData.repayment_frequency);
    appendIfPresent(payload, "term", formData.term);
  };

  const appendPayment = (payload: FormData) => {
    appendIfPresent(payload, "payment_method", data.payment_method);
  };

  const handleSubmit = () => {
    const payload = new FormData();

    appendBorrower(payload);
    appendSpouse(payload);
    appendEmployment(payload);
    appendBorrowerId(payload);
    appendCoBorrowers(payload);
    appendCollateral(payload);
    appendLoan(payload);
    appendPayment(payload);

    router.post(route("applications.confirm"), payload, {
      forceFormData: true,
      onSuccess: () => {
        // success handled by backend redirect
      },
    });
  };

  return (
    <section
      className="py-8 md:py-16 px-6 md:px-12"
      style={{ backgroundColor: "#F7F5F3" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard className="w-6 h-6 text-golden" />
            <h1 className="text-2xl md:text-3xl font-bold">Confirmation</h1>
          </div>
        </div>

        <StepIndicator
          currentStep={5}
          steps={[
            "Borrower",
            "Co-Borrower",
            "Collateral",
            "Loan Details",
            "Payment",
          ]}
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="bg-white rounded-lg p-6 md:p-8 space-y-6"
        >
          {errorEntries.length > 0 && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <p className="font-semibold">Please fix the following errors:</p>
              <ul className="mt-2 list-disc pl-5">
                {errorEntries.map(([field, message]) => (
                  <li key={field}>
                    <span className="font-medium">{field}:</span> {String(message)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Application Summary */}
          <div className="border-2 border-golden rounded-lg p-6 space-y-6 bg-golden/5">
            <h3 className="text-xl font-bold mb-4">Application Summary</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-semibold">Application ID</Label>
                <div className="bg-white p-3 rounded border">
                  {application?.id ?? "-"}
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold">Date</Label>
                <div className="bg-white p-3 rounded border">
                  {application?.created_at
                    ? new Date(application.created_at).toLocaleDateString()
                    : "-"}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-semibold">Borrower</Label>
                <div className="bg-white p-3 rounded border">
                  {formData?.borrower_first_name || application?.borrower
                    ? `${formData?.borrower_first_name ?? application?.borrower?.first_name} ${formData?.borrower_last_name ?? application?.borrower?.last_name}`.trim()
                    : "-"}
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold">Co-Borrower</Label>
                <div className="bg-white p-3 rounded border">
                  {formData?.coBorrowers?.[0]?.first_name
                    ? `${formData.coBorrowers[0].first_name} ${formData.coBorrowers[0].last_name}`
                    : application?.co_borrower?.full_name ?? "-"}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-semibold">Loan Amount</Label>
                <div className="bg-white p-3 rounded border">
                  {formData?.loan_amount ?? application?.loan?.loan_amount ?? "-"}
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold">Term</Label>
                <div className="bg-white p-3 rounded border">
                  {formData?.term ?? application?.loan?.term ? `${formData?.term ?? application?.loan?.term} months` : "-"}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-semibold">Collateral</Label>
                <div className="bg-white p-3 rounded border">
                  {formData?.collateral_type ?? application?.collateral?.collateral_type ?? "-"}
                </div>
              </div>
              <div>
                <Label className="text-sm font-semibold">Monthly Installment</Label>
                <div className="bg-white p-3 rounded border">
                  {application?.loan?.loan_amount && application?.loan?.term
                    ? (application.loan.loan_amount / application.loan.term).toFixed(2)
                    : "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between gap-4">
            <Button type="button" onClick={onPrev} variant="outline" className="px-8">
              Previous
            </Button>

            <Button
              type="submit"
              className="bg-golden hover:bg-golden-dark text-black px-8"
            >
              Submit Application
            </Button>

          </div>
        </form>
      </div>
    </section>
  );
};

export default Confirmation;
