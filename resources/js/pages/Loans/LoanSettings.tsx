import React, { useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Edit2, Plus, Search, Trash2 } from 'lucide-react';
import { route } from 'ziggy-js';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import FeeFormModal from '@/components/FeeFormModal';
import { Description } from '@radix-ui/react-dialog';

interface LoanCharge {
  id: number;
  name: string;
  description: string | null;
  rate: string | number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface LoanSettingsProps {
  fees?: LoanCharge[];
}

export default function LoanSettings({ fees = [] }: LoanSettingsProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Loan Settings', href: '/Loans/loan-settings/releasing-fees' },
    { title: 'Releasing Fees', href: '/Loans/loan-settings/releasing-fees' }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<LoanCharge | null>(null);

  const getStatusClasses = (status: string) => {
    const s = status?.toLowerCase() || '';
    return s === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const filteredFees = useMemo(() => {
    return fees.filter((f) => 
      f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [fees, searchTerm]);

  const paginatedFees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFees.slice(start, start + itemsPerPage);
  }, [filteredFees, currentPage]);

  const totalPages = Math.ceil(filteredFees.length / itemsPerPage);

  // Handlers
  const handleAdd = () => {
    setSelectedFee(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>, fee: LoanCharge) => {
    e.stopPropagation();
    setSelectedFee(fee);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>, fee: LoanCharge) => {
    e.stopPropagation();
    setSelectedFee(fee);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedFee) return;
    router.delete(route('loan-settings.releasing-fees.destroy', selectedFee.id), {
      onSuccess: () => setIsDeleteModalOpen(false),
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Loan Settings - Releasing Fees" />

      <div className="m-10 flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">Loan Settings</h1>

        <div className="flex flex-1 flex-col md:flex-row gap-4 md:gap-3 md:items-center md:justify-end">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search fees..."
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-[#FABF24] focus:ring-2 focus:ring-[#FAE6A0] outline-none transition"
            />
          </div>
          <Button onClick={handleAdd} className="bg-[#FABF24] text-black hover:bg-[#e2ac1f]">
            <Plus className="mr-2 h-4 w-4" /> Add Fee
          </Button>
        </div>
      </div>

      <div className="mx-10 overflow-hidden bg-white rounded-xl border border-gray-200 shadow-md">
        <div className="p-5 border-b border-gray-100">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Releasing Fees</h2>
            </div>
            
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
                <tr>
                {['Fee', 'Description', 'Rate', 'Created at', 'Updated at', 'Is Active', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-sm font-semibold text-gray-700 uppercase">{h}</th>
                ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
                {paginatedFees.map((f) => (
                <tr key={f.id} className="hover:bg-[#FFF8E6] transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{f.name}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700">{f.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-mono">{(f.rate * 100).toFixed(2)}%</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{f.created_at}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{f.updated_at || 'N/A'}</td>
                    <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusClasses(f.is_active ? 'active' : 'inactive')}`}>
                        {f.is_active ? 'Active' : 'Inactive'}
                    </span>
                    </td>
                    <td className="px-4 py-3 flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={(e) => handleEdit(e, f)}><Edit2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={(e) => handleDeleteClick(e, f)}><Trash2 className="h-4 w-4" /></Button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
            </div>
      </div>

      {/* MODALS */}
      <FeeFormModal 
        open={isFormModalOpen} 
        onClose={() => setIsFormModalOpen(false)} 
        fee={selectedFee} 
      />

      <ConfirmDialog
        open={isDeleteModalOpen}
        title="Delete Releasing Fee"
        description={`Are you sure you want to delete "${selectedFee?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
        confirmText="Delete"
      />
    </AppLayout>
  );
}


