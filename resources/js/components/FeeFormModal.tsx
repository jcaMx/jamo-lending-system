import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';

interface LoanChargeFormData {
  name: string;
  rate: string;
  description: string;
  is_active: boolean;
}

interface Fee {
  id: number;
  name: string;
  rate: string | number;
  description: string | null;
  is_active: boolean;
}

interface FeeFormModalProps {
  open: boolean;
  onClose: () => void;
  fee: Fee | null;
}

const initialValues: LoanChargeFormData = {
  name: '',
  rate: '',
  description: '',
  is_active: true,
};

export default function FeeFormModal({ open, onClose, fee }: FeeFormModalProps) {
  const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
    ...initialValues,
  });

  useEffect(() => {
    if (fee) {
      setData({
        name: fee.name,
        rate: String(fee.rate),
        description: fee.description || '',
        is_active: !!fee.is_active,
      });
    } else {
      reset(initialValues);
    }
    clearErrors();
  }, [fee, open, setData, reset, clearErrors]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fee) {
      put(route('loan-settings.releasing-fees.update', fee.id), { onSuccess: () => onClose() });
    } else {
      post(route('loan-settings.releasing-fees.store'), { onSuccess: () => onClose() });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white max-w-md">
        <DialogHeader>
          <DialogTitle>{fee ? 'Edit Releasing Fee' : 'Add New Releasing Fee'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Fee Name</label>
            <input 
              className="w-full border rounded-md p-2 mt-1"
              value={data.name} 
              onChange={e => setData('name', e.target.value)} 
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Rate</label>
            <input 
              type="number" step="0.01"
              className="w-full border rounded-md p-2 mt-1"
              value={data.rate} 
              onChange={e => setData('rate', e.target.value)} 
            />
            {errors.rate && <p className="text-red-500 text-xs mt-1">{errors.rate}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea 
              className="w-full border rounded-md p-2 mt-1"
              value={data.description} 
              onChange={e => setData('description', e.target.value)} 
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>
          <div className="flex items-center gap-2">
            <input
              id="fee-active"
              type="checkbox"
              checked={data.is_active}
              onChange={(e) => setData('is_active', e.target.checked)}
            />
            <label htmlFor="fee-active" className="text-sm font-medium">Active</label>
            {errors.is_active && <p className="text-red-500 text-xs mt-1">{errors.is_active}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={processing} className="bg-[#FABF24] text-black">
              {fee ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
