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
import RebatesSettingsCard from '@/components/RebatesSettingsCard';
import ProductRequirementsCard from '@/components/ProductRequirementsCard';
import RequirementFormModal from '@/components/RequirementFormModal';
import DocumentTypesCard from '@/components/DocumentTypesCard';
import DocumentTypeFormModal from '@/components/DocumentTypeFormModal';

interface LoanCharge {
  id: number;
  name: string;
  description: string | null;
  rate: string | number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Requirement {
  id: number;
  loan_product_id: number;
  loan_product: { name: string };
  requirement_type: string;
  document_type_id?: number;
  document_type?: { name: string };
  document_category?: string;
  subject_type: string;
  collateral_type?: string;
  is_required: boolean;
  min_count: number;
  max_count?: number;
  sort_order: number;
  notes?: string;
  is_active: boolean;
}

interface LoanSettingsProps {
  sections?: {
    general?: {
      key: string;
      title: string;
      description: string;
      items: {
        enable_rebates: boolean;
        rebate_percentage: number;
        rebate_basis: string;
        rebate_min_days_early: number;
        rebate_apply_to_full_payoff: boolean;
        rebate_require_good_standing: boolean;
      };
    };
    rebates?: {
      key: string;
      title: string;
      description: string;
      items: {
        enable_rebates: boolean;
        rebate_percentage: number;
        rebate_basis: string;
        rebate_min_days_early?: number;
        rebate_apply_to_full_payoff?: boolean;
        rebate_require_good_standing?: boolean;
      };
    };
    releasingFees?: {
      key: string;
      title: string;
      description: string;
      items: LoanCharge[];
    };
    productRequirements?: {
      key: string;
      title: string;
      description: string;
      items: {
        requirements: Requirement[];
        loanProducts: any[];
        documentTypes: any[];
        categories: string[];
        subjectTypes: string[];
        collateralTypes: string[];
        requirementTypes: string[];
      };
    };
    documentTypes?: {
      key: string;
      title: string;
      description: string;
      items: {
        documentTypes: any[];
        categories: string[];
      };
    };
  };
}

type LoanSettingsSection = NonNullable<LoanSettingsProps['sections']>[keyof NonNullable<LoanSettingsProps['sections']>];

const sectionLabels: Record<string, string> = {
  general: 'Rebates Settings',
  rebates: 'Rebates Settings',
  releasingFees: 'Releasing Fees',
  productRequirements: 'Product Requirements',
  documentTypes: 'Document Types',
};

export default function LoanSettings({ sections = {} }: LoanSettingsProps) {
  const loanSettingsUrl = route('loan-settings.index');
  const availableSections = Object.values(sections).filter(Boolean) as LoanSettingsSection[];
  const [activeSection, setActiveSection] = useState<string>(availableSections[0]?.key ?? 'general');
  const rebateSection = sections.rebates ?? sections.general;

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

  const [isReqFormModalOpen, setIsReqFormModalOpen] = useState(false);
  const [isReqDeleteModalOpen, setIsReqDeleteModalOpen] = useState(false);
  const [selectedRequirement, setSelectedRequirement] = useState<Requirement | null>(null);

  const [isDocTypeFormModalOpen, setIsDocTypeFormModalOpen] = useState(false);
  const [isDocTypeDeleteModalOpen, setIsDocTypeDeleteModalOpen] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState<any | null>(null);

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

  const handleAddRequirement = () => {
    setSelectedRequirement(null);
    setIsReqFormModalOpen(true);
  };

  const handleEditRequirement = (e: React.MouseEvent, req: Requirement) => {
    e.stopPropagation();
    setSelectedRequirement(req);
    setIsReqFormModalOpen(true);
  };

  const handleDeleteReqClick = (e: React.MouseEvent, req: Requirement) => {
    e.stopPropagation();
    setSelectedRequirement(req);
    setIsReqDeleteModalOpen(true);
  };

  const confirmDeleteRequirement = () => {
    if (!selectedRequirement) return;
    router.delete(route('loan-settings.product-requirements.destroy', selectedRequirement.id), {
      onSuccess: () => setIsReqDeleteModalOpen(false),
    });
  };

  const handleAddDocType = () => {
    setSelectedDocType(null);
    setIsDocTypeFormModalOpen(true);
  };

  const handleEditDocType = (e: React.MouseEvent, dt: any) => {
    e.stopPropagation();
    setSelectedDocType(dt);
    setIsDocTypeFormModalOpen(true);
  };

  const handleDeleteDocTypeClick = (e: React.MouseEvent, dt: any) => {
    e.stopPropagation();
    setSelectedDocType(dt);
    setIsDocTypeDeleteModalOpen(true);
  };

  const confirmDeleteDocType = () => {
    if (!selectedDocType) return;
    router.delete(route('loan-settings.document-types.destroy', selectedDocType.id), {
      onSuccess: () => setIsDocTypeDeleteModalOpen(false),
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

      {(activeSection === 'rebates' || activeSection === 'general') && rebateSection && (
        <RebatesSettingsCard settings={rebateSection.items} />
      )}

      {activeSection === 'productRequirements' && sections.productRequirements && (
        <ProductRequirementsCard
          requirements={sections.productRequirements.items.requirements}
          documentTypes={sections.productRequirements.items.documentTypes}
          totalRequirements={sections.productRequirements.items.requirements.length}
          onAdd={handleAddRequirement}
          onEdit={handleEditRequirement}
          onDelete={handleDeleteReqClick}
        />
      )}

      {activeSection === 'documentTypes' && sections.documentTypes && (
        <DocumentTypesCard
          documentTypes={sections.documentTypes.items.documentTypes}
          categories={sections.documentTypes.items.categories}
          totalCount={sections.documentTypes.items.documentTypes.length}
          onAdd={handleAddDocType}
          onEdit={handleEditDocType}
          onDelete={handleDeleteDocTypeClick}
        />
      )}

      {availableSections.length > 0 &&
        activeSection !== 'releasingFees' &&
        activeSection !== 'rebates' &&
        activeSection !== 'general' &&
        activeSection !== 'productRequirements' &&
        activeSection !== 'documentTypes' && (
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

      {sections.productRequirements && (
        <RequirementFormModal
          open={isReqFormModalOpen}
          onClose={() => setIsReqFormModalOpen(false)}
          requirement={selectedRequirement}
          loanProducts={sections.productRequirements.items.loanProducts}
          documentTypes={sections.productRequirements.items.documentTypes}
          categories={sections.productRequirements.items.categories}
          subjectTypes={sections.productRequirements.items.subjectTypes}
          collateralTypes={sections.productRequirements.items.collateralTypes}
          requirementTypes={sections.productRequirements.items.requirementTypes}
        />
      )}

      <ConfirmDialog
        open={isReqDeleteModalOpen}
        title="Delete Requirement"
        description="Are you sure you want to delete this requirement? This action cannot be undone."
        onConfirm={confirmDeleteRequirement}
        onCancel={() => setIsReqDeleteModalOpen(false)}
        confirmText="Delete"
      />

      {sections.documentTypes && (
        <DocumentTypeFormModal
          open={isDocTypeFormModalOpen}
          onClose={() => setIsDocTypeFormModalOpen(false)}
          documentType={selectedDocType}
          categories={sections.documentTypes.items.categories}
        />
      )}

      <ConfirmDialog
        open={isDocTypeDeleteModalOpen}
        title="Delete Document Type"
        description={`Are you sure you want to delete "${selectedDocType?.name}"? This action cannot be undone.`}
        onConfirm={confirmDeleteDocType}
        onCancel={() => setIsDocTypeDeleteModalOpen(false)}
        confirmText="Delete"
      />

    </AppLayout>
  );
}
