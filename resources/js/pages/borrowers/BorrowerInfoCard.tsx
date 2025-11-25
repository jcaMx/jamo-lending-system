import React from 'react';
import { useForm } from '@inertiajs/react';
import { SquarePen } from 'lucide-react';
import useInlineEdit from '@/hooks/useInlineEdit';

interface BorrowerInfoCardProps {
  borrower: any;
}

export default function BorrowerInfoCard({ borrower }: BorrowerInfoCardProps) {
  const [editMode, setEditMode] = React.useState(false);

  const { data, setData, put, processing, errors } = useForm({
    address: borrower.address ?? '',
    city: borrower.city ?? '',
    zipcode: borrower.zipcode ?? '',
    email: borrower.email ?? '',
    mobile: borrower.mobile ?? borrower.contact_no ?? '',
    landline: borrower.landline ?? '',
    occupation: borrower.occupation ?? '',
    gender: borrower.gender ?? '',
    age: borrower.age ?? '',
  });

  const { editingField, editedValue, setEditedValue, startEditing, cancelEditing, saveField } =
    useInlineEdit(data, (field, value) => setData(field, value));

  const saveBorrowerInfo = () => {
    put(`/borrowers/${borrower.id}`, {
      onSuccess: () => setEditMode(false),
    });
  };

  const cancelEdit = () => {
    setEditMode(false);
    // reset all form fields to initial borrower values
    setData({
      address: borrower.address ?? '',
      city: borrower.city ?? '',
      zipcode: borrower.zipcode ?? '',
      email: borrower.email ?? '',
      mobile: borrower.mobile ?? borrower.contact_no ?? '',
      landline: borrower.landline ?? '',
      occupation: borrower.occupation ?? '',
      gender: borrower.gender ?? '',
      age: borrower.age ?? '',
    });
    cancelEditing();
  };

  // helper to render each field with inline edit
  const renderField = (
    field: string,
    label: string,
    type: 'text' | 'number' | 'email' | 'select' = 'text',
    options?: string[]
  ) => {
    return (
      <div className="flex items-center gap-2">
        <span className="font-medium">{label}:</span>
        {editMode && editingField === field ? (
          <>
            {type === 'select' ? (
              <select
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                className="border rounded p-1"
              >
                <option value="">Select {label}</option>
                {options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <input
                type={type}
                value={editedValue}
                onChange={(e) => setEditedValue(e.target.value)}
                className="border rounded p-1 w-full text-orange-600 bg-yellow-50"
              />
            )}
            <button onClick={saveField} className="text-blue-600">Save</button>
            <button onClick={cancelEditing} className="text-red-500">Cancel</button>
            {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
          </>
        ) : (
          <span
          className={`cursor-pointer transition-colors duration-150 ${
            editMode ? 'text-orange-600' : 'text-gray-800 hover:text-orange-500'
          }`}
          onClick={() => startEditing(field, data[field])} // set editingField
          >
            {data[field]}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="m-4 bg-white p-6 rounded-lg shadow space-y-4 mb-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Borrower Information</h2>
        <button
          onClick={() => setEditMode((s) => !s)}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label={editMode ? 'Close edit' : 'Edit borrower'}
        >
          <SquarePen className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-lg">{borrower.name}</div>
          {renderField('occupation', 'Occupation')}
          {renderField('gender', 'Gender', 'select', ['Male', 'Female'])}
          {renderField('age', 'Age', 'number')}
        </div>

        <div className="flex flex-col gap-2">
          {renderField('address', 'Address')}
          {renderField('city', 'City')}
          {renderField('zipcode', 'Zipcode')}
        </div>

        <div className="flex flex-col gap-2">
          {renderField('email', 'Email', 'email')}
          {renderField('mobile', 'Mobile')}
          {renderField('landline', 'Landline')}
        </div>
      </div>

      {/* Action Buttons */}
      {editMode && (
        <div className="flex gap-3 pt-4">
          <button
            onClick={saveBorrowerInfo}
            disabled={processing}
            className="px-4 py-2 bg-[#FABF24]  rounded-md hover:bg-amber-200 disabled:opacity-50"
          >
            {processing ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={cancelEdit}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
