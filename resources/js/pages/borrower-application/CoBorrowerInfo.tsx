import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StepIndicator from "./StepIndicator";
import { Users } from "lucide-react";
import { useForm } from "@inertiajs/react";
import {route} from "ziggy-js";

interface CoBorrowerInfoProps {
  onNext: () => void;
  onPrev: () => void;
}

const CoBorrowerInfo = ({ onNext, onPrev }: CoBorrowerInfoProps) => {
  const { data, setData, post, errors } = useForm({
    full_name: "",
    dob: "",
    age: "",
    marital_status: "",
    address: "",
    mobile: "",
    dependents:'',
    home_ownership: "",
    occupation: "",
    position: "",
    employer_address: "",
  });

  const handleSubmit = () => {
    post("/applications/co-borrower", {
      onSuccess: () => onNext(),
    });
  };

  return (
    <section
      className="py-8 md:py-16 px-6 md:px-12"
      style={{ backgroundColor: "#F7F5F3" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-6 h-6 text-golden" />
            <h1 className="text-2xl md:text-3xl font-bold">
              Co-Borrower Information
            </h1>
          </div>
        </div>

        <StepIndicator
          currentStep={2}
          steps={[
            "Borrower",
            "Co-Borrower",
            "Collateral",
            "Loan Details",
            "Payment",
          ]}
        />

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="bg-white rounded-lg p-6 md:p-8 space-y-6"
        >
          <div className="space-y-2">
            <Label htmlFor="coFullName">Full Name</Label>
            <Input
              id="coFullName"
              value={data.full_name}
              onChange={(e) => setData("full_name", e.target.value)}
              placeholder="Enter full name"
              className="bg-gray-50"
            />
            {errors.full_name && (
              <div className="text-red-500 text-sm">{errors.full_name}</div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="coDob">Date of Birth</Label>
              <Input
                id="coDob"
                type="date"
                value={data.dob}
                onChange={(e) => setData("dob", e.target.value)}
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coAge">Age</Label>
              <Input
                id="coAge"
                type="number"
                value={data.age}
                onChange={(e) => setData("age", e.target.value)}
                placeholder="Age"
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coMaritalStatus">Marital Status</Label>
            <Select
              onValueChange={(val) => setData("marital_status", val)}
              value={data.marital_status}
            >
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
            <Input
              id="coAddress"
              value={data.address}
              onChange={(e) => setData("address", e.target.value)}
              placeholder="Enter address"
              className="bg-gray-50"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="coMobile">Mobile Number</Label>
              <Input
                id="coMobile"
                value={data.mobile}
                onChange={(e) => setData("mobile", e.target.value)}
                placeholder="Enter mobile number"
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coDependents">No. of Dependent child</Label>
              <Input
                id="coDependents"
                type="number"
                value={data.dependents}
                onChange={(e) => setData("dependents", e.target.value)}
                placeholder="0"
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coHomeOwnership">Home Ownership</Label>
            <Input
              id="coHomeOwnership"
              value={data.home_ownership}
              onChange={(e) => setData("home_ownership", e.target.value)}
              placeholder="Owned/Mortgage/Rented"
              className="bg-gray-50"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="coOccupation">Occupation</Label>
              <Input
                id="coOccupation"
                value={data.occupation}
                onChange={(e) => setData("occupation", e.target.value)}
                placeholder="Enter occupation"
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coPosition">Position (If employed)</Label>
              <Input
                id="coPosition"
                value={data.position}
                onChange={(e) => setData("position", e.target.value)}
                placeholder="Enter position"
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="coEmployerAddress">Agency/Employer's Address</Label>
            <Input
              id="coEmployerAddress"
              value={data.employer_address}
              onChange={(e) => setData("employer_address", e.target.value)}
              placeholder="Enter employer address"
              className="bg-gray-50"
            />
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between gap-4">
            <Button onClick={onPrev} variant="outline" className="px-8">
              Previous
            </Button>
            <Button onClick={onNext}
              type="submit"
              className="bg-golden hover:bg-golden-dark text-black px-8"
            >
              Next
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CoBorrowerInfo;
