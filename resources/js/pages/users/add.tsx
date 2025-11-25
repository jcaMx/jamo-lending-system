import React, { useState, useMemo } from "react";
import { Head, router, Form, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Plus, Trash2 } from 'lucide-react';


/* -------------------- Types -------------------- */

interface Borrower {
  id: number;
  name: string;
  loanNo: string;
}

interface Collector {
  id: number;
  name: string;
}

interface AddUserProps {
  roles?: string[];
}

interface FormData {
  fName: string;
  lName: string;
  email: string;
  phone: string;
  userPhoto?: File | null;
}
interface Errors {
  fName?: string;
  lName?: string;
  email?: string;
  phone?: string;
  role?: string;
  userPhoto?: string;
}


/* -------------------- Component -------------------- */

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Add Users", href: "/users/add" },
];


export default function Add({ roles = [] }: AddUserProps) {
  const { errors } = usePage<{ errors: Errors }>().props;

  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState<FormData>({
    fName: '',
    lName: '',
    email: '',
    phone: '',
    userPhoto: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('fName', formData.fName);
    data.append('lName', formData.lName);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('role', selectedRole);
    if (formData.userPhoto) {
      data.append('userPhoto', formData.userPhoto);
    }

    router.post('/users', data);
  };


  /* -------------------- JSX -------------------- */
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add User" />
      <h1 className="text-2xl font-bold mt-7 ml-5">Add User</h1>

      <form onSubmit={handleSubmit}>
        {/* User Profile */}
        <div className="m-4 bg-white rounded-lg shadow border text-black">
          <div className="flex justify-between items-center bg-yellow-50 border-b-2 border-yellow-400 px-4 py-2 rounded-t">
            <h2 className="font-semibold text-lg">User Profile</h2>
          </div>
          <div className="p-4 grid md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label htmlFor="fName" className="block text-sm font-medium mb-1 text-black">
                First Name
              </label>
              <input
                id="fName"
                name="fName"
                value={formData.fName}
                onChange={(e) => setFormData({ ...formData, fName: e.target.value })}
                placeholder="Enter first name"
                className="w-full border rounded px-3 py-2 text-black placeholder-black"
                required
              />
              {errors.fName && <p className="text-red-500 text-sm">{errors.fName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="lName" className="block text-sm font-medium mb-1 text-black">
                Last Name
              </label>
              <input
                id="lName"
                name="lName"
                value={formData.lName}
                onChange={(e) => setFormData({ ...formData, lName: e.target.value })}
                placeholder="Enter last name"
                className="w-full border rounded px-3 py-2 text-black placeholder-black"
                required
              />
              {errors.lName && <p className="text-red-500 text-sm">{errors.lName}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1 text-black">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email"
                className="w-full border rounded px-3 py-2 text-black placeholder-black"
                required
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-1 text-black">
                Mobile Number
              </label>
              <input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter mobile number"
                className="w-full border rounded px-3 py-2 text-black placeholder-black"
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            {/* User Photo */}
            <div className="md:col-span-2">
              <label htmlFor="userPhoto" className="block text-sm font-medium mb-1 text-black">
                User Photo
              </label>
              <input
                type="file"
                id="userPhoto"
                name="userPhoto"
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setFormData({ ...formData, userPhoto: e.target.files?.[0] || null })}
              />
              {errors.userPhoto && <p className="text-red-500 text-sm">{errors.userPhoto}</p>}
            </div>
          </div>
        </div>

        {/* User Role */}
        <div className="m-4 bg-white rounded-lg shadow border text-black">
          <div className="flex justify-between items-center bg-yellow-50 border-b-2 border-yellow-400 px-4 py-2 rounded-t">
            <h2 className="font-semibold text-lg">User Role</h2>
          </div>
          <div className="p-4 grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="roleDropdown" className="block text-sm font-medium text-gray-700 mb-1">
                Select Role
              </label>
              <select
                id="roleDropdown"
                name="role"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400"
                required
              >
                <option value="">-- Select Role --</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
              {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end m-4">
          <Button type="submit" className="px-6 py-2 text-black bg-[#FABF24] rounded-lg hover:bg-amber-600">
            Create
          </Button>
        </div>
      </form>
    </AppLayout>
  );
}

