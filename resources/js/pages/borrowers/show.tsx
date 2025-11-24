import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';

type Repayment = { id: number; name: string; loanNo: string; method: string; collectedBy: string; collectionDate: string; paidAmount: number };
type Loan = { loanNo: string; released: string; maturity: string; repayment: string; principal: number; interest: string; interestType: string; penalty: number; due: number; balance: number; status: string };
// Add after line 8 in show.tsx
type Collateral = {
  id: number;
  type: 'Land' | 'Vehicle' | 'ATM';
  estimated_value: number;
  appraisal_date: string;
  status: 'Pledged' | 'Released' | 'Forfeited' | 'Pending';
  description?: string;
  remarks?: string;
  land_details?: {
    titleNo: number;
    lotNo: number;
    location: string;
    areaSize: string;
  };
  vehicle_details?: {
    type: 'Car' | 'Motorcycle' | 'Truck';
    brand: string;
    model: string;
    year_model?: number;
    plate_no?: string;
    engine_no?: string;
    transmission_type?: 'Manual' | 'Automatic';
    fuel_type?: string;
  };
  atm_details?: {
    bank_name: 'BDO' | 'BPI' | 'LandBank' | 'MetroBank';
    account_no: string;
    cardno_4digits: number;
  };
};


export default function Show({ borrower, collaterals = [], activeLoan = null, repayments = [] }: { borrower: any, collaterals: Collateral[], activeLoan: Loan | null, repayments: Repayment[] }) {
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
            <div className="p-4 bg-gray-50 text-gray-500 rounded">Loan terms content goes here...
             </div>
          )}

          {activeTab === 'loanSchedule' && (
            <div className="p-4 bg-gray-50 text-gray-500 rounded">Loan schedule content goes here...</div>
          )}

          {activeTab === 'loanCollateral' && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Collaterals</h3>
                <Button className="bg-[#FABF24] text-black">Add Collateral</Button>
              </div>

              {collaterals && collaterals.length > 0 ? (
                <div className="space-y-4">
                  {collaterals.map((collateral: Collateral) => (
                    <div
                      key={collateral.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                              {collateral.type}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              collateral.status === 'Pledged' 
                                ? 'bg-green-100 text-green-800'
                                : collateral.status === 'Released'
                                ? 'bg-blue-100 text-blue-800'
                                : collateral.status === 'Forfeited'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {collateral.status}
                            </span>
                          </div>
                          <h4 className="font-semibold text-gray-900">{collateral.description || 'No description'}</h4>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">
                            ₱{parseFloat(collateral.estimated_value || 0).toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <p className="text-sm text-gray-500">
                            Appraised: {new Date(collateral.appraisal_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Type-specific details */}
                      {collateral.type === 'Land' && collateral.land_details && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Title No:</span>
                              <p className="font-medium">{collateral.land_details.titleNo}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Lot No:</span>
                              <p className="font-medium">{collateral.land_details.lotNo}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Location:</span>
                              <p className="font-medium">{collateral.land_details.location}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Area Size:</span>
                              <p className="font-medium">{collateral.land_details.areaSize}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {collateral.type === 'Vehicle' && collateral.vehicle_details && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Brand/Model:</span>
                              <p className="font-medium">
                                {collateral.vehicle_details.brand} {collateral.vehicle_details.model}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">Year:</span>
                              <p className="font-medium">{collateral.vehicle_details.year_model}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Plate No:</span>
                              <p className="font-medium">{collateral.vehicle_details.plate_no || 'N/A'}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Type:</span>
                              <p className="font-medium">{collateral.vehicle_details.type}</p>
                            </div>
                            {collateral.vehicle_details.engine_no && (
                              <div>
                                <span className="text-gray-500">Engine No:</span>
                                <p className="font-medium">{collateral.vehicle_details.engine_no}</p>
                              </div>
                            )}
                            {collateral.vehicle_details.transmission_type && (
                              <div>
                                <span className="text-gray-500">Transmission:</span>
                                <p className="font-medium">{collateral.vehicle_details.transmission_type}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {collateral.type === 'ATM' && collateral.atm_details && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="text-gray-500">Bank:</span>
                              <p className="font-medium">{collateral.atm_details.bank_name}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Account No:</span>
                              <p className="font-medium">{collateral.atm_details.account_no}</p>
                            </div>
                            <div>
                              <span className="text-gray-500">Card (Last 4):</span>
                              <p className="font-medium">****{collateral.atm_details.cardno_4digits}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Remarks */}
                      {collateral.remarks && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Remarks:</span> {collateral.remarks}
                          </p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="mt-4 flex gap-2 justify-end">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No collaterals registered for this loan.</p>
                  <Button className="mt-4 bg-[#FABF24] text-black">Add First Collateral</Button>
                </div>
              )}
            </div>
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
