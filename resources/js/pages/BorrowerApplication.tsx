import { useState } from "react";
import BorrowerInfo from "./borrower-application/BorrowerInfo";
import CoBorrowerInfo from "./borrower-application/CoBorrowerInfo";
import Collateral from "./borrower-application/Collateral";
import LoanDetails from "./borrower-application/LoanDetails";
import Confirmation from "./borrower-application/Confirmation";
import AppLayout from "@/layouts/app-layout";
import type { SharedFormData } from "./borrower-application/sharedFormData";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";



interface BorrowerApplicationProps {
  application?: {
    id: number;
    created_at: string;
    borrower?: { first_name: string; last_name: string };
    co_borrower?: { full_name: string };
    loan?: { loan_amount: number; term: number };
    collateral?: { collateral_type: string };
    payment_method?: string;
  };
}


const BorrowerApplication = ({ application }: BorrowerApplicationProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const totalSteps = 4;
  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const [formData, setFormData] = useState<SharedFormData>({
    // borrower_first_name: "",
    // borrower_last_name: "",
    // gender: "",
    // date_of_birth: "",
    // marital_status: "",
    // contact_no: "",
    // landline_number: "",
    // dependent_child: "",
    // spouse_first_name: "",
    // spouse_last_name: "",
    // spouse_agency_address: "",
    // spouse_occupation: "",
    // spouse_position: "",
    // spouse_mobile_number: "",
    // permanent_address: "",
    // city: "",
    // home_ownership: "",
    // employment_status: "",
    // occupation: "",
    // position: "",
    // monthly_income: "",
    // income_source: "",
    // agency_address: "",
    // valid_id_type: "",
    // valid_id_number: "",
    // files: null,
    coBorrowers: [],
    collateral_type: "",
    make: "",
    vehicle_type: "",
    transmission_type: "",
    plate_no: "",
    engine_no: "",
    year_model: "",
    series: "",
    fuel: "",
    certificate_of_title_no: "",
    location: "",
    description: "",
    area: "",
    bank_name: "",
    account_no: "",
    cardno_4digits: "",
    estimated_value: "",
    appraisal_date: "",
    appraised_by: "",
    ownership_proof: null,
    loan_type: "",
    loan_amount: "",
    interest_type: "",
    interest_rate: "",
    repayment_frequency: "",
    term: "",
    payment_method: "",
  });

  return (
    <DashboardLayout>
    <div className="min-h-screen">
      {/* <Header /> */}
      
      {/* {currentStep === 0 && (
        <BorrowerInfo
          onNext={nextStep}
          formData={formData}
          setFormData={setFormData}
        />
      )} */}
      {currentStep === 0 && (
        <LoanDetails
          onNext={nextStep}
          onPrev={prevStep}
          formData={formData}
          setFormData={setFormData}
        />

      )}
      {currentStep === 1 && (
        <CoBorrowerInfo
          onNext={nextStep}
          onPrev={prevStep}
          formData={formData}
          setFormData={setFormData}
        />

      )}
      {currentStep === 2 && (

        <Collateral
          onNext={nextStep}
          onPrev={prevStep}
          formData={formData}
          setFormData={setFormData}
        />

      )}
      {currentStep === 3 && (
        <Confirmation
          onPrev={prevStep}
          application={application}
          formData={formData}
          setFormData={setFormData}
        />
      )}


      
      {/* <Footer /> */}
    </div>
    </DashboardLayout>
  );
};

export default BorrowerApplication;
