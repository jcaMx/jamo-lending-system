import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

type Repayment = { id: number; name: string; loanNo: string; method: string; collectedBy: string; collectionDate: string; paidAmount: number };
type Loan = { loanNo: string; released: string; maturity: string; repayment: string; principal: number; interest: string; interestType: string; penalty: number; due: number; balance: number; status: string };

export default function Show({ borrower }: { borrower: any }) {
  const [activeTab, setActiveTab] = useState<'repayments' | 'loanTerms' | 'loanSchedule' | 'loanCollateral' | 'loanFiles' | 'coBorrower' | 'loanComments'>('repayments');

  // fallback safety if borrower is undefined
  if (!borrower) {
    return <div className="p-6">No borrower data provided.</div>;
  }

  const activeLoan: Loan = borrower.activeLoan ?? {
    loanNo: '-',
    released: '',
    maturity: '',
    repayment: '',
    principal: 0,
    interest: '',
    interestType: '',
    penalty: 0,
    due: 0,
    balance: 0,
    status: '',
  };

  const repayments: Repayment[] = borrower.repayments ?? [];

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Borrowers', href: '/borrowers' },
    { title: borrower.name, href: `/borrowers/${borrower.id}` },
  ];

  const tabs = [
    { key: 'repayments', label: 'Repayments' },
    { key: 'loanTerms', label: 'Loan Terms' },
    { key: 'loanSchedule', label: 'Loan Schedule' },
    { key: 'loanCollateral', label: 'Loan Collateral' },
    { key: 'loanFiles', label: 'Loan Files' },
    { key: 'coBorrower', label: 'Co-Borrower' },
    { key: 'loanComments', label: 'Loan Comments' },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Borrower: ${borrower.name}`} />

      {/* Borrower Info Card */}
      <div className="m-4 bg-white p-6 rounded-lg shadow space-y-2 mb-6 border border-gray-100">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
            <img src="https://via.placeholder.com/80" alt={borrower.name} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 w-full">
            {/* Name full width on top */}
            <div className="col-span-1 md:col-span-3 font-semibold text-lg mb-1">{borrower.name}</div>
            {/* Column 1 */}
            <div className="flex flex-col gap-1">
              <p>
                <span className="font-medium">Occupation:</span> {borrower.occupation}
              </p>
              <p>
                <span className="font-medium">Gender:</span> {borrower.gender}
              </p>
              <p>
                <span className="font-medium">Age:</span> {borrower.age} yrs old
              </p>
            </div>
            {/* Column 2 */}
            <div className="flex flex-col gap-1">
              <p>
                <span className="font-medium">Address:</span> {borrower.address}
              </p>
              <p>
                <span className="font-medium">City:</span> {borrower.city}
              </p>
              <p>
                <span className="font-medium">Zipcode:</span> {borrower.zipcode}
              </p>
            </div>
            {/* Column 3 */}
            <div className="flex flex-col gap-1">
              <p>
                <span className="font-medium">Email:</span> {borrower.email}
              </p>
              <p>
                <span className="font-medium">Mobile:</span> {borrower.mobile}
              </p>
              <p>
                <span className="font-medium">Landline:</span> {borrower.landline}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Loan Table */}
      <div className="m-4 overflow-x-auto mb-4">
        <p className='m-2 text-1xl font-semibold'>Active Loan</p>
        <table className="min-w-full bg-white border rounded-lg shadow-sm">
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
              <td className="px-3 py-2">{activeLoan.loanNo}</td>
              <td className="px-3 py-2">{activeLoan.released}</td>
              <td className="px-3 py-2">{activeLoan.maturity}</td>
              <td className="px-3 py-2">{activeLoan.repayment}</td>
              <td className="px-3 py-2">₱{activeLoan.principal.toLocaleString()}</td>
              <td className="px-3 py-2">{activeLoan.interest}</td>
              <td className="px-3 py-2">{activeLoan.interestType}</td>
              <td className="px-3 py-2">{activeLoan.penalty}</td>
              <td className="px-3 py-2">₱{activeLoan.due.toLocaleString()}</td>
              <td className="px-3 py-2">₱{activeLoan.balance.toLocaleString()}</td>
              <td className="px-3 py-2">{activeLoan.status}</td>
            </tr>
          </tbody>
        </table>
      </div>


      {/* TABS  */}
      <div className='m-4 bg-white  rounded-lg shadow space-y-2 mb-6 border border-gray-100'>

        {/* Tabs Navigation - top-right rounded corner */}
        <div className="flex gap-2 overflow-hidden">
          {tabs.map((tab, idx) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 font-medium whitespace-nowrap transition-colors duration-150 ${
                activeTab === tab.key
                  ? 'bg-[#D97706] text-white border-b-2 border-orange-500 shadow-sm'
                  : 'bg-white text-gray-600 border-b-2 border-transparent hover:text-gray-800'
              } ${idx === tabs.length - 1 ? 'rounded-tr-lg' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className='mx-2' >
          {activeTab === 'repayments' && (
            <div className="overflow-x-auto">
              

              <table className="min-w-full bg-white border rounded-lg shadow-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Name</th>
                    <th className="px-3 py-2 text-left">Loan No.</th>
                    <th className="px-3 py-2 text-left">Method</th>
                    <th className="px-3 py-2 text-left">Collected By</th>
                    <th className="px-3 py-2 text-left">Collection Date</th>
                    <th className="px-3 py-2 text-left">Paid Amount</th>
                    <th className="px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {repayments.map((r: Repayment, i: number) => (
                    <tr key={i} className="border-b hover:bg-gray-50">
                      <td className="px-3 py-2">{r.name}</td>
                      <td className="px-3 py-2">{r.loanNo}</td>
                      <td className="px-3 py-2">{r.method}</td>
                      <td className="px-3 py-2">{r.collectedBy}</td>
                      <td className="px-3 py-2">{r.collectionDate}</td>
                      <td className="px-3 py-2 font-semibold">₱{r.paidAmount.toLocaleString()}</td>
                      <td className="px-3 py-2 text-orange-500 cursor-pointer">Edit</td>
                    </tr>
                  ))}
                  {repayments.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-3 py-3 text-center text-gray-500">No repayments yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="flex justify-end mb-2 ">
                <Button className='bg-[#FABF24] text-black mt-5'>Add Repayment</Button>
              </div>
            </div>
          )}

          {activeTab === 'loanTerms' && (
            <div className="p-4 bg-gray-50 text-gray-500 rounded">Loan terms content goes here...</div>
          )}

          {activeTab === 'loanSchedule' && (
            <div className="p-4 bg-gray-50 text-gray-500 rounded">Loan schedule content goes here...</div>
          )}

          {activeTab === 'loanCollateral' && (
            <div className="p-4 bg-gray-50 text-gray-500 rounded">Loan collateral content goes here...</div>
          )}

          {activeTab === 'loanFiles' && (
            <div className="p-4 bg-gray-50 text-gray-500 rounded">
              <ul>
                {(borrower.files || []).map((f: any) => (
                  <li key={f.id}>{f.name}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'coBorrower' && (
            <div className="p-4 bg-gray-50 text-gray-500 rounded">
              <ul>
                {(borrower.coBorrowers || []).map((c: any, i: number) => (
                  <li key={i}>{c.name} — {c.relation}</li>
                ))}
                {(!borrower.coBorrowers || borrower.coBorrowers.length === 0) && <div>No co-borrowers.</div>}
              </ul>
            </div>
          )}

          {activeTab === 'loanComments' && (
            <div className="p-4 bg-gray-50 text-gray-500 rounded">
              <ul>
                {(borrower.comments || []).map((c: any) => (
                  <li key={c.id}><strong>{c.author}</strong>: {c.text} <span className="text-sm text-gray-400">({c.date})</span></li>
                ))}
                {(!borrower.comments || borrower.comments.length === 0) && <div>No comments yet.</div>}
              </ul>
            </div>
          )}
        </div>
        
      </div>
      
    </AppLayout>
  );
}
