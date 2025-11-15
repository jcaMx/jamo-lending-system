import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Megaphone } from 'lucide-react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Borrowers',
    href: '/borrowers/add',
  },
];

export default function Index() {
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

    // You can post to Laravel backend here using Inertia:
    // router.post('/borrowers', formData);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Borrowers" />

      {/* Page Header */}
      <div className="p-6">
        <Alert>
          <Megaphone className="h-4 w-4" />
          <AlertTitle>Borrowers Page</AlertTitle>
          <AlertDescription>
            Add new borrower information below.
          </AlertDescription>
        </Alert>
      </div>

      {/* Borrower Form */}
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-8 mb-10">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">
          New Borrower Information
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
          {/* Borrower Info */}
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Borrower Full Name</label>
            <input
              type="text"
              name="borrowerFullName"
              value={formData.borrowerFullName}
              onChange={handleChange}
              placeholder="Enter full name"
              className="w-full border rounded-md p-2 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="w-full border rounded-md p-2 text-black"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Marital Status</label>
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="w-full border rounded-md p-2 text-black"
            >
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Separated">Separated</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter age"
              className="w-full border rounded-md p-2 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Permanent Home Address</label>
            <input
              type="text"
              name="permanentAddress"
              value={formData.permanentAddress}
              onChange={handleChange}
              placeholder="Enter address"
              className="w-full border rounded-md p-2 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Home Ownership</label>
            <select
              name="homeOwnership"
              value={formData.homeOwnership}
              onChange={handleChange}
              className="w-full border rounded-md p-2 text-black"
            >
              <option value="">Select</option>
              <option value="Owned">Owned</option>
              <option value="Mortgage">Mortgage</option>
              <option value="Rented">Rented</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleChange}
              placeholder="09XX XXX XXXX"
              className="w-full border rounded-md p-2 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">No. of Dependent Child</label>
            <input
              type="number"
              name="dependentChild"
              value={formData.dependentChild}
              onChange={handleChange}
              placeholder="Enter number"
              className="w-full border rounded-md p-2 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Occupation</label>
            <input
              type="text"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="Enter occupation"
              className="w-full border rounded-md p-2 text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black">Net Pay</label>
            <input
              type="number"
              name="netPay"
              value={formData.netPay}
              onChange={handleChange}
              placeholder="Enter net pay"
              className="w-full border rounded-md p-2 text-black"
            />
          </div>

          {/* Spouse Section */}
          <div className="col-span-2 mt-6 border-t pt-4 text-black">
            <h3 className="text-lg font-semibold text-gray-700 mb-3 ">
              Spouse’s Personal Data{' '}
              <span className="text-sm text-gray-500">(If applicable)</span>
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1 text-black">Spouse Full Name</label>
                <input
                  type="text"
                  name="spouseFullName"
                  value={formData.spouseFullName}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-black">
                  Agency/Employer’s Address
                </label>
                <input
                  type="text"
                  name="spouseAgencyAddress"
                  value={formData.spouseAgencyAddress}
                  onChange={handleChange}
                  placeholder="Enter agency/address"
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-black">Occupation</label>
                <input
                  type="text"
                  name="spouseOccupation"
                  value={formData.spouseOccupation}
                  onChange={handleChange}
                  placeholder="Enter occupation"
                  className="w-full border rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-black">Mobile Number</label>
                <input
                  type="text"
                  name="spouseMobileNumber "
                  value={formData.spouseMobileNumber}
                  onChange={handleChange}
                  placeholder="09XX XXX XXXX"
                  className="w-full border rounded-md p-2"
                />
              </div>
            </div>
          </div>

          <div className="col-span-2 mt-6 flex justify-end">
            <Button type="submit" className="bg-yellow-600 hover:bg-yellow-700">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
