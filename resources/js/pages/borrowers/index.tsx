import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react'; // nice search icon

type Borrower = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  city: string;
  gender: string;
  occupation: string;
  contact_no: string;
  loan?: {
    status: string;
  }
}

export default function Index({ borrowers }: { borrowers: Borrower[] }) {
  const breadcrumbs: BreadcrumbItem[] = [{ title: 'Borrowers', href: '/borrowers' }];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter logic
  const filteredBorrowers = useMemo(() => {
    return borrowers.filter((b: Borrower) => {
      const fullName = `${b.first_name} ${b.last_name}` .toLowerCase();
      
      const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || b.email.toLowerCase().includes(searchTerm.toLowerCase()) || b.city.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' ? true : (b.loan?.status ?? '').toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [borrowers, searchTerm, statusFilter]);

  return (
    <AppLayout breadcrumbs={breadcrumbs} >
      <Head title="Borrowers List" />

      {/* Header & Actions Section */}
      <div className="m-10 flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">
          Borrowers
        </h1>

        <div className="flex flex-1 flex-col md:flex-row gap-4 md:gap-3 md:items-center md:justify-end">
          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search borrowers..."
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:border-[#FABF24] focus:ring-2 focus:ring-[#FAE6A0] focus:outline-none transition"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
              Status:
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-[#FABF24] focus:ring-2 focus:ring-[#FAE6A0] focus:outline-none transition"
            >
              <option value="all">All</option>
              <option value = "active">Active</option>
              <option value="closed">Closed</option>
              <option value="blacklisted">Blacklisted</option>
            </select>
          </div>

          {/* Add Borrower Button */}
          <Button
            asChild
            className="bg-[#FABF24] text-gray-900 font-medium px-4 py-2 rounded-lg shadow-sm hover:bg-[#f8b80f] transition-colors duration-200 inline-flex items-center"
          >
            <a href="/borrowers/add">+ Add Borrower</a>
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="mx-10 overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                '#',
                'Name',
                'Occupation',
                'Gender',
                'City',
                'Email',
                'Mobile',
                'Status',
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {filteredBorrowers.length > 0 ? (
              filteredBorrowers.map((b: Borrower, index: number) => {
                const status = b.loan?.status?.toLowerCase() ?? 'N/A';
                const statusClasses =
                  status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : status === 'closed'
                    ? 'bg-gray-100 text-gray-800'
                    : status === 'blacklisted'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800';

                return (
                  <tr
                    key={b.id}
                    className="hover:bg-[#FFF8E6] cursor-pointer transition-colors duration-150"
                    onClick={() => router.visit(`/borrowers/${b.id}`)}
                  >
                    <td className="px-4 py-3 text-sm text-gray-600">{index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{b.first_name} {b.last_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.occupation}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.gender}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.city}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.contact_no}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClasses}`}
                      >
                        {b.loan?.status ?? 'N/A'}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-6 text-gray-500 text-sm italic"
                >
                  No borrowers found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
