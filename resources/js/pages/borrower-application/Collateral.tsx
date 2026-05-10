import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "@inertiajs/react";
import { FormField } from "@/components/FormField";
import type { LoanProductDocumentRequirement, SharedFormData } from "./sharedFormData";
import { CreditCard } from "lucide-react";
import StepIndicator from "./StepIndicator";
import type {
  BorrowerDocumentTypeOption,
  BorrowerDocumentUploadItem,
} from "@/pages/borrowers/components/RenderDocumentUploader";

interface CollateralProps {
  onNext: () => void;
  onPrev: () => void;
  formData: SharedFormData;
  setFormData: React.Dispatch<React.SetStateAction<SharedFormData>>;
  documentTypesByCategory?: Record<string, BorrowerDocumentTypeOption[]>;
  loanProductRequirements?: LoanProductDocumentRequirement[];
  stepLabels?: string[];
  stepIndex?: number;
  required?: boolean;
}

const collateralTypeOptions = [
  { value: "vehicle", label: "Vehicle" },
  { value: "land", label: "Land" },
  { value: "atm", label: "ATM / Bank" },
];

const vehicleTypeOptions = [
  { value: "Car", label: "Car" },
  { value: "Motorcycle", label: "Motorcycle" },
  { value: "Truck", label: "Truck" },
];

const makeTypeOptions = [
  { value: "Toyota", label: "Toyota" },
  { value: "Nissan", label: "Nissan" },
  { value: "Honda", label: "Honda" },
  { value: "Ford", label: "Ford" },
  { value: "Chevrolet", label: "Chevrolet" },
  { value: "BMW", label: "BMW" },
  { value: "Mercedes-Benz", label: "Mercedes-Benz" },
  { value: "Audi", label: "Audi" },
  { value: "Volkswagen", label: "Volkswagen" },
  { value: "Hyundai", label: "Hyundai" },
  { value: "Kia", label: "Kia" },
  { value: "Mazda", label: "Mazda" },
  { value: "Subaru", label: "Subaru" },
  { value: "Jeep", label: "Jeep" },
  { value: "Dodge", label: "Dodge" },
  { value: "Tesla", label: "Tesla" },
  { value: "Volvo", label: "Volvo" },
  { value: "Jaguar", label: "Jaguar" },
  { value: "Land Rover", label: "Land Rover" },
  { value: "Mitsubishi", label: "Mitsubishi" },
];

const transmissionOptions = [
  { value: "Manual", label: "Manual" },
  { value: "Automatic", label: "Automatic" },
];

const fuelOptions = [
  { value: "Gasoline", label: "Gasoline" },
  { value: "Diesel", label: "Diesel" },
  { value: "Electric", label: "Electric" },
];

const bankOptions = [
  { value: "BDO", label: "BDO" },
  { value: "BPI", label: "BPI" },
  { value: "Security Bank", label: "Security Bank" },
  { value: "Metrobank", label: "Metrobank" },
  { value: "Land Bank", label: "Land Bank" },
  { value: "PNB", label: "PNB" },
  { value: "UnionBank", label: "UnionBank" },
  { value: "EastWest Bank", label: "EastWest Bank" },
  { value: "China Bank", label: "China Bank" },
  { value: "RCBC", label: "RCBC" },
  { value: "UCPB", label: "UCPB" },
  { value: "DBP", label: "DBP" },
  { value: "Maybank", label: "Maybank" },
  { value: "HSBC", label: "HSBC" },
  { value: "Standard Chartered", label: "Standard Chartered" },
];

const sanitize = {
  alphaNum: (v: string) => v.replace(/[^a-zA-Z0-9]/g, ""),
  number: (v: string) => v.replace(/\D/g, ""),
  trim: (v: string) => v.trim(),
};

const inputClass =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FABF24] focus:border-transparent";

type DisplayCollateralRow = BorrowerDocumentUploadItem & {
  slot_key: string;
  source_index: number | null;
};

const getEmptyCollateralState = () => ({
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
  lot_no: "",
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
    collateral: [] as BorrowerDocumentUploadItem[],
  },
});

