import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StepIndicator from "./StepIndicator";
import { DollarSign } from "lucide-react";

interface LoanDetailsProps {
  onNext: () => void;
  onPrev: () => void;
}

const LoanDetails = ({ onNext, onPrev }: LoanDetailsProps) => {
  return (
    <section className="py-8 md:py-16 px-6 md:px-12" style={{ backgroundColor: '#F7F5F3' }}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <DollarSign className="w-6 h-6 text-golden" />
            <h1 className="text-2xl md:text-3xl font-bold">Loan Details</h1>
          </div>
        </div>

        <StepIndicator currentStep={4} steps={["Borrower", "Co-Borrower", "Collateral", "Loan Details", "Payment"]} />

        <div className="bg-white rounded-lg p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="loanAmount">Loan Amount</Label>
            <Input id="loanAmount" type="number" placeholder="Enter loan amount" className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="loanType">Loan Type</Label>
            <Input id="loanType" placeholder="Enter loan type" className="bg-gray-50" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="interestRate">Interest Rate %</Label>
              <Input id="interestRate" type="number" step="0.01" placeholder="Enter interest rate" className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="term">Term</Label>
              <Input id="term" type="number" placeholder="Enter term (months)" className="bg-gray-50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="interestType">Interest Type</Label>
            <Select>
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Select interest type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="variable">Variable</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="repaymentFrequency">Repayment Frequency</Label>
            <Select>
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Select repayment frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" type="date" className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" type="date" className="bg-gray-50" />
            </div>
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

export default LoanDetails;
