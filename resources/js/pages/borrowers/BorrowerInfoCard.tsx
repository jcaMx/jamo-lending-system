import React from 'react';
import { useForm } from '@inertiajs/react';
import { SquarePen } from 'lucide-react';

interface BorrowerFormData {
  address: string;
  city: string;
  zipcode: string;
  email: string;
  mobile: string;
  landline: string;
  occupation: string;
  gender: string;
  age: string;
  [key: string]: string;
}

interface BorrowerInfoCardProps {
  borrower: any;
}

export default function BorrowerInfoCard({ borrower }: BorrowerInfoCardProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { data, setData, put, processing, errors } = useForm<BorrowerFormData>({
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

  const openEditModal = () => {
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    // Reset form data to original borrower values
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
  };

  const saveBorrowerInfo = () => {
    put(`/borrowers/${borrower.id}`, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  return (
    <div className="m-4 bg-white p-6 rounded-lg shadow space-y-4 mb-6 border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Borrower Information</h2>
        <button
          onClick={openEditModal}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label="Edit borrower"
        >
          <SquarePen className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Fields Display */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-lg">{borrower.name}</div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Occupation:</span>
            <span className="text-gray-800">{data.occupation}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Gender:</span>
            <span className="text-gray-800">{data.gender}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Age:</span>
            <span className="text-gray-800">{data.age}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Address:</span>
            <span className="text-gray-800">{data.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">City:</span>
            <span className="text-gray-800">{data.city}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Zipcode:</span>
            <span className="text-gray-800">{data.zipcode}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">Email:</span>
            <span className="text-gray-800">{data.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Mobile:</span>
            <span className="text-gray-800">{data.mobile}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Landline:</span>
            <span className="text-gray-800">{data.landline}</span>
          </div>
        </div>
      </div>

      {/* Edit Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Popup Content */}
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            {/* Popup Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-2xl font-bold">Edit Borrower Information</h3>
              <button
                onClick={closeEditModal}
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="Close popup"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Popup Form */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                    <input
                      type="text"
                      value={data.occupation}
                      onChange={(e) => setData('occupation', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FABF24]"
                    />
                    {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select
                      value={data.gender}
                      onChange={(e) => setData('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FABF24]"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      value={data.age}
                      onChange={(e) => setData('age', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FABF24]"
                    />
                    {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FABF24]"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={data.city}
                      onChange={(e) => setData('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FABF24]"
                    />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Zipcode</label>
                    <input
                      type="text"
                      value={data.zipcode}
                      onChange={(e) => setData('zipcode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FABF24]"
                    />
                    {errors.zipcode && <p className="text-red-500 text-xs mt-1">{errors.zipcode}</p>}
                  </div>
                </div>

                {/* Bottom Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FABF24]"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                    <input
                      type="text"
                      value={data.mobile}
                      onChange={(e) => setData('mobile', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FABF24]"
                    />
                    {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Landline</label>
                    <input
                      type="text"
                      value={data.landline}
                      onChange={(e) => setData('landline', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FABF24]"
                    />
                    {errors.landline && <p className="text-red-500 text-xs mt-1">{errors.landline}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Popup Footer */}
            <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={saveBorrowerInfo}
                disabled={processing}
                className="px-4 py-2 bg-[#FABF24] text-gray-900 rounded-md hover:bg-amber-200 disabled:opacity-50"
              >
                {processing ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}