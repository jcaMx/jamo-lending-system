import { useState, useCallback } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ---------------- BREADCRUMBS ----------------
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Loans', href: '/loans' },
  { title: 'Add Loan', href: '/loans/addloan' },
];

// ---------------- FORM TYPES ----------------
interface LoanFormData {
  borrower_name: string;
  borrower_id: string;
  loan_type: string;
  loan_amount: string;
  interest_type: string;
  interest_rate: string;
  repayment_frequency: string;
  term: string;
  start_date: string;
  end_date: string;
  collateral_type: string;
  type: string;
  brand: string;
  model: string;
  year_model: string;
  plate_no: string;
  engine_no: string;
  transmission_type: string;
  fuel_type: string;
  title_no: string;
  location: string;
  description: string;
  area_size: string;
  ownership_proof: File | null;
}

interface CoBorrower {
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  contact: string;
  birth_date: string;
  marital_status: string;
  occupation: string;
  net_pay: string;
}

// ---------------- REUSABLE COMPONENTS ----------------
const FieldError = ({ field, errors }: { field: string; errors: any }) =>
  errors[field] ? <p className="text-red-500 text-sm mt-1">{errors[field]}</p> : null;

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: { value: string; label: string }[];
  list?: string;
  children?: React.ReactNode;
}

const FormField = ({ label, name, type = 'text', value, onChange, options, list, children }: FormFieldProps) => (
  <div>
    <label className="block text-sm font-medium mb-1 text-gray-700">{label}</label>

    {children ? (
      children
    ) : type === 'select' && options ? (
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="bg-[#F7F5F3] border-gray-300 rounded-md w-full border p-2"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        list={list}
        className="bg-[#F7F5F3] border-gray-300 rounded-md w-full border p-2"
      />
    )}
  </div>
);

const SectionContainer = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-6">
    <h2 className="text-xl font-semibold text-gray-700 mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

