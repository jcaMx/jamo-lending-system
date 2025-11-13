import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { routes } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  User,
  ClipboardList,
  DollarSign,
  CheckSquare,
  FileText,
  Check,
  Handshake,
  FileWarning,
  TrendingUp,
  Database,
} from 'lucide-react';
import axios from 'axios';

// Breadcrumbs using fixed route
const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: routes.dashboard().url },
];

// Typing for stats card
interface StatCard {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

// Typing for chart data
interface ChartData {
  month: string;
  value: number;
}

// Dummy fallback data
const dummyStats: StatCard[] = [
  { label: 'Registered Borrowers', value: 5, color: 'bg-orange-500', icon: <User className="w-6 h-6" /> },
  { label: 'Total Loans Released', value: 5, color: 'bg-green-500', icon: <ClipboardList className="w-6 h-6" /> },
  { label: 'Total Collections', value: 5, color: 'bg-blue-500', icon: <DollarSign className="w-6 h-6" /> },
  { label: 'To Be Reviewed Loan Applications', value: 5, color: 'bg-purple-500', icon: <CheckSquare className="w-6 h-6" /> },
  { label: 'Open Loans', value: 5, color: 'bg-sky-500', icon: <FileText className="w-6 h-6" /> },
  { label: 'Fully Paid Loans', value: 5, color: 'bg-violet-500', icon: <Check className="w-6 h-6" /> },
  { label: 'Restructured Loans', value: 5, color: 'bg-green-600', icon: <Handshake className="w-6 h-6" /> },
  { label: 'Default Loans', value: 5, color: 'bg-gray-500', icon: <FileWarning className="w-6 h-6" /> },
];

const dummyLoanData: ChartData[] = [
  { month: 'Jan', value: 20000 }, { month: 'Feb', value: 40000 }, { month: 'Mar', value: 35000 },
  { month: 'Apr', value: 50000 }, { month: 'May', value: 30000 }, { month: 'Jun', value: 60000 },
  { month: 'Jul', value: 45000 }, { month: 'Aug', value: 55000 }, { month: 'Sep', value: 70000 },
  { month: 'Oct', value: 50000 }, { month: 'Nov', value: 65000 }, { month: 'Dec', value: 85000 },
];

const dummyCollectionData: ChartData[] = [
  { month: 'Jan', value: 10000 }, { month: 'Feb', value: 25000 }, { month: 'Mar', value: 40000 },
  { month: 'Apr', value: 50000 }, { month: 'May', value: 35000 }, { month: 'Jun', value: 55000 },
  { month: 'Jul', value: 60000 }, { month: 'Aug', value: 45000 }, { month: 'Sep', value: 65000 },
  { month: 'Oct', value: 55000 }, { month: 'Nov', value: 60000 }, { month: 'Dec', value: 70000 },
];

export default function Dashboard() {
  const [stats, setStats] = useState<StatCard[]>(dummyStats);
  const [loanData, setLoanData] = useState<ChartData[]>(dummyLoanData);
  const [collectionData, setCollectionData] = useState<ChartData[]>(dummyCollectionData);

  useEffect(() => {
    // Fetch stats from API
    axios.get('/api/dashboard-stats')
      .then(res => {
        setStats([
          { label: 'Registered Borrowers', value: res.data.registered_borrowers, color: 'bg-orange-500', icon: <User className="w-6 h-6" /> },
          { label: 'Total Loans Released', value: res.data.total_loans, color: 'bg-green-500', icon: <ClipboardList className="w-6 h-6" /> },
          { label: 'Total Collections', value: res.data.total_collections, color: 'bg-blue-500', icon: <DollarSign className="w-6 h-6" /> },
          { label: 'To Be Reviewed Loan Applications', value: res.data.to_review_loans, color: 'bg-purple-500', icon: <CheckSquare className="w-6 h-6" /> },
          { label: 'Open Loans', value: res.data.open_loans, color: 'bg-sky-500', icon: <FileText className="w-6 h-6" /> },
          { label: 'Fully Paid Loans', value: res.data.fully_paid, color: 'bg-violet-500', icon: <Check className="w-6 h-6" /> },
          { label: 'Restructured Loans', value: res.data.restructured, color: 'bg-green-600', icon: <Handshake className="w-6 h-6" /> },
          { label: 'Default Loans', value: res.data.defaulted, color: 'bg-gray-500', icon: <FileWarning className="w-6 h-6" /> },
        ]);
      })
      .catch(() => console.log('Using dummy stats'));

    // Fetch loans chart
    axios.get('/api/dashboard-loans')
      .then(res => setLoanData(res.data))
      .catch(() => console.log('Using dummy loan chart'));

    // Fetch collections chart
    axios.get('/api/dashboard-collections')
      .then(res => setCollectionData(res.data))
      .catch(() => console.log('Using dummy collection chart'));
  }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center p-4 bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-md transition">
              <div className={`${stat.color} text-white p-3 rounded-lg flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <ChartCard title="Loans Released" data={loanData} color="#f97316" icon={<TrendingUp className="w-5 h-5 text-orange-500" />} />
          <ChartCard title="Collections" data={collectionData} color="#3b82f6" icon={<Database className="w-5 h-5 text-blue-500" />} />
        </div>

        {/* Quick Links */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          <Link href={routes.borrowers.add().url} className="p-4 bg-green-500 text-white rounded-lg text-center hover:bg-green-600 transition">Add Borrower</Link>
          <Link href={routes.loans.add().url} className="p-4 bg-orange-500 text-white rounded-lg text-center hover:bg-orange-600 transition">Add Loan</Link>
          <Link href={routes.reports.monthly().url} className="p-4 bg-blue-500 text-white rounded-lg text-center hover:bg-blue-600 transition">Monthly Report</Link>
          <Link href={routes.reports.incomeStatement().url} className="p-4 bg-purple-500 text-white rounded-lg text-center hover:bg-purple-600 transition">Income Statement</Link>
        </div>
      </div>
    </AppLayout>
  );
}

// ChartCard component
function ChartCard({ title, data, color, icon }: { title: string; data: ChartData[]; color: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-4">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-lg font-semibold">{title}</h2>
      </div>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
