import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React, { useMemo, useState } from 'react';
import AddBorrowerStepIndicator from './components/AddBorrowerStepIndicator';
import RenderDocumentUploader, {
  type BorrowerDocumentCategory,
  type BorrowerDocumentTypeOption,
  type BorrowerDocumentUploadItem,
} from './components/RenderDocumentUploader';

type BorrowerAddProps = {
  documentTypesByCategory: Record<string, BorrowerDocumentTypeOption[]>;
};

type FormData = {
  borrower_first_name: string;
  borrower_last_name: string;
  gender: string;
  date_of_birth: string;
  marital_status: string;
  contact_no: string;
  landline_number: string;
  email: string;
  dependent_child: string;

  spouse_first_name: string;
  spouse_last_name: string;
  spouse_agency_address: string;
  spouse_occupation: string;
  spouse_position: string;
  spouse_mobile_number: string;

  permanent_address: string;
  city: string;
  home_ownership: string;

  employment_status: string;
  occupation: string;
  position: string;
  monthly_income: string;
  income_source: string;
  agency_address: string;

  valid_id_type: string;
  valid_id_number: string;

  documents: {
    borrower_identity: BorrowerDocumentUploadItem[];
    borrower_address: BorrowerDocumentUploadItem[];
    borrower_employment: BorrowerDocumentUploadItem[];
  };
};

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Borrowers', href: '/borrowers/add' }];
const addBorrowerSteps = ['Profile', 'Address', 'Employment', 'Confirmation'];

const inputClass =
  'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FABF24] focus:border-transparent';

const STEP_REQUIRED_FIELDS: Record<number, (keyof FormData)[]> = {
  1: ['borrower_first_name', 'borrower_last_name', 'gender', 'date_of_birth', 'marital_status', 'contact_no', 'email'],
  2: ['permanent_address', 'city', 'home_ownership'],
  3: ['employment_status', 'income_source'],
  4: ['valid_id_type'],
};

const MIN_DOCUMENTS_PER_CATEGORY: Record<'borrower_identity' | 'borrower_address' | 'borrower_employment', number> = {
  borrower_identity: 2,
  borrower_address: 1,
  borrower_employment: 2,
};

