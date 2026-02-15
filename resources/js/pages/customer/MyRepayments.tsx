import { Head, usePage } from '@inertiajs/react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RecentPaymentsCard } from "@/components/dashboard/RecentPaymentsCard";
import NoLoansPlaceholder from "@/components/dashboard/NoLoansPlaceholder";
import PendingLoanPlaceholder from "@/components/dashboard/PendingLoanPlaceholder";
import { PageProps as InertiaPageProps } from '@inertiajs/core';

type RawPayment = {
  id?: string | number;
  ID?: string | number;
  loanNo?: string | number;
  loan_no?: string | number;
  date?: string;
  payment_date?: string;
  amount?: number | string;
  status?: string;
  method?: string;
  payment_method?: string;
};

type Payment = {
  id: string;
  loanNo: string | number;
  date: string;
  amount: number;
  status: "Completed" | "Pending" | "Failed" | string;
  method?: string;
};

type PageProps = {
  payments?: RawPayment[];
  recentPayments?: RawPayment[];
  totalPaid?: number;
  totalPending?: number;
  hasLoan?: boolean;
  hasPendingLoan?: boolean;
  nextDueDate?: string | null;
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

const normalizeNumber = (value: number | string | undefined) => {
  if (value === null || value === undefined || value === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};



export default function CustomerRepayments() {
  const {
    payments = [],
    recentPayments = [],
    totalPaid: totalPaidFromBackend,
    totalPending: totalPendingFromBackend,
    hasLoan = true,
    hasPendingLoan = false,
    nextDueDate = null,
  } = usePage<InertiaPageProps & PageProps>().props;


  if (!hasLoan) {
    return (
      <DashboardLayout>
        <Head title="Repayments" />
        <div className="m-4">
          <NoLoansPlaceholder message="You don't have a loans yet. Please apply for a loan to create one." />
        </div>
      </DashboardLayout>
    );
  }
  const sourcePayments = payments.length ? payments : recentPayments;

  const normalizedPayments: Payment[] = sourcePayments.map((payment) => ({
    id: String(payment.id ?? payment.ID ?? ""),
    loanNo: payment.loanNo ?? payment.loan_no ?? "",
    date: payment.date ?? payment.payment_date ?? "",
    amount: normalizeNumber(payment.amount),
    status: payment.status ?? "Completed",
    method: payment.method ?? payment.payment_method,
  }));

  if (hasPendingLoan) {
    return (
      <DashboardLayout>
        <Head title="Repayments" />
        <div className="m-4">
          <PendingLoanPlaceholder
            message="Your loan application is pending review. You can view the summary on the My Loan page."
          />
        </div>
      </DashboardLayout>
    );
  }
  

  const computedTotalPaid = normalizedPayments
    .filter((payment) => payment.status === "Completed")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const computedTotalPending = normalizedPayments
    .filter((payment) => payment.status === "Pending")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const totalPaid = Number.isFinite(totalPaidFromBackend)
    ? Number(totalPaidFromBackend)
    : computedTotalPaid;
  const totalPending = Number.isFinite(totalPendingFromBackend)
    ? Number(totalPendingFromBackend)
    : computedTotalPending;
  const failedCount = normalizedPayments.filter((payment) => payment.status === "Failed").length;

  const sortedByDateDesc = [...normalizedPayments].sort((a, b) => {
    if (!a.date || !b.date) return 0;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  const onTimeStreak = sortedByDateDesc.reduce((count, payment) => {
    if (count === 0 && payment.status !== "Completed") return 0;
    if (payment.status === "Completed") return count + 1;
    return count;
  }, 0);

  // const nextDuePayment = normalizedPayments
  // .filter((payment) => payment.status === "Pending")


  const nextDueDisplay =
  nextDueDate && !Number.isNaN(new Date(nextDueDate).getTime())
    ? formatDate(nextDueDate)
    : "-";


  const preferredMethod = (() => {
    const counts = new Map<string, number>();
    normalizedPayments.forEach((payment) => {
      if (!payment.method) return;
      counts.set(payment.method, (counts.get(payment.method) ?? 0) + 1);
    });
    let topMethod = "";
    let topCount = 0;
    counts.forEach((count, method) => {
      if (count > topCount) {
        topMethod = method;
        topCount = count;
      }
    });
    return topMethod || "-";
  })();

  return (
    <DashboardLayout>
      <Head title="Repayments" />

      <div className="space-y-8">
        <div className="space-y-1.5">
          <p className="text-xl md:text-2xl font-semibold text-gray-900">Repayments</p>
          <p className="text-sm text-gray-600 max-w-xl">
            Track your payment history and get a clearer view of how your loan is progressing.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-gray-200/70 border-2 border-transparent hover:border-[#D97706] transition">
            <p className="text-sm font-medium text-gray-500">Total paid</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{formatCurrency(totalPaid)}</p>
            <p className="text-xs text-gray-500 mt-1">Completed payments</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-gray-200/70 border-2 border-transparent hover:border-[#D97706] transition">
            <p className="text-sm font-medium text-gray-500">Pending</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{formatCurrency(totalPending)}</p>
            <p className="text-xs text-gray-500 mt-1">Awaiting confirmation</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-gray-200/70 border-2 border-transparent hover:border-[#D97706] transition">
            <p className="text-sm font-medium text-gray-500">Failed attempts</p>
            <p className="mt-2 text-2xl font-semibold text-gray-900">{failedCount}</p>
            <p className="text-xs text-gray-500 mt-1">Needs attention</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentPaymentsCard payments={normalizedPayments} />
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70">
            <h2 className="text-lg font-semibold text-gray-900">Payment Snapshot</h2>
            <p className="mt-1 text-sm text-gray-500">
              A quick look at your repayment activity.
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-emerald-700">On-time streak</p>
                <p className="mt-2 text-xl font-semibold text-emerald-900">
                  {onTimeStreak} payment{onTimeStreak === 1 ? "" : "s"}
                </p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-amber-700">Next due</p>
                {/* <p className="mt-2 text-xl font-semibold text-amber-900">
                  {nextDuePayment?.date ? formatDate(nextDuePayment.date) : "-"}
                </p> */}
                <p className="mt-2 text-xl font-semibold text-amber-900">
                  {nextDueDisplay}
                </p>

              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-600">Preferred method</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{preferredMethod}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
