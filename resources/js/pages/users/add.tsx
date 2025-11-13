import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import React, { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Users',
    href: '/users/add',
  },
];

export default function UserAdd() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting Borrower Data:', formData);
    // In production: use Inertia.post('/borrowers', formData)
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add User" />
    
     <h1 className="text-5xl font-semibold text-gray-800 mx-10 mt-6">Add User</h1>

    <div className="w-full h-full mx-auto bg-white shadow-lg rounded-2xl p-10 mb-16 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* --- User Profile Section --- */}
          <section>
            <div className="border-b-4 border-[#FABF24] rounded-t-lg pb-3 mb-6 bg-[#FFF8E2] p-5">
              <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Borrower Full Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="w-full bg-[#F7F5F3] border border-gray-300 rounded-md p-2.5 focus:ring-[#FABF24] focus:border-[#FABF24]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="w-full bg-[#F7F5F3] border border-gray-300 rounded-md p-2.5 focus:ring-[#FABF24] focus:border-[#FABF24]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  className="w-full bg-[#F7F5F3] border border-gray-300 rounded-md p-2.5 focus:ring-[#FABF24] focus:border-[#FABF24]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full bg-[#F7F5F3] border border-gray-300 rounded-md p-2.5 focus:ring-[#FABF24] focus:border-[#FABF24]"
                  required
                />
              </div>
            </div>
          </section>

          {/* --- User Role Section --- */}
          <section>
            <div className="border-b-4 border-[#FABF24] rounded-t-lg pb-3 mb-6 bg-[#FFF8E2] p-5">
              <h2 className="text-2xl font-semibold text-gray-800">User Role</h2>
            </div>

            <div className="max-w-sm">
              <label className="block text-sm font-medium text-gray-700 mb-1 w-full">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-[#F7F5F3] border border-gray-300 rounded-md p-2.5 focus:ring-[#FABF24] focus:border-[#FABF24]"
                required
              >
                <option value="">Select Role</option>
                <option value="Admin">Admin</option>
                <option value="Cashier">Cashier</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
          </section>

          {/* --- Submit Button --- */}
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#FABF24] hover:bg-[#f9b406] text-gray-900 font-semibold px-8 py-2 rounded-md shadow"
            >
              Create
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
