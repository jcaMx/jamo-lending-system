import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Requirement {
  id: number;
  loan_product: { name: string };
  requirement_type: string;
  document_type?: { name: string; code: string };
  document_category?: string;
  subject_type: string;
  collateral_type?: string;
  is_required: boolean;
  min_count: number;
  max_count?: number;
  sort_order: number;
  notes?: string;
}

interface DocumentType {
  id: number;
  code: string;
  name: string;
  category: string;
}

interface ProductRequirementsCardProps {
  requirements: Requirement[];
  documentTypes?: DocumentType[];
  totalRequirements: number;
  onAdd: () => void;
  onEdit: (e: React.MouseEvent, requirement: Requirement) => void;
  onDelete: (e: React.MouseEvent, requirement: Requirement) => void;
}

export default function ProductRequirementsCard({
  requirements,
  documentTypes = [],
  onAdd,
  onEdit,
  onDelete,
}: ProductRequirementsCardProps) {
  // Group requirements by loan product
  const groupedRequirements = requirements.reduce((acc: Record<string, Requirement[]>, req) => {
    const productName = req.loan_product?.name || 'Unknown Product';
    if (!acc[productName]) {
      acc[productName] = [];
    }
    acc[productName].push(req);
    return acc;
  }, {});

  const formatCategory = (cat?: string) => {
    if (!cat) return '';
    return cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="mx-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Product Requirements</h1>
          <p className="mt-1 text-sm text-gray-500 italic">Manage document requirements grouped by loan products.</p>
        </div>
        <Button
          onClick={onAdd}
          className="bg-[#FABF24] text-black hover:bg-[#E5AE1F] font-semibold flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Requirement
        </Button>
      </div>

      {Object.entries(groupedRequirements).map(([productName, productReqs]) => (
        <div key={productName} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
          <div className="border-b border-gray-100 bg-gray-50/30 px-6 py-4">
            <h3 className="text-lg font-bold text-gray-800">{productName}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-xs font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">Requirement</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Required</th>
                  <th className="px-6 py-4">Counts</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productReqs.map((req) => {
                  const isCategory = req.requirement_type === 'category';
                  const acceptableDocs = isCategory && req.document_category
                    ? documentTypes.filter(dt => dt.category === req.document_category)
                    : [];

                  return (
                    <tr key={req.id} className="group hover:bg-gray-50/80 transition-colors">
                      <td className="px-6 py-4 text-gray-600">
                        <div className="flex flex-col">
                          <span className="font-semibold text-gray-900">
                            {isCategory ? `Category: ${formatCategory(req.document_category)}` : req.document_type?.name}
                          </span>
                          {!isCategory && req.document_type?.code && (
                            <span className="text-xs font-mono text-blue-600 mt-0.5">
                              {req.document_type.code}
                            </span>
                          )}
                          {isCategory && acceptableDocs.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {acceptableDocs.map(doc => (
                                <span key={doc.id} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 border border-gray-200" title={doc.code}>
                                  {doc.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="capitalize">{req.subject_type}</span>
                          {req.collateral_type && <span className="text-xs text-gray-400 capitalize">{req.collateral_type}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${req.is_required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                          {req.is_required ? 'Required' : 'Optional'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        Min: {req.min_count} {req.max_count ? `| Max: ${req.max_count}` : ''}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={(e) => onEdit(e, req)}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit Requirement"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => onDelete(e, req)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Requirement"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {requirements.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-400">
          No requirements found. Click "Add Requirement" to create one.
        </div>
      )}
    </div>
  );
}
