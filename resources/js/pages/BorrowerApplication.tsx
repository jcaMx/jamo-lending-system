import { useState } from "react";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import BorrowerInfo from "./borrower-application/BorrowerInfo";
import CoBorrowerInfo from "./borrower-application/CoBorrowerInfo";
import Collateral from "./borrower-application/Collateral";
import LoanDetails from "./borrower-application/LoanDetails";
import Confirmation from "./borrower-application/Confirmation";

const LoanApplication = () => {
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
      {currentStep === 5 && <Confirmation onPrev={prevStep} />}
      
      <Footer />
    </div>
  );
};

export default LoanApplication;
