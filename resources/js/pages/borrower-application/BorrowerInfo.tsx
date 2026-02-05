import { Button } from "@/components/ui/button";
import StepIndicator from "./StepIndicator";
import { User } from "lucide-react";
import { Link, useForm} from "@inertiajs/react";
import { FormField, SectionHeader, inputClass } from "@/components/FormField";
import { useEffect } from "react";
import type { SharedFormData } from "./sharedFormData";
import { on } from "events";

interface BorrowerInfoProps {
  onNext: () => void;
  formData: SharedFormData;
  setFormData: React.Dispatch<React.SetStateAction<SharedFormData>>;
}

const BorrowerInfo = ({ onNext, formData: parentData, setFormData }: BorrowerInfoProps) => {
 const { data, setData, errors } = useForm({
    borrower_first_name: '',
    borrower_last_name: '',
    gender: '',
    date_of_birth: '',
    marital_status: '',
    contact_no: '',
    landline_number: '',
    // email: '', we can remove email, as we can reference user -> email
    dependent_child: '',  

    spouse_first_name: '',
    spouse_last_name: '',
    spouse_agency_address: '',
    spouse_occupation: '',
    spouse_position: '',
    spouse_mobile_number: '',

    permanent_address: '',
    city: '',
    home_ownership: '',

    employment_status: '',
    occupation: '',
    position: '',
    monthly_income: '',
    income_source: '',
    agency_address: '',

    valid_id_type: '',
    valid_id_number: '',
    files: null as FileList | null,
  });

  // Initialize form from parent if available
  useEffect(() => {
    if (parentData) {
      // seed only keys that exist in the form definition
      const keys = Object.keys(data);
      const initial: Record<string, any> = {};
      keys.forEach((k) => {
        if (parentData[k] !== undefined && parentData[k] !== null) {
          initial[k] = parentData[k];
        }
      });
      if (Object.keys(initial).length) setData((d: any) => ({ ...d, ...initial }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // keep parent in sync whenever local form `data` changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, [data, setFormData]);

  const handleSubmit = () => {
    onNext();
  };

  // Options for select fields
  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  const maritalStatusOptions = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
    { value: "Separated", label: "Separated" },
    { value: "Widowed", label: "Widowed" },
  ];

  const homeOwnershipOptions = [
    { value: "Owned", label: "Owned" },
    { value: "Rented", label: "Rented" },
    { value: "Mortgage", label: "Mortgage" },
  ];

  return (
    <section
      className="py-8 md:py-16 px-6 md:px-12"
      style={{ backgroundColor: "#F7F5F3" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <User className="w-6 h-6 text-golden" />
            <h1 className="text-2xl md:text-3xl font-bold">Borrower Application</h1>
          </div>
        </div>

        {/* Step Indicator */}
        <StepIndicator
          currentStep={1}
          steps={[
            "Borrower",
            "Co-Borrower",
            "Collateral",
            "Loan Details",
            "Payment",
          ]}
        />

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="bg-white rounded-lg p-6 md:p-8 space-y-8"
        >
          {/* Section 1: Borrower Profile */}
          <fieldset>
            <SectionHeader title="Borrower Profile" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="First Name"
                name="borrower_first_name"
                value={data.borrower_first_name}
                onChange={(val) => setData("borrower_first_name", val)}
                placeholder="Enter first name"
                error={errors.borrower_first_name}
                required
              />

              <FormField
                label="Last Name"
                name="borrower_last_name"
                value={data.borrower_last_name}
                onChange={(val) => setData("borrower_last_name", val)}
                placeholder="Enter last name"
                error={errors.borrower_last_name}
                required
              />

              <FormField
                label="Gender"
                name="gender"
                type="select"
                value={data.gender}
                onChange={(val) => setData("gender", val)}
                error={errors.gender}
                options={genderOptions}
                required
              />

              <FormField
                label="Date of Birth"
                name="date_of_birth"
                type="date"
                value={data.date_of_birth}
                onChange={(val) => setData("date_of_birth", val)}
                error={errors.date_of_birth}
                required
              />

              <FormField
                label="Mobile Number"
                name="contact_no"
                value={data.contact_no}
                onChange={(val) => setData("contact_no", val)}
                placeholder="09XXXXXXXXX"
                pattern="09\d{9}"
                maxLength={11}
                error={errors.contact_no}
                required
              />

              <FormField
                label="Landline Number"
                name="landline_number"
                value={data.landline_number}
                onChange={(val) => setData("landline_number", val)}
                placeholder="02-XXXXXXX (optional)"
                pattern="0\d{1,2}-\d{7,8}"
                error={errors.landline_number}
              />

              {/* <FormField
                label="Email"
                name="email"
                type="email"
                value={data.email}
                onChange={(val) => setData("email", val)}
                placeholder="Enter email"
                error={errors.email}
                required
              /> */}

              <FormField
                label="Marital Status"
                name="marital_status"
                type="select"
                value={data.marital_status}
                onChange={(val) => setData("marital_status", val)}
                error={errors.marital_status}
                options={maritalStatusOptions}
                required
              />

              <FormField
                label="Number of Dependents"
                name="dependent_child"
                type="number"
                value={data.dependent_child}
                onChange={(val) => setData("dependent_child", val)}
                placeholder="0"
                error={errors.dependent_child}
              />
            </div>
          </fieldset>

          {/* Section 2: Spouse Information (Conditional) */}
          {data.marital_status === "Married" && (
            <fieldset>
              <SectionHeader title="Spouse Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Spouse First Name"
                  name="spouse_first_name"
                  value={data.spouse_first_name}
                  onChange={(val) => setData("spouse_first_name", val)}
                  placeholder="Enter spouse first name"
                  error={errors.spouse_first_name}
                  required
                />

                <FormField
                  label="Spouse Last Name"
                  name="spouse_last_name"
                  value={data.spouse_last_name}
                  onChange={(val) => setData("spouse_last_name", val)}
                  placeholder="Enter spouse last name"
                  error={errors.spouse_last_name}
                  required
                />

                <FormField
                  label="Spouse Mobile Number"
                  name="spouse_mobile_number"
                  value={data.spouse_mobile_number}
                  onChange={(val) => setData("spouse_mobile_number", val)}
                  placeholder="09XXXXXXXXX"
                  error={errors.spouse_mobile_number}
                />

                <FormField
                  label="Spouse Occupation"
                  name="spouse_occupation"
                  value={data.spouse_occupation}
                  onChange={(val) => setData("spouse_occupation", val)}
                  placeholder="Enter spouse occupation"
                  error={errors.spouse_occupation}
                />

                <FormField
                  label="Spouse Position"
                  name="spouse_position"
                  value={data.spouse_position}
                  onChange={(val) => setData("spouse_position", val)}
                  placeholder="Enter spouse position"
                  error={errors.spouse_position}
                />

                <FormField
                  label="Spouse Agency Address"
                  name="spouse_agency_address"
                  value={data.spouse_agency_address}
                  onChange={(val) => setData("spouse_agency_address", val)}
                  placeholder="Enter spouse agency address"
                  error={errors.spouse_agency_address}
                />
              </div>
            </fieldset>
          )}

          {/* Section 3: Address Information */}
          <fieldset>
            <SectionHeader title="Borrower Address" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Permanent Address"
                name="permanent_address"
                value={data.permanent_address}
                onChange={(val) => setData("permanent_address", val)}
                placeholder="Enter permanent address"
                error={errors.permanent_address}
                required
              />

              <FormField
                label="City"
                name="city"
                value={data.city}
                onChange={(val) => setData("city", val)}
                placeholder="Enter city"
                error={errors.city}
                required
              />

              <FormField
                label="Home Ownership"
                name="home_ownership"
                type="select"
                value={data.home_ownership}
                onChange={(val) => setData("home_ownership", val)}
                error={errors.home_ownership}
                options={homeOwnershipOptions}
                required
              />
            </div>
          </fieldset>

          <fieldset>
            <SectionHeader title="Employment Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Employment Status</label>
                <select
                  value={data.employment_status}
                  onChange={(e) => setData('employment_status', e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">Select Employment Status</option>
                  <option value="Employed">Employed</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
                {errors.employment_status && <p className="text-red-500 text-xs mt-1">{errors.employment_status}</p>}
              </div>
        
              <div>
                <label className="block text-sm font-medium mb-1">Income Source</label>
                <select
                  value={data.income_source}
                  onChange={(e) => setData('income_source', e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">Select Income Source</option>
                  <option value="Salary">Salary</option>
                  <option value="Business">Business</option>
                  <option value="Investments">Investments</option>
                  <option value="Property">Property</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Pension">Pension</option>
                  <option value="Remittance">Remittance</option>
                  <option value="Allowance">Allowance</option>
                  <option value="Other">Other</option>
                </select>
                {errors.income_source && (
                  <p className="text-red-500 text-xs mt-1">{errors.income_source}</p>
                )}
              </div>
        
              <div>
                <label className="block text-sm font-medium mb-1">Occupation</label>
                <input
                  type="text"
                  value={data.occupation}
                  onChange={(e) => setData('occupation', e.target.value)}
                  placeholder="Enter occupation"
                  className={inputClass}
                />
                {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
              </div>
        
              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <input
                  type="text"
                  value={data.position}
                  onChange={(e) => setData('position', e.target.value)}
                  placeholder="Enter position"
                  className={inputClass}
                />
                {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
              </div>
        
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Income</label>
                <input
                  type="number"
                  value={data.monthly_income}
                  onChange={(e) => setData('monthly_income', e.target.value)}
                  placeholder="Enter monthly income"
                  className={inputClass}
                />
                {errors.monthly_income && <p className="text-red-500 text-xs mt-1">{errors.monthly_income}</p>}
              </div>
        
              <div>
                <label className="block text-sm font-medium mb-1">Agency Address</label>
                <input
                  type="text"
                  value={data.agency_address}
                  onChange={(e) => setData('agency_address', e.target.value)}
                  placeholder="Enter agency address"
                  className={inputClass}
                />
                {errors.agency_address && <p className="text-red-500 text-xs mt-1">{errors.agency_address}</p>}
              </div>
            </div>
          </fieldset>

          <fieldset>
            <SectionHeader title="Valid ID" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <label className="block text-sm font-medium mb-1">Valid ID Type</label>
                <select
                  value={data.valid_id_type}
                  onChange={(e) => setData('valid_id_type', e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">Select ID Type</option>
                  <option value="Philippine Passport">Philippine Passport</option>
                  <option value="Driver's License">Driver's License</option>
                  <option value="SSS ID">SSS ID</option>
                  <option value="GSIS ID">GSIS ID</option>
                  <option value="PhilHealth ID">PhilHealth ID</option>
                  <option value="PRC License">PRC License</option>
                  <option value="Voter's ID">Voter's ID</option>
                  <option value="Barangay ID">Barangay ID</option>
                  <option value="Unified Multi-Purpose ID (UMID)">Unified Multi-Purpose ID (UMID)</option>
                  <option value="Other">Other</option>
                </select>
                {errors.valid_id_type && (
                  <p className="text-red-500 text-xs mt-1">{errors.valid_id_type}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Valid ID Number</label>
                <input
                  type="text"
                  value={data.valid_id_number}
                  onChange={(e) => setData('valid_id_number', e.target.value)}
                  placeholder="Enter ID number"
                  className={inputClass}
                />
                {errors.valid_id_number && <p className="text-red-500 text-xs mt-1">{errors.valid_id_number}</p>}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Upload Valid ID File(s)</label>
                <input
                  type="file"
                  multiple
                  className={inputClass}
                  onChange={(e) => setData('files', e.target.files)}
                />
                {errors.files && <p className="text-red-500 text-xs mt-1">{errors.files}</p>}
              </div>
            </div>

          </fieldset>


          {/* Form Actions */}
          <div className="flex justify-between gap-4 pt-6 border-t">
            <Link href="/">
              <Button variant="outline" className="px-8">
                Back to Home
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-golden hover:bg-golden-dark text-black px-8"
            >
              Next
            </Button>
          </div>
          
        </form>
      </div>
    </section>
  );
};

export default BorrowerInfo;
