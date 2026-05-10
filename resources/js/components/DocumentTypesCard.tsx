import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface DocumentType {
  id: number;
  code: string;
  name: string;
  category: string;
  is_active?: boolean;
}

interface DocumentTypesCardProps {
  documentTypes: DocumentType[];
  categories: string[];
  totalCount: number;
  onAdd: () => void;
  onEdit: (e: React.MouseEvent, dt: DocumentType) => void;
  onDelete: (e: React.MouseEvent, dt: DocumentType) => void;
}

export default function DocumentTypesCard({
  documentTypes,
  onAdd,
  onEdit,
  onDelete,
}: DocumentTypesCardProps) {
  // Group by category
  const groupedDocs = documentTypes.reduce((acc: Record<string, DocumentType[]>, dt) => {
    const cat = dt.category || 'Uncategorized';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(dt);
    return acc;
  }, {});

  const formatCategory = (cat: string) => {
    return cat.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="mx-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Types</h1>
          <p className="mt-1 text-sm text-gray-500 italic">Manage specific document types grouped by category.</p>
        </div>
        <Button
          onClick={onAdd}
          className="bg-[#FABF24] text-black hover:bg-[#E5AE1F] font-semibold flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Document Type
        </Button>
      </div>

      {Object.entries(groupedDocs).map(([category, docs]) => (
        <div key={category} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
          <div className="border-b border-gray-100 bg-gray-50/30 px-6 py-4">
            <h3 className="text-lg font-bold text-gray-800">{formatCategory(category)}</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-xs font-bold uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {docs.map((dt) => (
                  <tr key={dt.id} className="group hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{dt.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        {dt.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={(e) => onEdit(e, dt)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Edit Document Type"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => onDelete(e, dt)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete Document Type"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {documentTypes.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center text-gray-400">
          No document types found. Click "Add Document Type" to create one.
        </div>
      )}
    </div>
  );
}
