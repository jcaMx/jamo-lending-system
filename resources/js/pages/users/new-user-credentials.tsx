import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'System Users', href: '/users' },
];

type User = {
  ID: number;
  username: string;
  fName: string;
  lName: string;
  role: string;
  status: string;
  lastLogin: string;
  email: string;
  password: string;
};

export default function UserCredentials({ user }: { user: User }) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      {/* <Head title="User Credentials" />
      <HeadingSmall title="User Credentials" /> */}
      <h2 className="mx-10 mt-10 text-3xl font-bold text-gray-800">
        New User Created
      </h2>
      <div className="w-full mx-auto bg-white shadow-lg rounded-2xl p-10 mb-16 border border-gray-100">
        {/* Header */}
        <div className="border-b-4 border-[#FABF24] rounded-t-lg pb-3 mb-6 bg-[#FFF8E2] p-5">
          <h2 className="text-2xl font-semibold text-gray-800">
            User Credentials
          </h2>
        </div>

        {/* Message */}
        <p className="text-gray-600 mb-8">
          The user has been successfully created. An email containing login
          credentials has been sent to:
          <span className="font-medium text-gray-800 ml-1">{user.email}</span>
        </p>

        {/* User Credentials Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-x-10">
          <div>
            <p className="text-sm font-medium text-gray-700">Full Name</p>
            <p className="text-gray-500">
              {user.fName} {user.lName}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Role</p>
            <p className="text-gray-500">{user.role}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Username</p>
            <p className="text-gray-500">{user.username}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Password</p>
            <p className="text-gray-500">{user.password}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Status</p>
            <p
              className={`font-medium ${
                user.status === 'active'
                  ? 'text-green-600'
                  : 'text-red-500'
              }`}
            >
              {user.status}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700">Last Login</p>
            <p className="text-gray-500">
              {user.lastLogin || 'No logins yet'}
            </p>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end m-8">
        <Link href="/users">
          <Button className="bg-[#FABF24] hover:bg-[#f9b406] text-gray-900 font-semibold px-8 py-2 rounded-md shadow ">
            Continue
          </Button>
        </Link>
      </div>
    </AppLayout>
  );
}
