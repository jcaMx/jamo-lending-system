import { act, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, router, usePage } from '@inertiajs/react';
import { type BreadcrumbItem } from '@/types';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {route} from 'ziggy-js';


const breadcrumbs: BreadcrumbItem[] = [
{ title: 'Dashboard', href: '/dashboard' },
{ title: 'Loans', href: '/Loans' },
{ title: 'Add Loan', href: '/Loans/AddLoan' },
];


export default function AddLoan() {
  const [activeForm, setActiveForm] = useState<"existing" | "new">("existing");
const [form, setForm] = useState({
borrowerName: '',membershipDate: '',employmentStatus: '',incomeSource: '',monthlyIncome: '',validIdType: '',validIdNumber: '',
address: '',borrowerPhoto: '',loanAmount: '',interestType: '',loanType: '',interestRate: '',repaymentFrequency: '',term: '',
startDate: '',endDate: '',collateralType: 'motor',make: '',chassisNo: '',bodyType: '',plateNo: '',engineNo: '',yearModel: '',
series: '',fuel: '',ownershipProof: '',certificateOfTitleNo: '',location: '',description: '',area: '',atmType: '',
atmType1Details: '',atmType2Details: '',atmType3Details: '',spouseFullName: '',spouseMobileNumber: '',spouseAgencyAddress: '',spouseOccupation: '',
});

const [coBorrowers, setCoBorrowers] = useState([
{ fullName: '', address: '', email: '', contact: '', birthDate: '', maritalStatus: '', occupation: '', netPay: '' }
]);

 const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

const handleCoBorrowerChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
const { name, value } = e.target;
const updated = [...coBorrowers];
updated[index] = { ...updated[index], [name]: value };
setCoBorrowers(updated);
};

const addCoBorrower = () => {
setCoBorrowers([...coBorrowers, { fullName: '', address: '', email: '', contact: '', birthDate: '', maritalStatus: '', occupation: '', netPay: '' }]);
};

const removeCoBorrower = (index: number) => {
setCoBorrowers(coBorrowers.filter((_, i) => i !== index));
};

const handleSubmit = (e: React.FormEvent) => {
e.preventDefault();
router.post(route('loans.store'), { form, coBorrowers }, {
  onSuccess: () => {
    alert('Loan application submitted successfully!');
  },
  onError: (errors) => {
    console.error('Submission failed:', errors);
  },
});

};