// ---------------- HELPER ----------------
const debounce = (fn: (...args: any) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// ---------------- MAIN COMPONENT ----------------
export default function AddLoan() {
  const { data, setData, post, processing, errors } = useForm<LoanFormData>({
    borrower_name: '',
    borrower_id: '',
    loan_type: '',
    loan_amount: '',
    interest_type: '',
    interest_rate: '5',
    repayment_frequency: '',
    term: '',
    start_date: '',
    end_date: '',
    collateral_type: 'vehicle',
    type: '',
    brand: '',
    model: '',
    year_model: '',
    plate_no: '',
    engine_no: '',
    transmission_type: '',
    fuel_type: '',
    title_no: '',
    location: '',
    description: '',
    area_size: '',
    ownership_proof: null,
  });

  const [coBorrowers, setCoBorrowers] = useState<CoBorrower[]>([
    { first_name: '', last_name: '', address: '', email: '', contact: '', birth_date: '', marital_status: '', occupation: '', net_pay: '' },
  ]);

  const [activeStep, setActiveStep] = useState(0);
  const [borrowerValid, setBorrowerValid] = useState(false);
  const [borrowerSuggestions, setBorrowerSuggestions] = useState<{ id: string; name: string }[]>([]);

  // ---------------- HANDLERS ----------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target instanceof HTMLInputElement && e.target.type === 'file') {
      setData('ownership_proof', e.target.files?.[0] ?? null);
    } else {
      setData(e.target.name as keyof LoanFormData, e.target.value);
    }
  };

  const fetchBorrower = async (value: string) => {
    if (value.length <= 2) {
      setBorrowerValid(false);
      setBorrowerSuggestions([]);
      setData('borrower_id', '');
      return;
    }

    try {
      const res = await fetch(`/borrowers/search?query=${encodeURIComponent(value)}`);
      if (!res.ok) throw new Error('Fetch failed');

      const borrower = await res.json();
      if (borrower.borrower_id) {
        setData('borrower_name', borrower.borrower_name);
        setData('borrower_id', borrower.borrower_id.toString());
        setBorrowerValid(true);
        setBorrowerSuggestions([{ id: borrower.borrower_id, name: borrower.borrower_name }]);
      } else {
        setBorrowerValid(false);
        setData('borrower_id', '');
        setBorrowerSuggestions([]);
      }
    } catch (err) {
      setBorrowerValid(false);
      setData('borrower_id', '');
      setBorrowerSuggestions([]);
      console.error(err);
    }
  };

  const debouncedFetchBorrower = useCallback(debounce(fetchBorrower, 300), []);

  const handleBorrowerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target instanceof HTMLInputElement) {
      const value = e.target.value;
      setData('borrower_name', value);
      setBorrowerValid(false);
      setData('borrower_id', '');
      debouncedFetchBorrower(value);
    }
  };

  const selectBorrower = (borrower: { id: string; name: string }) => {
    setData('borrower_name', borrower.name);
    setData('borrower_id', borrower.id.toString());
    setBorrowerValid(true);
    setBorrowerSuggestions([]);
  };

  const handleCoBorrowerChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const updated = [...coBorrowers];
    updated[index] = { ...updated[index], [e.target.name]: e.target.value };
    setCoBorrowers(updated);
  };

  const addCoBorrower = () =>
    setCoBorrowers([...coBorrowers, { first_name: '', last_name: '', address: '', email: '', contact: '', birth_date: '', marital_status: '', occupation: '', net_pay: '' }]);

  const removeCoBorrower = (i: number) => setCoBorrowers(coBorrowers.filter((_, idx) => idx !== i));

  const nextStep = () => {
    if (activeStep === 0 && !borrowerValid) {
      alert('Please select a valid borrower before proceeding.');
      return;
    }
    setActiveStep((prev) => Math.min(prev + 1, 4));
  };
  const prevStep = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!borrowerValid) {
      alert('Borrower does not exist. Please select an existing borrower.');
      return;
    }

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value as any);
    });

    formData.append('co_borrowers', JSON.stringify(coBorrowers));

    post('/loans', {
      preserveScroll: true,
      forceFormData: true,
    });
  };

  // ---------------- RENDER STEPS ----------------
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <SectionContainer title="Borrower Information">
            <FormField label="Borrower Name" name="borrower_name" value={data.borrower_name} onChange={handleBorrowerChange}>
              <input
                type="text"
                name="borrower_name"
                value={data.borrower_name}
                onChange={handleBorrowerChange}
                list="borrower-suggestions"
                className="bg-[#F7F5F3] border-gray-300 rounded-md w-full border p-2"
              />
              {borrowerSuggestions.length > 0 && (
                <datalist id="borrower-suggestions">
                  {borrowerSuggestions.map((b) => (
                    <option key={b.id} value={b.name} />
                  ))}
                </datalist>
              )}
            </FormField>
            <FormField label="Borrower ID" name="borrower_id" value={data.borrower_id} onChange={handleChange} />
            <FieldError field="borrower_name" errors={errors} />
            <FieldError field="borrower_id" errors={errors} />
          </SectionContainer>
        );
      case 1:
        return (
          <SectionContainer title="Loan Details">
            <FormField label="Loan Type" name="loan_type" value={data.loan_type} onChange={handleChange} />
            <FormField label="Loan Amount" name="loan_amount" type="number" value={data.loan_amount} onChange={handleChange} />
            <FormField
              label="Interest Type"
              name="interest_type"
              type="select"
              value={data.interest_type}
              onChange={handleChange}
              options={[
                { value: 'Compound', label: 'Compound' },
                { value: 'Diminishing', label: 'Diminishing' },
              ]}
            />
            <FormField label="Interest Rate (%)" name="interest_rate" type="number" value={data.interest_rate} onChange={handleChange} />
            <FormField
              label="Repayment Frequency"
              name="repayment_frequency"
              type="select"
              value={data.repayment_frequency}
              onChange={handleChange}
              options={[
                { value: 'Weekly', label: 'Weekly' },
                { value: 'Monthly', label: 'Monthly' },
                { value: 'Yearly', label: 'Yearly' },
              ]}
            />
            <FormField label="Term (months)" name="term" type="number" value={data.term} onChange={handleChange} />
            <FormField label="Start Date" name="start_date" type="date" value={data.start_date} onChange={handleChange} />
            <FormField label="End Date" name="end_date" type="date" value={data.end_date} onChange={handleChange} />
            <FormField
              label="Collateral Type"
              name="collateral_type"
              type="select"
              value={data.collateral_type}
              onChange={handleChange}
              options={[
                { value: 'vehicle', label: 'Vehicle' },
                { value: 'atm', label: 'ATM' },
                { value: 'land', label: 'Land' },
              ]}
            />
          </SectionContainer>
        );
      case 2:
        return (
          <SectionContainer title="Co-Borrowers">
            {coBorrowers.map((cb, idx) => (
              <div key={idx} className="border rounded p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">Co-Borrower {idx + 1}</h3>
                  {idx > 0 && (
                    <Button type="button" variant="destructive" onClick={() => removeCoBorrower(idx)}>
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
                <FormField label="First Name" name="first_name" value={cb.first_name} onChange={(e) => handleCoBorrowerChange(idx, e)} />
                <FormField label="Last Name" name="last_name" value={cb.last_name} onChange={(e) => handleCoBorrowerChange(idx, e)} />
                <FormField label="Address" name="address" value={cb.address} onChange={(e) => handleCoBorrowerChange(idx, e)} />
                <FormField label="Email" name="email" type="email" value={cb.email} onChange={(e) => handleCoBorrowerChange(idx, e)} />
                <FormField label="Contact" name="contact" value={cb.contact} onChange={(e) => handleCoBorrowerChange(idx, e)} />
                <FormField label="Birth Date" name="birth_date" type="date" value={cb.birth_date} onChange={(e) => handleCoBorrowerChange(idx, e)} />
                <FormField label="Marital Status" name="marital_status" value={cb.marital_status} onChange={(e) => handleCoBorrowerChange(idx, e)} />
                <FormField label="Occupation" name="occupation" value={cb.occupation} onChange={(e) => handleCoBorrowerChange(idx, e)} />
                <FormField label="Net Pay" name="net_pay" type="number" value={cb.net_pay} onChange={(e) => handleCoBorrowerChange(idx, e)} />
              </div>
            ))}
            <Button type="button" onClick={addCoBorrower} className="flex items-center gap-2">
              <Plus size={16} /> Add Co-Borrower
            </Button>
          </SectionContainer>
        );
      case 3:
        return (
          <SectionContainer title="Collateral (Vehicle)">
            <FormField label="Type" name="type" value={data.type} onChange={handleChange} />
            <FormField label="Brand" name="brand" value={data.brand} onChange={handleChange} />
            <FormField label="Model" name="model" value={data.model} onChange={handleChange} />
            <FormField label="Year Model" name="year_model" value={data.year_model} onChange={handleChange} />
            <FormField label="Plate No" name="plate_no" value={data.plate_no} onChange={handleChange} />
            <FormField label="Engine No" name="engine_no" value={data.engine_no} onChange={handleChange} />
            <FormField label="Transmission Type" name="transmission_type" value={data.transmission_type} onChange={handleChange} />
            <FormField label="Fuel Type" name="fuel_type" value={data.fuel_type} onChange={handleChange} />
            <FormField label="Certificate of Title No" name="title_no" value={data.title_no} onChange={handleChange} />
            <FormField label="Location" name="location" value={data.location} onChange={handleChange} />
            <FormField label="Description" name="description" value={data.description} onChange={handleChange} />
            <FormField label="Area" name="area" value={data.area_size} onChange={handleChange} />
            <FormField label="Ownership Proof" name="ownership_proof" type="file" onChange={handleChange} />
          </SectionContainer>
        );
      case 4:
        return (
          <SectionContainer title="Review Summary">
            <div className="space-y-2">
              <p><strong>Borrower:</strong> {data.borrower_name}</p>
              <p><strong>Loan Type:</strong> {data.loan_type}</p>
              <p><strong>Loan Amount:</strong> {data.loan_amount}</p>
              <p><strong>Interest Type:</strong> {data.interest_type}</p>
              <p><strong>Interest Rate:</strong> {data.interest_rate}%</p>
              <p><strong>Repayment Frequency:</strong> {data.repayment_frequency}</p>
              <p><strong>Term:</strong> {data.term} months</p>
              <p><strong>Collateral Type:</strong> {data.collateral_type}</p>
              {coBorrowers.map((cb, idx) => (
                <p key={idx}><strong>Co-Borrower {idx + 1}:</strong> {cb.first_name} {cb.last_name}</p>
              ))}
            </div>
          </SectionContainer>
        );
      default:
        return null;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Loan Application" />
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="border-b-4 border-[#FABF24] bg-[#FFF8E2] pb-4 mb-8 p-5">
          <h1 className="text-3xl font-semibold text-gray-800">Add Loan</h1>
          <p className="text-gray-500 text-sm">Step {activeStep + 1} of 5</p>
        </div>

        {renderStep()}

        <div className="flex justify-between mt-6">
          {activeStep > 0 && (
            <Button type="button" className="bg-yellow-500" onClick={prevStep}>
              Previous
            </Button>
          )}
          {activeStep < 4 && (
            <Button type="button" className="bg-yellow-500" onClick={nextStep} disabled={activeStep === 0 && !borrowerValid}>
              Next
            </Button>
          )}
          {activeStep === 4 && (
            <Button type="submit" disabled={!borrowerValid || processing} className="bg-yellow-500">
              {processing ? 'Submitting...' : 'Submit Loan'}
            </Button>
          )}
        </div>
      </form>
    </AppLayout>
  );
}  
