import { Head } from '@inertiajs/react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RecentPaymentsCard } from "@/components/dashboard/RecentPaymentsCard";
import { recentPayments } from "@/data/dummyData";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function CustomerRepayments() {
  const totalPaid = recentPayments
    .filter((payment) => payment.status === "Completed")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const totalPending = recentPayments
    .filter((payment) => payment.status === "Pending")
    .reduce((sum, payment) => sum + payment.amount, 0);
  const failedCount = recentPayments.filter((payment) => payment.status === "Failed").length;

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
            <RecentPaymentsCard payments={recentPayments} />
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200/70">
            <h2 className="text-lg font-semibold text-gray-900">Payment Snapshot</h2>
            <p className="mt-1 text-sm text-gray-500">
              A quick look at your repayment activity.
            </p>
            <div className="mt-6 space-y-4">
              <div className="rounded-xl bg-emerald-50 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-emerald-700">On-time streak</p>
                <p className="mt-2 text-xl font-semibold text-emerald-900">3 payments</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-amber-700">Next due</p>
                <p className="mt-2 text-xl font-semibold text-amber-900">Feb 15, 2026</p>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.15em] text-slate-600">Preferred method</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">Auto debit</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
