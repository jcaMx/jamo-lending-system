// resources/js/components/dashboard/NoLoansPlaceholder.tsx
import { AlertTriangle } from "lucide-react";

interface NoLoansPlaceholderProps {
  message?: string;
}

const NoLoansPlaceholder: React.FC<NoLoansPlaceholderProps> = ({
  message = "You currently have no active loans.",
}) => { 
  return (
  <div className="p-10 bg-white rounded-2xl shadow-sm text-center">
    <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
    <p className="text-lg font-semibold text-gray-900">No loans found</p>
    <p className="text-sm text-gray-500">
      {message}
    </p>
    <a href="/applynow" className="inline-block mt-6">
        <button className="mt-4 px-4 py-2 bg-[#1E3A5F] text-white rounded-lg hover:bg-[#162E4D] transition">
        Apply for Loan
        </button>

    </a>

  </div>
  );
};

export default NoLoansPlaceholder;
