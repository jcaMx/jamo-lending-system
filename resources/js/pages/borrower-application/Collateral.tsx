

import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { FormField, SectionHeader } from "@/components/FormField";
import type { SharedFormData } from "./sharedFormData";
import { User, Users, Home, DollarSign, CreditCard } from "lucide-react";
import StepIndicator from "./StepIndicator";

interface CollateralProps {
  onNext: () => void;
  onPrev: () => void;
  formData: SharedFormData;
  setFormData: React.Dispatch<React.SetStateAction<SharedFormData>>;
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
  { value: "Mitsubishi", label: "Mitsubishi" }
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
  { value: "Standard Chartered", label: "Standard Chartered" }
];



const sanitize = {
  alphaNum: (v: string) => v.replace(/[^a-zA-Z0-9]/g, ""),
  number: (v: string) => v.replace(/\D/g, ""),
  trim: (v: string) => v.trim(),
};

const Collateral = ({ onNext, onPrev, formData, setFormData }: CollateralProps) => {
  const initial = formData ?? {};
  const { data, setData } = useForm({
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
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, [data, setFormData]);

  const submit = () => {
    onNext();
  };

  return (
    <section className="bg-[#F7F5F3] py-8 px-6 w-full">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg space-y-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard className="w-6 h-6 text-golden" />
            <h1 className="text-2xl md:text-3xl font-bold">Collateral Information</h1>
          </div>
        </div>

        <StepIndicator
          currentStep={3}
          steps={[
            "Loan Details",
            "Co-Borrower",
            "Collateral",
            "Payment",
          ]}
        />

        <FormField
          label="Collateral Type"
          name="collateral_type"
          type="select"
          value={data.collateral_type}
          onChange={(v) => setData("collateral_type", v)}
          options={collateralTypeOptions}
          required
        />

        {/* VEHICLE */}
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
            />

            <datalist id="vehicle-makes">
              {makeTypeOptions.map((opt) => (
                <option key={opt.value} value={opt.label} />
              ))}
            </datalist>

            <FormField label="Fuel Type" name="fuel" type="select"
              value={data.fuel}
              onChange={(v) => setData("fuel", v)}
              options={fuelOptions} />

            <FormField label="Vehicle Type" name="vehicle_type" type="select"
              value={data.vehicle_type} onChange={(v) => setData("vehicle_type", v)}
              options={vehicleTypeOptions} />

            <FormField label="Transmission Type" name="transmission_type"
              type="select" value={data.transmission_type}
              onChange={(v) => setData("transmission_type", v)}
              options={transmissionOptions} />

            <FormField label="Plate Number" name="plate_no"
              value={data.plate_no}
              onChange={(v) => setData("plate_no", sanitize.alphaNum(v))} />

            <FormField label="Engine Number" name="engine_no"
              value={data.engine_no}
              onChange={(v) => setData("engine_no", sanitize.alphaNum(v))} />

            <FormField label="Year Model" name="year_model"
              value={data.year_model}
              onChange={(v) => setData("year_model", sanitize.number(v))}
              maxLength={4} />

            <FormField label="Series" name="series"
              value={data.series}
              onChange={(v) => setData("series", sanitize.trim(v))} />

            
          </>
        )}

        {/* LAND */}
        {data.collateral_type === "land" && (
          <>
            <FormField
              label="Certificate of Title No."
              name="certificate_of_title_no"
              value={data.certificate_of_title_no}
              onChange={(v) =>
                setData("certificate_of_title_no", sanitize.alphaNum(v))
              }
            />

            <FormField
              label="Location"
              name="location"
              value={data.location}
              onChange={(v) => setData("location", sanitize.trim(v))}
            />

            <FormField
              label="Description"
              name="description"
              value={data.description}
              onChange={(v) => setData("description", sanitize.trim(v))}
            />

            <FormField
              label="Area (sqm)"
              name="area"
              value={data.area}
              onChange={(v) => setData("area", sanitize.number(v))}
            />
          </>
        )}

        {/* ATM */}
        {data.collateral_type === "atm" && (
          <>
            <FormField
              label="Bank Name"
              name="bank_name"
              value={data.bank_name}
              onChange={(v) => setData("bank_name", sanitize.trim(v))}
              list="bank-names"
              placeholder="Select or type bank name"
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
              onChange={(v) =>
                setData("account_no", sanitize.number(v))
              }
            />

            <FormField
              label="Card Last 4 Digits"
              name="cardno_4digits"
              value={data.cardno_4digits}
              onChange={(v) =>
                setData("cardno_4digits", sanitize.number(v).slice(0, 4))
              }
              maxLength={4}
            />
          </>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Ownership Proof
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.png"
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null;
              setData('ownership_proof', file);
              setFormData((prev) => ({ ...prev, ownership_proof: file }));
            }}
            className="mt-1 block w-full text-sm text-gray-700 bg-gray-50 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <p className="text-xs text-gray-400 mt-1">
            Accepted formats: PDF, DOC, DOCX, JPG, PNG
          </p>
        </div>


        

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
