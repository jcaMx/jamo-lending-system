import { Button } from '@/components/ui/button';

export type BorrowerDocumentCategory = 'borrower_identity' | 'borrower_address' | 'borrower_employment';

export type BorrowerDocumentTypeOption = {
  id: number;
  name: string;
  category: string;
  code?: string;
};

export type BorrowerDocumentUploadItem = {
  document_type_id: string;
  file: File | null;
};

type RenderDocumentUploaderProps = {
  title: string;
  category: BorrowerDocumentCategory;
  rows: BorrowerDocumentUploadItem[];
  optionsByCategory: Record<BorrowerDocumentCategory, BorrowerDocumentTypeOption[]>;
  minRequired: number;
  inputClass: string;
  onAdd: (category: BorrowerDocumentCategory) => void;
  onRemove: (category: BorrowerDocumentCategory, index: number) => void;
  onUpdate: (
    category: BorrowerDocumentCategory,
    index: number,
    patch: Partial<BorrowerDocumentUploadItem>,
  ) => void;
  getFieldError: (field: string) => string | undefined;
};

export default function RenderDocumentUploader({
  title,
  category,
  rows,
  optionsByCategory,
  minRequired,
  inputClass,
  onAdd,
  onRemove,
  onUpdate,
  getFieldError,
}: RenderDocumentUploaderProps) {
  const options = optionsByCategory[category] ?? [];

  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <Button type="button" onClick={() => onAdd(category)} className="bg-[#FABF24] text-black hover:bg-yellow-600">
          Add Document
        </Button>
      </div>

      {rows.map((row, index) => (
        <div key={`${category}-${index}`} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
          <div className="md:col-span-5">
            <label className="block text-sm font-medium mb-1">Document Type</label>
            <select
              value={row.document_type_id}
              onChange={(e) => onUpdate(category, index, { document_type_id: e.target.value })}
              className={inputClass}
            >
              <option value="">Select document type</option>
              {options.map((option) => (
                <option key={option.id} value={String(option.id)}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-5">
            <label className="block text-sm font-medium mb-1">File</label>
            <input
              type="file"
              className={inputClass}
              onChange={(e) => onUpdate(category, index, { file: e.target.files?.[0] ?? null })}
              accept=".jpg,.jpeg,.png,.pdf"
            />
          </div>

          <div className="md:col-span-2">
            <Button
              type="button"
              onClick={() => onRemove(category, index)}
              className="w-full bg-white text-red-600 border border-red-200 hover:bg-red-50"
              disabled={rows.length === 1}
            >
              Remove
            </Button>
          </div>

          {row.file && <p className="md:col-span-12 text-xs text-gray-600">Selected: {row.file.name}</p>}
          {getFieldError(`documents.${category}.${index}.file`) && (
            <p className="md:col-span-12 text-xs text-red-500">{getFieldError(`documents.${category}.${index}.file`)}</p>
          )}
        </div>
      ))}

      <p className="text-xs text-gray-600">Minimum required: {minRequired} complete upload(s).</p>
      {getFieldError(`documents.${category}`) && (
        <p className="text-xs text-red-500">{getFieldError(`documents.${category}`)}</p>
      )}
    </div>
  );
}