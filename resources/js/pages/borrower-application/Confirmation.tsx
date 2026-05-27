import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import StepIndicator from "./StepIndicator";
import { CreditCard, Banknote, Home, Users } from "lucide-react";
import { router, useForm, usePage } from "@inertiajs/react";
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

const toDisplayValue = (value: unknown) => {
  if (value === undefined || value === null) return "-";

  const normalized = String(value).trim();
  return normalized === "" ? "-" : normalized;
};

const formatCurrency = (value: unknown) => {
  const normalized = toDisplayValue(value);
  if (normalized === "-") return "-";

  const num = Number(String(normalized).replace(/,/g, ''));
  if (isNaN(num)) return `₱${normalized}`;

  return `₱${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const generateAmortizationSchedule = (
  amount: number,
  ratePercent: number,
  termMonths: number,
  frequency: string
) => {
  const principal = Number(amount);
  const rate = Number(ratePercent) / 100;
  const term = Number(termMonths);

  if (!principal || !term) return [];

  const freq = (frequency ?? "Monthly").trim().toLowerCase();

  // Determine total installments
  let totalInstallments = term;
  let periodRate = rate / 12;

  if (freq === "weekly") {
    totalInstallments = Math.ceil(term * 4.345);
    periodRate = rate / 52;
  } else if (freq === "monthly") {
    totalInstallments = term;
    periodRate = rate / 12;
  }

  // PMT formula: P * (r * (1 + r)^n) / ((1 + r)^n - 1)
  let installmentAmount = 0;
  if (periodRate > 0) {
    installmentAmount =
      (principal * (periodRate * Math.pow(1 + periodRate, totalInstallments))) /
      (Math.pow(1 + periodRate, totalInstallments) - 1);
  } else {
    installmentAmount = principal / totalInstallments;
  }

  const roundedInstallmentAmount = Math.round(installmentAmount * 100) / 100;

  const schedules = [];
  let remaining = principal;
  const startDate = new Date();

  for (let i = 1; i <= totalInstallments; i++) {
    const interest = Math.round(remaining * periodRate * 100) / 100;
    const principalPayment =
      i === totalInstallments
        ? remaining
        : Math.round((roundedInstallmentAmount - interest) * 100) / 100;

    const currentInstallmentAmount =
      i === totalInstallments
        ? Math.round((principalPayment + interest) * 100) / 100
        : roundedInstallmentAmount;

    const beginningBalance = remaining;
    remaining = Math.round(Math.max(0, remaining - principalPayment) * 100) / 100;

    // calculate due date
    const dueDate = new Date(startDate);
    if (freq === "weekly") {
      dueDate.setDate(startDate.getDate() + i * 7);
    } else {
      dueDate.setMonth(startDate.getMonth() + i);
    }

    schedules.push({
      installment_no: i,
      due_date: dueDate.toISOString().split("T")[0],
      beginningBalance,
      scheduledPayment: currentInstallmentAmount,
      principalAmount: principalPayment,
      interest_amount: interest,
      endingBalance: remaining,
    });
  }

  return schedules;
};

const Confirmation = ({ onPrev, application, formData }: ConfirmationProps) => {
  const { props } = usePage();
  const pageProps = props as any;
  const authUser = pageProps?.auth?.user;
  const clerkName = authUser?.name || "Clerk";

  const initialPayment = formData?.payment_method ?? application?.payment_method ?? "";
  const { data, errors } = useForm({
    payment_method: initialPayment,
  });

  const errorEntries = Object.entries(errors);
  const schedule = generateAmortizationSchedule(
    Number(formData.loan_amount ?? application?.loan?.loan_amount ?? 0),
    Number(formData.interest_rate ?? 0),
    Number(formData.term ?? application?.loan?.term ?? 0),
    String(formData.repayment_frequency ?? "monthly"),
  );
  const collateralType = String(
    formData.collateral_type ?? application?.collateral?.collateral_type ?? "",
  ).toLowerCase();

  const collateralFields = [
    { label: "Type", value: toDisplayValue(formData.collateral_type ?? application?.collateral?.collateral_type) },
    { label: "Estimated Value", value: formatCurrency(formData.estimated_value) },
    { label: "Appraisal Date", value: toDisplayValue(formData.appraisal_date) },
    { label: "Appraised By", value: toDisplayValue(formData.appraised_by) },
    ...(collateralType === "vehicle"
      ? [
          { label: "Make", value: toDisplayValue(formData.make) },
          { label: "Vehicle Type", value: toDisplayValue(formData.vehicle_type) },
          { label: "Transmission Type", value: toDisplayValue(formData.transmission_type) },
          { label: "Plate Number", value: toDisplayValue(formData.plate_no) },
          { label: "Engine Number", value: toDisplayValue(formData.engine_no) },
          { label: "Year Model", value: toDisplayValue(formData.year_model) },
          { label: "Series", value: toDisplayValue(formData.series) },
          { label: "Fuel Type", value: toDisplayValue(formData.fuel) },
        ]
      : []),
    ...(collateralType === "land"
      ? [
          { label: "Certificate of Title No.", value: toDisplayValue(formData.certificate_of_title_no) },
          { label: "Lot No.", value: toDisplayValue(formData.lot_no) },
          { label: "Location", value: toDisplayValue(formData.location) },
          { label: "Description", value: toDisplayValue(formData.description) },
          { label: "Area (sqm)", value: toDisplayValue(formData.area) },
        ]
      : []),
    ...(collateralType === "atm"
      ? [
          { label: "Bank Name", value: toDisplayValue(formData.bank_name) },
          { label: "Account Number", value: toDisplayValue(formData.account_no) },
          { label: "Card Last 4 Digits", value: toDisplayValue(formData.cardno_4digits) },
        ]
      : []),
  ].filter((field) => field.value !== "-");

  const collateralDocuments = (formData.documents?.collateral ?? [])
    .filter((row) => row.file)
    .map((row) => row.file?.name ?? "")
    .filter((name) => name !== "");

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
      Object.values(co).some((value) => value !== undefined && value !== null && String(value).trim() !== ""),
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
    appendIfPresent(payload, "lot_no", formData.lot_no);
    appendIfPresent(payload, "location", formData.location);
    appendIfPresent(payload, "description", formData.description);
    appendIfPresent(payload, "area", formData.area);
    appendIfPresent(payload, "bank_name", formData.bank_name);
    appendIfPresent(payload, "account_no", formData.account_no);
    appendIfPresent(payload, "cardno_4digits", formData.cardno_4digits);
    appendIfPresent(payload, "estimated_value", formData.estimated_value);
    appendIfPresent(payload, "appraisal_date", formData.appraisal_date);
    appendIfPresent(payload, "appraised_by", formData.appraised_by);

    if (formData.documents?.collateral?.length) {
      formData.documents.collateral.forEach((row, index) => {
        if (row.document_type_id) {
          payload.append(`documents[collateral][${index}][document_type_id]`, String(row.document_type_id));
        }
        if (row.file) {
          payload.append(`documents[collateral][${index}][file]`, row.file);
        }
      });
    }

    if (formData.documents?.loan_product?.length) {
      formData.documents.loan_product.forEach((row, index) => {
        if (row.document_type_id) {
          payload.append(`documents[loan_product][${index}][document_type_id]`, String(row.document_type_id));
        }
        if (row.document_category) {
          payload.append(`documents[loan_product][${index}][document_category]`, String(row.document_category));
        }
        if (row.file) {
          payload.append(`documents[loan_product][${index}][file]`, row.file);
        }
      });
    }

    if (formData.ownership_proof) {
      payload.append("ownership_proof", formData.ownership_proof);
    }
  };

  const appendLoan = (payload: FormData) => {
    appendIfPresent(payload, "loan_product_id", formData.loan_product_id);
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

  const logFormData = (fd: FormData) => {
    for (const [key, value] of fd as any) {
      console.log(key, value);
    }
  };

  const handleSubmit = () => {
    console.log("Submit button clicked");
    console.log("Form data:", formData);

    const payload = new FormData();

    appendBorrower(payload);
    appendSpouse(payload);
    appendEmployment(payload);
    appendBorrowerId(payload);
    appendCoBorrowers(payload);
    appendCollateral(payload);
    appendLoan(payload);
    appendPayment(payload);

    logFormData(payload);

    console.log("Sending POST request to:", route("applications.confirm"));

    router.post(route("applications.confirm"), payload, {
      forceFormData: true,
      onStart: () => {
        console.log("Request started");
      },
      onSuccess: (response) => {
        console.log("Success:", response);
      },
      onError: (errors) => {
        console.error("Validation errors:", errors);
      },
      onFinish: () => {
        console.log("Request finished");
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
          currentStep={4}
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

          <div className="border-2 border-golden rounded-lg p-6 space-y-6 bg-golden/5">
            <h3 className="text-xl font-bold mb-4">Application Summary</h3>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Banknote className="w-5 h-5 text-golden" />
                Loan Details
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Loan Amount</Label>
                  <div className="bg-white p-3 rounded border">
                    {formatCurrency(formData.loan_amount ?? application?.loan?.loan_amount)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Term</Label>
                  <div className="bg-white p-3 rounded border">
                    {formData?.term ?? application?.loan?.term ? `${formData?.term ?? application?.loan?.term} months` : "-"}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Loan Type</Label>
                  <div className="bg-white p-3 rounded border">
                    {toDisplayValue(formData.loan_type)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Interest Rate</Label>
                  <div className="bg-white p-3 rounded border">
                    {formData?.interest_rate ? `${Math.round(Number(formData.interest_rate))}%` : "-"}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Starting Date</Label>
                  <div className="bg-white p-3 rounded border">
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Prepared By</Label>
                  <div className="bg-white p-3 rounded border text-gray-700">
                    {clerkName}
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t border-golden/20">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Banknote className="w-5 h-5 text-golden" />
                Computation Preview
              </h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <p className="text-sm font-semibold text-gray-500 mb-1">Gross Loan</p>
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(formData.loan_amount ?? application?.loan?.loan_amount)}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <p className="text-sm font-semibold text-gray-500 mb-1">Estimated Net Loan</p>
                  <p className="text-sm font-medium text-amber-600 mt-1">
                    Subject to releasing fees
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border shadow-sm">
                  <p className="text-sm font-semibold text-gray-500 mb-1">Estimated Monthly</p>
                  <p className="text-xl font-bold text-gray-900">
                    {(() => {
                      const amount = Number(formData.loan_amount ?? application?.loan?.loan_amount ?? 0);
                      const term = Number(formData.term ?? application?.loan?.term ?? 1);
                      const rate = Number(formData.interest_rate ?? 0) / 100;
                      if (!amount || !term) return "-";
                      // Assuming Annual Flat Rate for estimate:
                      const interest = amount * rate * (term / 12);
                      const monthly = (amount + interest) / term;
                      return formatCurrency(monthly);
                    })()}
                  </p>
                </div>
              </div>

              {schedule && schedule.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h5 className="font-semibold text-md text-gray-700">Amortization Schedule Preview</h5>
                  <div className="overflow-x-auto rounded-lg border border-gray-250 bg-white">
                    <table className="w-full min-w-[700px] border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-gray-250 bg-gray-50 text-left text-xs font-semibold text-gray-600">
                          <th className="px-4 py-3">Term</th>
                          <th className="px-4 py-3">Due Date</th>
                          <th className="px-4 py-3 text-right">Beginning Balance</th>
                          <th className="px-4 py-3 text-right">Payment</th>
                          <th className="px-4 py-3 text-right text-[#A47B06]">Principal</th>
                          <th className="px-4 py-3 text-right text-amber-800">Interest</th>
                          <th className="px-4 py-3 text-right">Ending Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.map((row) => (
                          <tr key={row.installment_no} className="border-b border-gray-200 hover:bg-[#FFF8E6]/40 last:border-0 transition-colors">
                            <td className="px-4 py-3.5 text-gray-700 font-medium">{row.installment_no}</td>
                            <td className="px-4 py-3.5 text-gray-900 font-medium">
                              {new Date(row.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="px-4 py-3.5 text-right text-gray-600">{formatCurrency(row.beginningBalance)}</td>
                            <td className="px-4 py-3.5 text-right text-gray-900 font-semibold">{formatCurrency(row.scheduledPayment)}</td>
                            <td className="px-4 py-3.5 text-right text-[#A47B06] font-medium">{formatCurrency(row.principalAmount)}</td>
                            <td className="px-4 py-3.5 text-right text-amber-800 font-medium">{formatCurrency(row.interest_amount)}</td>
                            <td className="px-4 py-3.5 text-right text-gray-600">{formatCurrency(row.endingBalance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>


            {((formData?.coBorrowers?.length ?? 0) > 0 || application?.co_borrower) && (
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-golden" />
                  Co-Maker / Co-Borrower
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {formData?.coBorrowers && formData.coBorrowers.length > 0 ? (
                    formData.coBorrowers.map((co, index) => (
                      <div key={index}>
                        <Label className="text-sm font-semibold">Co-Maker #{index + 1} Name</Label>
                        <div className="bg-white p-3 rounded border">
                          {co.first_name || co.last_name ? `${co.first_name} ${co.last_name}` : "-"}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div>
                      <Label className="text-sm font-semibold">Name</Label>
                      <div className="bg-white p-3 rounded border">
                        {application?.co_borrower?.full_name ?? "-"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {(formData?.collateral_type || application?.collateral) && (
              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <Home className="w-5 h-5 text-golden" />
                  Collateral
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {collateralFields.map((field) => (
                    <div key={field.label}>
                      <Label className="text-sm font-semibold">{field.label}</Label>
                      <div className="bg-white p-3 rounded border">
                        {field.value}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Uploaded Collateral Documents</Label>
                  <div className="rounded border bg-white p-3">
                    {collateralDocuments.length > 0 ? (
                      <div className="space-y-2">
                        {collateralDocuments.map((documentName, index) => (
                          <p key={`${documentName}-${index}`} className="text-sm text-gray-700">
                            {documentName}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No collateral documents selected.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between gap-4">
            <Button type="button" onClick={onPrev} variant="outline" className="px-8">
              Previous
            </Button>
            <Button type="submit" className="bg-golden hover:bg-golden-dark text-black px-8">
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Confirmation;
