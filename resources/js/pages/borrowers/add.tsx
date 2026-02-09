import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Borrowers', href: '/borrowers/add' },
];

const inputClass = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FABF24] focus:border-transparent';

export default function BorrowerAdd() {
  const [step, setStep] = useState(1);

  const { data, setData, post, processing, errors } = useForm({
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
    files: null as FileList | null,
  });

const prev = () => setStep((s) => s - 1);

const next = () => {
  const requiredFields = {
    1: ['borrower_first_name', 'borrower_last_name', 'gender', 'date_of_birth', 'marital_status', 'contact_no', 'email'],
    2: ['permanent_address', 'city', 'home_ownership'],
    3: ['employment_status', 'income_source'],
    4: ['valid_id_type']
  };
  
  const currentRequired = requiredFields[step as keyof typeof requiredFields] || [];
  const hasEmptyFields = currentRequired.some(field => !data[field as keyof typeof data]);
  
  if (!hasEmptyFields && step < 5) {
    setStep((s) => s + 1);
  }
};

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  console.log('Form data being sent:', data);

  post('/borrowers', {
    preserveScroll: true,
    onSuccess: () => {
      console.log('Form submitted successfully');
    },
    onError: (errors) => {
      console.log('Form submission errors:', errors);

      // Auto-navigate to the first step with errors
      if (errors.borrower_first_name || errors.borrower_last_name || errors.email) {
        setStep(1);
      } else if (errors.permanent_address || errors.city || errors.home_ownership) {
        setStep(2);
      } else if (errors.employment_status || errors.income_source) {
        setStep(3);
      } else if (errors.valid_id_type || errors.valid_id_number) {
        setStep(4);
      }
    },
  });
};



  
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="New Borrower" />

      <form
        onSubmit={handleSubmit}
        className="w-full bg-white shadow-xl rounded-2xl p-10 mb-16 border border-gray-200 space-y-10"
      >
        {/* Header */}
        <div className="border-b-4 border-[#FABF24] pb-4 mb-8 bg-[#FFF8E2] p-5">
          <h1 className="text-3xl font-semibold text-gray-800">Add Borrower</h1>
          {/* <h2 className="text-lg font-medium text-gray-600"></h2> */}
          <p className="text-gray-500 text-sm">Step {step} of 5</p>
        </div>

 
        {/* STEP 1 — BORROWER PROFILE + SPOUSE IF MARRIED */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Borrower Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Borrower Info */}
            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <input
                type="text"
                value={data.borrower_first_name}
                onChange={(e) => setData('borrower_first_name', e.target.value)}
                placeholder="Enter first name"
                className={inputClass}
                required
              />
              {errors.borrower_first_name && <p className="text-red-500 text-xs mt-1">{errors.borrower_first_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <input
                type="text"
                value={data.borrower_last_name}
                onChange={(e) => setData('borrower_last_name', e.target.value)}
                placeholder="Enter last name"
                className={inputClass}
                required
              />
              {errors.borrower_last_name && <p className="text-red-500 text-xs mt-1">{errors.borrower_last_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gender</label>
              <select
                value={data.gender}
                onChange={(e) => setData('gender', e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date of Birth</label>
              <input
                type="date"
                value={data.date_of_birth}
                onChange={(e) => setData('date_of_birth', e.target.value)}
                className={inputClass}
                required
              />
              {errors.date_of_birth && <p className="text-red-500 text-xs mt-1">{errors.date_of_birth}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mobile Number</label>
              <input
                type="text"
                value={data.contact_no}
                onChange={(e) => setData('contact_no', e.target.value)}
                placeholder="09XXXXXXXXX"
                pattern="09\d{9}"
                maxLength={11}
                className={inputClass}
                required
              />
              {errors.contact_no && <p className="text-red-500 text-xs mt-1">{errors.contact_no}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Landline Number</label>
              <input
                type="text"
                value={data.landline_number}
                onChange={(e) => setData('landline_number', e.target.value)}
                placeholder="02-XXXXXXX"
                pattern="0\d{1,2}-\d{7,8}"
                className={inputClass}
              />
              {errors.landline_number && <p className="text-red-500 text-xs mt-1">{errors.landline_number}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="Enter email"
                className={inputClass}
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Marital Status</label>
              <select
                value={data.marital_status}
                onChange={(e) => setData('marital_status', e.target.value)}
                className={inputClass}
                required
              >
                <option value="">Select Marital Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Separated">Separated</option>
                <option value="Widowed">Widowed</option>
              </select>
              {errors.marital_status && <p className="text-red-500 text-xs mt-1">{errors.marital_status}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Number of Dependents</label>
              <input
                type="number"
                value={data.dependent_child}
                onChange={(e) => setData('dependent_child', e.target.value)}
                placeholder="0"
                className={inputClass}
              />
              {errors.dependent_child && <p className="text-red-500 text-xs mt-1">{errors.dependent_child}</p>}
            </div>

            {/* Spouse Info — Only if Married */}
            {data.marital_status === 'Married' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-1">Spouse First Name</label>
                  <input
                    type="text"
                    value={data.spouse_first_name}
                    onChange={(e) => setData('spouse_first_name', e.target.value)}
                    placeholder="Enter spouse first name"
                    className={inputClass}
                    required
                  />
                  {errors.spouse_first_name && <p className="text-red-500 text-xs mt-1">{errors.spouse_first_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Spouse Last Name</label>
                  <input
                    type="text"
                    value={data.spouse_last_name}
                    onChange={(e) => setData('spouse_last_name', e.target.value)}
                    placeholder="Enter spouse last name"
                    className={inputClass}
                    required
                  />
                  {errors.spouse_last_name && <p className="text-red-500 text-xs mt-1">{errors.spouse_last_name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Spouse Mobile Number</label>
                  <input
                    type="text"
                    value={data.spouse_mobile_number}
                    onChange={(e) => setData('spouse_mobile_number', e.target.value)}
                    placeholder="Enter spouse mobile number"
                    className={inputClass}
                  />
                  {errors.spouse_mobile_number && <p className="text-red-500 text-xs mt-1">{errors.spouse_mobile_number}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Spouse Occupation</label>
                  <input
                    type="text"
                    value={data.spouse_occupation}
                    onChange={(e) => setData('spouse_occupation', e.target.value)}
                    placeholder="Enter spouse occupation"
                    className={inputClass}
                  />
                  {errors.spouse_occupation && <p className="text-red-500 text-xs mt-1">{errors.spouse_occupation}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Spouse Position</label>
                  <input
                    type="text"
                    value={data.spouse_position}
                    onChange={(e) => setData('spouse_position', e.target.value)}
                    placeholder="Enter spouse position"
                    className={inputClass}
                  />
                  {errors.spouse_position && <p className="text-red-500 text-xs mt-1">{errors.spouse_position}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Spouse Agency Address</label>
                  <input
                    type="text"
                    value={data.spouse_agency_address}
                    onChange={(e) => setData('spouse_agency_address', e.target.value)}
                    placeholder="Enter spouse agency address"
                    className={inputClass}
                  />
                  {errors.spouse_agency_address && <p className="text-red-500 text-xs mt-1">{errors.spouse_agency_address}</p>}
                </div>
              </>
            )}
          </div>

          </div>
          
        )}




        {/* STEP 2 — ADDRESS */}
        {step === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Borrower Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Permanent Address</label>
                <input
                  type="text"
                  value={data.permanent_address}
                  onChange={(e) => setData('permanent_address', e.target.value)}
                  placeholder="Enter permanent address"
                  className={inputClass}
                  required
                />
                {errors.permanent_address && <p className="text-red-500 text-xs mt-1">{errors.permanent_address}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  value={data.city}
                  onChange={(e) => setData('city', e.target.value)}
                  placeholder="Enter city"
                  className={inputClass}
                  required
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Home Ownership</label>
                <select
                  value={data.home_ownership}
                  onChange={(e) => setData('home_ownership', e.target.value)}
                  className={inputClass}
                  required
                >
                  <option value="">Select Home Ownership</option>
                  <option value="Owned">Owned</option>
                  <option value="Rented">Rented</option>
                  <option value="Mortgage">Mortgage</option>
                </select>
                {errors.home_ownership && <p className="text-red-500 text-xs mt-1">{errors.home_ownership}</p>}
              </div>
            </div>

            </div>
          
        )}

        {/* STEP 3 — EMPLOYMENT */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Borrower Employment</h2>
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
          </div>
        )}


        {/* STEP 4 — VALID ID + FILES */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Valid ID</h2>
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

          </div>
          
        )}

       {/* STEP 5 — Review */}
{step === 5 && (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Review Borrower Details</h2>

    {/* Borrower Info */}
    <div className="p-5 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-600 mb-3">Profile</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div><span className="font-semibold">Name:</span> {data.borrower_first_name} {data.borrower_last_name}</div>
        <div><span className="font-semibold">Gender:</span> {data.gender}</div>
        <div><span className="font-semibold">DOB:</span> {data.date_of_birth}</div>
        <div><span className="font-semibold">Marital Status:</span> {data.marital_status}</div>
        <div><span className="font-semibold">Mobile:</span> {data.contact_no}</div>
        {data.landline_number && <div><span className="font-semibold">Landline:</span> {data.landline_number}</div>}
        <div><span className="font-semibold">Email:</span> {data.email}</div>
        {data.dependent_child && <div><span className="font-semibold">Dependents:</span> {data.dependent_child}</div>}
      </div>
    </div>

    {/* Spouse Info */}
    {data.marital_status === 'Married' && (
      <div className="p-5 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-600 mb-3">Spouse Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div><span className="font-semibold">Name:</span> {data.spouse_first_name} {data.spouse_last_name}</div>
          <div><span className="font-semibold">Mobile:</span> {data.spouse_mobile_number}</div>
          <div><span className="font-semibold">Occupation:</span> {data.spouse_occupation}</div>
          <div><span className="font-semibold">Position:</span> {data.spouse_position}</div>
          <div className="col-span-2"><span className="font-semibold">Agency Address:</span> {data.spouse_agency_address}</div>
        </div>
      </div>
    )}

    {/* Address */}
    <div className="p-5 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-600 mb-3">Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="col-span-2"><span className="font-semibold">Permanent Address:</span> {data.permanent_address}</div>
        <div><span className="font-semibold">City:</span> {data.city}</div>
        <div><span className="font-semibold">Home Ownership:</span> {data.home_ownership}</div>
      </div>
    </div>

    {/* Employment */}
    <div className="p-5 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-600 mb-3">Employment</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div><span className="font-semibold">Status:</span> {data.employment_status}</div>
        {data.occupation && <div><span className="font-semibold">Occupation:</span> {data.occupation}</div>}
        {data.position && <div><span className="font-semibold">Position:</span> {data.position}</div>}
        {data.monthly_income && <div><span className="font-semibold">Monthly Income:</span> {data.monthly_income}</div>}
        {data.income_source && <div><span className="font-semibold">Income Source:</span> {data.income_source}</div>}
        {data.agency_address && <div className="col-span-2"><span className="font-semibold">Agency Address:</span> {data.agency_address}</div>}
      </div>
    </div>

    {/* Valid ID */}
    <div className="p-5 bg-gray-50 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-medium text-gray-600 mb-3">Valid ID</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div><span className="font-semibold">ID Type:</span> {data.valid_id_type}</div>
        {data.valid_id_number && <div><span className="font-semibold">ID Number:</span> {data.valid_id_number}</div>}
        {data.files && <div className="col-span-2"><span className="font-semibold">Uploaded Files:</span> {data.files.length} file(s)</div>}
      </div>
    </div>
  </div>
)}


        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {/* Left side: Back */}
          <div>
            {step > 1 && (
              <Button onClick={prev} className="bg-[#FABF24] text-black hover:bg-yellow-600">Back</Button>
            )}
          </div>

          {/* Right side: Next or Submit */}
          <div>
            {step < 5 && (
              <Button onClick={next} className="bg-[#FABF24] text-black hover:bg-yellow-600">
                Next
              </Button>
            )}
            {step === 5 && (
              <Button
                type="submit"
                className="bg-[#FABF24] text-black hover:bg-yellow-600"
                disabled={processing}
              >
                {processing ? 'Submitting...' : 'Submit Borrower'}
              </Button>
            )}
          </div>
        </div>

      </form>
    </AppLayout>
  );
}
