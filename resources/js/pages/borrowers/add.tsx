import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Borrowers',
    href: '/borrowers/add',
  },
];

export default function BorrowerAdd() {
  const { data, setData, post, processing, errors } = useForm({
    borrowerFirstName: '',
    borrowerLastName: '',
    gender:'',
    dateOfBirth: '',
    maritalStatus: '',
    homeOwnership: '',
    permanentAddress: '',
    city:'',
    mobileNumber: '',
    landlineNumber:'',
    email:'',
    occupation: '',
    dependentChild: '',
    netPay: '',
    spouseFirstName: '',
    spouseLastName: '',
    spouseAgencyAddress: '',
    spouseOccupation: '',
    spousePosition: '',
    spouseMobileNumber: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/borrowers', {
      preserveScroll: true,
      onSuccess: () => {
        // Success handled by redirect in controller
      },
    });
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
            <label className="block text-sm font-medium mb-1"> First Name</label>
            <input
              type="text"
              name="borrowerFirstName"
              value={data.borrowerFirstName}
              onChange={(e) => setData('borrowerFirstName', e.target.value)}
              placeholder="Enter first name"
              className=" bg-[#F7F5F3] border-gray-300 rounded-md w-full border rounded-md p-2"
              required
            />
            {errors.borrowerFirstName && (
              <p className="text-red-500 text-xs mt-1">{errors.borrowerFirstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="borrowerLastName"
              value={data.borrowerLastName}
              onChange={(e) => setData('borrowerLastName', e.target.value)}
              placeholder="Enter last name"
              className=" bg-[#F7F5F3] border-gray-300 rounded-md w-full border rounded-md p-2"
              required
            />
            {errors.borrowerLastName && (
              <p className="text-red-500 text-xs mt-1">{errors.borrowerLastName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="gender"
              value={data.gender}
              onChange={(e) => setData('gender', e.target.value)}
              className="bg-[#F7F5F3] border-gray-300 rounded-md w-full border p-2"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
            )}
          </div>


          <div>
            <label className="block text-sm font-medium mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={data.dateOfBirth}
              onChange={(e) => setData('dateOfBirth', e.target.value)}
              className=" bg-[#F7F5F3] border-gray-300 rounded-md w-full border rounded-md p-2"
              required
              max={new Date(
                new Date().setFullYear(new Date().getFullYear() - 18)
              )
                .toISOString()
                .split("T")[0]}
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile Number</label>
            <input
              type="text"
              name="mobileNumber"
              value={data.mobileNumber}
              onChange={(e) => setData('mobileNumber', e.target.value)}
              placeholder="09XX XXX XXXX"
              className=" bg-[#F7F5F3] border-gray-300 rounded-md w-full border rounded-md p-2"
              pattern="09\d{9}"
              maxLength={11}
              title="Mobile number must start with 09 and be 11 digits"
              required
            />
            {errors.mobileNumber && (
              <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
            )}
          </div>
          <div>
              <label className="block text-sm font-medium mb-1">Landline Number</label>
              <input
                type="text"
                name="landlineNumber"
                value={data.landlineNumber}
                onChange={(e) => setData('landlineNumber', e.target.value)}
                placeholder="02-12345678"
                className="bg-[#F7F5F3] border-gray-300 rounded-md w-full border p-2"
                pattern="0\d{1,2}-\d{7,8}"
                title="Landline number format: AreaCode-Number (e.g., 02-12345678)"
              />
              {errors.landlineNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.landlineNumber}</p>
              )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={(e) => setData('email', e.target.value)}
              placeholder="Enter email address"
              className="bg-[#F7F5F3] border-gray-300 rounded-md w-full border p-2"
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Please enter a valid email address"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>



          <div>
            <label className="block text-sm font-medium mb-1">Marital Status</label>
            <select
              name="maritalStatus"
              value={data.maritalStatus}
              onChange={(e) => setData('maritalStatus', e.target.value)}
              className=" bg-[#F7F5F3] border-gray-300 rounded-md w-full border rounded-md p-2"
            >
              <option value="">Select Status</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Separated">Separated</option>
              <option value="Widowed">Widowed</option>
            </select>
          </div>


          <div>
            <label className="block text-sm font-medium mb-1">Permanent Home Address</label>
            <input
              type="text"
              name="permanentAddress"
              value={data.permanentAddress}
              onChange={(e) => setData('permanentAddress', e.target.value)}
              placeholder="Enter address"
              className=" bg-[#F7F5F3] border-gray-300 rounded-md w-full border rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              value={data.city}
              onChange={(e) => setData('city', e.target.value)}
              placeholder="Enter city"
              className="bg-[#F7F5F3] border-gray-300 rounded-md w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Home Ownership</label>
            <select
              name="homeOwnership"
              value={data.homeOwnership}
              onChange={(e) => setData('homeOwnership', e.target.value)}
              className=" bg-[#F7F5F3] border-gray-300 rounded-md w-full border rounded-md p-2"
            >
              <option value="">Select</option>
              <option value="Owned">Owned</option>
              <option value="Mortgage">Mortgage</option>
              <option value="Rented">Rented</option>
            </select>
          </div>



          <div>
            <label className="block text-sm font-medium mb-1">No. of Dependent Child</label>
            <input
              type="number"
              name="dependentChild"
              value={data.dependentChild}
              onChange={(e) => setData('dependentChild', e.target.value)}
              placeholder="Enter number"
              className=" bg-[#F7F5F3] border-gray-300 rounded-md w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Occupation</label>
            <input
              type="text"
              name="occupation"
              value={data.occupation}
              onChange={(e) => setData('occupation', e.target.value)}
              placeholder="Enter occupation"
              className=" bg-[#F7F5F3] border-gray-300 rounded-md w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Net Pay</label>
            <input
              type="number"
              name="netPay"
              value={data.netPay}
              onChange={(e) => {
                // Parse input and limit to 0 - 10,000,000
                let value = parseFloat(e.target.value);
                if (isNaN(value)) value = 0;
                if (value < 0) value = 0;
                if (value > 10000000) value = 10000000;
                setData('netPay', e.target.value);
              }}
              placeholder="Enter net pay"
              className=" bg-[#F7F5F3] border-gray-300 rounded-md w-full border rounded-md p-2"
              required
              min={0}
              max={10000000}
              step={0.01}
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
                <label className="block text-sm font-medium mb-1">Spouse First Name</label>
                <input
                  type="text"
                  name="spouseFirstName"
                  value={data.spouseFirstName}
                  onChange={(e) => setData('spouseFirstName', e.target.value)}
                  placeholder="Enter first name"
                  className="w-full bg-[#F7F5F3] border-gray-300 rounded-md p-2.5 focus:ring-[#FABF24] focus:border-[#FABF24]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Spouse Last Name</label>
                <input
                  type="text"
                  name="spouseLastName"
                  value={data.spouseLastName}
                  onChange={(e) => setData('spouseLastName', e.target.value)}
                  placeholder="Enter last name"
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
                  value={data.spouseAgencyAddress}
                  onChange={(e) => setData('spouseAgencyAddress', e.target.value)}
                  placeholder="Enter agency or address"
                  className="w-full  bg-[#F7F5F3] border-gray-300 rounded-md p-2.5 focus:ring-[#FABF24] focus:border-[#FABF24]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Occupation</label>
                <input
                  type="text"
                  name="spouseOccupation"
                  value={data.spouseOccupation}
                  onChange={(e) => setData('spouseOccupation', e.target.value)}
                  placeholder="Enter occupation"
                  className="w-full  bg-[#F7F5F3] border-gray-300 rounded-md p-2.5 focus:ring-[#FABF24] focus:border-[#FABF24]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Position</label>
                <input
                  type="text"
                  name="spousePosition"
                  value={data.spousePosition}
                  onChange={(e) => setData('spousePosition', e.target.value)}
                  placeholder="Enter position"
                  className="w-full  bg-[#F7F5F3] border-gray-300 rounded-md p-2.5 focus:ring-[#FABF24] focus:border-[#FABF24]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mobile Number</label>
                <input
                  type="text"
                  name="spouseMobileNumber"
                  value={data.spouseMobileNumber}
                  onChange={(e) => setData('spouseMobileNumber', e.target.value)}
                  placeholder="09XX XXX XXXX"
                  className="w-full  bg-[#F7F5F3] border-gray-300 rounded-md w-full border rounded-md p-2"
                  pattern="09\d{9}"
                  maxLength={11}
                  title="Mobile number must start with 09 and be 11 digits"
                />
              </div>
            </div>
          </div>

          <div className="col-span-2 mt-6 flex justify-end">
            <Button 
              type="submit" 
              disabled={processing}
              className="text-black bg-[#FABF24] hover:bg-amber-700 hover:text-white disabled:opacity-50"
            >
              {processing ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
