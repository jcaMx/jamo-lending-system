import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router, } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Eye, Edit } from 'lucide-react';
import React from 'react';
import {route} from "ziggy-js";


const breadcrumbs: BreadcrumbItem[] = [
  { title: 'System Users', href: '/users' },
];

type User = {
  id: number;
  username: string;
  fName: string;
  lName: string;
  role: string;
  status: string;      // 'active' | 'inactive'
  lastLogin: string;
  email?: string;
};
type UsersProp = User[] | { data?: User[] };

export default function Index({ users }: { users: UsersProp }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const list = useMemo<User[]>(() => {
    if (Array.isArray(users)) {
      return users;
    }

    if (users && Array.isArray(users.data)) {
      return users.data;
    }

    return [];
  }, [users]);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return list.filter((user) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [
          user.username || '',
          user.fName || '',
          user.lName || '',
          `${user.fName || ''} ${user.lName || ''}`,
          user.role || '',
          user.status || '',
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' ||
        (user.status && user.status.toLowerCase() === statusFilter);
  
      return matchesSearch && matchesStatus;
    });
  }, [list, search, statusFilter]);
  

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="System Users" />
      
      <div className="w-full h-full mx-auto bg-white shadow-lg rounded-2xl p-10 mb-16 border border-gray-100 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users…"
            className="w-full md:max-w-sm rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
          <div className="flex items-center gap-3">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as typeof statusFilter)
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-700">User No.</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Username</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Full Name</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Role</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Status</th>
                <th className="text-left px-4 py-2 font-medium text-gray-700">Last Login</th>
                <th className="text-center px-4 py-2 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-6 text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      onClick={(e) => {
                        // Prevent row click if a button inside was clicked
                            if ((e.target as HTMLElement).closest('a')) return;
                            router.visit(route('users.show', user.id));
                            }}
                            className="border-b hover:bg-gray-50 cursor-pointer"
                      >
                      <td className="px-4 py-2">{user.id}</td>
                      <td className="px-4 py-2">{user.username}</td>
                      <td className="px-4 py-2">{`${user.fName} ${user.lName}`}</td>
                      <td className="px-4 py-2">{user.role}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.status?.toLowerCase() === 'active'
                              ? 'bg-green-100 text-green-800'
                              : user.status?.toLowerCase() === 'inactive'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-2">{user.lastLogin}</td>
                      <td className="px-4 py-2 text-center space-x-2">
                        <Link href={`/users/${user.id}`}>
                          <Button variant="default" className="p-1">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/users/${user.id}/edit`}>
                          <Button variant="default" className="p-1">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>


          </table>
        </div>
      </div>
    </AppLayout>
  );
}