const Collateral = ({
  onNext,
  onPrev,
  formData,
  setFormData,
  documentTypesByCategory = {},
  loanProductRequirements = [],
  stepLabels,
  stepIndex,
  required = false,
}: CollateralProps) => {
  const initial = formData ?? {};
  const emptyCollateralState = getEmptyCollateralState();
  const { data, setData } = useForm({
    ...emptyCollateralState,
    collateral_type: initial.collateral_type ?? "",
    make: initial.make ?? "",
    vehicle_type: initial.vehicle_type ?? "",
    transmission_type: initial.transmission_type ?? "",
    plate_no: initial.plate_no ?? "",
    engine_no: initial.engine_no ?? "",
    year_model: initial.year_model ?? "",
    series: initial.series ?? "",
    fuel: initial.fuel ?? "",
    certificate_of_title_no: initial.certificate_of_title_no ?? "",
    lot_no: initial.lot_no ?? "",
    location: initial.location ?? "",
    description: initial.description ?? "",
    area: initial.area ?? "",
    bank_name: initial.bank_name ?? "",
    account_no: initial.account_no ?? "",
    cardno_4digits: initial.cardno_4digits ?? "",
    estimated_value: initial.estimated_value ?? "",
    appraisal_date: initial.appraisal_date ?? "",
    appraised_by: initial.appraised_by ?? "",
    ownership_proof: initial.ownership_proof ?? null,
    documents: {
      collateral: initial.documents?.collateral?.length ? initial.documents.collateral : [],
    },
  });
  const [stepError, setStepError] = useState("");

  const defaultStepLabels = ["Loan Details", "Co-Borrower", "Collateral", "Payment"];
  const indicatorLabels = stepLabels && stepLabels.length > 0 ? stepLabels : defaultStepLabels;
  const indicatorIndex = stepIndex ?? 3;

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      ...data,
      documents: {
        ...(prev.documents ?? { collateral: [], loan_product: [] }),
        ...(data.documents ?? { collateral: [] }),
      },
    }));
  }, [data, setFormData]);

  const areCollateralRowsEqual = (
    left: BorrowerDocumentUploadItem[],
    right: BorrowerDocumentUploadItem[],
  ) =>
    left.length === right.length &&
    left.every((row, index) => {
      const other = right[index];
      return (
        String(row.document_type_id) === String(other.document_type_id) &&
        row.file === other.file
      );
    });

  const hasMeaningfulCollateralRow = (row: BorrowerDocumentUploadItem) =>
    String(row.document_type_id ?? "").trim() !== "" || row.file !== null;

  const requiredCollateralRequirements = useMemo(() => {
    const collateralType = String(data.collateral_type || "").toLowerCase();

    if (!collateralType) return [];

    const requirementRows = loanProductRequirements.filter(
      (requirement) =>
        requirement.requirement_type === "document_type" &&
        requirement.subject_type === "collateral" &&
        requirement.is_required &&
        String(requirement.collateral_type || "").toLowerCase() === collateralType &&
        requirement.document_type !== null,
    );

    if (requirementRows.length > 0) {
      return requirementRows;
    }

    const fallbackCategoryMap: Record<string, string[]> = {
      vehicle: ["collateral_vehicle", "collateral_general"],
      land: ["collateral_land", "collateral_general"],
      atm: ["collateral_general"],
    };

    const fallbackCategories = fallbackCategoryMap[collateralType] ?? [];

    return fallbackCategories.flatMap((category, index) =>
      (documentTypesByCategory[category] ?? []).map((documentType) => ({
        id: Number(`${index}${documentType.id}`),
        requirement_type: "document_type" as const,
        document_type_id: documentType.id,
        document_category: documentType.category,
        subject_type: "collateral",
        collateral_type: collateralType,
        is_required: true,
        min_count: 1,
        max_count: 1,
        sort_order: index,
        notes: null,
        document_type: {
          id: documentType.id,
          code: documentType.code ?? "",
          name: documentType.name,
          category: documentType.category,
        },
      })),
    );
  }, [data.collateral_type, documentTypesByCategory, loanProductRequirements]);

  const collateralRowsByType = useMemo(() => {
    const grouped = new Map<string, { row: BorrowerDocumentUploadItem; index: number }>();

    (data.documents.collateral ?? []).forEach((row, index) => {
      const key = String(row.document_type_id ?? "");
      if (!key) return;
      grouped.set(key, { row, index });
    });

    return grouped;
  }, [data.documents.collateral]);

  const displayCollateralRows = useMemo<DisplayCollateralRow[]>(
    () =>
      requiredCollateralRequirements
        .filter((requirement) => requirement.document_type_id !== null)
        .map((requirement) => {
          const documentTypeId = String(requirement.document_type_id);
          const existing = collateralRowsByType.get(documentTypeId);

          if (existing) {
            return {
              ...existing.row,
              slot_key: `existing-${existing.index}`,
              source_index: existing.index,
            };
          }

          return {
            document_type_id: documentTypeId,
            file: null,
            slot_key: `empty-${documentTypeId}`,
            source_index: null,
          };
        }),
    [collateralRowsByType, requiredCollateralRequirements],
  );

  const updateRequiredDocument = (documentTypeId: string, sourceIndex: number | null, file: File | null) => {
    const currentRows = data.documents.collateral ?? [];
    const nextRows = [...currentRows];

    if (sourceIndex !== null && sourceIndex >= 0 && sourceIndex < nextRows.length) {
      const updatedRow = {
        ...nextRows[sourceIndex],
        document_type_id: documentTypeId,
        file,
      };

      if (hasMeaningfulCollateralRow(updatedRow)) {
        nextRows[sourceIndex] = updatedRow;
      } else {
        nextRows.splice(sourceIndex, 1);
      }
    } else {
      const newRow = { document_type_id: documentTypeId, file };
      if (!hasMeaningfulCollateralRow(newRow)) {
        return;
      }
      nextRows.push(newRow);
    }

    if (areCollateralRowsEqual(currentRows, nextRows)) {
      return;
    }

    setData("documents", {
      ...data.documents,
      collateral: nextRows,
    });
  };

  const hasMeaningfulCollateralPayload = () => {
    const detailValues = [
      data.make,
      data.vehicle_type,
      data.transmission_type,
      data.plate_no,
      data.engine_no,
      data.year_model,
      data.series,
      data.fuel,
      data.certificate_of_title_no,
      data.lot_no,
      data.location,
      data.description,
      data.area,
      data.bank_name,
      data.account_no,
      data.cardno_4digits,
      data.estimated_value,
      data.appraisal_date,
      data.appraised_by,
    ];

    const hasDetailValues = detailValues.some((value) => String(value ?? "").trim() !== "");
    const hasDocumentFiles = data.documents.collateral.some((row) => row.file !== null);

    return hasDetailValues || hasDocumentFiles || data.ownership_proof !== null;
  };

  const clearCollateralState = () => {
    setData(() => emptyCollateralState);
    setFormData((prev) => ({
      ...prev,
      ...emptyCollateralState,
      documents: {
        ...(prev.documents ?? {}),
        collateral: [],
      },
    }));
  };

  const submit = () => {
    if (!data.collateral_type) {
      if (required) {
        setStepError("Collateral is required for this loan product.");
        return;
      }
      setStepError("");
      onNext();
      return;
    }

    if (!required && !hasMeaningfulCollateralPayload()) {
      clearCollateralState();
      setStepError("");
      onNext();
      return;
    }

    if (
      data.collateral_type === "vehicle" &&
      (!data.make ||
        !data.fuel ||
        !data.vehicle_type ||
        !data.transmission_type ||
        !data.plate_no ||
        !data.engine_no ||
        !data.year_model ||
        !data.series)
    ) {
      setStepError("Please complete all required vehicle collateral fields.");
      return;
    }

    if (
      data.collateral_type === "land" &&
      (!data.certificate_of_title_no || !data.location || !data.description || !data.area)
    ) {
      setStepError("Please complete all required land collateral fields.");
      return;
    }

    if (
      data.collateral_type === "atm" &&
      (!data.bank_name || !data.account_no || !data.cardno_4digits)
    ) {
      setStepError("Please complete all required ATM collateral fields.");
      return;
    }

    const missingRequiredFiles = requiredCollateralRequirements
      .filter((requirement) => requirement.document_type_id !== null)
      .some((requirement) => {
        const documentTypeId = String(requirement.document_type_id);
        const row = (data.documents.collateral ?? []).find(
          (item) => String(item.document_type_id) === documentTypeId,
        );

        return !row?.file;
      });

    if (missingRequiredFiles) {
      setStepError("Please upload all required collateral documents.");
      return;
    }

    setStepError("");
    onNext();
  };

  return (
    <section className="py-8 px-6 w-full">
      <div className="max-w-4xl mx-auto bg-[#F7F5F3] p-6 rounded-lg space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard className="w-6 h-6 text-golden" />
            <h1 className="text-2xl md:text-3xl font-bold">Collateral Information</h1>
          </div>
        </div>

        <StepIndicator currentStep={indicatorIndex} steps={indicatorLabels} />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="bg-white rounded-lg shadow-sm p-6 md:p-8 space-y-6"
        >
          {stepError && (
            <p className="text-sm text-red-600">{stepError}</p>
          )}
          {/* Requirement hint for optional vs required behavior */}
          <p className={`text-sm ${required ? "text-red-600" : "text-green-700"}`}>
            {required ? "Collateral required for this loan product." : "Optional — you may skip this step."}
          </p>
           <FormField
          label="Collateral Type"
          name="collateral_type"
          type="select"
          value={data.collateral_type}
          onChange={(v) => setData("collateral_type", v)}
          options={collateralTypeOptions}
          required
        />

        {data.collateral_type === "vehicle" && (
          <>
            <FormField
              label="Make"
              name="make"
              value={data.make}
              onChange={(v) => setData("make", sanitize.trim(v))}
              type="text"
              list="vehicle-makes"
              placeholder="Select or type vehicle make"
              required
            />
            <datalist id="vehicle-makes">
              {makeTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.label} />
              ))}
            </datalist>

            <FormField
              label="Fuel Type"
              name="fuel"
              type="select"
              value={data.fuel}
              onChange={(v) => setData("fuel", v)}
              options={fuelOptions}
              required
            />
            <FormField
              label="Vehicle Type"
              name="vehicle_type"
              type="select"
              value={data.vehicle_type}
              onChange={(v) => setData("vehicle_type", v)}
              options={vehicleTypeOptions}
              required
            />
            <FormField
              label="Transmission Type"
              name="transmission_type"
              type="select"
              value={data.transmission_type}
              onChange={(v) => setData("transmission_type", v)}
              options={transmissionOptions}
              required
            />
            <FormField
              label="Plate Number"
              name="plate_no"
              value={data.plate_no}
              onChange={(v) => setData("plate_no", sanitize.alphaNum(v))}
              required
            />
            <FormField
              label="Engine Number"
              name="engine_no"
              value={data.engine_no}
              onChange={(v) => setData("engine_no", sanitize.alphaNum(v))}
              required
            />
            <FormField
              label="Year Model"
              name="year_model"
              value={data.year_model}
              onChange={(v) => setData("year_model", sanitize.number(v))}
              maxLength={4}
              required
            />
            <FormField
              label="Series"
              name="series"
              value={data.series}
              onChange={(v) => setData("series", sanitize.trim(v))}
              required
            />
          </>
        )}

        {data.collateral_type === "land" && (
          <>
            <FormField
              label="Certificate of Title No."
              name="certificate_of_title_no"
              value={data.certificate_of_title_no}
              onChange={(v) => setData("certificate_of_title_no", sanitize.alphaNum(v))}
            />
            <FormField
              label="Lot No."
              name="lot_no"
              value={data.lot_no}
              onChange={(v) => setData("lot_no", sanitize.alphaNum(v))}
            />
            <FormField
              label="Location"
              name="location"
              value={data.location}
              onChange={(v) => setData("location", v)}
              required
            />
            <FormField
              label="Description"
              name="description"
              value={data.description}
              onChange={(v) => setData("description", v)}
              required
            />
            <FormField
              label="Area (sqm)"
              name="area"
              value={data.area}
              onChange={(v) => setData("area", sanitize.number(v))}
              required
            />
          </>
        )}

        {data.collateral_type === "atm" && (
          <>
            <FormField
              label="Bank Name"
              name="bank_name"
              value={data.bank_name}
              onChange={(v) => setData("bank_name", sanitize.trim(v))}
              list="bank-names"
              placeholder="Select or type bank name"
              required
            />
            <datalist id="bank-names">
              {bankOptions.map((opt) => (
                <option key={opt.value} value={opt.label} />
              ))}
            </datalist>

            <FormField
              label="Account Number"
              name="account_no"
              value={data.account_no}
              onChange={(v) => setData("account_no", sanitize.number(v))}
              required
            />
            <FormField
              label="Card Last 4 Digits"
              name="cardno_4digits"
              value={data.cardno_4digits}
              onChange={(v) => setData("cardno_4digits", sanitize.number(v).slice(0, 4))}
              maxLength={4}
              required
            />
          </>
        )}

        {data.collateral_type && (
          <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-4">
            <h3 className="font-semibold text-gray-700">Required Collateral Documents</h3>

            {!requiredCollateralRequirements.length && (
              <p className="text-sm text-amber-700">
                No required document type is configured for this collateral type.
              </p>
            )}

            {requiredCollateralRequirements.map((requirement, index) => {
              const documentType = requirement.document_type;
              if (!documentType || requirement.document_type_id === null) {
                return null;
              }

              const row = displayCollateralRows[index];

              return (
                <div key={requirement.id} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {documentType.name} <span className="text-red-600">*</span>
                  </label>
                  {requirement.notes && (
                    <p className="text-xs text-gray-500">{requirement.notes}</p>
                  )}
                  <input
                    type="file"
                    className={inputClass}
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    required
                    onChange={(e) =>
                      updateRequiredDocument(
                        String(requirement.document_type_id),
                        row?.source_index ?? null,
                        e.target.files?.[0] ?? null,
                      )
                    }
                  />
                  {row?.file && (
                    <p className="text-xs text-gray-600">Selected: {row.file.name}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}

          
        </form>

       

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrev}>
            Previous
          </Button>
          <Button className="bg-golden text-black" onClick={submit}>
            Next
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Collateral;
