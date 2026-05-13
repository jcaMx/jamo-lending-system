import { CheckCircle, Clock, XCircle } from "lucide-react";

type Payment = {
  id: string;
  loanNo: string | number;
  date: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed" | string;
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString: string) => {
  if (!dateString || dateString === "-") return "-";
  return new Date(dateString).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

interface RecentPaymentsCardProps {
  payments: Payment[];
}

const paymentStatusConfig = {
  Completed: { icon: CheckCircle, color: "#16A34A" },
  Pending: { icon: Clock, color: "#D97706" },
  Failed: { icon: XCircle, color: "#DC2626" },
};
const defaultPaymentConfig = paymentStatusConfig.Completed;

export function RecentPaymentsCard({ payments }: RecentPaymentsCardProps) {
  return (
    <div className="bg-white rounded-3xl shadow-sm ring-1 ring-gray-200/70 overflow-hidden">
      <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Recent Payments</h3>
          <p className="text-xs text-gray-500 mt-0.5 font-medium">Your latest activity at a glance</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm border border-gray-100">
           <Clock className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="p-6 md:p-8 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
        {payments.map((payment: Payment) => {
          const config = paymentStatusConfig[payment.status as keyof typeof paymentStatusConfig] ?? defaultPaymentConfig;
          const StatusIcon = config.icon;
          return (
            <div
              key={payment.id}
              className="group relative flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 md:flex-row md:items-center md:justify-between transition-all duration-300 hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 shadow-sm border border-gray-50"
                  style={{ color: config.color, backgroundColor: `${config.color}10` }}
                >
                  <StatusIcon className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-bold text-gray-900 tracking-tight">Loan #{payment.loanNo}</p>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                      style={{ backgroundColor: `${config.color}15`, color: config.color }}
                    >
                      {payment.status}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-gray-400 mt-0.5">{formatDate(payment.date)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:text-right md:block">
                <p className="text-lg font-bold text-gray-900 tracking-tight">{formatCurrency(payment.amount)}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest md:mt-1">Amount Paid</p>
              </div>
            </div>
          );
        })}
        {payments.length === 0 && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-dashed border-gray-200">
               <Clock className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-400">No recent payments found</p>
          </div>
        )}
      </div>
    </div>
  );
}
