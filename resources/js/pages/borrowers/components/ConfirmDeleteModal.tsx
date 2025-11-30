import React from 'react';

export default function CenterDeletePopup({
  open,
  onClose,
  onConfirm,
  borrowerName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  borrowerName: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md border border-gray-300">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Delete {borrowerName}?
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
          This action cannot be undone. Are you sure you want to proceed?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
