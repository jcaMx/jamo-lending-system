import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ConfirmDialog } from '@/components/ConfirmDialog';

type Payment = {
  id: number;
  borrowerName: string;
  loanNo: string;
  amount: number;
  method: string;
  referenceNo: string;
  collectedBy: string;
  collectionDate: string;
};

type Props = { pendingPayments: Payment[] };

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Repayments', href: '/repayments/add' },
  { title: 'Pending', href: '/repayments/pending' },
];



export default function Pending({ pendingPayments }: Props) {
  const [successMessage, setSuccessMessage] = useState('');
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
  }>({ open:false, title: '', description: '', onConfirm: () => {} });
  const handleVerify = (paymentId: number) => {
      setConfirmDialog({
        open: true,
        title: 'Confirm Verification',
        description: 'Are you sure you want to mark this payment as verified?',
        onConfirm: () => {
          router.post(`/repayments/verify/${paymentId}`, {}, {
            onSuccess: () => {
              setSuccessMessage('Payment verified successfully!');
              setConfirmDialog((prev) => ({ ...prev, open: false }));
            },
          });
        },
      });
  };



  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Pending Payments" />
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-3 rounded-md mb-4">{successMessage}</div>
      )}

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-5">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2">Borrower</th>
              <th className="px-4 py-2">Loan No</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Method</th>
              <th className="px-4 py-2">Reference No</th>
              <th className="px-4 py-2">Collected By</th>
              <th className="px-4 py-2">Collection Date</th>
              <th className="px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {pendingPayments.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{p.borrowerName}</td>
                <td className="px-4 py-2">{p.loanNo}</td>
                <td className="px-4 py-2">₱{p.amount.toLocaleString()}</td>
                <td className="px-4 py-2">{p.method}</td>
                <td className="px-4 py-2">{p.referenceNo}</td>
                <td className="px-4 py-2">{p.collectedBy}</td>
                <td className="px-4 py-2">{p.collectionDate}</td>
                <td className="px-4 py-2">
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={() => handleVerify(p.id)}
                  >
                    Verify
                  </button>
                </td>
              </tr>
            ))}
            {pendingPayments.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No pending payments.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
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