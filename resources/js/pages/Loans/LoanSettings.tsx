import React, { useEffect, useMemo, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { route } from 'ziggy-js';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import FeeFormModal from '@/components/FeeFormModal';
import ReleasingFeesCard from '@/components/ReleasingFeesCard';

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
  sections?: {
    releasingFees?: {
      key: string;
      title: string;
      description: string;
      items: LoanCharge[];
    };
  };
}

type LoanSettingsSection = NonNullable<LoanSettingsProps['sections']>[keyof NonNullable<LoanSettingsProps['sections']>];

const sectionLabels: Record<string, string> = {
  releasingFees: 'Releasing Fees',
};

export default function LoanSettings({ sections = {} }: LoanSettingsProps) {
  const loanSettingsUrl = route('loan-settings.index');
  const availableSections = Object.values(sections).filter(Boolean) as LoanSettingsSection[];
  const [activeSection, setActiveSection] = useState<string>(availableSections[0]?.key ?? 'releasingFees');

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Loan Settings', href: loanSettingsUrl },
    { title: sectionLabels[activeSection] ?? 'Loan Settings', href: loanSettingsUrl }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<LoanCharge | null>(null);

  const releasingFees = sections.releasingFees?.items ?? [];

  const filteredFees = useMemo(() => {
    return releasingFees.filter((f) =>
      f.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.description ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [releasingFees, searchTerm]);

  const paginatedFees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredFees.slice(start, start + itemsPerPage);
  }, [filteredFees, currentPage]);

  const totalPages = Math.ceil(filteredFees.length / itemsPerPage);

  useEffect(() => {
    if (availableSections.length > 0 && !availableSections.some((section) => section.key === activeSection)) {
      setActiveSection(availableSections[0].key);
    }
  }, [activeSection, availableSections]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeSection]);

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
      <Head title="Loan Settings" />

      <div className="m-10 flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-4xl font-semibold text-gray-800 tracking-tight">Loan Settings</h1>

        <div className="flex flex-1 flex-col md:flex-row gap-4 md:gap-3 md:items-center md:justify-end">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Search ${sectionLabels[activeSection]?.toLowerCase() ?? 'settings'}...`}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-[#FABF24] focus:ring-2 focus:ring-[#FAE6A0] outline-none transition"
            />
          </div>
        </div>
      </div>

      {availableSections.length > 1 && (
        <div className="mx-10 mb-6 flex flex-wrap gap-2">
          {availableSections.map((section) => (
            <Button
              key={section.key}
              type="button"
              variant={activeSection === section.key ? 'default' : 'outline'}
              className={activeSection === section.key ? 'bg-[#FABF24] text-black hover:bg-[#E5AE1F]' : ''}
              onClick={() => setActiveSection(section.key)}
            >
              {section.title}
            </Button>
          ))}
        </div>
      )}

      {activeSection === 'releasingFees' && (
        <>
          <ReleasingFeesCard
            fees={paginatedFees}
            totalFees={filteredFees.length}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          {totalPages > 1 && (
            <div className="mx-10 mt-4 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {availableSections.length > 0 && activeSection !== 'releasingFees' && (
        <div className="mx-10 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          This loan setting section is ready to plug into the shared page, but its UI component has not been added yet.
        </div>
      )}

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
