import { Wallet, TrendingDown, AlertTriangle, CreditCard, Calendar } from "lucide-react";
import { Head, usePage } from "@inertiajs/react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { RecentPaymentsCard } from "@/components/dashboard/RecentPaymentsCard";
import NoLoansPlaceholder from "@/components/dashboard/NoLoansPlaceholder";
import PendingLoanPlaceholder from "@/components/dashboard/PendingLoanPlaceholder";
import { PageProps as InertiaPageProps } from '@inertiajs/core';

type DashboardBorrower = {
  name?: string;
  email?: string;
  contact_no?: string;
};

type RawLoan = {
  id?: string | number;
  ID?: string | number;
  loanNo?: string | number;
  loan_no?: string | number;
  principal?: number | string;
  principal_amount?: number | string;
  balance?: number | string;
  balance_remaining?: number | string;
  due?: number | string;
  amount_due?: number | string;
  total_due?: number | string;
  penalty?: number | string;
  penalty_amount?: number | string;
  status?: string;
  nextPaymentDate?: string;
  next_payment_date?: string;
  maturityDate?: string;
  maturity?: string;
  maturity_date?: string;
  end_date?: string;
  repaymentType?: string;
  repayment?: string;
  repayment_frequency?: string;
  interestType?: string;
  interest_type?: string;
  interestRate?: number | string;
  interest?: number | string;
  interest_rate?: number | string;
};

type Loan = {
  id: string;
  loanNo: string;
  principal: number;
  balance: number;
  due: number;
  penalty: number;
  status: "Active" | "Paid" | "Overdue" | "Pending" | string;
  nextPaymentDate: string;
  maturityDate: string;
  repaymentType: string;
  interestType: string;
  interestRate: number;
};

type RawPayment = {
  id?: string | number;
  ID?: string | number;
  loanNo?: string | number;
  loan_no?: string | number;
  date?: string;
  payment_date?: string;
  amount?: number | string;
  status?: string;
};

type DashboardStats = {
  totalBalance: number;
  totalDue: number;
  totalPenalty: number;
  activeLoans: number;
  overdueCount: number;
};

