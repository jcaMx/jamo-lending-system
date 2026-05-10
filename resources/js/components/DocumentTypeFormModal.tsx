import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/required-label';
import { Input } from '@/components/ui/input';

interface DocumentType {
  id?: number;
  code: string;
  name: string;
  category: string;
  is_active?: boolean;
}

interface DocumentTypeFormModalProps {
  open: boolean;
  onClose: () => void;
  documentType: DocumentType | null;
  categories: string[];
}

export default function DocumentTypeFormModal({
  open,
  onClose,
  documentType,
  categories,
}: DocumentTypeFormModalProps) {
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    code: '',
    name: '',
    category: '',
    is_active: true,
  });

  useEffect(() => {
    if (open) {
      if (documentType) {
        setData({
          code: documentType.code,
          name: documentType.name,
          category: documentType.category,
          is_active: documentType.is_active ?? true,
        });
      } else {
        reset();
      }
      clearErrors();
    }
  }, [open, documentType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const onSuccess = () => {
      onClose();
      reset();
    };

    if (documentType?.id) {
      put(route('loan-settings.document-types.update', documentType.id), { onSuccess });
    } else {
      post(route('loan-settings.document-types.store'), { onSuccess });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {documentType ? 'Edit Document Type' : 'Add Document Type'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              list="category-options"
              value={data.category}
              onChange={(e) => setData('category', e.target.value)}
              placeholder="e.g. borrower_identity"
              required
            />
            <datalist id="category-options">
              {categories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
            {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
            <p className="text-xs text-gray-500">You can select an existing category or type a new one.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData('name', e.target.value)}
              placeholder="e.g. National ID"
              required
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="code">Code</Label>
            <Input
              id="code"
              value={data.code}
              onChange={(e) => setData('code', e.target.value)}
              placeholder="e.g. NATIONAL_ID"
              className="uppercase"
              required
            />
            {errors.code && <p className="text-xs text-red-500">{errors.code}</p>}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#FABF24] text-black hover:bg-[#E5AE1F]"
              disabled={processing}
            >
              {processing ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
