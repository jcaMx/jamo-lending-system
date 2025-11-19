import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Loans', href: '/Loans' },
  { title: 'Add Loan', href: '/Loans/AddLoan' },
];

export default function AddLoan() {
  /** ---------- STATES ---------- */
  const [form, setForm] = useState({
    borrowerName: '',
    membershipDate: '',
    employmentStatus: '',
    incomeSource: '',
    monthlyIncome: '',
    validIdType: '',
    validIdNumber: '',
    address: '',
    borrowerPhoto: '',
    loanAmount: '',
    interestType: '',
    loanType: '',
    interestRate: '',
    repaymentFrequency: '',
    term: '',
    startDate: '',
    endDate: '',
    collateralType: 'motor',
    make: '',
    chassisNo: '',
    bodyType: '',
    plateNo: '',
    engineNo: '',
    yearModel: '',
    series: '',
    fuel: '',
    ownershipProof: '',
    certificateOfTitleNo: '',
    location: '',
    description: '',
    area: '',
    atmType: '',
    atmType1Details: '',
    atmType2Details: '',
    atmType3Details: '',
  });

  const [spouse, setSpouse] = useState({
    fullName: '',
    mobileNumber: '',
    agencyAddress: '',
    occupation: '',
  });

  const [coBorrowers, setCoBorrowers] = useState([
    {
      fullName: '',
      address: '',
      email: '',
      contact: '',
      birthDate: '',
      maritalStatus: '',
      occupation: '',
      netPay: '',
    },
  ]);

  // Toggle state for forms
  const [activeForm, setActiveForm] = useState<
    'borrower' | 'collateral' | 'coborrower' | null
  >(null);

  /** ---------- HANDLERS ---------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpouseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSpouse((prev) => ({ ...prev, [name]: value }));
  };

  const handleCoBorrowerChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCoBorrowers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  };

  const addCoBorrower = () => {
    setCoBorrowers([
      ...coBorrowers,
      {
        fullName: '',
        address: '',
        email: '',
        contact: '',
        birthDate: '',
        maritalStatus: '',
        occupation: '',
        netPay: '',
      },
    ]);
  };

  const removeCoBorrower = (index: number) => {
    const newList = [...coBorrowers];
    newList.splice(index, 1);
    setCoBorrowers(newList);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Submitting:', { form, coBorrowers, spouse });
  };

  /** ---------- INPUT COMPONENT ---------- */
  interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
  }

  const Input: React.FC<InputProps> = ({ label, ...props }) => (
    <div>
      <label className="block text-sm font-medium mb-1 text-black">{label}</label>
      <input
        {...props}
        className="w-full border rounded px-3 py-2 text-black placeholder-black"
      />
    </div>
  );

  /** ---------- SECTION HEADER ---------- */
  const SectionHeader = ({ title, buttonLabel, onClick }: any) => (
    <div className="flex justify-between items-center bg-yellow-50 border-b-2 border-yellow-400 px-4 py-2 rounded-t">
      <h2 className="font-semibold text-lg">{title}</h2>
      {buttonLabel && (
        <button
          type="button"
          onClick={onClick}
          className="flex items-center gap-1 text-sm bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
        >
          <Plus size={14} /> {buttonLabel}
        </button>
      )}
    </div>
  );

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Loan Application" />

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <h1 className="text-2xl font-bold">Add Loan Application</h1>

        {/** ------------------ TOGGLE: BORROWER ------------------ */}
        {activeForm === 'borrower' ? (
          <div className="bg-white rounded-lg shadow border p-4">
            <SectionHeader
              title="Add New Borrower"
              buttonLabel="Cancel"
              onClick={() => setActiveForm(null)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <h3 className="col-span-2 font-semibold text-black mb-2 border-b pb-1">
                Borrower Information
              </h3>
              <Input label="Full Name" name="borrowerFullName" />
              <Input label="Date of Birth" type="date" name="borrowerBirthDate" />
              <Input label="Marital Status" name="borrowerMaritalStatus" />
              <Input label="Age" name="borrowerAge" />
              <Input label="Permanent Home Address" name="borrowerAddress" />
              <Input label="Home Ownership" name="borrowerHomeOwnership" />
              <Input label="Mobile Number" name="borrowerMobileNumber" />
              <Input label="No. of Dependant Child" name="borrowerDependentChild" />
              <Input label="Occupation" name="borrowerOccupation" />
              <Input label="Net Pay" name="borrowerNetPay" />

              <h3 className="col-span-2 font-semibold text-black mt-4 mb-2 border-b pb-1">
                Spouse (if applicable)
              </h3>
              <Input
                label="Spouse Full Name"
                name="spouseFullName"
                value={spouse.fullName}
                onChange={handleSpouseChange}
              />
              <Input
                label="Agency/Employer's Address"
                name="spouseAgencyAddress"
                value={spouse.agencyAddress}
                onChange={handleSpouseChange}
              />
              <Input
                label="Occupation"
                name="spouseOccupation"
                value={spouse.occupation}
                onChange={handleSpouseChange}
              />
              <Input
                label="Mobile Number"
                name="spouseMobileNumber"
                value={spouse.mobileNumber}
                onChange={handleSpouseChange}
              />
            </div>

            <div className="flex justify-end mt-5">
              <button className="bg-yellow-500 px-5 py-2 text-white rounded">
                Save Borrower
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border text-black">
            <SectionHeader
              title={
                <>
                  <span>Borrower Information</span>{' '}
                  <span className="text-sm text-gray-500">(Existing)</span>
                </>
              }
              buttonLabel="New Borrower"
              onClick={() => setActiveForm('borrower')}
            />
            <div className="p-4 grid md:grid-cols-2 gap-4">
              <Input
                label="Borrower Name"
                name="borrowerName"
                value={form.borrowerName}
                onChange={handleChange}
              />
              <Input
                label="Membership Date"
                type="date"
                name="membershipDate"
                value={form.membershipDate}
                onChange={handleChange}
              />
              <Input
                label="Employment Status"
                name="employmentStatus"
                value={form.employmentStatus}
                onChange={handleChange}
              />
              <Input
                label="Income Source"
                name="incomeSource"
                value={form.incomeSource}
                onChange={handleChange}
              />
              <Input
                label="Monthly Income (₱)"
                name="monthlyIncome"
                value={form.monthlyIncome}
                onChange={handleChange}
              />
              <Input
                label="Valid ID Type"
                name="validIdType"
                value={form.validIdType}
                onChange={handleChange}
              />
              <Input
                label="Valid ID Number"
                name="validIdNumber"
                value={form.validIdNumber}
                onChange={handleChange}
              />
              <Input
                label="Address"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Borrower Photo</label>
                <input
                  type="file"
                  name="borrowerPhoto"
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>
        )}

        {/** ------------------ LOAN DETAILS ------------------ */}
        <div className="bg-white rounded-lg shadow border text-black">
          <SectionHeader title="Loan Details" />
          <div className="p-4 grid md:grid-cols-2 gap-4">
            <Input
              label="Loan Amount (₱)"
              name="loanAmount"
              value={form.loanAmount}
              onChange={handleChange}
            />
            <Input
              label="Interest Type"
              name="interestType"
              value={form.interestType}
              onChange={handleChange}
            />
            <Input
              label="Loan Type"
              name="loanType"
              value={form.loanType}
              onChange={handleChange}
            />
            <Input
              label="Interest Rate (%)"
              name="interestRate"
              value={form.interestRate}
              onChange={handleChange}
            />
            <Input
              label="Repayment Frequency"
              name="repaymentFrequency"
              value={form.repaymentFrequency}
              onChange={handleChange}
            />
            <Input label="Term (months)" name="term" value={form.term} onChange={handleChange} />
            <Input
              label="Start Date"
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
            />
            <Input
              label="End Date"
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
            />
          </div>
        </div>

      {/* Collateral */}
<div className="bg-white rounded-lg shadow border text-black p-4">
  <SectionHeader title="Collateral" />

  <div className="space-y-4 mt-4">
    {/* Collateral Type Dropdown */}
    <div>
      <label className="block text-sm font-medium mb-1">Collateral Type</label>
      <select
        className="w-full border rounded px-3 py-2"
        value={form.collateralType}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, collateralType: e.target.value }))
        }
      >
        <option value="motor">Motor/Car</option>
        <option value="land">Land Title</option>
        <option value="atm">ATM</option>
      </select>
    </div>

    {/* Motor/Car Fields */}
    {form.collateralType === 'motor' && (
      <div className="grid md:grid-cols-2 gap-4 mt-2">
        <Input label="Make" name="make" value={form.make} onChange={handleChange} />
        <Input label="Chassis No." name="chassisNo" value={form.chassisNo} onChange={handleChange} />
        <Input label="Body Type" name="bodyType" value={form.bodyType} onChange={handleChange} />
        <Input label="Plate No." name="plateNo" value={form.plateNo} onChange={handleChange} />
        <Input label="Engine No." name="engineNo" value={form.engineNo} onChange={handleChange} />
        <Input label="Year Model" name="yearModel" value={form.yearModel} onChange={handleChange} />
        <Input label="Series" name="series" value={form.series} onChange={handleChange} />
        <Input label="Fuel" name="fuel" value={form.fuel} onChange={handleChange} />
      </div>
    )}

    {/* Land Title Fields */}
    {form.collateralType === 'land' && (
      <div className="grid md:grid-cols-2 gap-4 mt-2">
        <Input label="Certificate of Title No." name="certificateOfTitleNo" value={form.certificateOfTitleNo} onChange={handleChange} />
        <Input label="Location" name="location" value={form.location} onChange={handleChange} />
        <Input label="Description" name="description" value={form.description} onChange={handleChange} />
        <Input label="Area" name="area" value={form.area} onChange={handleChange} />
      </div>
    )}

    {/* ATM Fields */}
    {form.collateralType === 'atm' && (
      <div className="mt-2 space-y-4">
        {/* ATM Type Dropdown (just like Collateral Type) */}
        <div>
          <label className="block text-sm font-medium mb-1">ATM Type</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={form.atmType}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, atmType: e.target.value }))
            }
          >
            <option value="">Select ATM Type</option>
            <option value="atm_type1">ATM Type 1</option>
            <option value="atm_type2">ATM Type 2</option>
            <option value="atm_type3">ATM Type 3</option>
          </select>
        </div>

        {/* Section for the selected ATM type */}
        {form.atmType === 'atm_type1' && (
          <Input label="ATM Type 1 Details" name="atmType1Details" value={form.atmType1Details} onChange={handleChange} />
        )}
        {form.atmType === 'atm_type2' && (
          <Input label="ATM Type 2 Details" name="atmType2Details" value={form.atmType2Details} onChange={handleChange} />
        )}
        {form.atmType === 'atm_type3' && (
          <Input label="ATM Type 3 Details" name="atmType3Details" value={form.atmType3Details} onChange={handleChange} />
        )}
      </div>
    )}

    {/* Ownership Proof */}
    <div className="mt-4">
      <label className="text-sm font-medium text-black">Upload Ownership Proof</label>
      <input type="file" name="ownershipProof" onChange={handleChange} className="block w-full border p-2 rounded" />
    </div>

    <div className="flex justify-end mt-5">
      <button className="bg-yellow-500 px-5 py-2 text-white rounded">Save Collateral</button>
    </div>
  </div>
