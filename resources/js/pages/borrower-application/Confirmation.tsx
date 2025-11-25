import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StepIndicator from "./StepIndicator";
import { CreditCard } from "lucide-react";
import { useForm } from "@inertiajs/react";

interface ConfirmationProps {
  onPrev: () => void;
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

const Confirmation = ({ onPrev, application }: ConfirmationProps) => {
  const { data, setData, post, errors } = useForm({
    payment_method: application?.payment_method || "",
  });

  const handleSubmit = () => {
    post("/applications/confirm", {
      onSuccess: () => {
        // redirect or show success
      },
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
            <CreditCard className="w-6 h-6 text-golden" />
            <h1 className="text-2xl md:text-3xl font-bold">Confirmation</h1>
          </div>
        </div>

        <StepIndicator
          currentStep={5}
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
          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              onValueChange={(val) => setData("payment_method", val)}
              value={data.payment_method}
            >
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="check">Check</SelectItem>
              </SelectContent>
            </Select>
            {errors.payment_method && (
              <div className="text-red-500 text-sm">{errors.payment_method}</div>
            )}
          </div>

          {/* Application Summary */}
<div className="border-2 border-golden rounded-lg p-6 space-y-6 bg-golden/5">
  <h3 className="text-xl font-bold mb-4">Application Summary</h3>

  <div className="grid md:grid-cols-2 gap-6">
    <div>
      <Label className="text-sm font-semibold">Application ID</Label>
      <div className="bg-white p-3 rounded border">
        {application.id}
      </div>
    </div>
    <div>
      <Label className="text-sm font-semibold">Date</Label>
      <div className="bg-white p-3 rounded border">
        {new Date(application.created_at).toLocaleDateString()}
      </div>
    </div>
  </div>

  <div className="grid md:grid-cols-2 gap-6">
    <div>
      <Label className="text-sm font-semibold">Borrower</Label>
      <div className="bg-white p-3 rounded border">
        {application.borrower
          ? `${application.borrower.first_name} ${application.borrower.last_name}`
          : "-"}
      </div>
    </div>
    <div>
      <Label className="text-sm font-semibold">Co-Borrower</Label>
      <div className="bg-white p-3 rounded border">
        {application.co_borrower?.full_name ?? "-"}
      </div>
    </div>
  </div>

  <div className="grid md:grid-cols-2 gap-6">
    <div>
      <Label className="text-sm font-semibold">Loan Amount</Label>
      <div className="bg-white p-3 rounded border">
        {application.loan?.loan_amount ?? "-"}
      </div>
    </div>
    <div>
      <Label className="text-sm font-semibold">Term</Label>
      <div className="bg-white p-3 rounded border">
        {application.loan?.term ? `${application.loan.term} months` : "-"}
      </div>
    </div>
  </div>

  <div className="grid md:grid-cols-2 gap-6">
    <div>
      <Label className="text-sm font-semibold">Collateral</Label>
      <div className="bg-white p-3 rounded border">
        {application.collateral?.collateral_type ?? "-"}
      </div>
    </div>
    <div>
      <Label className="text-sm font-semibold">Payment Method</Label>
      <div className="bg-white p-3 rounded border">
        {application.payment_method ?? "-"}
      </div>
    </div>
  </div>

  <div>
    <Label className="text-sm font-semibold">Monthly Installment</Label>
    <div className="bg-white p-3 rounded border">
      {application.loan?.loan_amount && application.loan?.term
        ? (application.loan.loan_amount / application.loan.term).toFixed(2)
        : "-"}
    </div>
  </div>
</div>

          {/* Navigation buttons */}
          <div className="flex justify-between gap-4">
            <Button onClick={onPrev} variant="outline" className="px-8">
              Previous
            </Button>
            <Button
              type="submit"
              className="bg-golden hover:bg-golden-dark text-black px-8"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Confirmation;
