import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StepIndicator from "./StepIndicator";
import { User } from "lucide-react";

interface BorrowerInfoProps {
  onNext: () => void;
}

const BorrowerInfo = ({ onNext }: BorrowerInfoProps) => {
  return (
    <section className="py-8 md:py-16 px-6 md:px-12 bg-gradient-to-b from-golden/20 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <User className="w-6 h-6 text-golden" />
            <h1 className="text-2xl md:text-3xl font-bold">Borrower Information</h1>
          </div>
        </div>

        <StepIndicator currentStep={1} steps={["Borrower", "Co-Borrower", "Collateral", "Loan Details", "Payment"]} />

        <div className="bg-white rounded-lg p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="Enter full name" className="bg-gray-50" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input id="dob" type="date" className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" type="number" placeholder="Age" className="bg-gray-50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Marital Status</Label>
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
            <Label htmlFor="address">Permanent Home Address</Label>
            <Input id="address" placeholder="Enter address" className="bg-gray-50" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input id="mobile" placeholder="Enter mobile number" className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dependents">No. of Dependent child</Label>
              <Input id="dependents" type="number" placeholder="0" className="bg-gray-50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="homeOwnership">Home Ownership</Label>
            <Input id="homeOwnership" placeholder="Owned/Mortgage/Rented" className="bg-gray-50" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="occupation">Occupation</Label>
              <Input id="occupation" placeholder="Enter occupation" className="bg-gray-50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position (if employed)</Label>
              <Input id="position" placeholder="Enter position" className="bg-gray-50" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="employerAddress">Agency/Employer's Address</Label>
            <Input id="employerAddress" placeholder="Enter employer address" className="bg-gray-50" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="photo">Borrower Photo</Label>
            <Input id="photo" type="file" accept="image/*" className="bg-gray-50" />
          </div>

          <div className="border-t pt-6 mt-8">
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">Spouse's personal data <span className="text-sm font-normal">(If applicable)</span></h3>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="spouseName">Full Name</Label>
                <Input id="spouseName" placeholder="Enter spouse's full name" className="bg-gray-50" />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="spouseOccupation">Occupation</Label>
                  <Input id="spouseOccupation" placeholder="Enter occupation" className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spousePosition">Position (If employed)</Label>
                  <Input id="spousePosition" placeholder="Enter position" className="bg-gray-50" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="spouseEmployerAddress">Agency/Employer's Address</Label>
                <Input id="spouseEmployerAddress" placeholder="Enter employer address" className="bg-gray-50" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spouseMobile">Mobile Number</Label>
                <Input id="spouseMobile" placeholder="Enter mobile number" className="bg-gray-50" />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onNext} className="bg-golden hover:bg-golden-dark text-white px-8">
              Next
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BorrowerInfo;