return ( <AppLayout breadcrumbs={breadcrumbs}> <Head title="Add Loan Application" />

  <form onSubmit={handleSubmit} className="p-6 space-y-8">

    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Add Loan Application</h1>

      {activeForm === "existing" ? (
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">Borrower Information</h2>
            <button
              type="button"
              onClick={() => setActiveForm("new")}
              className="bg-yellow-600 text-white px-3 py-1 rounded"
            >
              New Borrower
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text" name="borrowerName" value={form.borrowerName} onChange={handleChange}placeholder="Full Name"className="w-full border rounded p-2" />
            <input type="date"name="membershipDate"value={form.membershipDate}onChange={handleChange}className="w-full border rounded p-2"/>
            <input type="text"name="employmentStatus"value={form.employmentStatus}onChange={handleChange}placeholder="Employment Status"className="w-full border rounded p-2"/>
            <input type="text"name="incomeSource"value={form.incomeSource}onChange={handleChange}placeholder="Income Source"className="w-full border rounded p-2"/>
            <input type="number"name="monthlyIncome"value={form.monthlyIncome}onChange={handleChange}placeholder="Monthly Income"className="w-full border rounded p-2"/>
            <input type="text"name="validIdType"value={form.validIdType}onChange={handleChange}placeholder="Valid ID Type"className="w-full border rounded p-2"/>
            <input type="text"name="validIdNumber"value={form.validIdNumber}onChange={handleChange}placeholder="Valid ID Number"className="w-full border rounded p-2"/>
            <input type="text"name="address"value={form.address}onChange={handleChange}placeholder="Address"className="w-full border rounded p-2"
            />
            <div>
              <label className="block mb-1 text-sm">Borrower Photo</label>
              <input type="file"name="borrowerPhoto"onChange={handleChange}className="w-full border rounded p-2"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow border p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg">New Borrower Information</h2>
            <button
              type="button"
              onClick={() => setActiveForm("existing")}
              className="bg-gray-600 text-white px-3 py-1 rounded"
            >
              Cancel
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Same borrower fields */}
            <input type="text"name="borrowerName"value={form.borrowerName}onChange={handleChange}placeholder="Full Name"className="w-full border rounded p-2"
            />
            <input type="date"name="membershipDate"value={form.membershipDate}onChange={handleChange}className="w-full border rounded p-2"
            />
            <input type="text"name="employmentStatus"value={form.employmentStatus}onChange={handleChange}placeholder="Employment Status"className="w-full border rounded p-2"
            />
            <input type="text"name="incomeSource"value={form.incomeSource}onChange={handleChange}placeholder="Income Source"className="w-full border rounded p-2"
            />
            <input type="number"name="monthlyIncome"value={form.monthlyIncome}onChange={handleChange}placeholder="Monthly Income"className="w-full border rounded p-2"
            />
            <input type="text"name="validIdType"value={form.validIdType}onChange={handleChange}placeholder="Valid ID Type"className="w-full border rounded p-2"
            />
            <input type="text"name="validIdNumber"value={form.validIdNumber}onChange={handleChange}placeholder="Valid ID Number"className="w-full border rounded p-2"
            />
            <input type="text"name="address"value={form.address}onChange={handleChange}placeholder="Address"className="w-full border rounded p-2"
            />

            {/* Spouse section */}
            <h3 className="col-span-2 font-semibold mt-4 border-b pb-1">
              Spouse Information
            </h3>
            <input type="text"name="spouseFullName"value={form.spouseFullName}onChange={handleChange}placeholder="Spouse Full Name"className="w-full border rounded p-2"
            />
            <input type="text"name="spouseAgencyAddress"value={form.spouseAgencyAddress}onChange={handleChange}placeholder="Agency/Employer Address"className="w-full border rounded p-2"
            />
            <input type="text"name="spouseOccupation"value={form.spouseOccupation}onChange={handleChange}placeholder="Occupation"className="w-full border rounded p-2"
            />
            <input type="text"name="spouseMobileNumber"value={form.spouseMobileNumber}onChange={handleChange}placeholder="Mobile Number"className="w-full border rounded p-2"
            />
          </div>
        </div>
      )}
    </div>
    {/* Loan Details */}
<div className="bg-white rounded-lg shadow border p-4">
  <h2 className="font-semibold text-lg mb-4">Loan Details</h2>
  <div className="grid md:grid-cols-2 gap-4">
    <input type="number"name="loanAmount"value={form.loanAmount}onChange={handleChange}placeholder="Loan Amount"className="w-full border rounded p-2"
    />

    {/* Interest Type dropdown */}
    <select name="interestType"value={form.interestType}onChange={handleChange}className="w-full border rounded p-2"
    >
      <option value="">Select Interest Type</option>
      <option value="diminishing">Diminishing</option>
      <option value="compound">Compound</option>
    </select>

    {/* Loan Type dropdown */}
    <select name="loanType"value={form.loanType}onChange={handleChange}className="w-full border rounded p-2"
    >
      <option value="">Select Loan Type</option>
      <option value="personal">Personal Loan</option>
      <option value="home">Home Loan</option>
      <option value="business">Business Loan</option>
      <option value="emergency">Emergency Loan</option>
    </select>

    <input type="number"name="interestRate"value={form.interestRate}onChange={handleChange}placeholder="Interest Rate %"className="w-full border rounded p-2"
    />
    <input type="text"name="repaymentFrequency"value={form.repaymentFrequency}onChange={handleChange}placeholder="Repayment Frequency"className="w-full border rounded p-2"
    />
    <input type="number"name="term"value={form.term}onChange={handleChange}placeholder="Term (months)"className="w-full border rounded p-2"
    />
    <input type="date"name="startDate"value={form.startDate}onChange={handleChange}placeholder="Start Date"className="w-full border rounded p-2"
    />
    <input type="date"name="endDate"value={form.endDate}onChange={handleChange}placeholder="End Date"className="w-full border rounded p-2"
    />
  </div>
