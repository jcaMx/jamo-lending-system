import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Search, Edit2, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';

type Borrower = any;

export default function Index({ borrowers }: { borrowers: Borrower[] }) {
  const breadcrumbs: BreadcrumbItem[] = [{ title: 'Borrowers', href: '/borrowers' }];

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const borrowersPerPage = 10;

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<number | null>(null);
  const [selectedBorrowerName, setSelectedBorrowerName] = useState<string>('');

  const getFullName = (b: Borrower) => {
    const first = b.first_name || b.firstname || b.borrowerFirstName || '';
    const last = b.last_name || b.lastname || b.borrowerLastName || '';
    const full = b.name || b.full_name || '';
    if (full?.trim()) return full.trim();
    if (first.trim() || last.trim()) return `${first.trim()} ${last.trim()}`.trim();
    return 'N/A';
  };

  const getStatusInfo = (b: Borrower) => {
    const statusRaw = b.activeLoan?.status?.trim() || '';
    const status = statusRaw ? statusRaw.toLowerCase() : 'n/a';
    const statusClasses =
      status === 'active'
        ? 'bg-green-100 text-green-800'
        : status === 'completed'
        ? 'bg-gray-100 text-gray-800'
        : status === 'delinquent'
        ? 'bg-red-100 text-red-800'
        : 'bg-yellow-100 text-yellow-800';
    const statusLabel = statusRaw || 'N/A';
    return { statusClasses, statusLabel };
  };

  const filteredBorrowers = useMemo(() => {
    return borrowers.filter((b: Borrower) => {
      const fullName = getFullName(b).toLowerCase();
      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        (b.email ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (b.city ?? '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : (b.activeLoan?.status ?? '').toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [borrowers, searchTerm, statusFilter]);

  const paginatedBorrowers = useMemo(() => {
    const start = (currentPage - 1) * borrowersPerPage;
    const end = start + borrowersPerPage;
    return filteredBorrowers.slice(start, end);
  }, [filteredBorrowers, currentPage]);

  const totalPages = Math.ceil(filteredBorrowers.length / borrowersPerPage);

  // Delete flow
  const handleDeleteClick = (borrowerId: number, borrowerName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedBorrowerId(borrowerId);
    setSelectedBorrowerName(borrowerName);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedBorrowerId) return;

    router.delete(route('borrowers.destroy', selectedBorrowerId), {
      onSuccess: () => {
        router.reload({ only: ['borrowers'] });
        setModalOpen(false);
      },
      onError: () => {
        // Optionally show a toast or error message
        setModalOpen(false);
      },
      preserveScroll: true,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Borrowers List" />

      {/* Header & Actions */}
      <div className="m-10 flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">Borrowers</h1>

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
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-[#FABF24] focus:ring-2 focus:ring-[#FAE6A0] focus:outline-none transition"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="delinquent">Delinquent</option>
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

      {/* Borrowers Table */}
      <div className="mx-10 overflow-x-auto bg-white rounded-xl border border-gray-200 shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['#', 'Name', 'Occupation', 'Gender', 'City', 'Email', 'Mobile', 'Status'].map(
                (header) => (
                  <th
                    key={header}
                    className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 bg-white">
            {paginatedBorrowers.length > 0 ? (
              paginatedBorrowers.map((b: Borrower, index: number) => {
                const fullName = getFullName(b);
                const { statusClasses, statusLabel } = getStatusInfo(b);

                return (
                  <tr key={b.id} className="hover:bg-[#FFF8E6] transition-colors duration-150">
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {(currentPage - 1) * borrowersPerPage + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{fullName}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.occupation ?? 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.gender ?? 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.city ?? 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.email ?? 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{b.mobile ?? 'N/A'}</td>
                    <td className="px-4 py-3 flex items-center gap-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusClasses}`}
                      >
                        {statusLabel}
                      </span>
                      <Button
                        variant="default"
                        size="sm"
                        className="p-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.visit(`/borrowers/${b.id}/edit`);
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="p-1 text-red-600 hover:text-red-800"
                        onClick={(e) => handleDeleteClick(b.id, fullName, e)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-500 text-sm italic">
                  No borrowers found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mx-10 flex justify-between items-center py-6">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 disabled:opacity-40"
        >
          Previous
        </Button>

        <span className="text-gray-700 text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="bg-[#FABF24] text-gray-900 px-4 py-2 rounded-lg hover:bg-[#f8b80f] disabled:opacity-40"
        >
          Next
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        borrowerName={selectedBorrowerName}
      />
    </AppLayout>
  );
}
