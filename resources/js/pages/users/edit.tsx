import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

type User = {
  ID: number;
  fName: string;
  lName: string;
  email: string;
  phoneNumber: string;
  role: string;
};

type EditProps = {
  user?: User; // optional to handle loading
};

export default function EditUser({ user }: EditProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Users', href: '/users' },
    { title: user ? `${user.fName} ${user.lName}` : 'Loading...', href: user ? `/users/${user.ID}` : '#' },
    { title: 'Edit', href: user ? `/users/${user.ID}/edit` : '#' },
  ];

  // Show loading if user not yet available
  if (!user) {
    return (
      <AppLayout breadcrumbs={breadcrumbs}>
        <Head title="Edit User" />
        <div className="p-10 text-gray-500 text-center">
          Loading user data...
        </div>
      </AppLayout>
    );
  }

  const [formData, setFormData] = useState({
    fName: user.fName || '',
    lName: user.lName || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    role: user.role || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.put(`/users/${user.ID}`, formData, {
      onSuccess: () => {
        console.log('User updated successfully!');
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Edit User: ${user.fName} ${user.lName}`} />
      <HeadingSmall title="Edit User" />

      <div className="w-full mx-auto bg-white shadow-lg rounded-2xl p-10 mb-16 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* User Profile */}
          <section>
            <div className="border-b-4 border-[#FABF24] rounded-t-lg pb-3 mb-6 bg-[#FFF8E2] p-5">
              <h2 className="text-2xl font-semibold text-gray-800">User Profile</h2>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="fName"
                  value={formData.fName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className="w-full bg-[#F7F5F3] border border-gray-300 rounded-md p-2.5 focus:ring-[#FABF24] focus:border-[#FABF24]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lName"
                  value={formData.lName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className="w-full bg-[#F7F5F3] border border-gray-300 rounded-md p-2.5 focus:ring-[#FABF24] focus:border-[#FABF24]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full bg-[#F7F5F3] border border-gray-300 rounded-md p-2.5 focus:ring-[#FABF24] focus:border-[#FABF24]"
                />
              </div>
            </div>
          </section>

          {/* User Role */}
          <section>
            <div className="border-b-4 border-[#FABF24] rounded-t-lg pb-3 mb-6 bg-[#FFF8E2] p-5">
              <h2 className="text-2xl font-semibold text-gray-800">User Role</h2>
            </div>

            <div className="max-w-sm">
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
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

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button asChild variant="outline">
              <Link href={`/users/${user.ID}`}>Cancel</Link>
            </Button>
            <Button
              type="submit"
              className="bg-[#FABF24] hover:bg-[#f9b406] text-gray-900 font-semibold px-8 py-2 rounded-md shadow"
            >
              Update
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
