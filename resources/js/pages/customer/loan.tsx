import { Head } from '@inertiajs/react';
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { LoanCard } from "@/components/dashboard/LoanCard";
import { customerProfile, loans } from "@/data/dummyData";
import { Loan } from "@/data/dummyData";
import { CreditCard, CheckCircle, AlertTriangle, Layers } from "lucide-react";

export default function CustomerLoan() {
  const activeLoans = loans.filter((loan: Loan) => loan.status === "Active" || loan.status === "Overdue");
  const paidLoans = loans.filter((loan: Loan) => loan.status === "Paid");
  const overdueCount = loans.filter((loan: Loan) => loan.status === "Overdue").length;
  const totalLoans = loans.length;

  const summaryCards = [
    { title: "Active Loans", value: activeLoans.length.toString(), icon: CreditCard, description: `${overdueCount} overdue`, color: "#16A34A" },
    { title: "Paid Loans", value: paidLoans.length.toString(), icon: CheckCircle, description: "Completed repayments", color: "#6B7280" },
    { title: "Overdue", value: overdueCount.toString(), icon: AlertTriangle, description: "Needs attention", color: "#DC2626" },
    { title: "Total Loans", value: totalLoans.toString(), icon: Layers, description: "Lifetime count", color: "#D97706" },
  ];

  return (
    <DashboardLayout>
      <Head title="My Loans" />

      <div className="w-full space-y-8">
        <div className="space-y-1">
          <p className="text-2xl md:text-3xl font-semibold text-gray-900">My Loans</p>
          <p className="text-sm text-gray-600 max-w-xl">
            Review active balances, track payments, and manage your loan history in one place.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((stat) => (
            <div
              key={stat.title}
              className="bg-white p-8 rounded-3xl shadow-sm ring-1 ring-gray-200/70 border-2 border-transparent hover:border-[#D97706] transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.title}</p>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-2 font-medium">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Active Loans */}
        {activeLoans.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-gray-900 tracking-tight px-1">Active Loans</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              {activeLoans.map((loan) => (
                <div key={loan.id} className="hover:-translate-y-1 transition-transform duration-300">
                  <LoanCard loan={loan} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loan History */}
        {paidLoans.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Loan History</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {paidLoans.map((loan) => (
                <LoanCard key={loan.id} loan={loan} />
              ))}
            </div>
          </div>
        )}

        {/* No Loans Message */}
        {activeLoans.length === 0 && paidLoans.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm ring-1 ring-gray-200/70 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-golden/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-golden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Loans Found</h3>
              <p className="text-gray-600 mb-6">You don't have any loans yet. Apply for a loan to get started.</p>
              <a href="/applynow">
                <button className="px-6 py-2 bg-[#D97706] text-white rounded-md hover:bg-amber-700 transition">
                  Apply for a Loan
                </button>
              </a>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
