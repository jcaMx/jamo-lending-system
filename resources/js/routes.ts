// Auth routes
export const login = () => '/login';
export const register = () => '/register';
export const logout = () => '/logout';
export const home = () => '/';

// Dashboard
export const dashboard = () => '/dashboard';

// Borrowers
export const borrowers = {
    index: () => '/borrowers',
    add: () => '/borrowers/add',
    show: (id: number | string) => `/borrowers/${id}`,
    loans: (id: number | string) => `/borrowers/${id}/loans`,
    repayments: (id: number | string) => `/borrowers/${id}/repayments`,
};

// Loans
export const loans = {
    add: () => '/Loans/AddLoan',
    oneMonthLate: () => '/Loans/1MLL',
    threeMonthLate: () => '/Loans/3MLL',
    pastMaturity: () => '/Loans/PMD',
    viewApplications: () => '/Loans/VLA',
    view: () => '/Loans/VAL',
};

// Daily collection sheet
export const daily_collections = {
    index: () => '/daily-collections',
};

// Repayments
export const repayments = {
    index: () => '/Repayments',
    add: () => '/Repayments/add',
};

// Reports
export const reports = {
    dcpr: () => '/Reports/DCPR',
    monthly: () => '/Reports/MonthlyReport',
    incomeStatement: () => '/Reports/IncomeStatement',
};

// Collections
export const collections = {
    daily: () => '/daily-collections',
};

// Users
export const users = {
    index: () => '/users',
    add: () => '/users/add',
};

// Default export
export const routes = {
    home,
    login,
    register,
    logout,
    dashboard,
    borrowers,
    loans,
    repayments,
    reports,
    collections,
    users,
};
