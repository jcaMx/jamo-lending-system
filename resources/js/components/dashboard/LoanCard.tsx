import { Calendar, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Loan } from "@/data/dummyData";
import { cn } from "@/lib/utils";

interface LoanCardProps {
  loan: Loan;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  if (dateString === "-") return "-";
  return new Date(dateString).toLocaleDateString("en-PH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export function LoanCard({ loan }: LoanCardProps) {
  const statusConfig = {
    Active: { icon: TrendingUp, color: "#16A34A", bg: "#E8F6EE", border: "#C7EBD6", hoverBorder: "hover:border-emerald-400 hover:ring-emerald-100" },
    Paid: { icon: CheckCircle, color: "#6B7280", bg: "#F3F4F6", border: "#E5E7EB", hoverBorder: "hover:border-slate-300 hover:ring-slate-100" },
    Overdue: { icon: AlertCircle, color: "#DC2626", bg: "#FDECEC", border: "#F8C9C9", hoverBorder: "hover:border-rose-400 hover:ring-rose-100" },
    Pending: { icon: Calendar, color: "#D97706", bg: "#FEF3E1", border: "#F6D6A5", hoverBorder: "hover:border-amber-400 hover:ring-amber-100" },
  };

  const config = statusConfig[loan.status as keyof typeof statusConfig];
  const StatusIcon = config.icon;

  return (
    <Card className={cn(
      "rounded-2xl border border-transparent bg-white p-5 shadow-sm ring-1 ring-gray-200/70 transition hover:shadow-md hover:ring-2",
      loan.status === "Overdue" && "ring-1 ring-red-200",
      config.hoverBorder
    )}>
      <div className="flex items-start justify-between">
        <p className="text-base font-semibold text-gray-900">Loan #{loan.loanNo}</p>
        <div
          className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold"
          style={{ backgroundColor: config.bg, color: config.color, borderColor: config.border }}
        >
          <StatusIcon className="h-3.5 w-3.5" />
          {loan.status}
        </div>
      </div>
      <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-xs font-medium text-gray-500">Principal</p>
          <p className="text-base font-semibold text-gray-900">{formatCurrency(loan.principal)}</p>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-500">Balance</p>
          <p className="text-base font-semibold text-gray-900">{formatCurrency(loan.balance)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-xs font-medium text-gray-500">Released</p>
            <p className="text-sm font-semibold text-gray-900">{formatDate(loan.releasedDate)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <div>
            <p className="text-xs font-medium text-gray-500">Maturity</p>
            <p className="text-sm font-semibold text-gray-900">{formatDate(loan.maturityDate)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
