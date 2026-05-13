import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { routes } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import {
  User,
  ClipboardList,
  DollarSign,
  CheckSquare,
  FileText,
  Check,
  FileWarning,
  TrendingUp,
  Database,
  AlertCircle,
} from 'lucide-react';
import { route } from 'ziggy-js';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: routes.dashboard() },
];

interface StatCard {
  label: string;
  value: number | string;
  color: string;
  icon: React.ReactNode;
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
  const latest = data[data.length - 1]?.value ?? 0;
  const previous = data[data.length - 2]?.value ?? 0;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const delta = latest - previous;
  const deltaPercent = previous > 0 ? (delta / previous) * 100 : latest > 0 ? 100 : 0;

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
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-md">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{formatCurrency(payload[0].value ?? 0)}</p>
    </div>
  );
};

export default function Dashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [loanData, setLoanData] = useState<ChartData[]>([]);
  const [collectionData, setCollectionData] = useState<ChartData[]>([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState<UpcomingSchedule[]>([]);

  useEffect(() => {
    axios
      .get('/dashboard-stats')
      .then((res) => {
        const data = res.data;
        setStats([
          { label: 'Registered Borrowers', value: data.totalBorrowers, color: 'bg-orange-500', icon: <User className="h-6 w-6" /> },
          { label: 'Total Loans Released', value: data.total_loans_released ? formatCurrency(data.total_loans_released) : 'PHP 0', color: 'bg-green-500', icon: <ClipboardList className="h-6 w-6" /> },
          { label: 'Total Collections', value: data.total_collections ? formatCurrency(data.total_collections) : 'PHP 0', color: 'bg-blue-500', icon: <DollarSign className="h-6 w-6" /> },
          { label: 'To Be Reviewed Loan Applications', value: data.to_review_loans, color: 'bg-amber-500', icon: <CheckSquare className="h-6 w-6" /> },
          { label: 'Open Loans', value: data.open_loans, color: 'bg-sky-500', icon: <FileText className="h-6 w-6" /> },
          { label: 'Fully Paid Loans', value: data.fully_paid, color: 'bg-emerald-500', icon: <Check className="h-6 w-6" /> },
          { label: 'Default Loans', value: data.defaulted, color: 'bg-slate-500', icon: <FileWarning className="h-6 w-6" /> },
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

  return (
    <AppLayout>
      <Head title="Dashboard" />
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">Operational snapshot of lending volume, collections, and upcoming dues.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md">
              <div className={`${stat.color} flex items-center justify-center rounded-lg p-3 text-white`}>
                {stat.icon}
              </div>
              <div className="ml-4 min-w-0">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="truncate text-2xl font-bold text-gray-900">
                  {typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ChartCard
            title="Loans Released"
            subtitle="Monthly released amount"
            data={loanData}
            color="#ea580c"
            icon={<TrendingUp className="h-5 w-5 text-orange-600" />}
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

        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Schedules Due Within 3 Days</h2>
                <p className="text-sm text-gray-500">{upcomingSchedules.length} schedules need attention soon.</p>
              </div>
            </div>
          </div>

          {upcomingSchedules.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No schedules due within the next 3 days.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Borrower</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Loan #</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Installment #</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Due Date</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-600">Amount Due</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Due Window</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingSchedules.map((schedule) => (
                    <tr
                      key={schedule.id}
                      className={`border-b border-gray-100 text-sm ${
                        schedule.days_until_due <= 0
                          ? 'bg-red-50/60'
                          : schedule.days_until_due === 1
                            ? 'bg-orange-50/50'
                            : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">{schedule.borrower_name}</td>
                      <td className="px-4 py-3 text-gray-600">{schedule.loan_id}</td>
                      <td className="px-4 py-3 text-gray-600">{schedule.installment_no}</td>
                      <td className="px-4 py-3 text-gray-700">{new Date(schedule.due_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(schedule.total_due)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            schedule.days_until_due <= 0
                              ? 'bg-red-100 text-red-700'
                              : schedule.days_until_due === 1
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {schedule.days_until_due === 0
                            ? 'Due Today'
                            : schedule.days_until_due === 1
                              ? 'Due Tomorrow'
                              : `${schedule.days_until_due} days`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => router.visit(route('loans.show', schedule.loan_id))}
                          className="rounded bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700"
                        >
                          View Loan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
    summary.delta > 0 ? 'text-green-600' : summary.delta < 0 ? 'text-red-600' : 'text-gray-500';

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Latest</p>
          <p className="text-lg font-semibold text-gray-900">{formatCompactCurrency(summary.latest)}</p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3 rounded-lg bg-gray-50 p-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Current</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{formatCompactCurrency(summary.latest)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Previous</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">{formatCompactCurrency(summary.previous)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Change</p>
          <p className={`mt-1 text-sm font-semibold ${deltaTone}`}>
            {summary.previous === 0 && summary.latest === 0 ? '0%' : `${summary.deltaPercent >= 0 ? '+' : ''}${summary.deltaPercent.toFixed(1)}%`}
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="flex h-[260px] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-500">
          No data available yet.
        </div>
      ) : (
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="2 4" vertical={false} />
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
                  tickFormatter={(value) => formatCompactCurrency(Number(value))}
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
              <BarChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="2 4" vertical={false} />
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
                  tickFormatter={(value) => formatCompactCurrency(Number(value))}
                  width={72}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} maxBarSize={34} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      <p className="mt-3 text-xs text-gray-500">Total tracked in chart: {formatCompactCurrency(summary.total)}</p>
    </div>
  );
}
