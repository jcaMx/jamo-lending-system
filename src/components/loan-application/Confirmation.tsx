import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StepIndicator from "./StepIndicator";
import { CreditCard } from "lucide-react";

interface ConfirmationProps {
  onPrev: () => void;
}

const Confirmation = ({ onPrev }: ConfirmationProps) => {
  return (
    <section className="py-8 md:py-16 px-6 md:px-12 bg-gradient-to-b from-golden/20 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CreditCard className="w-6 h-6 text-golden" />
            <h1 className="text-2xl md:text-3xl font-bold">Confirmation</h1>
          </div>
        </div>

        <StepIndicator currentStep={5} steps={["Borrower", "Co-Borrower", "Collateral", "Loan Details", "Payment"]} />

        <div className="bg-white rounded-lg p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select>
              <SelectTrigger className="bg-gray-50">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="check">Check</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border-2 border-golden rounded-lg p-6 space-y-6 bg-golden/5">
            <h3 className="text-xl font-bold mb-4">Application Summary</h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Application ID</Label>
                <div className="bg-white p-3 rounded border">-</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Date</Label>
                <div className="bg-white p-3 rounded border">-</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Borrower</Label>
                <div className="bg-white p-3 rounded border">-</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Co-Borrower</Label>
                <div className="bg-white p-3 rounded border">-</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Loan Amount</Label>
                <div className="bg-white p-3 rounded border">-</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Term</Label>
                <div className="bg-white p-3 rounded border">-</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Collateral</Label>
                <div className="bg-white p-3 rounded border">-</div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Payment Method</Label>
                <div className="bg-white p-3 rounded border">-</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Monthly Installment</Label>
              <div className="bg-white p-3 rounded border">-</div>
            </div>
          </div>

          <div className="flex justify-between gap-4">
            <Button onClick={onPrev} variant="outline" className="px-8">
              Previous
            </Button>
            <Button className="bg-golden hover:bg-golden-dark text-white px-8">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Confirmation;
