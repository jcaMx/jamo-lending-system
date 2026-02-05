import React from 'react';
import type { Borrower } from '@/types/loan';

interface BorrowerHeaderProps {
  borrower: Borrower | null;
}

/**
 * Displays borrower header information
 */
export default function BorrowerHeader({ borrower }: BorrowerHeaderProps) {
  if (!borrower) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="bg-white rounded-lg p-8 max-w-md text-center border border-gray-200">
          <p className="text-gray-700 text-xl font-semibold mb-4">No Borrower Record Found</p>
          <p className="text-gray-500 mb-6">It looks like you haven't applied for a loan yet. Start your application today!</p>
          <a href="/applynow" className="inline-block px-6 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition">
            Apply for a Loan
          </a>
        </div>
      </div>
    );
  }

  const fullName = `${borrower.first_name || ''} ${borrower.last_name || ''}`.trim();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <p className="text-sm font-medium text-gray-600 mb-1">Name</p>
        <p className="text-lg font-semibold text-gray-900">{fullName}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <p className="text-sm font-medium text-gray-600 mb-1">Email</p>
        <p className="text-lg font-semibold text-gray-900 truncate">{borrower.email || '-'}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
        <p className="text-sm font-medium text-gray-600 mb-1">Contact</p>
        <p className="text-lg font-semibold text-gray-900">{borrower.contact_no || '-'}</p>
      </div>
    </div>
  );
}
