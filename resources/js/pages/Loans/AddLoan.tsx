import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Plus, Trash2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Loans', href: '/Loans' },
  { title: 'Add Loan', href: '/Loans/AddLoan' },
];

export default function AddLoan() {
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
    collateralType: '',
    make: '',
    chassisNo: '',
    bodyType: '',
    plateNo: '',
    engineNo: '',
    yearModel: '',
    series: '',
    fuel: '',
    ownershipProof: '',
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

  const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const { name, value } = e.target;
  setForm((prev) => ({ ...prev, [name]: value }));
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
  console.log('Submitting:', { form, coBorrowers });
  // Inertia.post('/loans', { ...form, coBorrowers })
};

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



  const SectionHeader = ({ title, buttonLabel }: any) => (
    <div className="flex justify-between items-center bg-yellow-50 border-b-2 border-yellow-400 px-4 py-2 rounded-t">
      <h2 className="font-semibold text-lg">{title}</h2>
      {buttonLabel && (
        <button
          type="button"
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

        {/* === Borrower Information === */}
        <div className="bg-white rounded-lg shadow border text-black">
          <SectionHeader title={<><span>Borrower Information</span> <span className="text-sm text-gray-500">(Existing)</span></>} buttonLabel="New Borrower" /> 
          <div className="p-4 grid md:grid-cols-2 gap-4">
            <Input label="Borrower Name" name="borrowerName" value={form.borrowerName} onChange={handleChange} placeholder="Choose borrower" />
            <Input label="Membership Date" type="date" name="membershipDate" value={form.membershipDate} onChange={handleChange} />
            <Input label="Employment Status" name="employmentStatus" value={form.employmentStatus} onChange={handleChange} placeholder="Select Status" />
            <Input label="Income Source" name="incomeSource" value={form.incomeSource} onChange={handleChange} placeholder="e.g., Sari-sari Store" />
            <Input label="Monthly Income (₱)" name="monthlyIncome" value={form.monthlyIncome} onChange={handleChange} />
            <Input label="Valid ID Type" name="validIdType" value={form.validIdType} onChange={handleChange} placeholder="e.g., Driver's License" />
            <Input label="Valid ID Number" name="validIdNumber" value={form.validIdNumber} onChange={handleChange} />
            <Input label="Address" name="address" value={form.address} onChange={handleChange} />
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Borrower Photo</label>
              <input type="file" name="borrowerPhoto" onChange={handleChange} className="w-full border rounded px-3 py-2" />
            </div>
          </div>
        </div>

        {/* === Loan Details === */}
        <div className="bg-white rounded-lg shadow border text-black">
          <SectionHeader title="Loan Details" />
          <div className="p-4 grid md:grid-cols-2 gap-4">
            <Input label="Loan Amount (₱)" name="loanAmount" value={form.loanAmount} onChange={handleChange} />
            <Input label="Interest Type" name="interestType" value={form.interestType} onChange={handleChange} placeholder="Select Interest Type" />
            <Input label="Loan Type" name="loanType" value={form.loanType} onChange={handleChange} />
            <Input label="Interest Rate (%)" name="interestRate" value={form.interestRate} onChange={handleChange} placeholder="e.g. 5%" />
            <Input label="Repayment Frequency" name="repaymentFrequency" value={form.repaymentFrequency} onChange={handleChange} placeholder="Select Frequency" />
            <Input label="Term (months)" name="term" value={form.term} onChange={handleChange} />
            <Input label="Start Date" type="date" name="startDate" value={form.startDate} onChange={handleChange} />
            <Input label="End Date" type="date" name="endDate" value={form.endDate} onChange={handleChange} />
          </div>
        </div>

        {/* === Collateral === */}
        <div className="bg-white rounded-lg shadow border text-black">
          <SectionHeader title="Collateral" buttonLabel="Add Collateral" />
          <div className="p-4 space-y-4">
            <Input label="Collateral Type" name="collateralType" value={form.collateralType} onChange={handleChange} placeholder="Motor/Car Collateral" />
            <div className="grid md:grid-cols-2 gap-4">
              <Input label="Make" name="make" value={form.make} onChange={handleChange} />
              <Input label="Chassis No." name="chassisNo" value={form.chassisNo} onChange={handleChange} />
              <Input label="Body Type" name="bodyType" value={form.bodyType} onChange={handleChange} />
              <Input label="Plate No." name="plateNo" value={form.plateNo} onChange={handleChange} />
              <Input label="Engine No." name="engineNo" value={form.engineNo} onChange={handleChange} />
              <Input label="Year Model" name="yearModel" value={form.yearModel} onChange={handleChange} />
              <Input label="Series" name="series" value={form.series} onChange={handleChange} />
              <Input label="Fuel" name="fuel" value={form.fuel} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Ownership Proof (Collateral Files)
              </label>
              <input type="file" name="ownershipProof" onChange={handleChange} className="w-full border rounded px-3 py-2" />
              <p className="text-xs text-gray-500 mt-1">
                Accepted formats: PDF, DOC, DOCX, JPG, PNG
              </p>
            </div>
          </div>
        </div>

        {/* === Co-Borrowers === */}
        <div className="bg-white rounded-lg shadow border text-black">
          <SectionHeader title="Co-Borrowers" buttonLabel="Add Co-Borrower" />
          <div className="p-4 space-y-6">
            {coBorrowers.map((co, i) => (
              <div key={i} className="border rounded-lg p-4 relative">
                <p className="font-semibold mb-3">Co-Borrower {i + 1}</p>
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
                  <Input label="Full Name" name="fullName" value={co.fullName} onChange={(e) => handleCoBorrowerChange(i, e)} />
                  <Input label="Address" name="address" value={co.address} onChange={(e) => handleCoBorrowerChange(i, e)} />
                  <Input label="Email" name="email" value={co.email} onChange={(e) => handleCoBorrowerChange(i, e)} />
                  <Input label="Contact Number" name="contact" value={co.contact} onChange={(e) => handleCoBorrowerChange(i, e)} placeholder="09XX XXX XXXX" />
                  <Input label="Date of Birth" type="date" name="birthDate" value={co.birthDate} onChange={(e) => handleCoBorrowerChange(i, e)} />
                  <Input label="Marital Status" name="maritalStatus" value={co.maritalStatus} onChange={(e) => handleCoBorrowerChange(i, e)} placeholder="Select Status" />
                  <Input label="Occupation" name="occupation" value={co.occupation} onChange={(e) => handleCoBorrowerChange(i, e)} />
                  <Input label="Net Pay" name="netPay" value={co.netPay} onChange={(e) => handleCoBorrowerChange(i, e)} />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={addCoBorrower}
              className="text-sm text-yellow-600 font-medium hover:underline"
            >
              + Add Co-Borrower
            </button>
          </div>
        </div>

        {/* Submit */}
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