export default function BorrowerAdd({ documentTypesByCategory }: BorrowerAddProps) {
  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState<string>('');

  const { data, setData, post, processing, errors } = useForm<FormData>({
    borrower_first_name: '',
    borrower_last_name: '',
    gender: '',
    date_of_birth: '',
    marital_status: '',
    contact_no: '',
    landline_number: '',
    email: '',
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

    documents: {
      borrower_identity: [{ document_type_id: '', file: null }],
      borrower_address: [{ document_type_id: '', file: null }],
      borrower_employment: [{ document_type_id: '', file: null }],
    },
  });

  const incomeSources = [
  "Salary",
  "Business Income",
  "Freelance / Contract Work",
  "Self-Employed",
  "Investments",
  "Rental Income",
  "Commission-Based",
  "Pension / Retirement",
  "Remittance",
  "Government Assistance",
  "Other"
];

  const documentTypeOptions = useMemo(
    () => ({
      borrower_identity: documentTypesByCategory?.borrower_identity ?? [],
      borrower_address: documentTypesByCategory?.borrower_address ?? [],
      borrower_employment: documentTypesByCategory?.borrower_employment ?? [],
    }),
    [documentTypesByCategory],
  );

  const updateDocRow = (
    category: BorrowerDocumentCategory,
    index: number,
    patch: Partial<BorrowerDocumentUploadItem>,
  ) => {
    setData('documents', {
      ...data.documents,
      [category]: data.documents[category].map((item, i) => (i === index ? { ...item, ...patch } : item)),
    });
  };

  const addDocRow = (category: BorrowerDocumentCategory) => {
    setData('documents', {
      ...data.documents,
      [category]: [...data.documents[category], { document_type_id: '', file: null }],
    });
  };

  const removeDocRow = (category: BorrowerDocumentCategory, index: number) => {
    const current = data.documents[category];
    if (current.length <= 1) return;

    setData('documents', {
      ...data.documents,
      [category]: current.filter((_, i) => i !== index),
    });
  };

  const hasMinDocuments = (category: BorrowerDocumentCategory) => {
    const valid = data.documents[category].filter((item) => item.document_type_id && item.file);
    return valid.length >= MIN_DOCUMENTS_PER_CATEGORY[category];
  };

  const prev = () => setStep((s) => s - 1);

  const next = () => {
    setSubmitError('');
    const currentRequired = STEP_REQUIRED_FIELDS[step] || [];
    const hasEmptyFields = currentRequired.some((field) => !String(data[field] ?? '').trim());

    if (step === 1 && data.marital_status === 'Married') {
      const spouseRequired = [data.spouse_first_name, data.spouse_last_name].some((v) => !v?.trim());
      if (spouseRequired) return;
    }

    if (!hasEmptyFields && step < addBorrowerSteps.length) {
      setStep((s) => s + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!hasMinDocuments('borrower_identity') || !hasMinDocuments('borrower_address') || !hasMinDocuments('borrower_employment')) {
      setStep(4);
      setSubmitError('Please complete the required documents: Identity (2), Address (1), Employment (2).');
      return;
    }

    post('/borrowers', {
      forceFormData: true,
      preserveScroll: true,
      onError: (fieldErrors) => {
        const keys = Object.keys(fieldErrors);
        const firstMessage = Object.values(fieldErrors)[0];
        setSubmitError(typeof firstMessage === 'string' ? firstMessage : 'Submission failed. Please check the highlighted fields.');

        if (keys.some((k) => k.startsWith('documents.'))) {
          setStep(4);
          return;
        }
        if (keys.some((k) => k.startsWith('borrower_') || ['gender', 'date_of_birth', 'marital_status', 'contact_no', 'email'].includes(k))) {
          setStep(1);
        } else if (keys.some((k) => k.startsWith('permanent_address') || k.startsWith('city') || k.startsWith('home_ownership') || k.includes('borrower_address'))) {
          setStep(2);
        } else if (keys.some((k) => k.startsWith('employment_') || k.startsWith('income_source') || k.includes('borrower_employment'))) {
          setStep(3);
        } else {
          setStep(4);
        }
      },
    });
  };

  const getError = (field: string) => errors[field as keyof typeof errors] as string | undefined;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="New Borrower" />

      <form onSubmit={handleSubmit} className="w-full bg-white shadow-xl rounded-2xl p-10 mb-16 border border-gray-200 space-y-10">
        <h1 className="text-center text-3xl font-semibold text-gray-800">
          {addBorrowerSteps[step - 1]}
        </h1>

        <AddBorrowerStepIndicator currentStep={step} steps={addBorrowerSteps} />

        {submitError && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Borrower Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input type="text" value={data.borrower_first_name} onChange={(e) => setData('borrower_first_name', e.target.value)} className={inputClass} required />
                {errors.borrower_first_name && <p className="text-red-500 text-xs mt-1">{errors.borrower_first_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <input type="text" value={data.borrower_last_name} onChange={(e) => setData('borrower_last_name', e.target.value)} className={inputClass} required />
                {errors.borrower_last_name && <p className="text-red-500 text-xs mt-1">{errors.borrower_last_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gender</label>
                <select value={data.gender} onChange={(e) => setData('gender', e.target.value)} className={inputClass} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth</label>
                <input type="date" value={data.date_of_birth} onChange={(e) => setData('date_of_birth', e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Mobile Number</label>
                <input type="text" value={data.contact_no} onChange={(e) => setData('contact_no', e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Landline Number</label>
                <input type="text" value={data.landline_number} onChange={(e) => setData('landline_number', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass} required />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Marital Status</label>
                <select value={data.marital_status} onChange={(e) => setData('marital_status', e.target.value)} className={inputClass} required>
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Separated">Separated</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              {data.marital_status === 'Married' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Spouse First Name</label>
                    <input type="text" value={data.spouse_first_name} onChange={(e) => setData('spouse_first_name', e.target.value)} className={inputClass} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Spouse Last Name</label>
                    <input type="text" value={data.spouse_last_name} onChange={(e) => setData('spouse_last_name', e.target.value)} className={inputClass} required />
                  </div>
                </>
              )}
            </div>
              <RenderDocumentUploader
                title="Identification documents"
                category="borrower_identity"
                rows={data.documents.borrower_identity}
                optionsByCategory={documentTypeOptions}
                minRequired={MIN_DOCUMENTS_PER_CATEGORY.borrower_identity}
                inputClass={inputClass}
                onAdd={addDocRow}
                onRemove={removeDocRow}
                onUpdate={updateDocRow}
                getFieldError={getError}
              />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Borrower Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Permanent Address</label>
                <input type="text" value={data.permanent_address} onChange={(e) => setData('permanent_address', e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input type="text" value={data.city} onChange={(e) => setData('city', e.target.value)} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Home Ownership</label>
                <select value={data.home_ownership} onChange={(e) => setData('home_ownership', e.target.value)} className={inputClass} required>
                  <option value="">Select Home Ownership</option>
                  <option value="Owned">Owned</option>
                  <option value="Rented">Rented</option>
                  <option value="Mortgage">Mortgage</option>
                </select>
              </div>
            </div>

            <RenderDocumentUploader
              title="Address Proof Documents"
              category="borrower_address"
              rows={data.documents.borrower_address}
              optionsByCategory={documentTypeOptions}
              minRequired={MIN_DOCUMENTS_PER_CATEGORY.borrower_address}
              inputClass={inputClass}
              onAdd={addDocRow}
              onRemove={removeDocRow}
              onUpdate={updateDocRow}
              getFieldError={getError}
            />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Borrower Employment</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Employment Status</label>
                <select value={data.employment_status} onChange={(e) => setData('employment_status', e.target.value)} className={inputClass} required>
                  <option value="">Select Employment Status</option>
                  <option value="Employed">Employed</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Income Source</label>
                <select
                value={data.income_source}
                onChange={(e) => setData('income_source', e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select income source</option>
                {incomeSources.map((source) => (
                  <option key={source} value={source}>
                    {source}
                  </option>
                ))}
              </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Occupation</label>
                <input type="text" value={data.occupation} onChange={(e) => setData('occupation', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <input type="text" value={data.position} onChange={(e) => setData('position', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Monthly Income</label>
                <input type="number" value={data.monthly_income} onChange={(e) => setData('monthly_income', e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Agency Address</label>
                <input type="text" value={data.agency_address} onChange={(e) => setData('agency_address', e.target.value)} className={inputClass} />
              </div>
            </div>

            <RenderDocumentUploader
              title="Employment / Income Documents"
              category="borrower_employment"
              rows={data.documents.borrower_employment}
              optionsByCategory={documentTypeOptions}
              minRequired={MIN_DOCUMENTS_PER_CATEGORY.borrower_employment}
              inputClass={inputClass}
              onAdd={addDocRow}
              onRemove={removeDocRow}
              onUpdate={updateDocRow}
              getFieldError={getError}
            />
          </div>
        )}


        {step === 4 && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg border shadow-sm bg-[#F7F5F3]">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Borrower Profile</h3>
              <ul className="text-gray-600 space-y-1">
                <li><strong>First Name:</strong> {data.borrower_first_name}</li>
                <li><strong>Last Name:</strong> {data.borrower_last_name}</li>
                <li><strong>Email:</strong> {data.email}</li>
                <li><strong>Mobile:</strong> {data.contact_no}</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border shadow-sm bg-[#F7F5F3]">
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Document Summary</h3>
              <ul className="text-gray-600 space-y-1">
                <li><strong>Identity Documents:</strong> {data.documents.borrower_identity.filter((d) => d.file).length}</li>
                <li><strong>Address Documents:</strong> {data.documents.borrower_address.filter((d) => d.file).length}</li>
                <li><strong>Employment Documents:</strong> {data.documents.borrower_employment.filter((d) => d.file).length}</li>
              </ul>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-6">
          <div>{step > 1 && <Button type="button" onClick={prev} className="bg-[#FABF24] text-black hover:bg-yellow-600">Back</Button>}</div>
          <div>
            {step < addBorrowerSteps.length && (
              <Button type="button" onClick={next} className="bg-[#FABF24] text-black hover:bg-yellow-600">
                Next
              </Button>
            )}
            {step === addBorrowerSteps.length && (
              <Button type="submit" className="bg-[#FABF24] text-black hover:bg-yellow-600" disabled={processing}>
                {processing ? 'Submitting...' : 'Submit'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </AppLayout>
  );
}
