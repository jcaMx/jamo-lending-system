// resources/js/routes.ts

// Auth routes
export const login = () => ({ url: '/login', name: 'login' });
export const register = () => ({ url: '/register', name: 'register' });
export const logout = () => ({ url: '/logout', name: 'logout' });
export const home = () => ({ url: '/', name: 'home' });

// Dashboard
export const dashboard = () => ({ url: '/dashboard', name: 'dashboard' });

// Borrowers
export const borrowers = {
    index: () => ({ url: '/borrowers', name: 'borrowers.index' }),
    add: () => ({ url: '/borrowers/add', name: 'borrowers.add' }),
    show: (id: number | string) => ({ url: `/borrowers/${id}`, name: 'borrowers.show' }),
    loans: (id: number | string) => ({ url: `/borrowers/${id}/loans`, name: 'borrowers.loans' }),
    repayments: (id: number | string) => ({ url: `/borrowers/${id}/repayments`, name: 'borrowers.repayments' }),
};

// Loans
export const loans = {
    add: () => ({ url: '/Loans/AddLoan', name: 'loans.add' }),
    oneMonthLate: () => ({ url: '/Loans/1MLL', name: 'loans.one-month-late' }),
    threeMonthLate: () => ({ url: '/Loans/3MLL', name: 'loans.three-month-late' }),
    pastMaturity: () => ({ url: '/Loans/PMD', name: 'loans.past-maturity-date' }),
    viewApplications: () => ({ url: '/Loans/VLA', name: 'loans.applications' }),
    view: () => ({ url: '/Loans/VAL', name: 'loans.view' }),
};

// Reports
export const reports = {
    dcpr: () => ({ url: '/Reports/DCPR', name: 'reports.dcpr' }),
    monthly: () => ({ url: '/Reports/MonthlyReport', name: 'reports.monthly' }),
    incomeStatement: () => ({ url: '/Reports/IncomeStatement', name: 'reports.income' }),
};

// Collections
export const collections = {
    daily: () => ({ url: '/daily-collections', name: 'collections.daily' }),
};

// Users
export const users = {
    index: () => ({ url: '/system-users', name: 'users.index' }),
    add: () => ({ url: '/system-users/add', name: 'users.add' }),
};

// Default export for easy destructuring
export const routes = {
    home,
    login,
    register,
    logout,
    dashboard,
    borrowers,
    loans,
    reports,
    collections,
    users,
};
