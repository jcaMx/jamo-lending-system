import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Search } from 'lucide-react';
import {ConfirmDialog }from '@/components/ConfirmDialog';

type Repayment = {
  id: number;
  borrowerName: string;
  loanNo: string;
  scheduleNos?: (number | string)[];
  method: string;
  status: string;
  referenceNo: string;
  collectedBy: string;
  collectionDate: string | null;
  submittedDate: string | null;
  amount: number;
};

type Props = {
  repayments: Repayment[];
  collectors: Array<{ id: number; name: string }>;
};

export default function RepaymentsIndex({ repayments, collectors }: Props) {
  const today = new Date().toISOString().split('T')[0];
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'history'>('all');
  const [confirmingId, setConfirmingId] = useState<number | null>(null);
  const [confirmCollectedBy, setConfirmCollectedBy] = useState<string>(collectors[0] ? String(collectors[0].id) : '');
  const [confirmCollectionDate, setConfirmCollectionDate] = useState<string>(today);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState('');

  const filteredRepayments = useMemo(() => {
    return repayments.filter((r) =>
      r.borrowerName.toLowerCase().includes(search.toLowerCase()) ||
      String(r.loanNo).toLowerCase().includes(search.toLowerCase())
    );
  }, [repayments, search]);

  const pendingRepayments = useMemo(() => {
    return filteredRepayments.filter((r) => r.status?.toLowerCase() === 'pending');
  }, [filteredRepayments]);

  const historyRepayments = useMemo(() => {
    return filteredRepayments.filter((r) => ['confirmed', 'rejected'].includes(r.status?.toLowerCase()));
  }, [filteredRepayments]);

  const visibleRepayments =
    activeTab === 'pending'
      ? pendingRepayments
      : activeTab === 'history'
        ? historyRepayments
        : filteredRepayments;

  const formatDate = (value: string | null) => {
    if (!value) return 'N/A';
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? 'N/A' : parsed.toLocaleDateString('en-PH');
  };

  const renderStatus = (status: string) => {
    const normalizedStatus = status?.toLowerCase() ?? 'pending';
    const className =
      normalizedStatus === 'confirmed'
        ? 'bg-green-100 text-green-700'
        : normalizedStatus === 'rejected'
          ? 'bg-red-100 text-red-700'
          : 'bg-yellow-100 text-yellow-700';

    return (
      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold capitalize ${className}`}>
        {normalizedStatus}
      </span>
    );
  };

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open:false, title: '', description: '', onConfirm: () => {} });


  const handleVerify = (paymentId: number) => {
    if (!confirmCollectedBy) {
      alert('Please select a collector.');
      return;
    }

    setConfirmDialog({
      open: true,
      title: 'Confirm Payment',
      description: 'Mark this payment as confirmed?',
      onConfirm: () => {
        router.post(`/repayments/verify/${paymentId}`, {}, {
          onSuccess: () => {
            setConfirmDialog({ ...confirmDialog, open: false });
            router.get('/repayments', {}, { preserveState: true, preserveScroll: true });
          },
        });
      },
    });
  };



  const setConfirmRemarksDefaults = () => {
    setConfirmCollectedBy(collectors[0] ? String(collectors[0].id) : '');
    setConfirmCollectionDate(today);
    setRejectRemarks('');
    setRejectingId(null);
  };

  const submitReject = (paymentId: number) => {
    router.post(
      `/repayments/${paymentId}/reject`,
      {
        remarks: rejectRemarks.trim() || null,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setRejectingId(null);
          setRejectRemarks('');
        },
      }
    );
  };




  return (
    <AppLayout>
      <Head title="Repayments" />
      
      {/* Header & Search */}
      <div className="m-10 flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">View Repayments</h1>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or loan number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-[#FABF24] focus:ring-2 focus:ring-[#FAE6A0] focus:outline-none transition"
          />
        </div>
      </div>

      <div className="mx-10 mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('all')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'all' ? 'bg-[#FABF24] text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({filteredRepayments.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('pending')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'pending' ? 'bg-[#FABF24] text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending ({pendingRepayments.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('history')}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            activeTab === 'history' ? 'bg-[#FABF24] text-black' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          History ({historyRepayments.length})
        </button>
      </div>

      {/* Repayments Table */}
      <div className="mx-10 overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Borrower Name</th>
              {activeTab !== 'pending' && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Loan No</th>
              )}
              {/* {activeTab !== 'pending' && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Schedules</th>
              )} */}
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Method</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Reference</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                {activeTab === 'pending' ? 'Submitted Date' : 'Collection Date'}
              </th>
              {activeTab !== 'pending' && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Collected By</th>
              )}
              {activeTab !== 'pending' && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Status</th>
              )}
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                {activeTab === 'pending' ? 'Amount' : 'Paid Amount'}
              </th>
              {activeTab === 'pending' && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Action</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {visibleRepayments.length > 0 ? (
              visibleRepayments.map((r) => (
                <React.Fragment key={r.id}>
                  <tr className="hover:bg-[#FFF8E6] transition-colors duration-150">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.borrowerName}</td>
                    {activeTab !== 'pending' && <td className="px-4 py-3 text-sm text-gray-700">{r.loanNo}</td>}
                    {/* {activeTab !== 'pending' && (
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {r.scheduleNos && r.scheduleNos.length ? r.scheduleNos.join(', ') : 'N/A'}
                      </td>
                    )} */}
                    <td className="px-4 py-3 text-sm text-gray-700">{r.method}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.referenceNo ?? 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatDate(activeTab === 'pending' ? r.submittedDate : r.collectionDate)}
                    </td>
                    {activeTab !== 'pending' && <td className="px-4 py-3 text-sm text-gray-700">{r.collectedBy}</td>}
                    {activeTab !== 'pending' && <td className="px-4 py-3 text-sm text-gray-700">{renderStatus(r.status)}</td>}
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                      {r.amount.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                    </td>
                    {activeTab === 'pending' && (
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setRejectingId(null);
                              setConfirmingId(r.id);
                            }}
                            className="rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                          >
                            Verify
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmingId(null);
                              setRejectingId(r.id);
                            }}
                            className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>

                  {activeTab === 'pending' && confirmingId === r.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid gap-3 md:grid-cols-3">
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-700">Collected By</label>
                            <select
                              value={confirmCollectedBy}
                              onChange={(e) => setConfirmCollectedBy(e.target.value)}
                              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                            >
                              <option value="">Select collector</option>
                              {collectors.map((collector) => (
                                <option key={collector.id} value={collector.id}>
                                  {collector.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="mb-1 block text-xs font-semibold text-gray-700">Collection Date</label>
                            <input
                              type="date"
                              value={confirmCollectionDate}
                              onChange={(e) => setConfirmCollectionDate(e.target.value)}
                              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                            />
                          </div>
                          <div className="flex items-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleVerify(r.id)}
                              className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                            >
                              Save Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmingId(null)}
                              className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}

                  {activeTab === 'pending' && rejectingId === r.id && (
                    <tr className="bg-red-50">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="md:col-span-2">
                            <label className="mb-1 block text-xs font-semibold text-gray-700">Remarks (Optional)</label>
                            <input
                              type="text"
                              value={rejectRemarks}
                              onChange={(e) => setRejectRemarks(e.target.value)}
                              maxLength={100}
                              placeholder="Reason for rejection"
                              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                            />
                          </div>
                          <div className="flex items-end gap-2">
                            <button
                              type="button"
                              onClick={() => submitReject(r.id)}
                              className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                            >
                              Confirm Reject
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setRejectingId(null);
                                setRejectRemarks('');
                              }}
                              className="rounded border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan={activeTab === 'pending' ? 6 : 9} className="text-center py-6 text-gray-500 text-sm italic">
                  No repayments found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Confirm Dialog for verifying payment */}
      <ConfirmDialog
      open={confirmDialog.open}
      title={confirmDialog.title}
      description={confirmDialog.description}
      onConfirm={confirmDialog.onConfirm}
      onCancel={() => setConfirmDialog({ ...confirmDialog, open: false })}
      confirmText="Confirm"
      cancelText="Cancel"
    />

    </AppLayout>
  );
}


