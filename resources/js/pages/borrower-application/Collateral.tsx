import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";  
import { Label } from "@/components/ui/label";
import { Textarea } from "./textarea";
import StepIndicator from "./StepIndicator";
import { Home } from "lucide-react";

interface CollateralProps {
  onNext: () => void;
  onPrev: () => void;
}

const Collateral = ({ onNext, onPrev }: CollateralProps) => {
  return (
    <section className="py-8 md:py-16 px-6 md:px-12" style={{ backgroundColor: '#F7F5F3' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Home className="w-6 h-6 text-golden" />
            <h1 className="text-2xl md:text-3xl font-bold">Collateral</h1>
          </div>
        </div>

        <StepIndicator currentStep={3} steps={["Borrower", "Co-Borrower", "Collateral", "Loan Details", "Payment"]} />

        <div className="bg-white rounded-lg p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="collateralType">Collateral Type</Label>
            <Input id="collateralType" placeholder="Enter collateral type" className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter description" rows={4} className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedValue">Estimated Value</Label>
            <Input id="estimatedValue" type="number" placeholder="Enter estimated value" className="bg-gray-50" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="appraisalDate">Appraisal Date</Label>
              <Input id="appraisalDate" type="date" className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appraisedBy">Appraised by</Label>
              <Input id="appraisedBy" placeholder="Enter appraiser name" className="bg-gray-50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownershipProof">Ownership Proof (Collateral Files)</Label>
            <Input id="ownershipProof" type="file" accept=".pdf,.doc,.docx,.jpg,.png" className="bg-gray-50" />
            <p className="text-xs text-muted-foreground">Accepted formats: PDF, DOC, DOCX, JPG, PNG</p>
          </div>

          <div className="flex justify-between gap-4">
            <Button onClick={onPrev} variant="outline" className="px-8">
              Previous
            </Button>
            <Button onClick={onNext} className="bg-golden hover:bg-golden-dark text-white px-8">
              Next
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collateral;
