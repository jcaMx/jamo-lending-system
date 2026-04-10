import AddLoanPage from "./AddLoan/AddLoan";
import type { BorrowerDocumentTypeOption } from "@/pages/borrowers/components/RenderDocumentUploader";

interface Borrower {
  id: number;
  name: string;
  has_active_or_pending_loan?: boolean;
  has_active_loan?: boolean;
  loan_status?: string;
}

interface AddLoanProps {
  borrowers?: Borrower[];
  documentTypesByCategory?: Record<string, BorrowerDocumentTypeOption[]>;
}

export default function AddLoan(props: AddLoanProps) {
  return <AddLoanPage {...props} />;
}

// AYAW TAROGI ni nga file - wrapper ra ni