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

const addCoBorrower = () => {
setCoBorrowers([...coBorrowers, { fullName: '', address: '', email: '', contact: '', birthDate: '', maritalStatus: '', occupation: '', netPay: '' }]);
};

            export default function AddLoan() {
               const [activeSection, setActiveSection] = useState<'borrower' | 'employment' | 'loan' | 'collateral' | 'coBorrowers'>('borrower');

               const [form, setForm] = useState({

                  first_name: '',
                  last_name: '',
                  membership_date: '',
                  birth_date: '',
                  gender: '',
                  email: '',
                  contact_no: '',
                  city: '',
                  address: '',
                  marital_status: '',
                  numof_dependentchild: '',
                  home_ownership: '',
                  employment_status: '',
                  income_source: '',
                  occupation: '',
                  monthly_income: '',
                  agency_address: '',
                  valid_id_type: '',
                  valid_id_num: '',
                  loanAmount: '',
                  interestRate: '',
                  interestType: '',
                  loanType: '',
                  repaymentFrequency: '',
                  term: '',
                  startDate: '',
                  endDate: '',
                  // Spouse (optional)
                  spouseFirstName: '',
                  spouseLastName: '',
                  spouseContactNo: '',
                  spouseOccupation: '',
                  spousePosition: '',
                  spouseAgencyAddress: '',
                  borrowerPhoto: null as File | null,
                  ownershipProof: null as File | null,
               });

               const [showSpouse, setShowSpouse] = useState(false);

               const [coBorrowers, setCoBorrowers] = useState([
                  { 
                     first_name: '', 
                     last_name: '',
                     age: '', 
                     birth_date: '', 
                     address: '', 
                     email: '', 
                     contact_no: '', 
                     occupation: '', 
                     marital_status: '', 
                     home_ownership: ''
                  }
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

               const handleCoBorrowerChange =
                  (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => 
                     {
                        const { name, value } = e.target;
                        
                        const updated = [...coBorrowers];

                        updated[index] = { ...updated[index], [name]: value };

                        setCoBorrowers(updated);
                     };

               const addCoBorrower = () => {
                  setCoBorrowers([...coBorrowers,
                     { 
                        first_name: '', 
                        last_name: '', 
                        age: '', 
                        birth_date: '', 
                        address: '', 
                        email: '', 
                        contact_no: '', occupation: '', marital_status: '', home_ownership: ''
                     }
                  ]);
               };

               const removeCoBorrower = (index:
                  number) => {
                     setCoBorrowers(coBorrowers.filter((_, i) => i !== index));
                  };

               const handleSubmit = (e: React.
                  FormEvent) => {
                     e.preventDefault();

                     const payload = {
                        borrower: {
                           first_name: form.
                           first_name,
                           last_name: form.last_name,
                           membership_date: form.membership_date,
                           birth_date: form.birth_date,
                           gender: form.gender,
                           email: form.email,
                           contact_no: form.contact_no,
                           marital_status: form.marital_status,
                           numof_dependentchild: form.numof_dependentchild,
                           home_ownership: form.home_ownership,
                        },
                        addresses: {
                           city: form.city,
                           address: form.address
                        },
                        employment: {
                           employment_status: form.employment_status,
                           income_source: form.income_source,
                           occupation: form.occupation,
                           monthly_income: form.monthly_income,
                           agency_address: form.agency_address,
                        }, 
                        ids: {
                           id_type: form.valid_id_type,
                           id_number: form.valid_id_num,
                        }, 
                        spouse: showSpouse 
                        ? {
                           first_name: form.spouseFirstName,
                           last_name: form.spouseLastName,
                           contact_no: form.spouseContactNo,
                           occupation: form.spouseOccupation,
                           position: form.spousePosition,
                           agency_address: form.spouseAgencyAddress,
                        }: null,
                        coBorrowers: coBorrowers,
                        loan: {
                           principal_amount: form.loanAmount,
                           interest_rate: form.interestRate,
                           interest_type: form.interestType,
                           loan_type: form.loanType,
                           repayment_frequency: form.repaymentFrequency,
                           term_months: form.term,
                           start_date: form.startDate,
                           end_date: form.endDate,
                        },
                        files: {
                           borrowerPhoto: form.borrowerPhoto,
                           ownershipProof: form.ownershipProof,
                        }
                     };

                     router.post(route('loans.store'), payload, {
                        onSuccess: () => {
                           alert('Loan application submitted successfully!');
                           router.visit(route('loans.applications'), { replace: true, preserveState: false });
                        },
                        onError: (errors) => console.error(errors),
                     });
                  };

                  const nextSection = () => {
                     const order: Array<typeof activeSection> = ['borrower', 'employment', 'loan', 'collateral', 'coBorrowers'];

                     const currentIndex = order.indexOf(activeSection);

                     if (currentIndex < order.length - 1) setActiveSection(order[currentIndex + 1]);
                  };

                  const prevSection = () => {
                     const order: Array<typeof activeSection> = ['borrower', 'employment', 'loan', 'collateral', 'coBorrowers'];
                     
                     const currentIndex = order.indexOf(activeSection);

                     if (currentIndex > 0) setActiveSection(order[currentIndex - 1]);
                  };

                  return ( 
                  <AppLayout breadcrumbs=
                  {breadcrumbs}> <Head title="Add Loan Application" />
                  
                  <form onSubmit={handleSubmit} className="p-6 space-y-8">
                     
                     <div className="p-6 space-y-8">
                        <h1 className="text-2xl font-bold">Add Loan Application</h1>
                     </div>
                        
                        {/* Borrower Info */}
               {activeSection === 'borrower' && (
                  <div className="bg-white rounded-lg shadow border p-4 space-y-4">
                     <h2 className="text-lg font-semibold">Borrower Information</h2>
                     <div className="grid md:grid-cols-2 gap-4">
                     <input type="text" name="first_name" value={form.first_name} onChange={handleChange} placeholder="First Name" className="w-full border rounded p-2" />
                     <input type="text" name="last_name" value={form.last_name} onChange={handleChange} placeholder="Last Name" className="w-full border rounded p-2" />
                     <input type="date" name="membership_date" value={form.membership_date} onChange={handleChange} className="w-full border rounded p-2" />
                     <input type="date" name="birth_date" value={form.birth_date} onChange={handleChange} className="w-full border rounded p-2" />
                     <input type="text" name="gender" value={form.gender} onChange={handleChange} placeholder="Gender" className="w-full border rounded p-2" />
                     <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border rounded p-2" />
                     <input type="text" name="contact_no" value={form.contact_no} onChange={handleChange} placeholder="Contact Number" className="w-full border rounded p-2" />
                     <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City" className="w-full border rounded p-2" />
                     <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="Address" className="w-full border rounded p-2" />
                     <input type="text" name="marital_status" value={form.marital_status} onChange={handleChange} placeholder="Marital Status" className="w-full border rounded p-2" />
                     <input type="number" name="numof_dependentchild" value={form.numof_dependentchild} onChange={handleChange} placeholder="Number of Dependent Children" className="w-full border rounded p-2" />
                     <input type="text" name="home_ownership" value={form.home_ownership} onChange={handleChange} placeholder="Home Ownership" className="w-full border rounded p-2" />
                     <div>
                        <label className="block mb-1 text-sm">Borrower Photo</label>
                        <input type="file" name="borrowerPhoto" onChange={handleChange} className="w-full border rounded p-2" />
                        <label className="flex items-center space-x-2">
                           <input type="checkbox" checked={showSpouse} onChange={() => setShowSpouse(!showSpouse)} className="form-checkbox" />
                           <span>Add Spouse Information (Optional)</span>
                        </label>

                     {showSpouse && (
                           <div className="grid md:grid-cols-2 gap-4 mt-2">
                              <input
                                 type="text"
                                 name="spouseFirstName"
                                 value={form.spouseFirstName}
                                 onChange={handleChange}
                                 placeholder="Spouse First Name"
                                 className="w-full border rounded p-2"
                              />
                              <input
                                 type="text"
                                 name="spouseLastName"
                                 value={form.spouseLastName}
                                 onChange={handleChange}
                                 placeholder="Spouse Last Name"
                                 className="w-full border rounded p-2"
                              />
                              <input
                                 type="text"
                                 name="spouseContactNo"
                                 value={form.spouseContactNo}
                                 onChange={handleChange}
                                 placeholder="Spouse Contact Number"
                                 className="w-full border rounded p-2"
                              />
                              <input
                                 type="text"
                                 name="spouseOccupation"
                                 value={form.spouseOccupation}
                                 onChange={handleChange}
                                 placeholder="Spouse Occupation"
                                 className="w-full border rounded p-2"
                              />
                              <input
                                 type="text"
                                 name="spousePosition"
                                 value={form.spousePosition}
                                 onChange={handleChange}
                                 placeholder="Spouse Position"
                                 className="w-full border rounded p-2"
                              />
                              <input
                                 type="text"
                                 name="spouseAgencyAddress"
                                 value={form.spouseAgencyAddress}
                                 onChange={handleChange}
                                 placeholder="Spouse Agency Address"
                                 className="w-full border rounded p-2"
                              />
                           </div>
                           )}
                     </div>
                     </div>
                  </div>
                     

               )}

               {/* Employment Section */}
               {activeSection === 'employment' && (
                  <div className="bg-white rounded-lg shadow border p-4 space-y-4">
                     <h2 className="text-lg font-semibold">Employment Information</h2>
                     <div className="grid md:grid-cols-2 gap-4">
                     <input type="text" name="employment_status" value={form.employment_status} onChange={handleChange} placeholder="Employment Status" className="w-full border rounded p-2" />
                     <input type="text" name="income_source" value={form.income_source} onChange={handleChange} placeholder="Income Source" className="w-full border rounded p-2" />
                     <input type="text" name="occupation" value={form.occupation} onChange={handleChange} placeholder="Occupation" className="w-full border rounded p-2" />
                     <input type="number" name="monthly_income" value={form.monthly_income} onChange={handleChange} placeholder="Monthly Income" className="w-full border rounded p-2" />
                     <input type="text" name="agency_address" value={form.agency_address} onChange={handleChange} placeholder="Agency Address" className="w-full border rounded p-2" />
                     <input type="text" name="valid_id_type" value={form.valid_id_type} onChange={handleChange} placeholder="Valid ID Type" className="w-full border rounded p-2" />
                     <input type="text" name="valid_id_number" value={form.valid_id_num} onChange={handleChange} placeholder="Valid ID Number" className="w-full border rounded p-2" />
                     </div>
                  </div>
               )}

               {/* Loan Section */}
               {activeSection === 'loan' && (
                  <div className="bg-white rounded-lg shadow border p-4 space-y-4">
                     <h2 className="text-lg font-semibold">Loan Information</h2>
                     <div className="grid md:grid-cols-2 gap-4">
                     <input type="number" name="loanAmount" value={form.loanAmount} onChange={handleChange} placeholder="Loan Amount" className="w-full border rounded p-2" />
                     <input type="number" name="interestRate" value={form.interestRate} onChange={handleChange} placeholder="Interest Rate %" className="w-full border rounded p-2" />
                     <select name="interestType" value={form.interestType} onChange={handleChange} className="w-full border rounded p-2">
                        <option value="">Select Interest Type</option>
                        <option value="Compound">Compound</option>
                        <option value="Diminishing">Diminishing</option>
                     </select>
                     <select name="loanType" value={form.loanType} onChange={handleChange} className="w-full border rounded p-2">
                        <option value="">Select Loan Type</option>
                        <option value="personal">Personal</option>
                        <option value="home">Home</option>
                        <option value="business">Business</option>
                        <option value="emergency">Emergency</option>
                     </select>
                     <input type="text" name="repaymentFrequency" value={form.repaymentFrequency} onChange={handleChange} placeholder="Repayment Frequency" className="w-full border rounded p-2" />
                     <input type="number" name="term" value={form.term} onChange={handleChange} placeholder="Term (Months)" className="w-full border rounded p-2" />
                     <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className="w-full border rounded p-2" />
                     <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className="w-full border rounded p-2" />
                     </div>
                  </div>
               )}

               {/* Co-Borrowers Section */}
               {activeSection === 'coBorrowers' && (
                  <div className="bg-white rounded-lg shadow border p-4 space-y-4">
                     <div className="flex justify-between items-center mb-4">
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
                           <input type="text" name="first_name" value={co.first_name} onChange={(e) => handleCoBorrowerChange(i, e)} placeholder="First Name" className="w-full border rounded p-2" />
                           <input type="text" name="last_name" value={co.last_name} onChange={(e) => handleCoBorrowerChange(i, e)} placeholder="Last Name" className="w-full border rounded p-2" />
                           <input type="date" name="birth_date" value={co.birth_date} onChange={(e) => handleCoBorrowerChange(i, e)} placeholder="Date of Birth" className="w-full border rounded p-2" />
                           <input type="number" name="age" value={co.age} onChange={(e) => handleCoBorrowerChange(i, e)} placeholder="Age" className="w-full border rounded p-2" />
                           <input type="text" name="address" value={co.address} onChange={(e) => handleCoBorrowerChange(i, e)} placeholder="Address" className="w-full border rounded p-2" />
                           <input type="text" name="email" value={co.email} onChange={(e) => handleCoBorrowerChange(i, e)} placeholder="Email" className="w-full border rounded p-2" />
                           <input type="text" name="contact_no" value={co.contact_no} onChange={(e) => handleCoBorrowerChange(i, e)} placeholder="Contact Number" className="w-full border rounded p-2" />
                           <input type="text" name="occupation" value={co.occupation} onChange={(e) => handleCoBorrowerChange(i, e)} placeholder="Occupation" className="w-full border rounded p-2" />
                           <input type="text" name="marital_status" value={co.marital_status} onChange={(e) => handleCoBorrowerChange(i, e)} placeholder="Marital Status" className="w-full border rounded p-2" />
                           <input type="text" name="home_ownership" value={co.home_ownership} onChange={(e) => handleCoBorrowerChange(i, e)} placeholder="Home Ownership" className="w-full border rounded p-2" />
                        </div>
                     </div>
                     ))}
                  </div>
               )}

               {/* Navigation Buttons */}
               <div className="flex justify-between mt-4">
                  {activeSection !== 'borrower' && (
                     <Button type="button" onClick={prevSection} className="bg-gray-500 hover:bg-gray-600">Previous</Button>
                  )}
                  {activeSection !== 'coBorrowers' && (
                     <Button type="button" onClick={nextSection} className="bg-yellow-500 hover:bg-yellow-600">Next</Button>
                  )}
                  {activeSection === 'coBorrowers' && (
                     <Button type="submit" className="bg-green-500 hover:bg-green-600">Submit</Button>
                  )}
               </div>
               </form>
            </AppLayout>
         );
         }
