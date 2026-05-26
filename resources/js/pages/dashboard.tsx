import AppLayout from '@/layouts/app-layout';
import { routes } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import axios from 'axios';
import {
    AlertCircle,
    Bell,
    Check,
    CheckSquare,
    ClipboardList,
    Database,
    Banknote,
    FileText,
    FileWarning,
    TrendingUp,
    User,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: routes.dashboard() },
];

interface StatCard {
    label: string;
    value: number | string;
    color: string;
    icon: React.ReactNode;
    description: string;
}

interface ChartData {
    month: string;
    value: number;
}

interface UpcomingSchedule {
    id: number;
    loan_id: number;
    borrower_name: string;
    installment_no: number;
    due_date: string;
    total_due: number;
    days_until_due: number;
}

interface StaffNotification {
    id: string;
    data: {
        borrower_name?: string;
        loan_id?: number;
        loan_type?: string;
        message?: string;
        principal_amount?: number;
        submitted_at?: string;
        url?: string;
    };
    created_at?: string;
}

const currencyFormatter = new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

const shortMonth = (label: string) => label.slice(0, 3);

const formatCurrency = (value: number) => currencyFormatter.format(value);

const formatCompactCurrency = (value: number) => {
    if (value >= 1_000_000) return `PHP ${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `PHP ${(value / 1_000).toFixed(0)}K`;
    return formatCurrency(value);
};

const buildChartSummary = (data: ChartData[]) => {
    const latest = Number(data[data.length - 1]?.value ?? 0);
    const previous = Number(data[data.length - 2]?.value ?? 0);
    const total = data.reduce((sum, item) => sum + Number(item.value), 0);
    const delta = latest - previous;
    const deltaPercent =
        previous > 0 ? (delta / previous) * 100 : latest > 0 ? 100 : 0;

    return {
        latest,
        previous,
        total,
        delta,
        deltaPercent,
    };
};

const ChartTooltip = ({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
}) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-lg border-gray-200 bg-white px-3 py-2 shadow-md border">
            <p className="text-xs font-medium text-gray-500">{label}</p>
            <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(payload[0].value ?? 0)}
            </p>
        </div>
    );
};

export default function Dashboard() {
    const { props } = usePage();
    const roles: string[] = props.auth?.roles ?? [];
    const canViewStaffNotifications = roles.includes('admin');
    const [stats, setStats] = useState<StatCard[]>([]);
    const [loanData, setLoanData] = useState<ChartData[]>([]);
    const [collectionData, setCollectionData] = useState<ChartData[]>([]);
    const [upcomingSchedules, setUpcomingSchedules] = useState<
        UpcomingSchedule[]
    >([]);
    const [notifications, setNotifications] = useState<StaffNotification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);
    const [popupNotification, setPopupNotification] =
        useState<StaffNotification | null>(null);
    const seenNotificationIds = useRef<Set<string>>(new Set());
    const hasLoadedNotifications = useRef(false);

    useEffect(() => {
        axios
            .get('/dashboard-stats')
            .then((res) => {
                const data = res.data;
                setStats([
                    {
                        label: 'Registered Borrowers',
                        value: data.totalBorrowers,
                        color: '#D97706',
                        icon: <User className="h-6 w-6" />,
                        description: 'Borrower records',
                    },
                    {
                        label: 'Total Loans Released',
                        value: data.total_loans_released
                            ? formatCurrency(data.total_loans_released)
                            : 'PHP 0',
                        color: '#16A34A',
                        icon: <ClipboardList className="h-6 w-6" />,
                        description: 'Released principal',
                    },
                    {
                        label: 'Total Collections',
                        value: data.total_collections
                            ? formatCurrency(data.total_collections)
                            : 'PHP 0',
                        color: '#2563EB',
                        icon: <Banknote className="h-6 w-6" />,
                        description: 'Collected payments',
                    },
                    {
                        label: 'To Be Reviewed Loan Applications',
                        value: data.to_review_loans,
                        color: '#F59E0B',
                        icon: <CheckSquare className="h-6 w-6" />,
                        description: 'Pending review',
                    },
                    {
                        label: 'Open Loans',
                        value: data.open_loans,
                        color: '#0284C7',
                        icon: <FileText className="h-6 w-6" />,
                        description: 'Currently active',
                    },
                    {
                        label: 'Fully Paid Loans',
                        value: data.fully_paid,
                        color: '#059669',
                        icon: <Check className="h-6 w-6" />,
                        description: 'Closed accounts',
                    },
                    {
                        label: 'Default Loans',
                        value: data.defaulted,
                        color: '#64748B',
                        icon: <FileWarning className="h-6 w-6" />,
                        description: 'Needs attention',
                    },
                ]);
            })
            .catch(() => console.log('Failed to fetch dashboard stats'));

        axios
            .get('/dashboard-loans')
            .then((res) => setLoanData(res.data))
            .catch(() => console.log('Failed to fetch loan chart'));

        axios
            .get('/dashboard-collections')
            .then((res) => setCollectionData(res.data))
            .catch(() => console.log('Failed to fetch collection chart'));

        axios
            .get('/dashboard-upcoming-schedules')
            .then((res) => setUpcomingSchedules(res.data))
            .catch(() => console.log('Failed to fetch upcoming schedules'));
    }, []);

    useEffect(() => {
        if (!canViewStaffNotifications) return;

        let popupTimer: ReturnType<typeof setTimeout> | undefined;

        const fetchNotifications = () => {
            axios
                .get('/api/staff/notifications')
                .then((res) => {
                    const nextNotifications: StaffNotification[] =
                        res.data.notifications ?? [];
                    const nextUnreadCount = Number(res.data.unread_count ?? 0);
                    const previousIds = seenNotificationIds.current;
                    const newNotification = nextNotifications.find(
                        (notification) => !previousIds.has(notification.id),
                    );

                    setNotifications(nextNotifications);
                    setUnreadCount(nextUnreadCount);
                    seenNotificationIds.current = new Set(
                        nextNotifications.map(
                            (notification) => notification.id,
                        ),
                    );

                    if (hasLoadedNotifications.current && newNotification) {
                        setPopupNotification(newNotification);
                        if (popupTimer) clearTimeout(popupTimer);
                        popupTimer = setTimeout(
                            () => setPopupNotification(null),
                            8000,
                        );
                    }

                    hasLoadedNotifications.current = true;
                })
                .catch(() =>
                    console.log('Failed to fetch staff notifications'),
                );
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);

        return () => {
            clearInterval(interval);
            if (popupTimer) clearTimeout(popupTimer);
        };
    }, [canViewStaffNotifications]);

    const openNotification = (notification: StaffNotification) => {
        axios
            .post(`/api/staff/notifications/${notification.id}/read`)
            .catch(() => console.log('Failed to mark notification as read'))
            .finally(() => {
                setPopupNotification(null);
                router.visit(notification.data.url ?? '/Loans/VLA');
            });
    };

    return (
        <AppLayout>
            <Head title="Dashboard" />
            <div className="space-y-8">
                {popupNotification && (
                    <div className="right-4 top-20 max-w-sm rounded-3xl border-gray-200/70 bg-white p-4 shadow-xl ring-gray-200/70 fixed z-50 w-[calc(100vw-2rem)] border ring-1">
                        <div className="gap-3 flex items-start">
                            <div className="h-11 w-11 rounded-2xl bg-orange-50 text-orange-600 flex shrink-0 items-center justify-center">
                                <Bell className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold text-gray-900">
                                    New loan application
                                </p>
                                <p className="mt-1 text-sm text-gray-600">
                                    {popupNotification.data.message ??
                                        'A borrower submitted a loan application.'}
                                </p>
                                <button
                                    onClick={() =>
                                        openNotification(popupNotification)
                                    }
                                    className="mt-3 rounded-xl px-3 py-1.5 text-xs font-semibold text-white bg-[#1E3A5F] transition hover:bg-[#192132]"
                                >
                                    View application
                                </button>
                            </div>
                            <button
                                onClick={() => setPopupNotification(null)}
                                className="p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 rounded-full transition"
                                aria-label="Dismiss notification"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}

                <div className="gap-4 lg:flex-row lg:items-start flex flex-col justify-between">
                    <div className="space-y-1.5">
                        <p className="text-xl font-semibold text-gray-900 md:text-2xl">
                            Dashboard
                        </p>
                        <p className="text-xs text-gray-500 tracking-[0.2em] uppercase">
                            Admin overview
                        </p>
                        <h1 className="text-3xl font-semibold text-gray-900 md:text-4xl">
                            Lending operations
                        </h1>
                        <p className="max-w-xl text-sm text-gray-600 md:text-base">
                            Operational snapshot of lending volume, collections,
                            and upcoming dues.
                        </p>
                    </div>

                    {canViewStaffNotifications && (
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setShowNotifications((open) => !open)
                                }
                                className="gap-2 rounded-2xl border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-gray-200/70 hover:text-gray-900 inline-flex items-center border ring-1 transition hover:border-[#D97706]"
                            >
                                <span className="relative">
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <span className="-right-2 -top-2 h-5 min-w-5 bg-orange-500 px-1 font-bold text-white absolute flex items-center justify-center rounded-full text-[10px]">
                                            {unreadCount > 9
                                                ? '9+'
                                                : unreadCount}
                                        </span>
                                    )}
                                </span>
                                Notifications
                            </button>

                            {showNotifications && (
                                <div className="right-0 mt-3 max-w-md rounded-3xl border-gray-200/70 bg-white p-3 shadow-xl ring-gray-200/70 absolute z-40 w-[calc(100vw-2rem)] border ring-1">
                                    <div className="border-gray-100 px-2 pb-3 flex items-center justify-between border-b">
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">
                                                Loan applications
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {unreadCount} unread
                                                notification
                                                {unreadCount === 1 ? '' : 's'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="max-h-96 py-2 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="rounded-2xl border-gray-200 bg-gray-50 px-4 py-8 text-sm text-gray-500 border border-dashed text-center">
                                                No unread loan application
                                                notifications.
                                            </div>
                                        ) : (
                                            notifications.map(
                                                (notification) => (
                                                    <button
                                                        key={notification.id}
                                                        onClick={() =>
                                                            openNotification(
                                                                notification,
                                                            )
                                                        }
                                                        className="rounded-2xl px-3 py-3 hover:bg-orange-50 w-full text-left transition"
                                                    >
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {notification.data
                                                                .borrower_name ??
                                                                'Borrower'}
                                                        </p>
                                                        <p className="mt-1 text-sm text-gray-600">
                                                            {notification.data
                                                                .message ??
                                                                'Submitted a loan application.'}
                                                        </p>
                                                        <div className="mt-2 gap-2 text-xs text-gray-500 flex flex-wrap">
                                                            {notification.data
                                                                .loan_type && (
                                                                <span className="bg-gray-100 px-2 py-1 rounded-full">
                                                                    {
                                                                        notification
                                                                            .data
                                                                            .loan_type
                                                                    }
                                                                </span>
                                                            )}
                                                            {notification.data
                                                                .principal_amount !==
                                                                undefined && (
                                                                <span className="bg-gray-100 px-2 py-1 rounded-full">
                                                                    {formatCurrency(
                                                                        Number(
                                                                            notification
                                                                                .data
                                                                                .principal_amount,
                                                                        ),
                                                                    )}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </button>
                                                ),
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid grid-cols-1">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="group rounded-3xl bg-white p-6 shadow-sm ring-gray-200/70 hover:shadow-lg border-2 border-transparent ring-1 transition-all duration-300 hover:border-[#D97706]"
                        >
                            <div className="mb-4 gap-4 flex items-start justify-between">
                                <p className="text-sm font-medium tracking-wider text-gray-500 uppercase">
                                    {stat.label}
                                </p>
                                <div
                                    className="h-12 w-12 rounded-2xl flex shrink-0 items-center justify-center transition-transform group-hover:scale-110"
                                    style={{
                                        backgroundColor: `${stat.color}15`,
                                        color: stat.color,
                                    }}
                                >
                                    {stat.icon}
                                </div>
                            </div>
                            <p className="text-3xl font-bold tracking-tight text-gray-900 truncate">
                                {typeof stat.value === 'string'
                                    ? stat.value
                                    : stat.value.toLocaleString()}
                            </p>
                            <p className="mt-2 gap-1 text-xs text-gray-500 flex items-center">
                                <span className="h-1.5 w-1.5 bg-orange-400 rounded-full" />
                                {stat.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="gap-6 lg:grid-cols-2 grid">
                    <ChartCard
                        title="Loans Released"
                        subtitle="Monthly released amount"
                        data={loanData}
                        color="#ea580c"
                        icon={
                            <TrendingUp className="h-5 w-5 text-orange-600" />
                        }
                        chartType="line"
                    />
                    <ChartCard
                        title="Collections"
                        subtitle="Monthly collected amount"
                        data={collectionData}
                        color="#2563eb"
                        icon={<Database className="h-5 w-5 text-blue-600" />}
                        chartType="bar"
                    />
                </div>

                <div className="rounded-3xl border-gray-200/70 bg-white p-6 shadow-sm ring-gray-200/70 border ring-1">
                    <div className="mb-5 gap-3 sm:flex-row sm:items-center flex flex-col justify-between">
                        <div className="gap-3 flex items-center">
                            <div className="h-12 w-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                                <AlertCircle className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Schedules Due Within 3 Days
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {upcomingSchedules.length} schedules need
                                    attention soon.
                                </p>
                            </div>
                        </div>
                        <span className="bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 w-fit rounded-full">
                            Upcoming dues
                        </span>
                    </div>

                    {upcomingSchedules.length === 0 ? (
                        <div className="rounded-2xl border-gray-200 bg-gray-50 py-10 text-sm text-gray-500 border border-dashed text-center">
                            No schedules due within the next 3 days.
                        </div>
                    ) : (
                        <div className="rounded-2xl border-gray-100 overflow-hidden border">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="border-gray-200 bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-semibold tracking-wide text-gray-600 text-left uppercase">
                                                Borrower
                                            </th>
                                            <th className="px-4 py-3 text-xs font-semibold tracking-wide text-gray-600 text-left uppercase">
                                                Loan #
                                            </th>
                                            <th className="px-4 py-3 text-xs font-semibold tracking-wide text-gray-600 text-left uppercase">
                                                Installment #
                                            </th>
                                            <th className="px-4 py-3 text-xs font-semibold tracking-wide text-gray-600 text-left uppercase">
                                                Due Date
                                            </th>
                                            <th className="px-4 py-3 text-xs font-semibold tracking-wide text-gray-600 text-right uppercase">
                                                Amount Due
                                            </th>
                                            <th className="px-4 py-3 text-xs font-semibold tracking-wide text-gray-600 text-left uppercase">
                                                Due Window
                                            </th>
                                            <th className="px-4 py-3 text-xs font-semibold tracking-wide text-gray-600 text-left uppercase">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {upcomingSchedules.map((schedule) => (
                                            <tr
                                                key={schedule.id}
                                                className={`border-gray-100 text-sm border-b ${
                                                    schedule.days_until_due <= 0
                                                        ? 'bg-red-50/60'
                                                        : schedule.days_until_due ===
                                                            1
                                                          ? 'bg-orange-50/50'
                                                          : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <td className="px-4 py-3 font-medium text-gray-900">
                                                    {schedule.borrower_name}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {schedule.loan_id}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {schedule.installment_no}
                                                </td>
                                                <td className="px-4 py-3 text-gray-700">
                                                    {new Date(
                                                        schedule.due_date,
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-gray-900 text-right">
                                                    {formatCurrency(
                                                        schedule.total_due,
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span
                                                        className={`px-2.5 py-1 text-xs font-semibold inline-flex rounded-full ${
                                                            schedule.days_until_due <=
                                                            0
                                                                ? 'bg-red-100 text-red-700'
                                                                : schedule.days_until_due ===
                                                                    1
                                                                  ? 'bg-orange-100 text-orange-700'
                                                                  : 'bg-yellow-100 text-yellow-800'
                                                        }`}
                                                    >
                                                        {schedule.days_until_due ===
                                                        0
                                                            ? 'Due Today'
                                                            : schedule.days_until_due ===
                                                                1
                                                              ? 'Due Tomorrow'
                                                              : `${schedule.days_until_due} days`}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() =>
                                                            router.visit(
                                                                route(
                                                                    'loans.show',
                                                                    schedule.loan_id,
                                                                ),
                                                            )
                                                        }
                                                        className="rounded-xl px-3 py-1.5 text-xs font-semibold text-white bg-[#1E3A5F] transition hover:bg-[#192132]"
                                                    >
                                                        View Loan
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}

function ChartCard({
    title,
    subtitle,
    data,
    color,
    icon,
    chartType,
}: {
    title: string;
    subtitle: string;
    data: ChartData[];
    color: string;
    icon: React.ReactNode;
    chartType: 'line' | 'bar';
}) {
    const summary = buildChartSummary(data);
    const hasData = data.length > 0;
    const deltaTone =
        summary.delta > 0
            ? 'text-green-600'
            : summary.delta < 0
              ? 'text-red-600'
              : 'text-gray-500';

    return (
        <div className="rounded-3xl border-gray-200/70 bg-white p-6 shadow-sm ring-gray-200/70 border ring-1">
            <div className="mb-5 gap-4 flex items-start justify-between">
                <div>
                    <div className="gap-2 flex items-center">
                        {icon}
                        <h2 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h2>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
                </div>
                <div className="text-right">
                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                        Latest
                    </p>
                    <p className="text-lg font-semibold text-gray-900">
                        {formatCompactCurrency(summary.latest)}
                    </p>
                </div>
            </div>

            <div className="mb-4 gap-3 rounded-2xl bg-gray-50 p-4 grid grid-cols-3">
                <div>
                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                        Current
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatCompactCurrency(summary.latest)}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                        Previous
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">
                        {formatCompactCurrency(summary.previous)}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-medium tracking-wide text-gray-500 uppercase">
                        Change
                    </p>
                    <p className={`mt-1 text-sm font-semibold ${deltaTone}`}>
                        {summary.previous === 0 && summary.latest === 0
                            ? '0%'
                            : `${summary.deltaPercent >= 0 ? '+' : ''}${summary.deltaPercent.toFixed(1)}%`}
                    </p>
                </div>
            </div>

            {!hasData ? (
                <div className="rounded-2xl border-gray-200 bg-gray-50 text-sm text-gray-500 flex h-[260px] items-center justify-center border border-dashed">
                    No data available yet.
                </div>
            ) : (
                <div className="h-[260px]">
                    <ResponsiveContainer width="100%" height="100%">
                        {chartType === 'line' ? (
                            <LineChart
                                data={data}
                                margin={{
                                    top: 10,
                                    right: 12,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    stroke="#e5e7eb"
                                    strokeDasharray="2 4"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    tickFormatter={shortMonth}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    tickFormatter={(value) =>
                                        formatCompactCurrency(Number(value))
                                    }
                                    width={72}
                                />
                                <Tooltip content={<ChartTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={color}
                                    strokeWidth={3}
                                    dot={{ r: 3, strokeWidth: 0, fill: color }}
                                    activeDot={{ r: 5, fill: color }}
                                />
                            </LineChart>
                        ) : (
                            <BarChart
                                data={data}
                                margin={{
                                    top: 10,
                                    right: 12,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    stroke="#e5e7eb"
                                    strokeDasharray="2 4"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    tickFormatter={shortMonth}
                                />
                                <YAxis
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                    tickFormatter={(value) =>
                                        formatCompactCurrency(Number(value))
                                    }
                                    width={72}
                                />
                                <Tooltip content={<ChartTooltip />} />
                                <Bar
                                    dataKey="value"
                                    fill={color}
                                    radius={[6, 6, 0, 0]}
                                    maxBarSize={34}
                                />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            )}

            <p className="mt-3 text-xs text-gray-500">
                Total tracked in chart: {formatCompactCurrency(summary.total)}
            </p>
        </div>
    );
}
