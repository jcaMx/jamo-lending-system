import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { routes } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, ClipboardList, DollarSign, CheckSquare, FileText, Check, Handshake, FileWarning, TrendingUp, Database, Calendar, AlertCircle } from 'lucide-react';
import { router } from '@inertiajs/react';
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

export default function Dashboard() {
  console.log('Rendering Staff Dashboard');
const [stats, setStats] = useState<StatCard[]>([]);
const [loanData, setLoanData] = useState<ChartData[]>([]);
const [collectionData, setCollectionData] = useState<ChartData[]>([]);
const [totalBorrowers, setTotalBorrowers] = useState<number>(0);
const [upcomingSchedules, setUpcomingSchedules] = useState<UpcomingSchedule[]>([]);

useEffect(() => {
// Fetch stats from API
axios.get('/dashboard-stats')
.then(res => {
const data = res.data;
setStats([
{ label: 'Registered Borrowers', value: data.totalBorrowers, color: 'bg-orange-500', icon: <User className="w-6 h-6" /> },
{ label: 'Total Loans Released', value: data.total_loans_released ? `₱${data.total_loans_released.toLocaleString()}` : '₱0', color: 'bg-green-500', icon: <ClipboardList className="w-6 h-6" /> },
{ label: 'Total Collections', value: data.total_collections ? `₱${data.total_collections.toLocaleString()}` : '₱0', color: 'bg-blue-500', icon: <DollarSign className="w-6 h-6" /> },
{ label: 'To Be Reviewed Loan Applications', value: data.to_review_loans, color: 'bg-purple-500', icon: <CheckSquare className="w-6 h-6" /> },
{ label: 'Open Loans', value: data.open_loans, color: 'bg-sky-500', icon: <FileText className="w-6 h-6" /> },
{ label: 'Fully Paid Loans', value: data.fully_paid, color: 'bg-violet-500', icon: <Check className="w-6 h-6" /> },
{ label: 'Restructured Loans', value: data.restructured, color: 'bg-green-600', icon: <Handshake className="w-6 h-6" /> },
{ label: 'Default Loans', value: data.defaulted, color: 'bg-gray-500', icon: <FileWarning className="w-6 h-6" /> },
]);
})
.catch(() => console.log('Failed to fetch dashboard stats'));

// Fetch monthly loan chart  
axios.get('/dashboard-loans')  
  .then(res => setLoanData(res.data))  
  .catch(() => console.log('Failed to fetch loan chart'));  

// Fetch monthly collection chart  
axios.get('/dashboard-collections')  
  .then(res => setCollectionData(res.data))  
  .catch(() => console.log('Failed to fetch collection chart'));  

// Fetch total borrowers
axios.get('/dashboard-stats')
      .then(res => setTotalBorrowers(res.data.totalBorrowers))
      .catch((err) => console.error(err));

// Fetch upcoming due schedules (within 3 days)
axios.get('/dashboard-upcoming-schedules')
      .then(res => setUpcomingSchedules(res.data))
      .catch(() => console.log('Failed to fetch upcoming schedules'));
  }, []);

return ( <AppLayout> <Head title="Dashboard" /> <div className="p-6 space-y-6"> <h1 className="text-3xl font-bold">Dashboard</h1>

    {/* Stats Cards */}  
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">  
      {stats.map((stat, i) => (  
        <div key={i} className="flex items-center p-4 bg-white dark:bg-neutral-900 rounded-lg shadow hover:shadow-md transition">  
          <div className={`${stat.color} text-white p-3 rounded-lg flex items-center justify-center`}>  
            {stat.icon}  
          </div>  
          <div className="ml-4">  
            <p className="text-sm font-medium">{stat.label}</p>  
            <p className="text-2xl font-bold">{typeof stat.value === 'string' ? stat.value : stat.value.toLocaleString()}</p>  
          </div>  
        </div>  
      ))}  
    </div>  

    {/* Charts */}  
    <div className="grid md:grid-cols-2 gap-6">  
      <ChartCard title="Loans Released" data={loanData} color="#f97316" icon={<TrendingUp className="w-5 h-5 text-orange-500" />} />  
      <ChartCard title="Collections" data={collectionData} color="#3b82f6" icon={<Database className="w-5 h-5 text-blue-500" />} />  
    </div>  

    {/* Upcoming Due Schedules (Within 3 Days) */}
    <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="w-5 h-5 text-red-500" />
        <h2 className="text-lg font-semibold">Schedules Due Within 3 Days</h2>
      </div>
      {upcomingSchedules.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No schedules due within the next 3 days.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Borrower</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Loan #</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Installment #</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Due Date</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-700">Amount Due</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Days Until Due</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {upcomingSchedules.map((schedule) => (
                <tr key={schedule.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{schedule.borrower_name}</td>
                  <td className="px-4 py-2">{schedule.loan_id}</td>
                  <td className="px-4 py-2">{schedule.installment_no}</td>
                  <td className="px-4 py-2">{new Date(schedule.due_date).toLocaleDateString()}</td>
                  <td className="px-4 py-2 text-right">₱{schedule.total_due.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      schedule.days_until_due <= 0 ? 'bg-red-100 text-red-800' :
                      schedule.days_until_due === 1 ? 'bg-orange-100 text-orange-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {schedule.days_until_due === 0 ? 'Due Today' :
                       schedule.days_until_due === 1 ? 'Due Tomorrow' :
                       `${schedule.days_until_due} days`}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => router.visit(route('loans.show', schedule.loan_id))}
                      className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
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

function ChartCard({ title, data, color, icon }: { title: string; data: ChartData[]; color: string; icon: React.ReactNode }) {
return ( <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-4"> <div className="flex items-center gap-2 mb-4">
{icon} <h2 className="text-lg font-semibold">{title}</h2> </div> <ResponsiveContainer width="100%" height={250}> <LineChart data={data}> <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /> <XAxis dataKey="month" stroke="#9ca3af" /> <YAxis stroke="#9ca3af" /> <Tooltip />
<Line type="monotone" dataKey="value" stroke={color} strokeWidth={3} dot={{ r: 3 }} /> </LineChart> </ResponsiveContainer> </div>
);
}
