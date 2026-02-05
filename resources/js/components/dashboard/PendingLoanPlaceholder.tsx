// resources/js/components/dashboard/NoLoansPlaceholder.tsx
import { Clock} from "lucide-react";
interface PendingLoanPlaceholderProp {
  message?: string;
}

const PendingLoanPlaceholder: React.FC<PendingLoanPlaceholderProp> = ({
  message = "You currently have no active loans.",
}) => { 
  return (
  <div className="p-10 bg-white rounded-2xl text-center">
    <Clock className="mx-auto h-12 w-12 text-amber-500 mb-4" />
    <p className="text-lg font-semibold text-gray-900">Your loan application is still pending. </p>
    <p className="text-sm text-gray-500">
      {message}
    </p>


  </div>
  );
};

export default PendingLoanPlaceholder;
// resources/js/pages/customer/MyLoanSummary.tsx