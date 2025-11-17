import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StepIndicator from "./StepIndicator";
import { Users } from "lucide-react";

interface CoBorrowerInfoProps {
  onNext: () => void;
  onPrev: () => void;
}

const CoBorrowerInfo = ({ onNext, onPrev }: CoBorrowerInfoProps) => {
  return (
    <section className="py-8 md:py-16 px-6 md:px-12 bg-gradient-to-b from-golden/20 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-6 h-6 text-golden" />
            <h1 className="text-2xl md:text-3xl font-bold">Co Borrower Information</h1>
          </div>
        </div>

        <StepIndicator currentStep={2} steps={["Borrower", "Co-Borrower", "Collateral", "Loan Details", "Payment"]} />

        <div className="bg-white rounded-lg p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="coFullName">Full Name</Label>
            <Input id="coFullName" placeholder="Enter full name" className="bg-gray-50" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="coDob">Date of Birth</Label>
              <Input id="coDob" type="date" className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coAge">Age</Label>
              <Input id="coAge" type="number" placeholder="Age" className="bg-gray-50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coMaritalStatus">Marital Status</Label>
            <Select>
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Select marital status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married</SelectItem>
                <SelectItem value="divorced">Divorced</SelectItem>
                <SelectItem value="widowed">Widowed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coAddress">Permanent Home Address</Label>
            <Input id="coAddress" placeholder="Enter address" className="bg-gray-50" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="coMobile">Mobile Number</Label>
              <Input id="coMobile" placeholder="Enter mobile number" className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coDependents">No. of Dependent child</Label>
              <Input id="coDependents" type="number" placeholder="0" className="bg-gray-50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coHomeOwnership">Home Ownership</Label>
            <Input id="coHomeOwnership" placeholder="Owned/Mortgage/Rented" className="bg-gray-50" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="coOccupation">Occupation</Label>
              <Input id="coOccupation" placeholder="Enter occupation" className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coPosition">Position (If employed)</Label>
              <Input id="coPosition" placeholder="Enter position" className="bg-gray-50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coEmployerAddress">Agency/Employer's Address</Label>
            <Input id="coEmployerAddress" placeholder="Enter employer address" className="bg-gray-50" />
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

export default CoBorrowerInfo;
