import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Borrowers',
    href: '/borrowers/add',
  },
];

export default function BorrowerAdd() {
  const [formData, setFormData] = useState({
    borrowerFullName: '',
    dateOfBirth: '',
    maritalStatus: '',
    age: '',
    homeOwnership: '',
    permanentAddress: '',
    mobileNumber: '',
    occupation: '',
    dependentChild: '',
    netPay: '',
    spouseFullName: '',
    spouseAgencyAddress: '',
    spouseOccupation: '',
    spouseMobileNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Borrower Data:', formData);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="New Borrower" />

      {/* Form Container */}
      <div className=" w-full mx-auto bg-white shadow-lg rounded-2xl p-10 mb-16 border border-gray-100">
        {/* Header */}
        <div className="border-b-4 border-[#FABF24] rounded-t-lg pb-3 mb-8 bg-[#FFF8E2] p-5">
          <h2 className="text-3xl font-semibold text-gray-800">
            New Borrower Information
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Please fill out the borrower’s personal information.
          </p>
        </div>

        {/* Borrower Info */}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-8 gap-y-5">
          {/* Left Column */}
          <div>
            <label className="block text-sm font-medium mb-1">Borrower Full Name</label>
            <input
              type="text"
              name="borrowerFullName"
              value={formData.borrowerFullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Marital Status</label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Separated">Separated</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter age"
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Permanent Home Address</label>
            <input
              type="text"
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleChange}
              placeholder="Enter address"
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Home Ownership</label>
            <select
              name="homeOwnership"
              value={formData.homeOwnership}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
            >
              <option value="">Select</option>
              <option value="Owned">Owned</option>
              <option value="Mortgage">Mortgage</option>
              <option value="Rented">Rented</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="09XX XXX XXXX"
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">No. of Dependent Child</label>
            <input
              type="number"
              name="dependentChild"
              value={formData.dependentChild}
              onChange={handleChange}
              placeholder="Enter number"
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Occupation</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="Enter occupation"
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Net Pay</label>
            <input
              type="number"
              name="netPay"
              value={formData.netPay}
              onChange={handleChange}
              placeholder="Enter net pay"
              className="w-full border rounded-md p-2"
            />
          </div>

          {/* Spouse Section */}
          <div className="col-span-2 mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Spouse’s Personal Data{' '}
              <span className="text-sm text-gray-500">(If applicable)</span>
            </h3>

            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <label className="block text-sm font-medium mb-1">Spouse Full Name</label>
                <input
                  type="text"
                  name="spouseFullName"
                  value={formData.spouseFullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full bg-[#F7F5F3] border-gray-300 rounded-md p-2.5 focus:ring-[#FABF24] focus:border-[#FABF24]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Agency/Employer’s Address
                </label>
                <input
                  type="text"
                  name="spouseAgencyAddress"
                  value={formData.spouseAgencyAddress}
                  onChange={handleChange}
                  placeholder="Enter agency or address"
                  className="w-full  bg-[#F7F5F3] border-gray-300 rounded-md p-2.5 focus:ring-[#FABF24] focus:border-[#FABF24]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Occupation</label>
                <input
                  type="text"
                  name="spouseOccupation"
                  value={formData.spouseOccupation}
                  onChange={handleChange}
                  placeholder="Enter occupation"
                  className="w-full  bg-[#F7F5F3] border-gray-300 rounded-md p-2.5 focus:ring-[#FABF24] focus:border-[#FABF24]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mobile Number</label>
                <input
                  type="text"
                  name="spouseMobileNumber "
                  value={formData.spouseMobileNumber}
                  onChange={handleChange}
                  placeholder="09XX XXX XXXX"
                  className="w-full  bg-[#F7F5F3] border-gray-300 rounded-md p-2.5 focus:ring-[#FABF24] focus:border-[#FABF24]"
                />
              </div>
            </div>
          </div>

          <div className="col-span-2 mt-6 flex justify-end">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
