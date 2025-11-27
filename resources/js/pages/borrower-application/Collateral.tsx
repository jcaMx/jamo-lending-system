import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";  
import { Label } from "@/components/ui/label";
import { Textarea } from "./textarea";
import StepIndicator from "./StepIndicator";
import { Home } from "lucide-react";
import { useForm } from "@inertiajs/react";

interface CollateralProps {
  onNext: () => void;
  onPrev: () => void;
}

const Collateral = ({ onNext, onPrev }: CollateralProps) => {
  const { data, setData, post, errors } = useForm({
    collateral_type: "",
    description: "",
    estimated_value: 0,
    appraisal_date: "",
    appraised_by: "",
    ownership_proof: null as File | null,
  });

  const handleSubmit = () => {
    post("/applications/collateral", {
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
            <Home className="w-6 h-6 text-golden" />
            <h1 className="text-2xl md:text-3xl font-bold">Collateral</h1>
          </div>
        </div>

        <StepIndicator
          currentStep={3}
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
            <Label htmlFor="collateralType">Collateral Type</Label>
            <Input
              id="collateralType"
              value={data.collateral_type}
              onChange={(e) => setData("collateral_type", e.target.value)}
              placeholder="Enter collateral type"
              className="bg-gray-50"
            />
            {errors.collateral_type && (
              <div className="text-red-500 text-sm">{errors.collateral_type}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={data.description}
              onChange={(e) => setData("description", e.target.value)}
              placeholder="Enter description"
              rows={4}
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedValue">Estimated Value</Label>
            <Input
              id="estimatedValue"
              type="number"
              value={data.estimated_value}
              onChange={(e) => setData("estimated_value", Number(e.target.value))}
              placeholder="Enter estimated value"
              className="bg-gray-50"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="appraisalDate">Appraisal Date</Label>
              <Input
                id="appraisalDate"
                type="date"
                value={data.appraisal_date}
                onChange={(e) => setData("appraisal_date", e.target.value)}
                className="bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appraisedBy">Appraised by</Label>
              <Input
                id="appraisedBy"
                value={data.appraised_by}
                onChange={(e) => setData("appraised_by", e.target.value)}
                placeholder="Enter appraiser name"
                className="bg-gray-50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ownershipProof">
              Ownership Proof (Collateral Files)
            </Label>
            <Input
              id="ownershipProof"
              type="file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) =>
                setData("ownership_proof", e.target.files ? e.target.files[0] : null)
              }
              className="bg-gray-50"
            />
            <p className="text-xs text-muted-foreground">
              Accepted formats: PDF, DOC, DOCX, JPG, PNG
            </p>
          </div>

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

export default Collateral;
