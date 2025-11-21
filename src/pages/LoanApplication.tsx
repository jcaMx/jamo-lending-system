import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BorrowerInfo from "@/components/loan-application/BorrowerInfo";
import CoBorrowerInfo from "@/components/loan-application/CoBorrowerInfo";
import Collateral from "@/components/loan-application/Collateral";
import LoanDetails from "@/components/loan-application/LoanDetails";
import Confirmation from "@/components/loan-application/Confirmation";

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
