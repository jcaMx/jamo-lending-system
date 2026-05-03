import React from 'react';
import { Edit2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LoanCharge {
  id: number;
  name: string;
  description: string | null;
  rate: string | number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ReleasingFeesCardProps {
  fees: LoanCharge[];
  totalFees: number;
  onAdd: () => void;
  onEdit: (event: React.MouseEvent<HTMLButtonElement>, fee: LoanCharge) => void;
  onDelete: (event: React.MouseEvent<HTMLButtonElement>, fee: LoanCharge) => void;
}

function formatRate(rate: string | number) {
  const numericRate = Number(rate);

  if (Number.isNaN(numericRate)) return '0%';

  // Convert decimal → percent
  const percent = numericRate * 100;

  return percent % 1 === 0
    ? `${percent.toFixed(0)}%`
    : `${percent.toFixed(2)}%`;
}

export default function ReleasingFeesCard({
  fees,
  totalFees,
  onAdd,
  onEdit,
  onDelete,
}: ReleasingFeesCardProps) {
  return (
    <Card className="mx-10 border border-gray-200 bg-white shadow-sm">
      <CardHeader className="flex flex-col gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-xl font-semibold text-gray-900">Releasing Fees</CardTitle>
          <p className="mt-1 text-sm text-gray-500">
            {totalFees} {totalFees === 1 ? 'fee' : 'fees'} found
          </p>
        </div>

        <Button onClick={onAdd} className="bg-[#FABF24] text-black hover:bg-[#E5AE1F]">
          <Plus className="h-4 w-4" />
          Add Fee
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        {fees.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <h3 className="text-base font-semibold text-gray-900">No releasing fees found</h3>
            <p className="mt-2 text-sm text-gray-500">Try a different search or add a new fee.</p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Fee Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {fees.map((fee) => (
                    <tr key={fee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{fee.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatRate(fee.rate)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{fee.description || 'No description'}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant="outline"
                          className={fee.is_active ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}
                        >
                          {fee.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" size="icon" onClick={(event) => onEdit(event, fee)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button type="button" variant="outline" size="icon" onClick={(event) => onDelete(event, fee)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 md:hidden">
              {fees.map((fee) => (
                <div key={fee.id} className="rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{fee.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{fee.description || 'No description'}</p>
                    </div>

                    <Badge
                      variant="outline"
                      className={fee.is_active ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}
                    >
                      {fee.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-700">Rate: {formatRate(fee.rate)}</p>

                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="icon" onClick={(event) => onEdit(event, fee)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="outline" size="icon" onClick={(event) => onDelete(event, fee)}>
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}