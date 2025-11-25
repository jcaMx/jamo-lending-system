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

type BorrowerForm = {
  first_name: string;
  last_name: string;
  membership_date: string | null;
  birth_date: string | null;
  age: string;
  gender: string;
  email: string;
  contact_no: string;
  city: string;
  address: string;
  land_line: string;
  marital_status: string;
  numof_dependentchild: string;
};

type BorrowerEmploymentForm = {
  employment_status: string;
  income_source: string;
  occupation: string;
  position: string;
  agency_address: string;
  monthly_income: string;
};

type BorrowerIdsForm = {
  id_type: string;
  id_number: string;
};

type SpouseForm = {
  first_name: string;
  last_name: string;
  mobile_number: string;
  agency_address: string;
  occupation: string;
};

type CoBorrowerForm = {
  first_name: string;
  last_name: string;
  address: string;
  email: string;
  contact_no: string;
  birth_date: string;
  marital_status: string;
  occupation: string;
  net_pay: string;
};

type LoanForm = {
  loan_amount: string;
  interest_type: string;
  loan_type: string;
  interest_rate: string;
  repayment_frequency: string;
  term: string;
  start_date: string;
  end_date: string;
};

type CollateralBaseForm = {
  type: 'vehicle' | 'land' | 'atm';
  estimated_value: string;
  appraisal_date: string;
  appraised_by: string;
  ownership_proof: File | null;
  status: string;
  remarks: string;
  description: string;
};

type VehicleCollateralForm = {
  type: string;
  brand: string;
  model: string;
  year_model: string;
  plate_no: string;
  engine_no: string;
  transmission_type: string;
  fuel_type: string;
};

type LandCollateralForm = {
  title_no: string;
  lot_no: string;
  location: string;
  area_size: string;
};

type ATMCollateralForm = {
  bank_name: string;
  account_no: string;
  cardno_4digits: string;
};



export default function AddLoan() {
  /** ---------- STATES ---------- */
  const [borrower, setBorrower] = useState<BorrowerForm>({
    first_name: '',
    last_name: '',
    membership_date: null,
    birth_date: null,
    age: '',
    gender: '',
    email: '',
    contact_no: '',
    city: '',
    address: '',
    land_line: '',
    marital_status: '',
    numof_dependentchild: '',
  });

  const [employment, setEmployment] = useState<BorrowerEmploymentForm>({
    employment_status: '',
    income_source: '',
    occupation: '',
    position: '',
    agency_address: '',
    monthly_income: '',
  });

  const [borrowerId, setBorrowerId] = useState<BorrowerIdsForm>({
    id_type: '',
    id_number: '',
  });

  const [spouse, setSpouse] = useState<SpouseForm>({
    first_name: '',
    last_name: '',
    mobile_number: '',
    agency_address: '',
    occupation: '',
  });

  const [coBorrowers, setCoBorrowers] = useState<CoBorrowerForm[]>([
    {
      first_name: '',
      last_name: '',
      address: '',
      email: '',
      contact_no: '',
      birth_date: '',
      marital_status: '',
      occupation: '',
      net_pay: '',
    },
  ]);

  const [loan, setLoan] = useState<LoanForm>({
    loan_amount: '',
    interest_type: '',
    loan_type: '',
    interest_rate: '',
    repayment_frequency: '',
    term: '',
    start_date: '',
    end_date: '',
  });

  const [collateral, setCollateral] = useState<{
    base: CollateralBaseForm;
    vehicle?: VehicleCollateralForm;
    land?: LandCollateralForm;
    atm?: ATMCollateralForm;
  }>({
    base: {
      type: 'vehicle',
      estimated_value: '',
      appraisal_date: '',
      appraised_by: '',
      ownership_proof: null,
      status: '',
      remarks: '',
      description: '',
    },
    vehicle: {
      type: '',
      brand: '',
      model: '',
      year_model: '',
      plate_no: '',
      engine_no: '',
      transmission_type: '',
      fuel_type: '',
    },
    land: {
      title_no: '',
      lot_no: '',
      location: '',
      area_size: '',
    },
    atm: {
      bank_name: '',
      account_no: '',
      cardno_4digits: '',
    },
  });

  // Toggle state for forms
  const [activeForm, setActiveForm] = useState<
    'borrower' | 'collateral' | 'coborrower' | null
  >(null);

  /** ---------- HANDLERS ---------- */
  const handleChange =
    (setter: Function) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, files } = e.target as any;
      setter((prev: any) => ({
        ...prev,
        [name]: files ? files[0] : value,
      }));
    };

  const handleCoBorrowerChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCoBorrowers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  };

  const addCoBorrower = () => {
    setCoBorrowers((prev) => [
      ...prev,
      {
        first_name: '',
        last_name: '',
        address: '',
        email: '',
        contact_no: '',
        birth_date: '',
        marital_status: '',
        occupation: '',
        net_pay: '',
      },
    ]);
  };

  const removeCoBorrower = (index: number) => {
    const updated = [...coBorrowers];
    updated.splice(index, 1);
    setCoBorrowers(updated);
  };

