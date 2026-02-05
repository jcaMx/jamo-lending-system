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
    <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200/70 max-h-96">
      <div className="p-6 md:p-7 border-b border-gray-100 flex items-center justify-between ">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Recent Payments</h3>
          <p className="text-sm text-gray-500">Your latest activity at a glance</p>
        </div>
        <span className="text-xs uppercase tracking-[0.2em] text-gray-400">History</span>
      </div>
      <div className="p-6 md:p-7 space-y-4 max-h-64 overflow-y-auto">
        {payments.slice(0, 5).map((payment: Payment) => {
          const config = paymentStatusConfig[payment.status as keyof typeof paymentStatusConfig] ?? defaultPaymentConfig;
          const StatusIcon = config.icon;
          return (
            <div
              key={payment.id}
              className="group relative flex flex-col gap-4 rounded-xl border border-gray-200/80 bg-gray-50/40 p-4 md:flex-row md:items-center md:justify-between md:p-5 transition hover:border-gray-300 hover:bg-white"
            >
              <span
                className="absolute left-0 top-0 h-full w-1.5 rounded-l-xl"
                style={{ backgroundColor: config.color }}
              />
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm"
                  style={{ color: config.color }}
                >
                  <StatusIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">Loan #{payment.loanNo}</p>
                  <p className="text-sm text-gray-500">{formatDate(payment.date)}</p>
                </div>
              </div>
              <div className="flex items-center justify-between md:text-right md:block">
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ backgroundColor: `${config.color}15`, color: config.color }}
                >
                  {payment.status}
                </span>
              </div>
            </div>
          );
        })}
        {payments.length === 0 && (
          <p className="py-10 text-center text-sm text-gray-500">No recent payments</p>
        )}
      </div>
    </div>
  );
}
