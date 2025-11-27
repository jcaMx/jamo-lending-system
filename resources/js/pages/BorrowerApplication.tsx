import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BorrowerInfo from "./borrower-application/BorrowerInfo";
import CoBorrowerInfo from "./borrower-application/CoBorrowerInfo";
import Collateral from "./borrower-application/Collateral";
import LoanDetails from "./borrower-application/LoanDetails";
import Confirmation from "./borrower-application/Confirmation";


interface BorrowerApplicationProps {
  application: {
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
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen">
      <Header />
      
      {currentStep === 1 && <BorrowerInfo onNext={nextStep} />}
      {currentStep === 2 && <CoBorrowerInfo onNext={nextStep} onPrev={prevStep} />}
      {currentStep === 3 && <Collateral onNext={nextStep} onPrev={prevStep} />}
      {currentStep === 4 && <LoanDetails onNext={nextStep} onPrev={prevStep} />}
      {currentStep === 5 && (<Confirmation onPrev={prevStep} application={application} />
)}

      
      <Footer />
    </div>
  );
};

export default BorrowerApplication;
