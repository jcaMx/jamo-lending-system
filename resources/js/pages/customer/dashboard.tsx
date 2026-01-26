// import CustomerLayout from '@/layouts/CustomerLayout';
// import AppLayout from '@/layouts/app-layout';
// export default function CustomerDashboard() {
//     console.log('Rendering Customer Dashboard');

//     return (
//         <AppLayout>

//             <h1>Customer Dashboard</h1>

//         </AppLayout>
//     );
// }

import { Head } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';
import AppLayout from '@/layouts/app-layout';
/* ---------------- TYPES ---------------- */

type Loan = {
    loanNo: string;
    released: string;
    maturity: string;
    repayment: string;
    principal: number;
    interest: string;
    interestType: string;
    penalty: number;
    due: number;
    balance: number;
    status: string;
};

interface Props {
    borrower: {
        name: string;
        email: string;
        contact_no: string;
    } | null;
    loan: Loan | null;
}

/* ---------------- COMPONENT ---------------- */

export default function CustomerDashboard({ borrower, loan }: Props) {
    const safeLoan: Loan = loan ?? {
        loanNo: '-',
        released: '-',
        maturity: '-',
        repayment: '-',
        principal: 0,
        interest: '-',
        interestType: '-',
        penalty: 0,
        due: 0,
        balance: 0,
        status: 'No Active Loan',
    };

    return (
        <AppLayout>
            <Head title="My Loan" />

                {!borrower ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="bg-white rounded-lg p-8 max-w-md text-center">
                        <p className="text-gray-700 text-xl font-semibold mb-4">
                        No borrower record found
                        </p>
                        <p className="text-gray-500 mb-6">
                        It looks like you haven’t applied for a loan yet. Start your application today!
                        </p>
                        <button className="px-6 py-2 bg-[#D97706] text-white rounded-md hover:bg-amber-700 transition">
                        Apply for a Loan
                        </button>
                    </div>
                </div>



            ) : (
                <>
                    {/* Borrower Info */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <InfoCard title="Name" value={borrower.name} />
                        <InfoCard title="Email" value={borrower.email} />
                        <InfoCard title="Contact" value={borrower.contact_no} />
                    </div>

                    {/* Active Loan */}
                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-3 py-2 text-left">Loan No.</th>
                                    <th className="px-3 py-2 text-left">Released</th>
                                    <th className="px-3 py-2 text-left">Maturity</th>
                                    <th className="px-3 py-2 text-left">Repayment</th>
                                    <th className="px-3 py-2 text-left">Principal</th>
                                    <th className="px-3 py-2 text-left">Interest</th>
                                    <th className="px-3 py-2 text-left">Interest Type</th>
                                    <th className="px-3 py-2 text-left">Penalty</th>
                                    <th className="px-3 py-2 text-left">Due</th>
                                    <th className="px-3 py-2 text-left">Balance</th>
                                    <th className="px-3 py-2 text-left">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="px-3 py-2">{safeLoan.loanNo}</td>
                                    <td className="px-3 py-2">{safeLoan.released}</td>
                                    <td className="px-3 py-2">{safeLoan.maturity}</td>
                                    <td className="px-3 py-2">{safeLoan.repayment}</td>
                                    <td className="px-3 py-2">
                                        ₱{safeLoan.principal.toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2">{safeLoan.interest}</td>
                                    <td className="px-3 py-2">{safeLoan.interestType}</td>
                                    <td className="px-3 py-2">{safeLoan.penalty}</td>
                                    <td className="px-3 py-2">
                                        ₱{safeLoan.due.toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2">
                                        ₱{safeLoan.balance.toLocaleString()}
                                    </td>
                                    <td className="px-3 py-2">{safeLoan.status}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </AppLayout>
    );
}

/* ---------------- COMPONENTS ---------------- */

function InfoCard({ title, value }: { title: string; value: string }) {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-lg font-semibold">{value}</p>
        </div>
    );
}
