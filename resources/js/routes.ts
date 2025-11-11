// resources/js/routes.ts

export const dashboard = () => ({
    url: '/dashboard',
    name: 'dashboard',
});

export const borrowers = {
    index: () => ({
        url: '/borrowers',
        name: 'borrowers.index',
    }),
    add: () => ({
        url: '/borrowers/add',
        name: 'borrowers.add',
    }),
};

export const loans = {
    index: () => ({
        url: '/loans',
        name: 'loans.index',
    }),
    add: () => ({
        url: '/loans/add',
        name: 'loans.add',
    }),
    late1: () => ({
        url: '/loans/1-month-late',
        name: 'loans.late-1',
    }),
    late3: () => ({
        url: '/loans/3-month-late',
        name: 'loans.late-3',
    }),
    pastMaturity: () => ({
        url: '/loans/past-maturity-date',
        name: 'loans.past-maturity',
    }),
    applications: () => ({
        url: '/loans/view-loan-applications',
        name: 'loans.applications',
    }),
};

export const repayments = {
    index: () => ({
        url: '/repayments',
        name: 'repayments.index',
    }),
};

export const collections = {
    daily: () => ({
        url: '/daily-collections',
        name: 'collections.daily',
    }),
};

export const reports = {
    dailyCash: () => ({
        url: '/daily-cash-position-report',
        name: 'reports.daily-cash',
    }),
    monthly: () => ({
        url: '/monthly-report',
        name: 'reports.monthly',
    }),
    incomeStatement: () => ({
        url: '/income-statement-report',
        name: 'reports.income-statement',
    }),
};

export const users = {
    index: () => ({
        url: '/system-users',
        name: 'users.index',
    }),
    add: () => ({
        url: '/system-users/add',
        name: 'users.add',
    }),
};

export const routes = {
    home: () => ({ url: '/' }),

    dashboard: () => ({ url: '/dashboard' }),

    borrowers: {
        index: () => ({ url: '/borrowers' }),
        add: () => ({ url: '/borrowers/add' }),
        show: (id: number | string) => ({ url: `/borrowers/${id}` }),
        edit: (id: number | string) => ({ url: `/borrowers/${id}/edit` }),
    },

    loans: {
        index: () => ({ url: '/loans' }),
        add: () => ({ url: '/loans/add' }),
        late1: () => ({ url: '/loans/1-month-late' }),
        late3: () => ({ url: '/loans/3-month-late' }),
        pastMaturity: () => ({ url: '/loans/past-maturity-date' }),
        applications: () => ({ url: '/loans/view-loan-applications' }),
        show: (id: number | string) => ({ url: `/loans/${id}` }),
    },

    repayments: {
        index: () => ({ url: '/repayments' }),
    },

    collections: {
        daily: () => ({ url: '/daily-collections' }),
    },

    reports: {
        dailyCash: () => ({ url: '/daily-cash-position-report' }),
        monthly: () => ({ url: '/monthly-report' }),
        incomeStatement: () => ({ url: '/income-statement-report' }),
    },

    users: {
        index: () => ({ url: '/system-users' }),
        add: () => ({ url: '/system-users/add' }),
    },
};
