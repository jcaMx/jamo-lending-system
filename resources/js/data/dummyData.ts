export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  contact: string;
  address: string;
  joinDate: string;
}

export interface Loan {
  id: string;
  loanNo: number;
  releasedDate: string;
  maturityDate: string;
  repaymentType: "Monthly" | "Weekly" | "Bi-Weekly";
  principal: number;
  interestRate: number;
  interestType: "Compound" | "Simple";
  penalty: number;
  due: number;
  balance: number;
  status: "Active" | "Paid" | "Overdue" | "Pending";
  nextPaymentDate: string;
  monthlyPayment: number;
}

export interface Payment {
  id: string;
  loanNo: number;
  date: string;
  amount: number;
  type: "Principal" | "Interest" | "Penalty";
  status: "Completed" | "Pending" | "Failed";
}

export const customerProfile: CustomerProfile = {
  id: "CUST-001",
  name: "Rafael Sanchez",
  email: "josh@gmail.com",
  contact: "09288785554",
  address: "123 Main Street, Manila, Philippines",
  joinDate: "2024-06-15",
};

export const loans: Loan[] = [
  {
    id: "LOAN-001",
    loanNo: 143,
    releasedDate: "2025-12-01",
    maturityDate: "2026-11-01",
    repaymentType: "Monthly",
    principal: 10000,
    interestRate: 5,
    interestType: "Compound",
    penalty: 0,
    due: 9647.99,
    balance: 9647.99,
    status: "Active",
    nextPaymentDate: "2026-02-01",
    monthlyPayment: 879.16,
  },
  {
    id: "LOAN-002",
    loanNo: 128,
    releasedDate: "2025-08-15",
    maturityDate: "2026-02-15",
    repaymentType: "Monthly",
    principal: 25000,
    interestRate: 4.5,
    interestType: "Simple",
    penalty: 250,
    due: 12500,
    balance: 12750,
    status: "Overdue",
    nextPaymentDate: "2026-01-15",
    monthlyPayment: 2187.50,
  },
  {
    id: "LOAN-003",
    loanNo: 95,
    releasedDate: "2024-03-01",
    maturityDate: "2025-03-01",
    repaymentType: "Monthly",
    principal: 15000,
    interestRate: 5,
    interestType: "Simple",
    penalty: 0,
    due: 0,
    balance: 0,
    status: "Paid",
    nextPaymentDate: "-",
    monthlyPayment: 1375,
  },
];

export const recentPayments: Payment[] = [
  {
    id: "PAY-001",
    loanNo: 143,
    date: "2026-01-01",
    amount: 879.16,
    type: "Principal",
    status: "Completed",
  },
  {
    id: "PAY-002",
    loanNo: 128,
    date: "2025-12-15",
    amount: 2187.50,
    type: "Principal",
    status: "Completed",
  },
  {
    id: "PAY-003",
    loanNo: 128,
    date: "2025-11-15",
    amount: 2187.50,
    type: "Principal",
    status: "Completed",
  },
  {
    id: "PAY-004",
    loanNo: 143,
    date: "2025-12-01",
    amount: 879.16,
    type: "Principal",
    status: "Completed",
  },
];

export const getDashboardStats = () => {
  const activeLoans = loans.filter((l) => l.status === "Active" || l.status === "Overdue");
  const totalBalance = activeLoans.reduce((sum, l) => sum + l.balance, 0);
  const totalDue = activeLoans.reduce((sum, l) => sum + l.due, 0);
  const totalPenalty = activeLoans.reduce((sum, l) => sum + l.penalty, 0);
  const overdueCount = loans.filter((l) => l.status === "Overdue").length;

  return {
    totalLoans: loans.length,
    activeLoans: activeLoans.length,
    totalBalance,
    totalDue,
    totalPenalty,
    overdueCount,
  };
};