</div>

        {/** ------------------ TOGGLE: CO-BORROWER ------------------ */}
        {activeForm === 'coborrower' ? (
          <div className="bg-white rounded-lg shadow border p-4">
            <SectionHeader
              title="Add Co-Borrower"
              buttonLabel="Cancel"
              onClick={() => setActiveForm(null)}
            />
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Input label="Full Name" name="coFullName" />
              <Input label="Address" name="coAddress" />
              <Input label="Email" name="coEmail" />
              <Input label="Contact" name="coContact" />
              <Input label="Birth Date" type="date" name="coBirthDate" />
              <Input label="Marital Status" name="coMaritalStatus" />
              <Input label="Occupation" name="coOccupation" />
              <Input label="Net Pay" name="coNetPay" />
            </div>
            <div className="flex justify-end mt-5">
              <Button>Add Co-Borrower</Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border text-black">
            <SectionHeader
              title="Co-Borrowers"
              buttonLabel="Add Co-Borrower"
              onClick={() => setActiveForm('coborrower')}
            />
            <div className="p-4 space-y-6">
              {coBorrowers.map((co, i) => (
                <div key={i} className="border rounded-lg p-4 relative">
                  <p className="font-semibold mb-3">Co-Borrower</p>
                  {coBorrowers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCoBorrower(i)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      name="fullName"
                      value={co.fullName}
                      onChange={(e) => handleCoBorrowerChange(i, e)}
                    />
                    <Input
                      label="Address"
                      name="address"
                      value={co.address}
                      onChange={(e) => handleCoBorrowerChange(i, e)}
                    />
                    <Input
                      label="Email"
                      name="email"
                      value={co.email}
                      onChange={(e) => handleCoBorrowerChange(i, e)}
                    />
                    <Input
                      label="Contact Number"
                      name="contact"
                      value={co.contact}
                      onChange={(e) => handleCoBorrowerChange(i, e)}
                    />
                    <Input
                      label="Date of Birth"
                      type="date"
                      name="birthDate"
                      value={co.birthDate}
                      onChange={(e) => handleCoBorrowerChange(i, e)}
                    />
                    <Input
                      label="Marital Status"
                      name="maritalStatus"
                      value={co.maritalStatus}
                      onChange={(e) => handleCoBorrowerChange(i, e)}
                    />
                    <Input
                      label="Occupation"
                      name="occupation"
                      value={co.occupation}
                      onChange={(e) => handleCoBorrowerChange(i, e)}
                    />
                    <Input
                      label="Net Pay"
                      name="netPay"
                      value={co.netPay}
                      onChange={(e) => handleCoBorrowerChange(i, e)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 shadow"
          >
            Submit
          </button>
        </div>
      </form>
    </AppLayout>
  );
}
