import React, { useState, useMemo } from "react";
import { Head, router, Form } from "@inertiajs/react";
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

/* -------------------- Component -------------------- */

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Add Users", href: "/users/add" },
];

interface AddUserProps {
  roles?: string[]; // Changed from array of objects to array of strings
}

export default function Add({ roles = [] }: AddUserProps) {
  const [selectedRole, setSelectedRole] = useState('');
  const [formData, setFormData] = useState({
    fName: '',
    lName: '',
    email: '',
    phone: '',        // was mobileNumber
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/users', {
      fName: formData.fName,
      lName: formData.lName,
      email: formData.email,
      phone: formData.phone,   // send to backend
      role: selectedRole,
    });
  };

  /* -------------------- JSX -------------------- */

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add User" />
      <h1 className="text-2xl font-bold mt-7 ml-5">Add User</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="m-4 bg-white rounded-lg shadow border text-black">
          <div className="flex justify-between items-center bg-yellow-50 border-b-2 border-yellow-400 px-4 py-2 rounded-t">
            <h2 className="font-semibold text-lg">User Profile</h2>
          </div>
          <div className="p-4 grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-black" htmlFor="fName">First Name</label>
              <input
                id="fName"
                name="fName"
                value={formData.fName}
                onChange={(e) => setFormData({ ...formData, fName: e.target.value })}
                placeholder="Enter first name"
                className="w-full border rounded px-3 py-2 text-black placeholder-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-black" htmlFor="lName">Last Name</label>
              <input
                id="lName"
                name="lName"
                value={formData.lName}
                onChange={(e) => setFormData({ ...formData, lName: e.target.value })}
                placeholder="Enter last name"
                className="w-full border rounded px-3 py-2 text-black placeholder-black"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-black" htmlFor="email">Email</label>
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
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-black" htmlFor="mobileNumber">Mobile Number</label>
              <input
                id="mobileNumber"
                name="phone"      // important: send as "phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Enter mobile number"
                className="w-full border rounded px-3 py-2 text-black placeholder-black"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1 text-black" htmlFor="userPhoto">User Photo</label>
              <input
                type="file"
                id="userPhoto"
                name="userPhoto"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

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
            </div>
          </div>
        </div>

        <div className="flex justify-end m-4">
          <Button
            type="submit"
            className="px-6 py-2 text-black bg-[#FABF24] rounded-lg hover:bg-amber-600"
          >
            Create
          </Button>
        </div>
      </form>
    </AppLayout>
  );
}
