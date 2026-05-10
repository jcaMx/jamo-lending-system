import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { route } from 'ziggy-js';

interface LoanProduct {
  id: number;
  name: string;
}

interface DocumentType {
  id: number;
  name: string;
  category: string;
}

interface Requirement {
  id: number;
  loan_product_id: number;
  requirement_type: string;
  document_type_id?: number;
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

interface RequirementFormModalProps {
  open: boolean;
  onClose: () => void;
  requirement: Requirement | null;
  loanProducts: LoanProduct[];
  documentTypes: DocumentType[];
  categories: string[];
  subjectTypes: string[];
  collateralTypes: string[];
  requirementTypes: string[];
}

export default function RequirementFormModal({
  open,
  onClose,
  requirement,
  loanProducts,
  documentTypes,
  categories,
  subjectTypes,
  collateralTypes,
  requirementTypes,
}: RequirementFormModalProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm({
    loan_product_id: requirement?.loan_product_id ?? (loanProducts[0]?.id || 0),
    requirement_type: requirement?.requirement_type ?? 'category',
    document_type_id: requirement?.document_type_id ?? undefined,
    document_category: requirement?.document_category ?? '',
    subject_type: requirement?.subject_type ?? 'borrower',
    collateral_type: requirement?.collateral_type ?? '',
    is_required: requirement?.is_required ?? true,
    min_count: requirement?.min_count ?? 1,
    max_count: requirement?.max_count ?? undefined,
    sort_order: requirement?.sort_order ?? 0,
    notes: requirement?.notes ?? '',
    is_active: requirement?.is_active ?? true,
  });

  useEffect(() => {
    if (requirement) {
      setData({
        loan_product_id: requirement.loan_product_id,
        requirement_type: requirement.requirement_type,
        document_type_id: requirement.document_type_id,
        document_category: requirement.document_category ?? '',
        subject_type: requirement.subject_type,
        collateral_type: requirement.collateral_type ?? '',
        is_required: requirement.is_required,
        min_count: requirement.min_count,
        max_count: requirement.max_count,
        sort_order: requirement.sort_order,
        notes: requirement.notes ?? '',
        is_active: requirement.is_active,
      });
    } else {
      reset();
    }
  }, [requirement, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requirement) {
      put(route('loan-settings.product-requirements.update', requirement.id), {
        onSuccess: () => {
          onClose();
          reset();
        },
      });
    } else {
      post(route('loan-settings.product-requirements.store'), {
        onSuccess: () => {
          onClose();
          reset();
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {requirement ? 'Edit Requirement' : 'Add New Requirement'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="loan_product_id">Loan Product</Label>
              <Select
                value={data.loan_product_id.toString()}
                onValueChange={(val) => setData('loan_product_id', parseInt(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {loanProducts.map((product) => (
                    <SelectItem key={product.id} value={product.id.toString()}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.loan_product_id && <p className="text-xs text-red-500">{errors.loan_product_id}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirement_type">Requirement Type</Label>
              <Select
                value={data.requirement_type}
                onValueChange={(val) => setData('requirement_type', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {requirementTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.requirement_type && <p className="text-xs text-red-500">{errors.requirement_type}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {data.requirement_type === 'document_type' ? (
              <div className="space-y-2">
                <Label htmlFor="document_type_id">Document Type</Label>
                <Select
                  value={data.document_type_id?.toString()}
                  onValueChange={(val) => setData('document_type_id', parseInt(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Document Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {documentTypes.map((doc) => (
                      <SelectItem key={doc.id} value={doc.id.toString()}>
                        <span className="font-mono text-blue-600 mr-2">{doc.code}</span>
                        <span>{doc.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.document_type_id && <p className="text-xs text-red-500">{errors.document_type_id}</p>}
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="document_category">Document Category</Label>
                <Select
                  value={data.document_category}
                  onValueChange={(val) => setData('document_category', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.document_category && <p className="text-xs text-red-500">{errors.document_category}</p>}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject_type">Subject Type</Label>
              <Select
                value={data.subject_type}
                onValueChange={(val) => setData('subject_type', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Subject" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {subjectTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.subject_type && <p className="text-xs text-red-500">{errors.subject_type}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="collateral_type">Collateral Type (Optional)</Label>
              <Select
                value={data.collateral_type || 'none'}
                onValueChange={(val) => setData('collateral_type', val === 'none' ? '' : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Collateral Type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="none">None</SelectItem>
                  {collateralTypes.map((type) => (
                    <SelectItem key={type} value={type} className="capitalize">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.collateral_type && <p className="text-xs text-red-500">{errors.collateral_type}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="min_count">Min Count</Label>
              <Input
                id="min_count"
                type="number"
                value={data.min_count}
                onChange={(e) => setData('min_count', parseInt(e.target.value))}
              />
              {errors.min_count && <p className="text-xs text-red-500">{errors.min_count}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="max_count">Max Count</Label>
              <Input
                id="max_count"
                type="number"
                placeholder="Optional"
                value={data.max_count || ''}
                onChange={(e) => setData('max_count', e.target.value ? parseInt(e.target.value) : undefined)}
              />
              {errors.max_count && <p className="text-xs text-red-500">{errors.max_count}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="sort_order">Sort Order</Label>
              <Input
                id="sort_order"
                type="number"
                value={data.sort_order}
                onChange={(e) => setData('sort_order', parseInt(e.target.value))}
              />
              {errors.sort_order && <p className="text-xs text-red-500">{errors.sort_order}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id="is_required"
              checked={data.is_required}
              onCheckedChange={(checked) => setData('is_required', checked as boolean)}
            />
            <Label htmlFor="is_required">Is Required</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={data.notes}
              onChange={(e) => setData('notes', e.target.value)}
              placeholder="Internal notes or instructions for the user..."
            />
            {errors.notes && <p className="text-xs text-red-500">{errors.notes}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={processing}
              className="bg-[#FABF24] text-black hover:bg-[#E5AE1F]"
            >
              {requirement ? 'Update Requirement' : 'Create Requirement'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