</div>


    {/* Collateral */}
    <div className="bg-white rounded-lg shadow border p-4">
      <h2 className="font-semibold text-lg mb-4">Collateral</h2>
      <div>
        <label>Collateral Type</label>
        <select name="collateralType" value={form.collateralType} onChange={handleChange} className="w-full border rounded p-2 mb-4">
          <option value="motor">Motor/Car</option>
          <option value="land">Land Title</option>
          <option value="atm">ATM</option>
        </select>
      </div>

      {form.collateralType === 'motor' && (
        <div className="grid md:grid-cols-2 gap-4">
          {['make','chassisNo','bodyType','plateNo','engineNo','yearModel','series','fuel'].map((f) => (
            <input key={f} type="text" name={f} value={form[f as keyof typeof form]} onChange={handleChange} placeholder={f.replace(/([A-Z])/g,' $1')} className="w-full border rounded p-2" />
          ))}
        </div>
      )}

      {form.collateralType === 'land' && (
        <div className="grid md:grid-cols-2 gap-4">
          {['certificateOfTitleNo','location','description','area'].map((f) => (
            <input key={f} type="text" name={f} value={form[f as keyof typeof form]} onChange={handleChange} placeholder={f.replace(/([A-Z])/g,' $1')} className="w-full border rounded p-2" />
          ))}
        </div>
      )}

      {form.collateralType === 'atm' && (
        <div>
          <select name="atmType" value={form.atmType} onChange={handleChange} className="w-full border rounded p-2 mb-4">
            <option value="">Select ATM Type</option>
            <option value="atm_type1">ATM Type 1</option>
            <option value="atm_type2">ATM Type 2</option>
            <option value="atm_type3">ATM Type 3</option>
          </select>

          {form.atmType === 'atm_type1' && <input type="text" name="atmType1Details" value={form.atmType1Details} onChange={handleChange} placeholder="ATM Type 1 Details" className="w-full border rounded p-2 mb-2" />}
          {form.atmType === 'atm_type2' && <input type="text" name="atmType2Details" value={form.atmType2Details} onChange={handleChange} placeholder="ATM Type 2 Details" className="w-full border rounded p-2 mb-2" />}
          {form.atmType === 'atm_type3' && <input type="text" name="atmType3Details" value={form.atmType3Details} onChange={handleChange} placeholder="ATM Type 3 Details" className="w-full border rounded p-2 mb-2" />}
        </div>
      )}

      <div className="mt-4">
        <label>Upload Ownership Proof</label>
        <input type="file" name="ownershipProof" onChange={handleChange} className="w-full border rounded p-2" />
      </div>
    </div>

    {/* Co-Borrowers */}
    <div className="bg-white rounded-lg shadow border p-4">
      <div className="flex justify-between mb-4 items-center">
        <h2 className="font-semibold text-lg">Co-Borrowers</h2>
        <Button type="button" onClick={addCoBorrower}><Plus size={14} /> Add Co-Borrower</Button>
      </div>
      {coBorrowers.map((co, i) => (
        <div key={i} className="border rounded p-4 mb-4 relative">
          {coBorrowers.length > 1 && (
            <button type="button" onClick={() => removeCoBorrower(i)} className="absolute top-1 right-2 text-red-500">
              <Trash2 size={30} />
            </button>
          )}
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" name="fullName" value={co.fullName} onChange={(e) => handleCoBorrowerChange(i,e)} placeholder="Full Name" className="w-full border rounded p-2" />
            <input type="text" name="address" value={co.address} onChange={(e) => handleCoBorrowerChange(i,e)} placeholder="Address" className="w-full border rounded p-2" />
            <input type="text" name="email" value={co.email} onChange={(e) => handleCoBorrowerChange(i,e)} placeholder="Email" className="w-full border rounded p-2" />
            <input type="text" name="contact" value={co.contact} onChange={(e) => handleCoBorrowerChange(i,e)} placeholder="Contact" className="w-full border rounded p-2" />
            <input type="date" name="birthDate" value={co.birthDate} onChange={(e) => handleCoBorrowerChange(i,e)} placeholder="Date of Birth" className="w-full border rounded p-2" />
            <input type="text" name="maritalStatus" value={co.maritalStatus} onChange={(e) => handleCoBorrowerChange(i,e)} placeholder="Marital Status" className="w-full border rounded p-2" />
            <input type="text" name="occupation" value={co.occupation} onChange={(e) => handleCoBorrowerChange(i,e)} placeholder="Occupation" className="w-full border rounded p-2" />
            <input type="number" name="netPay" value={co.netPay} onChange={(e) => handleCoBorrowerChange(i,e)} placeholder="Net Pay" className="w-full border rounded p-2" />
          </div>
        </div>
      ))}
    </div>

    <div className="flex justify-end mt-4">
      <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600">
        Submit
        </Button>
    </div>
  </form>
</AppLayout>
);
}