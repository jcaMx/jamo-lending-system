import { Wallet, TrendingDown, AlertTriangle, CreditCard, Calendar } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { RecentPaymentsCard } from "@/components/dashboard/RecentPaymentsCard";
import { customerProfile, loans, recentPayments, getDashboardStats, Loan } from "@/data/dummyData";

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
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const CustomerDashboard = () => {
  const stats = getDashboardStats();
  const activeLoans = loans.filter((l: Loan) => l.status === "Active" || l.status === "Overdue");
  const initials = customerProfile.name.split(" ").map((n: string) => n[0]).join("");

  const statCards = [
    { title: "Total Balance", value: formatCurrency(stats.totalBalance), icon: Wallet, description: "Across all active loans" },
    { title: "Amount Due", value: formatCurrency(stats.totalDue), icon: TrendingDown, description: "Current outstanding", color: "#D97706" },
    { title: "Total Penalty", value: formatCurrency(stats.totalPenalty), icon: AlertTriangle, description: stats.totalPenalty > 0 ? "Action required" : "No penalties", color: stats.totalPenalty > 0 ? "#DC2626" : undefined },
    { title: "Active Loans", value: stats.activeLoans.toString(), icon: CreditCard, description: `${stats.overdueCount} overdue`, color: "#16A34A" },
  ];

  const loanStatusConfig = {
    Active: { bg: "bg-[#1E3A5F]", pillBg: "bg-emerald-100", pillText: "text-emerald-700", border: "border-emerald-200" },
    Overdue: { bg: "bg-[#1E3A5F]", pillBg: "bg-rose-100", pillText: "text-rose-700", border: "border-rose-200" },
    Paid: { bg: "bg-slate-600", pillBg: "bg-slate-100", pillText: "text-slate-600", border: "border-slate-200" },
    Pending: { bg: "bg-[#1E3A5F]", pillBg: "bg-amber-100", pillText: "text-amber-700", border: "border-amber-200" },
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="space-y-1.5">
          <p className="text-xl md:text-2xl font-semibold text-gray-900">Dashboard</p>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Welcome back</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            {customerProfile.name}
          </h1>
          <p className="text-sm md:text-base text-gray-600 max-w-xl">
            Here is a quick snapshot of your loan activity and recent repayments.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm ring-1 ring-gray-200/70 border-2 border-transparent hover:border-[#D97706] hover:shadow-md transition-all">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color ? `${stat.color}15` : '#f3f4f6' }}>
                  <stat.icon className="w-5 h-5" style={{ color: stat.color || '#6B7280' }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Loans Section */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Active Loans</h2>
              <span className="text-sm text-gray-500">{activeLoans.length} active loan{activeLoans.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {activeLoans.map((loan: Loan) => {
                const config = loanStatusConfig[loan.status as keyof typeof loanStatusConfig];
                return (
                  <div key={loan.id} className={["rounded-2xl border bg-white shadow-sm ring-1 ring-gray-200/70", config.border].join(" ")}>
                    <div className={["flex items-center justify-between rounded-t-2xl px-5 py-4 text-white", config.bg].join(" ")}>
                      <div>
                        <p className="text-xs text-white/70">Loan No.</p>
                        <p className="text-lg font-semibold">#{loan.loanNo}</p>
                      </div>
                      <span className={["inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", config.pillBg, config.pillText].join(" ")}>
                        {loan.status}
                      </span>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs font-medium text-gray-500">Principal</p>
                          <p className="text-base font-semibold text-gray-900">{formatCurrency(loan.principal)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Balance</p>
                          <p className="text-base font-semibold text-gray-900">{formatCurrency(loan.balance)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Amount Due</p>
                          <p className="text-base font-semibold text-amber-600">{formatCurrency(loan.due)}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">Penalty</p>
                          <p className="text-base font-semibold text-rose-600">{formatCurrency(loan.penalty)}</p>
                        </div>
                      </div>
                      <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Next Payment</p>
                            <p className="font-medium text-gray-900">{formatDate(loan.nextPaymentDate)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Maturity</p>
                            <p className="font-medium text-gray-900">{formatDate(loan.maturityDate)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 border-t pt-4 text-xs">
                        <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-600">{loan.repaymentType}</span>
                        <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-600">{loan.interestType}</span>
                        <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-600">{loan.interestRate}% Interest</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Loan History */}
            {loans.filter((l: Loan) => l.status === "Paid").length > 0 && (
              <>
                <div className="flex items-center justify-between pt-4">
                  <h2 className="text-lg font-bold text-gray-900">Loan History</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {loans.filter((l: Loan) => l.status === "Paid").map((loan: Loan) => {
                    const config = loanStatusConfig[loan.status as keyof typeof loanStatusConfig];
                    return (
                      <div key={loan.id} className="opacity-80">
                        <div className={["rounded-2xl border bg-white shadow-sm ring-1 ring-gray-200/70", config.border].join(" ")}>
                          <div className={["flex items-center justify-between rounded-t-2xl px-5 py-4 text-white", config.bg].join(" ")}>
                            <div>
                              <p className="text-xs text-white/70">Loan No.</p>
                              <p className="text-lg font-semibold">#{loan.loanNo}</p>
                            </div>
                            <span className={["inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold", config.pillBg, config.pillText].join(" ")}>
                              {loan.status}
                            </span>
                          </div>
                          <div className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-xs font-medium text-gray-500">Principal</p>
                                <p className="text-base font-semibold text-gray-900">{formatCurrency(loan.principal)}</p>
                              </div>
                              <div>
                                <p className="text-xs font-medium text-gray-500">Balance</p>
                                <p className="text-base font-semibold text-gray-900">{formatCurrency(loan.balance)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Recent Payments Sidebar */}
          <RecentPaymentsCard payments={recentPayments} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
