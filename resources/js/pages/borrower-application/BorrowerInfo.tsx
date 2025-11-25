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
import { User } from "lucide-react";
import { Link, useForm } from "@inertiajs/react";
import {route} from "ziggy-js";


interface BorrowerInfoProps {
  onNext: () => void;
}

const BorrowerInfo = ({ onNext }: BorrowerInfoProps) => {
  const { data, setData, post, errors } = useForm({
    first_name: "",
    middle_name: "",
    last_name: "",
    dob: "",
    age: "",
    marital_status: "",
    address: "",
    mobile: "",
    dependents: 0,
    home_ownership: "",
    occupation: "",
    position: "",
    employer_address: "",
    photo: null as File | null,
    spouse_first_name: "",
    spouse_middle_name: "",
    spouse_last_name: "",
    spouse_occupation: "",
    spouse_position: "",
    spouse_employer_address: "",
    spouse_mobile: "",
  });

  const handleSubmit = () => {
    post(route("applications.store"), {
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
            <User className="w-6 h-6 text-golden" />
            <h1 className="text-2xl md:text-3xl font-bold">
              Borrower Information
            </h1>
          </div>
        </div>

        <StepIndicator
          currentStep={1}
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
          {/* Borrower fields */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={data.first_name}
                onChange={(e) => setData("first_name", e.target.value)}
                placeholder="Enter first name"
                className="bg-gray-50"
              />
              {errors.first_name && (
                <div className="text-red-500 text-sm">{errors.first_name}</div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="middleName">Middle Name</Label>
              <Input
                id="middleName"
                value={data.middle_name}
                onChange={(e) => setData("middle_name", e.target.value)}
                placeholder="Enter middle name"
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={data.last_name}
                onChange={(e) => setData("last_name", e.target.value)}
                placeholder="Enter last name"
                className="bg-gray-50"
              />
              {errors.last_name && (
                <div className="text-red-500 text-sm">{errors.last_name}</div>
              )}
            </div>
          </div>

          {/* Example: DOB and Age */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={data.dob}
                onChange={(e) => setData("dob", e.target.value)}
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={data.age}
                onChange={(e) => setData("age", e.target.value)}
                placeholder="Age"
                className="bg-gray-50"
              />
            </div>
          </div>

          {/* Marital Status */}
          <div className="space-y-2">
            <Label htmlFor="maritalStatus">Marital Status</Label>
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

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Permanent Home Address</Label>
            <Input
              id="address"
              value={data.address}
              onChange={(e) => setData("address", e.target.value)}
              placeholder="Enter address"
              className="bg-gray-50"
            />
          </div>

          {/* Mobile */}
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number</Label>
            <Input
              id="mobile"
              value={data.mobile}
              onChange={(e) => setData("mobile", e.target.value)}
              placeholder="Enter mobile number"
              className="bg-gray-50"
            />
          </div>
          {/* Dependents */}
<div className="space-y-2">
  <Label htmlFor="dependents">Number of Dependents</Label>
  <Input
    id="dependents"
    type="number"
    value={data.dependents}
    onChange={(e) => setData("dependents", Number(e.target.value))}
    placeholder="0"
    className="bg-gray-50"
  />
  {errors.dependents && (
    <div className="text-red-500 text-sm">{errors.dependents}</div>
  )}
</div>


          {/* Photo */}
          <div className="space-y-2">
            <Label htmlFor="photo">Borrower Photo</Label>
            <Input
              id="photo"
              type="file"
              accept="image/*"
              onChange={(e) =>
                setData("photo", e.target.files ? e.target.files[0] : null)
              }
              className="bg-gray-50"
            />
          </div>

          {/* Spouse data */}
          <div className="border-t pt-6 mt-8">
            <h3 className="text-lg font-semibold mb-4 text-muted-foreground">
              Spouse's personal data{" "}
              <span className="text-sm font-normal">(If applicable)</span>
            </h3>

            <div className="space-y-6 ">
              <div className="space-y-2">
                <Label htmlFor="spouseFirstName">First Name</Label>
                <Input
                  id="spouseFirstName"
                  value={data.spouse_first_name}
                  onChange={(e) =>
                    setData("spouse_first_name", e.target.value)
                  }
                  placeholder="Enter first name"
                  className="bg-gray-50"
                />
              </div>
             <div className="space-y-2">
  <Label htmlFor="spouseMiddleName">Middle Name</Label>
  <Input
    id="spouseMiddleName"
    value={data.spouse_middle_name}
    onChange={(e) => setData("spouse_middle_name", e.target.value)}
    placeholder="Enter middle name"
    className="bg-gray-50"
  />
</div>

<div className="space-y-2">
  <Label htmlFor="spouseLastName">Last Name</Label>
  <Input
    id="spouseLastName"
    value={data.spouse_last_name}
    onChange={(e) => setData("spouse_last_name", e.target.value)}
    placeholder="Enter last name"
    className="bg-gray-50"
  />
</div>

<div className="space-y-2">
  <Label htmlFor="spouseOccupation">Occupation</Label>
  <Input
    id="spouseOccupation"
    value={data.spouse_occupation}
    onChange={(e) => setData("spouse_occupation", e.target.value)}
    placeholder="Enter occupation"
    className="bg-gray-50"
  />
</div>

<div className="space-y-2">
  <Label htmlFor="spousePosition">Position</Label>
  <Input
    id="spousePosition"
    value={data.spouse_position}
    onChange={(e) => setData("spouse_position", e.target.value)}
    placeholder="Enter position"
    className="bg-gray-50"
  />
</div>

<div className="space-y-2">
  <Label htmlFor="spouseEmployerAddress">Employer Address</Label>
  <Input
    id="spouseEmployerAddress"
    value={data.spouse_employer_address}
    onChange={(e) => setData("spouse_employer_address", e.target.value)}
    placeholder="Enter employer address"
    className="bg-gray-50"
  />
</div>

<div className="space-y-2">
  <Label htmlFor="spouseMobile">Mobile Number</Label>
  <Input
    id="spouseMobile"
    value={data.spouse_mobile}
    onChange={(e) => setData("spouse_mobile", e.target.value)}
    placeholder="Enter mobile number"
    className="bg-gray-50"
  />
</div>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between gap-4">
            <Link href="/">
            <Link href="/">
              <Button variant="outline" className="px-8">
                Back to Home
              </Button>
            </Link>
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

export default BorrowerInfo;
