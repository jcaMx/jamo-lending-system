import React, { useEffect, useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { routes } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, ClipboardList, DollarSign, CheckSquare, FileText, Check, Handshake, FileWarning, TrendingUp, Database } from 'lucide-react';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
{ title: 'Dashboard', href: routes.dashboard() },
];

interface StatCard {
label: string;
value: number;
color: string;
icon: React.ReactNode;
}

interface ChartData {
month: string;
value: number;
}

export default function Dashboard() {
const [stats, setStats] = useState<StatCard[]>([]);
const [loanData, setLoanData] = useState<ChartData[]>([]);
const [collectionData, setCollectionData] = useState<ChartData[]>([]);
const [totalBorrowers, setTotalBorrowers] = useState<number>(0);

useEffect(() => {
// Fetch stats from API
axios.get('/dashboard-stats')
.then(res => {
const data = res.data;
setStats([
{ label: 'Registered Borrowers', value: data.totalBorrowers, color: 'bg-orange-500', icon: <User className="w-6 h-6" /> },
{ label: 'Total Loans Released', value: data.total_loans, color: 'bg-green-500', icon: <ClipboardList className="w-6 h-6" /> },
{ label: 'Total Collections', value: data.total_collections, color: 'bg-blue-500', icon: <DollarSign className="w-6 h-6" /> },
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
  }, []);

return ( <AppLayout breadcrumbs={breadcrumbs}> <Head title="Dashboard" /> <div className="p-6 space-y-6"> <h1 className="text-3xl font-bold">Dashboard</h1>

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