type DashboardPageProps = {
  borrower?: DashboardBorrower | null;
  loans?: RawLoan[];
  recentPayments?: RawPayment[];
  stats?: DashboardStats;
  hasLoan?: boolean;
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

const CustomerDashboard = () => {
  // const { borrower, loans = [], recentPayments = [], stats, hasBorrower = true } = usePage.props() as PageProps;
  const {
    borrower,
    loans = [],
    recentPayments = [],
    stats,
    hasLoan = true,
  } = usePage<InertiaPageProps & DashboardPageProps>().props;

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

  const normalizeNumber = (value: number | string | undefined) => {
    if (value === null || value === undefined || value === "") return 0;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };
 
  const normalizedLoans: Loan[] = loans.map((loan) => ({
    id: String(loan.id ?? loan.ID ?? loan.loanNo ?? loan.loan_no ?? ""),
    loanNo: String(loan.loanNo ?? loan.loan_no ?? loan.ID ?? loan.id ?? ""),
    principal: normalizeNumber(loan.principal ?? loan.principal_amount),
    balance: normalizeNumber(loan.balance ?? loan.balance_remaining),
    due: normalizeNumber(loan.due ?? loan.amount_due ?? loan.total_due ?? 0),
    penalty: normalizeNumber(loan.penalty ?? loan.penalty_amount),
    status: loan.status ?? "Active",
    nextPaymentDate: loan.nextPaymentDate ?? loan.next_payment_date ?? "-",
    maturityDate: loan.maturityDate ?? loan.maturity ?? loan.maturity_date ?? loan.end_date ?? "-",
    repaymentType: loan.repaymentType ?? loan.repayment ?? loan.repayment_frequency ?? "",
    interestType: loan.interestType ?? loan.interest_type ?? "",
    interestRate: normalizeNumber(loan.interestRate ?? loan.interest ?? loan.interest_rate),
  }));

  const normalizedPayments = recentPayments.map((payment) => ({
    id: String(payment.id ?? payment.ID ?? ""),
    loanNo: String(payment.loanNo ?? payment.loan_no ?? ""),
    date: payment.date ?? payment.payment_date ?? "",
    amount: normalizeNumber(payment.amount),
    status: payment.status ?? "Completed",
  }));

  // Fallback when no borrower (e.g. not yet linked)
  const displayName = borrower?.name ?? "Customer";
  const activeLoans = normalizedLoans.filter(
    (l) => l.status === "Active" || l.status === "Overdue"
  );
  const pendingLoans = normalizedLoans.filter((l) => l.status === "Pending");

  if (pendingLoans.length > 0) {
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



  // Use stats from backend, or compute from loans if stats not provided
  const displayStats: DashboardStats = stats ?? {
    totalBalance: activeLoans.reduce((s, l) => s + l.balance, 0),
    totalDue: activeLoans.reduce((s, l) => s + (l.due || 0), 0), // Add fallback to 0
    totalPenalty: activeLoans.reduce((s, l) => s + l.penalty, 0),
    activeLoans: activeLoans.length,
    overdueCount: activeLoans.filter((l) => l.status === "Overdue").length,
  };

  const statCards = [
    { title: "Total Balance", value: formatCurrency(displayStats.totalBalance), icon: Wallet, description: "Across all active loans" },
    { title: "Amount Due", value: formatCurrency(displayStats.totalDue), icon: TrendingDown, description: "Current outstanding", color: "#D97706" },
    { title: "Total Penalty", value: formatCurrency(displayStats.totalPenalty), icon: AlertTriangle, description: displayStats.totalPenalty > 0 ? "Action required" : "No penalties", color: displayStats.totalPenalty > 0 ? "#DC2626" : undefined },
    { title: "Active Loans", value: displayStats.activeLoans.toString(), icon: CreditCard, description: `${displayStats.overdueCount} overdue`, color: "#16A34A" },
  ];

  const loanStatusConfig = {
    Active: { bg: "bg-[#1E3A5F]", pillBg: "bg-emerald-100", pillText: "text-emerald-700", border: "border-emerald-200" },
    Overdue: { bg: "bg-[#1E3A5F]", pillBg: "bg-rose-100", pillText: "text-rose-700", border: "border-rose-200" },
    Paid: { bg: "bg-slate-600", pillBg: "bg-slate-100", pillText: "text-slate-600", border: "border-slate-200" },
    Pending: { bg: "bg-[#1E3A5F]", pillBg: "bg-amber-100", pillText: "text-amber-700", border: "border-amber-200" },
  };
  const defaultLoanConfig = loanStatusConfig.Active;


  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="space-y-1.5">
          <p className="text-xl md:text-2xl font-semibold text-gray-900">Dashboard</p>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Welcome back</p>
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">
            {displayName}
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
            <div className="grid gap-4 sm:grid-cols-1">
              {activeLoans.length > 0 ? (
                activeLoans.map((loan) => {
                  const config =
                    loanStatusConfig[loan.status as keyof typeof loanStatusConfig] ??
                    defaultLoanConfig;

      return (
        <div
          key={loan.id}
          className={[
            "rounded-2xl border bg-white shadow-sm ring-1 ring-gray-200/70",
            config.border,
          ].join(" ")}
        >
          <div
            className={[
              "flex items-center justify-between rounded-t-2xl px-5 py-4 text-white",
              config.bg,
            ].join(" ")}
          >
            <div>
              <p className="text-xs text-white/70">Loan No.</p>
              <p className="text-lg font-semibold">#{loan.loanNo}</p>
            </div>
            <span
              className={[
                "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                config.pillBg,
                config.pillText,
              ].join(" ")}
            >
              {loan.status}
            </span>
          </div>

          <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs font-medium text-gray-500">Principal</p>
                  <p className="text-base font-semibold text-gray-900">
                    {formatCurrency(loan.principal)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Balance</p>
                  <p className="text-base font-semibold text-gray-900">
                    {formatCurrency(loan.balance)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Amount Due</p>
                  <p className="text-base font-semibold text-amber-600">
                    {formatCurrency(loan.due)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500">Penalty</p>
                  <p className="text-base font-semibold text-rose-600">
                    {formatCurrency(loan.penalty)}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Next Payment</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(loan.nextPaymentDate)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Maturity</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(loan.maturityDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 border-t pt-4 text-xs">
                <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                  {loan.repaymentType}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                  {loan.interestType}
                </span>
                <span className="px-2 py-1 bg-gray-100 rounded-md text-gray-600">
                  {loan.interestRate}% Interest
                </span>
              </div>
            </div>
          </div>
                  );
                })
              ) : (
                <NoLoansPlaceholder message="No active loans at the moment." />
              )}
            </div>


            {/* Loan History */}
            {normalizedLoans.filter((l) => l.status === "Paid").length > 0 && (
              <>
                <div className="flex items-center justify-between pt-4">
                  <h2 className="text-lg font-bold text-gray-900">Loan History</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {normalizedLoans.filter((l) => l.status === "Paid").map((loan) => {
                    const config = loanStatusConfig[loan.status as keyof typeof loanStatusConfig] ?? defaultLoanConfig;
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
          <RecentPaymentsCard payments={normalizedPayments} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;

