import { useState, useEffect, useCallback, useMemo } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Trash2 } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { store } from '@/actions/App/Http/Controllers/LoanController';

// Constants
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Loans', href: '/loans' },
  { title: 'Add Loan', href: '/loans/add' },
];

const steps = ['Borrower', 'Loan Details', 'Collateral', 'Co-Borrowers', 'Review & Submit'];

// Types
interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value?: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: { value: string; label: string }[];
  list?: string;
  children?: React.ReactNode;
  required?: boolean;
}

// Reusable Components
const FieldError = ({ field, errors }: { field: string; errors: any }) =>
  errors[field] ? <p className="text-red-500 text-sm mt-1">{errors[field]}</p> : null;

const FormField = ({ label, name, type = 'text', value, onChange, options, list, children, required = false }: FormFieldProps) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {type === 'select' && options ? (
      <select name={name} value={value ?? ''} onChange={onChange} required={required} className="bg-[#F7F5F3] border-gray-300 rounded-md w-full border p-2">
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : children ? (
      children
    ) : (
      <input type={type} name={name} value={value ?? ''} onChange={onChange} required={required} className="bg-[#F7F5F3] border-gray-300 rounded-md w-full border p-2" {...(list ? { list } : {})} />
    )}
  </div>
);

const SectionContainer = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-6">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

type Borrower = {
  id: number;
  name: string;
};

type Props = {
  borrowers?: Borrower[];
};