const handleCollateralBaseChange = (e: any) => {
  const { name, value, files } = e.target;
  setCollateral(prev => ({
    ...prev,
    base: {
      ...prev.base,
      [name]: files ? files[0] : value,
    },
  }));
};


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({
      borrower,
      employment,
      borrowerId,
      spouse,
      coBorrowers,
      loan,
      collateral,
    });
  };

  /** ---------- INPUT COMPONENT ---------- */

  const Input = ({ label, ...props }: any) => (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        {...props}
        className="w-full border rounded px-3 py-2"
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
              title="Add Borrower"
              buttonLabel="Cancel"
              onClick={() => setActiveForm(null)}
            />
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <Input label="First Name" name="first_name" value={borrower.first_name} onChange={handleChange(setBorrower)} />
              <Input label="Last Name" name="last_name" value={borrower.last_name} onChange={handleChange(setBorrower)} />
              <Input label="Membership Date" type="date" name="membership_date" value={borrower.membership_date || ''} onChange={handleChange(setBorrower)} />
              <Input label="Birth Date" type="date" name="birth_date" value={borrower.birth_date || ''} onChange={handleChange(setBorrower)} />
              <Input label="Age" name="age" value={borrower.age} onChange={handleChange(setBorrower)} />
              <Input label="Gender" name="gender" value={borrower.gender} onChange={handleChange(setBorrower)} />
              <Input label="Email" name="email" value={borrower.email} onChange={handleChange(setBorrower)} />
              <Input label="Contact No" name="contact_no" value={borrower.contact_no} onChange={handleChange(setBorrower)} />
              <Input label="City" name="city" value={borrower.city} onChange={handleChange(setBorrower)} />
              <Input label="Address" name="address" value={borrower.address} onChange={handleChange(setBorrower)} />
              <Input label="Land Line" name="land_line" value={borrower.land_line} onChange={handleChange(setBorrower)} />
              <Input label="Marital Status" name="marital_status" value={borrower.marital_status} onChange={handleChange(setBorrower)} />
              <Input label="No. of Dependent Child" name="numof_dependentchild" value={borrower.numof_dependentchild} onChange={handleChange(setBorrower)} />
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border">
            <SectionHeader
              title="Borrower Information (Existing)"
              buttonLabel="New Borrower"
              onClick={() => setActiveForm('borrower')}
            />
          </div>
        )}

        {/** ---------- Employment Section ---------- */}
        <div className="bg-white rounded-lg shadow border p-4">
          <SectionHeader title="Employment Information" />
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <Input label="Employment Status" name="employment_status" value={employment.employment_status} onChange={handleChange(setEmployment)} />
            <Input label="Income Source" name="income_source" value={employment.income_source} onChange={handleChange(setEmployment)} />
            <Input label="Occupation" name="occupation" value={employment.occupation} onChange={handleChange(setEmployment)} />
            <Input label="Position" name="position" value={employment.position} onChange={handleChange(setEmployment)} />
            <Input label="Agency Address" name="agency_address" value={employment.agency_address} onChange={handleChange(setEmployment)} />
            <Input label="Monthly Income" name="monthly_income" value={employment.monthly_income} onChange={handleChange(setEmployment)} />
          </div>
        </div>

        {/** ---------- Borrower ID Section ---------- */}
        <div className="bg-white rounded-lg shadow border p-4">
          <SectionHeader title="Valid ID" />
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <Input label="ID Type" name="id_type" value={borrowerId.id_type} onChange={handleChange(setBorrowerId)} />
            <Input label="ID Number" name="id_number" value={borrowerId.id_number} onChange={handleChange(setBorrowerId)} />
          </div>
        </div>

        {/** ---------- Spouse Section ---------- */}
        <div className="bg-white rounded-lg shadow border p-4">
          <SectionHeader title="Spouse Information" />
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <Input label="First Name" name="first_name" value={spouse.first_name} onChange={handleChange(setSpouse)} />
            <Input label="Last Name" name="last_name" value={spouse.last_name} onChange={handleChange(setSpouse)} />
            <Input label="Mobile Number" name="mobile_number" value={spouse.mobile_number} onChange={handleChange(setSpouse)} />
            <Input label="Agency Address" name="agency_address" value={spouse.agency_address} onChange={handleChange(setSpouse)} />
            <Input label="Occupation" name="occupation" value={spouse.occupation} onChange={handleChange(setSpouse)} />
          </div>
        </div>

        {/** ---------- Co-Borrowers Section ---------- */}
        <div className="bg-white rounded-lg shadow border p-4">
          <SectionHeader
            title="Co-Borrowers"
            buttonLabel="Add Co-Borrower"
            onClick={() => setActiveForm('coborrower')}
          />
          {coBorrowers.map((co, i) => (
            <div key={i} className="border rounded p-4 relative">
              <p className="font-semibold mb-2">Co-Borrower</p>
              {coBorrowers.length > 1 && (
                <button
                  type="button"
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  onClick={() => removeCoBorrower(i)}
                >
                  <Trash2 size={16} />
                </button>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                {Object.keys(co).map((key) => (
                  <Input
                    key={key}
                    label={key.replace('_', ' ').toUpperCase()}
                    name={key}
                    value={co[key as keyof CoBorrowerForm]}
                    onChange={handleCoBorrowerChange(i)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/** ---------- Loan Section ---------- */}
        <div className="bg-white rounded-lg shadow border p-4">
          <SectionHeader title="Loan Details" />
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {Object.keys(loan).map((key) => (
              <Input
                key={key}
                label={key.replace('_', ' ').toUpperCase()}
                name={key}
                value={loan[key as keyof LoanForm]}
                onChange={handleChange(setLoan)}
              />
            ))}
          </div>
        </div>

        {/** ---------- Collateral Section ---------- */}
        <div className="bg-white rounded-lg shadow border p-4">
          <SectionHeader title="Collateral" />
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <label>Collateral Type</label>
            <select
              className="border rounded px-3 py-2"
              value={collateral.base.type}
              onChange={(e) =>
                setCollateral((prev) => ({
                  ...prev,
                  base: { ...prev.base, type: e.target.value as any },
                }))
              }
              >
              <option value="vehicle">Vehicle</option>
              <option value="land">Land</option>
              <option value="atm">ATM</option>
            </select>
          
            <Input label="Estimated Value" name="estimated_value" value={collateral.base.estimated_value} onChange=
            {handleCollateralBaseChange}/>
            <Input label="Appraisal Date" type="date" name="appraisal_date" value={collateral.base.appraisal_date} onChange={handleChange((v: any) => setCollateral(prev => ({ ...prev, base: { ...prev.base, ...v } })))} />
            <Input label="Appraised By" name="appraised_by" value={collateral.base.appraised_by} onChange={handleChange((v: any) => setCollateral(prev => ({ ...prev, base: { ...prev.base, ...v } })))} />
          </div>

          {collateral.base.type === 'vehicle' && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {Object.keys(collateral.vehicle!).map((key) => (
                <Input
                  key={key}
                  label={key.replace('_', ' ').toUpperCase()}
                  name={key}
                  value={collateral.vehicle![key as keyof VehicleCollateralForm]}
                  onChange={handleChange((v: any) => setCollateral(prev => ({ ...prev, vehicle: { ...prev.vehicle, ...v } })))}
                />
              ))}
            </div>
          )}

          {collateral.base.type === 'land' && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {Object.keys(collateral.land!).map((key) => (
                <Input
                  key={key}
                  label={key.replace('_', ' ').toUpperCase()}
                  name={key}
                  value={collateral.land![key as keyof LandCollateralForm]}
                  onChange={handleChange((v: any) => setCollateral(prev => ({ ...prev, land: { ...prev.land, ...v } })))}
                />
              ))}
            </div>
          )}

          {collateral.base.type === 'atm' && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              {Object.keys(collateral.atm!).map((key) => (
                <Input
                  key={key}
                  label={key.replace('_', ' ').toUpperCase()}
                  name={key}
                  value={collateral.atm![key as keyof ATMCollateralForm]}
                  onChange={handleChange((v: any) => setCollateral(prev => ({ ...prev, atm: { ...prev.atm, ...v } })))}
                />
              ))}
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
        </div>
      </form>
    </AppLayout>
  );
}