// Main Component
export default function AddLoan({ borrowers: initialBorrowers = [] }: Props) {
  // Form Data
  const { data, setData, post, processing, errors } = useForm({
    // Borrower Information
    borrower_name: '',
    borrower_id: '' as string | number,
    // Loan Details
    loan_type: '',
    loan_amount: '',
    interest_type: '',
    interest_rate: '5',
    repayment_frequency: '',
    term: '',
    // Collateral
    collateral_type: 'vehicle',
    // Vehicle Collateral
    make: '',
    vehicle_type: '',
    transmission_type: '',
    plate_no: '',
    engine_no: '',
    year_model: '',
    series: '',
    fuel: '',
    // Land Collateral
    certificate_of_title_no: '',
    location: '',
    description: '',
    area: '',
    // ATM Collateral
    atm_type: '',
    bank_name: '',
    account_no: '',
    cardno_4digits: '',
    ownership_proof: null,
    coBorrowers: [] as Array<{ first_name: string; last_name: string; address: string; email: string; contact: string; birth_date: string; marital_status: string; occupation: string; net_pay: string }>,
  });


  

  // State
  const [coBorrowers, setCoBorrowers] = useState([
    { first_name: '', last_name: '', address: '', email: '', contact: '', birth_date: '', marital_status: '', occupation: '', net_pay: '' },
  ]);
  const [activeStep, setActiveStep] = useState(0);
  const [borrowerSearch, setBorrowerSearch] = useState('');
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
  const [borrowerError, setBorrowerError] = useState<string>('');

  // Filter borrowers based on search
  const filteredBorrowers = useMemo(() => {
    if (!borrowerSearch.trim()) return [];
    return initialBorrowers.filter((b) =>
      b.name.toLowerCase().includes(borrowerSearch.toLowerCase())
    );
  }, [borrowerSearch, initialBorrowers]);

  // Handle borrower selection
  const handleSelectBorrower = (borrower: Borrower) => {
    setSelectedBorrower(borrower);
    setBorrowerSearch(borrower.name);
    setData('borrower_name', borrower.name);
    setData('borrower_id', borrower.id);
    setBorrowerError('');
  };

  // Check if borrower has existing loan
  const checkExistingLoan = useCallback(async (borrowerId: number) => {
    try {
      const response = await fetch(`/borrowers/${borrowerId}/loans`);
      const result = await response.json();
      if (result.hasActiveLoan) {
        return true;
      }
      return false;
    } catch {
      return false;
      }
  }, []);

  // Event Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (e.target instanceof HTMLInputElement && e.target.files) {
      setData(name as any, e.target.files[0]);
    } else {
      setData(name as any, value);
    }
  };

  const handleCoBorrowerChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updated = [...coBorrowers];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    setCoBorrowers(updated);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Filter out empty co-borrowers before submitting
    // Only include co-borrowers with first_name and last_name (required by backend validation)
    const validCoBorrowers = coBorrowers.filter(
      (co) => co.first_name.trim() !== '' && co.last_name.trim() !== ''
    );

    // Transform data to match backend expectations - ensure borrower_id is a number
    const borrowerIdNum = typeof data.borrower_id === 'string' && data.borrower_id 
      ? parseInt(data.borrower_id, 10) 
      : (typeof data.borrower_id === 'number' ? data.borrower_id : 0);
    
    const loanAmountNum = typeof data.loan_amount === 'string' && data.loan_amount 
      ? parseFloat(data.loan_amount) 
      : (typeof data.loan_amount === 'number' ? data.loan_amount : 0);
    
    const interestRateNum = typeof data.interest_rate === 'string' && data.interest_rate 
      ? parseFloat(data.interest_rate) 
      : (typeof data.interest_rate === 'number' ? data.interest_rate : 0);
    
    const termNum = typeof data.term === 'string' && data.term 
      ? parseInt(data.term, 10) 
      : (typeof data.term === 'number' ? data.term : 0);

    // Update form data with transformed values
    setData('borrower_id', borrowerIdNum as any);
    setData('loan_amount', loanAmountNum as any);
    setData('interest_rate', interestRateNum as any);
    setData('term', termNum as any);
    setData('coBorrowers', validCoBorrowers.length > 0 ? validCoBorrowers : []);

    // Submit after React batches the state updates
    setTimeout(() => {
      post(store.url(), { 
        preserveScroll: true,
        onError: (errors) => {
          console.error('Form submission errors:', errors);
        },
        onSuccess: () => {
          console.log('Form submitted successfully');
        }
      });
    }, 50);
  };

  // Co-Borrower Management
  const addCoBorrower = () =>
    setCoBorrowers([...coBorrowers, { first_name: '', last_name: '', address: '', email: '', contact: '', birth_date: '', marital_status: '', occupation: '', net_pay: '' }]);

  const removeCoBorrower = (index: number) => setCoBorrowers(coBorrowers.filter((_, i) => i !== index));

  // Step Validation
  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!(selectedBorrower && data.borrower_id && data.borrower_name.trim());
      case 1:
        return !!(
          data.loan_type &&
          data.loan_amount &&
          data.interest_type &&
          data.interest_rate &&
          data.repayment_frequency &&
          data.term
        );
      case 2:
        if (!data.collateral_type) return false;
        if (data.collateral_type === 'vehicle') {
          return !!(data.make && data.vehicle_type && data.transmission_type);
        }
        if (data.collateral_type === 'land') {
          return !!(data.certificate_of_title_no && data.location);
        }
        if (data.collateral_type === 'atm') {
          return !!(data.bank_name && data.account_no && data.cardno_4digits);
        }
        return false;
      case 3:
        // Co-borrowers are optional, but if any exist, first_name and last_name are required
        return coBorrowers.every((co) => {
          const hasName = co.first_name.trim() || co.last_name.trim();
          return !hasName || (co.first_name.trim() && co.last_name.trim());
        });
      case 4:
        return true; // Review step has no inputs
      default:
        return false;
    }
  };

  // Step Navigation
  const nextStep = async () => {
    // Validate borrower on step 0 before proceeding
    if (activeStep === 0) {
      if (!selectedBorrower || !data.borrower_id) {
        setBorrowerError('Please select a borrower from the list.');
        return;
      }
      // Check if borrower has existing loan
      const hasLoan = await checkExistingLoan(selectedBorrower.id);
      if (hasLoan) {
        alert('This borrower already has an active loan. A borrower cannot reloan if they have an existing unpaid loan.');
        return;
      }
    }
    if (!isStepValid(activeStep)) {
      return;
    }
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  // Helper Functions
  const toCapitalCase = (str: string) =>
    str
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

  // Step Rendering
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <SectionContainer title="Borrower Information">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Borrower Name
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={borrowerSearch}
                  onChange={(e) => {
                    setBorrowerSearch(e.target.value);
                    if (!e.target.value) {
                      setSelectedBorrower(null);
                      setData('borrower_id', '');
                      setData('borrower_name', '');
                    }
                  }}
                  placeholder="Search borrower..."
                  className="bg-[#F7F5F3] border-gray-300 rounded-md w-full border p-2"
                />
                {borrowerSearch.length > 0 && filteredBorrowers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {filteredBorrowers.map((b) => (
                      <div
                        key={b.id}
                        onClick={() => handleSelectBorrower(b)}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        {b.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {selectedBorrower && (
                <p className="text-green-500 text-sm mt-1">✓ Borrower selected (ID: {selectedBorrower.id})</p>
              )}
              {borrowerError && <p className="text-red-500 text-sm mt-1">{borrowerError}</p>}
              <FieldError field="borrower_name" errors={errors} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Borrower ID
                <span className="text-red-500 ml-1">*</span>
              </label>
              <input 
                type="text" 
                name="borrower_id" 
                value={data.borrower_id ?? ''} 
                onChange={handleChange}
                className="bg-[#F7F5F3] border-gray-300 rounded-md w-full border p-2 bg-gray-100"
                readOnly
                disabled
              />
              <FieldError field="borrower_id" errors={errors} />
            </div>
          </SectionContainer>
        );

      case 1:
        return (
          <SectionContainer title="Loan Details">
            
            <FormField label="Loan Type" name="loan_type" value={data.loan_type} onChange={handleChange} required 
              type="select"
              options={[
                { value: 'Personal Loan', label: 'Personal Loan' },
                { value: 'Business Loan', label: 'Business Loan' },
                { value: 'Home Loan', label: 'Home Loan' },
                { value: 'Education Loan', label: 'Education Loan' },
              ]}/>
            <FormField label="Loan Amount (₱)" name="loan_amount" value={data.loan_amount} onChange={handleChange} required />
            <FormField
              label="Interest Type"
              name="interest_type"
              type="select"
              value={data.interest_type}
              onChange={handleChange}
              required
              options={[
                { value: 'Compound', label: 'Compound' },
                { value: 'Diminishing', label: 'Diminishing' },
              ]}
            />
            <FormField label="Interest Rate (%)" name="interest_rate" onChange={handleChange} value={data.interest_rate} required>
              <input
                name="interest_rate"
                list="interestRateOptions"
                value={data.interest_rate}
                onChange={handleChange}
                required
                className="bg-[#F7F5F3] border-gray-300 rounded-md w-full border p-2"
                placeholder="Enter interest rate"
              />
              <datalist id="interestRateOptions">{Array.from({ length: 10 }, (_, i) => i + 1).map((rate) => <option key={rate} value={rate} />)}</datalist>
            </FormField>
            <FormField
              label="Repayment Frequency"
              name="repayment_frequency"
              type="select"
              value={data.repayment_frequency}
              onChange={handleChange}
              required
              options={[
                { value: 'Weekly', label: 'Weekly' },
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Yearly', label: 'Yearly' },
              ]}
            />
            <FormField label="Term (months)" name="term" onChange={handleChange} value={data.term} required>
              <input
                name="term"
                list="termOptions"
                value={data.term}
                onChange={handleChange}
                required
                className="bg-[#F7F5F3] border-gray-300 rounded-md w-full border p-2"
                placeholder="Enter term in months"
              />
              <datalist id="termOptions">{Array.from({ length: 24 }, (_, i) => i + 1).map((month) => <option key={month} value={month} />)}</datalist>
            </FormField>
          </SectionContainer>
        );

      case 2: {
        const vehicleOptions: Record<string, string[]> = { make: ['Toyota', 'Honda', 'Nissan'], fuel: ['Gasoline', 'Diesel', 'Electric'] };
        const landOptions: Record<string, string[]> = { location: ['Manila', 'Cebu', 'Davao'] };
        const atmOptions: Record<string, string[]> = { bank_name: ['BDO', 'BPI', 'Metrobank'] };
        type DataKey = keyof typeof data;

        return (
          <SectionContainer title="Collateral">
            <FormField
              label="Collateral Type"
              name="collateral_type"
              type="select"
              value={data.collateral_type}
              onChange={handleChange}
              required
              options={[
                { value: 'vehicle', label: 'Vehicle' },
                { value: 'land', label: 'Land Title' },
                { value: 'atm', label: 'ATM' },
              ]}
            />

            {/* Vehicle Collateral Fields */}
            {data.collateral_type === 'vehicle' && (
              <>
                <FormField
                  label="Vehicle Type"
                  name="vehicle_type"
                  type="select"
                  value={data.vehicle_type}
                  onChange={handleChange}
                  required
                  options={[
                    { value: 'Car', label: 'Car' },
                    { value: 'Motorcycle', label: 'Motorcycle' },
                    { value: 'Truck', label: 'Truck' },
                  ]}
                />
                <FormField
                  label="Transmission Type"
                  name="transmission_type"
                  type="select"
                  value={data.transmission_type}
                  onChange={handleChange}
                  required
                  options={[
                    { value: 'Manual', label: 'Manual' },
                    { value: 'Automatic', label: 'Automatic' },
                  ]}
                />
                {(['make', 'plate_no', 'engine_no', 'year_model', 'series', 'fuel'] as DataKey[]).map((field) => {
                const fieldStr = String(field);
                const options = vehicleOptions[fieldStr];
                const isRequired = fieldStr === 'make';
                return (
                  <div key={fieldStr}>
                    <FormField label={toCapitalCase(fieldStr)} name={fieldStr} value={data[field]} onChange={handleChange} list={`${fieldStr}-options`} required={isRequired} />
                    {options && (
                      <datalist id={`${fieldStr}-options`}>
                        {options.map((opt) => (
                          <option key={opt} value={opt} />
                        ))}
                      </datalist>
                    )}
                  </div>
                );
              })}
              </>
            )}

            {/* Land Collateral Fields */}
            {data.collateral_type === 'land' &&
              (['certificate_of_title_no', 'location', 'description', 'area'] as DataKey[]).map((field) => {
                const fieldStr = String(field);
                const options = landOptions[fieldStr];
                const isRequired = fieldStr === 'certificate_of_title_no' || fieldStr === 'location';
                return (
                  <div key={fieldStr}>
                    <FormField label={toCapitalCase(fieldStr)} name={fieldStr} value={data[field]} onChange={handleChange} list={`${fieldStr}-options`} required={isRequired} />
                    {options && (
                      <datalist id={`${fieldStr}-options`}>
                        {options.map((opt) => (
                          <option key={opt} value={opt} />
                        ))}
                      </datalist>
                    )}
                  </div>
                );
              })}

            {/* ATM Collateral Fields */}
            {data.collateral_type === 'atm' &&
              (['bank_name', 'account_no', 'cardno_4digits'] as DataKey[]).map((field) => {
                const fieldStr = String(field);
                const options = atmOptions[fieldStr];
                const isRequired = fieldStr === 'bank_name' || fieldStr === 'account_no' || fieldStr === 'cardno_4digits';
                return (
                  <div key={fieldStr}>
                    <FormField label={toCapitalCase(fieldStr)} name={fieldStr} value={data[field]} onChange={handleChange} list={`${fieldStr}-options`} required={isRequired} />
                    {options && (
                      <datalist id={`${fieldStr}-options`}>
                        {options.map((opt) => (
                          <option key={opt} value={opt} />
                        ))}
                      </datalist>
                    )}
                  </div>
                );
              })}

            <div>
              <label className="block text-sm font-medium mb-1">Upload Ownership Proof</label>
              <input type="file" name="ownership_proof" onChange={handleChange} className="bg-[#F7F5F3] border-gray-300 rounded-md w-full border p-2" />
            </div>
          </SectionContainer>
        );
      }

      case 3:
      // Options for dropdowns
      const maritalStatusOptions = [
        { value: 'Single', label: 'Single' },
        { value: 'Married', label: 'Married' },
        { value: 'Widowed', label: 'Widowed' },
        { value: 'Divorced', label: 'Divorced' },
      ];

      const occupationOptions = [
        { value: 'Employee', label: 'Employee' },
        { value: 'Self-Employed', label: 'Self-Employed' },
        { value: 'Unemployed', label: 'Unemployed' },
        { value: 'Retired', label: 'Retired' },
      ];

      return (
        <SectionContainer title="Co-Borrowers">
          {coBorrowers.map((co, i) => (
            <div key={i} className="relative border-white p-4 rounded-lg mb-4">
              {coBorrowers.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCoBorrower(i)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              )}
              {(Object.keys(co) as Array<keyof typeof co>).map((key) => {
                const keyStr = String(key);
                const isRequired = keyStr === 'first_name' || keyStr === 'last_name';

                // Dropdowns for specific fields
                if (keyStr === 'marital_status') {
                  return (
                    <FormField
                      key={keyStr}
                      label={toCapitalCase(keyStr)}
                      name={keyStr}
                      type="select"
                      value={co[key]}
                      onChange={(e) => handleCoBorrowerChange(i, e)}
                      options={maritalStatusOptions}
                      required={isRequired}
                    />
                  );
                }

                if (keyStr === 'occupation') {
                  return (
                    <FormField
                      key={keyStr}
                      label={toCapitalCase(keyStr)}
                      name={keyStr}
                      type="select"
                      value={co[key]}
                      onChange={(e) => handleCoBorrowerChange(i, e)}
                      options={occupationOptions}
                      required={isRequired}
                    />
                  );
                }

                if (keyStr === 'birth_date') {
                  return (
                    <FormField
                      key={keyStr}
                      label={toCapitalCase(keyStr)}
                      name={keyStr}
                      type="date"
                      value={co.birth_date}
                      onChange={(e) => handleCoBorrowerChange(i, e)}
                    />
                  );
                }

                // Default to text input for other fields
                return (
                  <FormField
                    key={keyStr}
                    label={toCapitalCase(keyStr)}
                    name={keyStr}
                    value={co[key]}
                    onChange={(e) => handleCoBorrowerChange(i, e)}
                    required={isRequired}
                  />
                );
              })}
            </div>
          ))}

          <div className="flex justify-end">
            <Button
              type="button"
              className="bg-yellow-500 text-black hover:bg-yellow-600"
              onClick={addCoBorrower}
            >
              <Plus size={14} /> Add Co-Borrower
            </Button>
          </div>
        </SectionContainer>
      );


      case 4:
        return (
          <SectionContainer title="Review & Submit">
            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Borrower Information</h3>
              <p>
                <strong>Name:</strong> {data.borrower_name}
              </p>
              <p>
                <strong>Borrower ID:</strong> {data.borrower_id}
              </p>
              <p>
                <strong>Loan Type:</strong> {data.loan_type}
              </p>
              <p>
                <strong>Interest Type:</strong> {data.interest_type}
              </p>
              <p>
                <strong>Interest Rate:</strong> {data.interest_rate}%
              </p>
              <p>
                <strong>Loan Amount:</strong> ₱{data.loan_amount}
              </p>
              <p>
                <strong>Repayment Frequency:</strong> {data.repayment_frequency}
              </p>
              <p>
                <strong>Term:</strong> {data.term} months
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-700 mb-2">Collateral</h3>
              <p>
                <strong>Type:</strong> {toCapitalCase(data.collateral_type)}
              </p>
              {data.collateral_type === 'vehicle' && (
                <>
                  <p>
                    <strong>Model:</strong> {data.make}
                  </p>
                  <p>
                    <strong>Vehicle Type:</strong> {data.vehicle_type}
                  </p>
                  <p>
                    <strong>Transmission Type:</strong> {data.transmission_type}
                  </p>
                  <p>
                    <strong>Plate No.:</strong> {data.plate_no}
                  </p>
                  <p>
                    <strong>Engine No.:</strong> {data.engine_no}
                  </p>
                  <p>
                    <strong>Year Model:</strong> {data.year_model}
                  </p>
                  <p>
                    <strong>Series:</strong> {data.series}
                  </p>
                  <p>
                    <strong>Fuel:</strong> {data.fuel}
                  </p>
                </>
              )}
              {data.collateral_type === 'land' && (
                <>
                  <p>
                    <strong>Certificate of Title No.:</strong> {data.certificate_of_title_no}
                  </p>
                  <p>
                    <strong>Location:</strong> {data.location}
                  </p>
                  <p>
                    <strong>Description:</strong> {data.description}
                  </p>
                  <p>
                    <strong>Area:</strong> {data.area}
                  </p>
                </>
              )}
              {data.collateral_type === 'atm' && (
                <>
                  <p>
                    <strong>Bank Name:</strong> {data.bank_name}
                  </p>
                  <p>
                    <strong>Account Number:</strong> {data.account_no}
                  </p>
                  <p>
                    <strong>Card Last 4 Digits:</strong> {data.cardno_4digits}
                  </p>
                </>
              )}
            </div>

            {coBorrowers.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Co-Borrowers</h3>
                {coBorrowers.map((co, index) => (
                  <div key={index} className="mb-3">
                    <p>
                      <strong>Co-Borrower {index + 1}:</strong>
                    </p>
                    <p>
                      <strong>First Name:</strong> {co.first_name}
                    </p>
                    <p>
                      <strong>Last Name:</strong> {co.last_name}
                    </p>
                    <p>
                      <strong>Address:</strong> {co.address}
                    </p>
                    <p>
                      <strong>Email:</strong> {co.email}
                    </p>
                    <p>
                      <strong>Contact:</strong> {co.contact}
                    </p>
                    <p>
                      <strong>Birth Date:</strong> {co.birth_date}
                    </p>
                    <p>
                      <strong>Marital Status:</strong> {co.marital_status}
                    </p>
                    <p>
                      <strong>Occupation:</strong> {co.occupation}
                    </p>
                    <p>
                      <strong>Net Pay:</strong> {co.net_pay}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </SectionContainer>
        );
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Loan Application" />
      <form onSubmit={handleSubmit} className="p-6 space-y-6">

        {/* Global errors from server */}
        {errors && Object.keys(errors).length > 0 && (
          <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
            <ul className="list-disc list-inside">
              {Object.entries(errors).map(([key, msg]) => (
                <li key={key}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-b-4 border-[#FABF24] bg-[#FFF8E2] pb-4 mb-8 p-5">
          <h1 className="text-3xl font-semibold text-gray-800">Add Loan</h1>
          <p className="text-gray-500 text-sm">
            Step {activeStep + 1} of {steps.length}
          </p>
          <p className="text-gray-600 text-sm mt-2">
            <span className="text-red-500">*</span> indicates required fields
          </p>
        </div>
        {renderStep()}
        <div className="flex justify-between mt-6">
          <div>
            {activeStep > 0 && (
              <Button type="button" className="bg-yellow-500 hover:bg-yellow-600 text-black" onClick={prevStep}>
                Previous
              </Button>
            )}
          </div>
          <div>
            {activeStep < steps.length - 1 && (
              <Button 
                type="button" 
                className="bg-yellow-500 text-black hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed" 
                onClick={nextStep}
                disabled={!isStepValid(activeStep)}
              >
                Next
              </Button>
            )}
            {activeStep === steps.length - 1 && (
              <Button type="submit" disabled={processing} className="bg-yellow-500 text-black hover:bg-yellow-600">
                {processing ? 'Submitting...' : 'Submit Loan'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </AppLayout>
  );
}
