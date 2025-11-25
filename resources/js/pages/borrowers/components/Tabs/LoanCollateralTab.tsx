import React from 'react';
import { SquarePen, Trash } from 'lucide-react';
import useInlineEdit from '@/hooks/useInlineEdit';

type Collateral = {
  id: number;
  type: 'Land' | 'Vehicle' | 'ATM';
  estimated_value: number;
  appraisal_date?: string;
  status: 'Pledged' | 'Released' | 'Forfeited' | 'Pending';
  description?: string;
  remarks?: string;
  land_details?: Record<string, any>;
  vehicle_details?: Record<string, any>;
  atm_details?: Record<string, any>;
};

interface LoanCollateralTabProps {
  collaterals: Collateral[];
  onDeleteCollateral?: (id: number) => void;
}

export default function LoanCollateralTab({ collaterals, onDeleteCollateral }: LoanCollateralTabProps) {
  const [editMode, setEditMode] = React.useState(false);
  const [data, setData] = React.useState(collaterals);

  const { editingField, editedValue, startEditing, setEditedValue, saveField } = useInlineEdit(
    data,
    (field, value, collateralId) => {
      setData((prev) =>
        prev.map((c) =>
          c.id === collateralId
            ? { ...c, [field]: value }
            : c
        )
      );
    }
  );

  const renderEditable = (collateralId: number, fieldKey: string, value: any, type: 'number' | 'text' = 'text') => {
    const fieldName = `${fieldKey}_${collateralId}`;
    if (editMode && editingField === fieldName) {
      return (
        <input
          type={type}
          value={editedValue}
          onChange={(e) => setEditedValue(type === 'number' ? parseFloat(e.target.value) : e.target.value)}
          onBlur={() => saveField(fieldName, collateralId)}
          className="border rounded p-1 w-full"
        />
      );
    }
    return (
      <span
        className="cursor-pointer"
        onClick={() => editMode && startEditing(fieldName, value, collateralId)}
      >
        {type === 'number' ? Number(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value || 'N/A'}
      </span>
    );
  };

  const handleDelete = (id: number) => {
    // Remove from local state
    setData((prev) => prev.filter((c) => c.id !== id));
    // Call parent handler if provided
    onDeleteCollateral?.(id);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={() => setEditMode((s) => !s)}
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        <SquarePen className="w-4 h-4" /> {editMode ? 'Close Edit' : 'Edit Collaterals'}
      </button>

      {data.map((c) => (
        <div key={c.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative">
          {editMode && (
            <button
              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
              onClick={() => handleDelete(c.id)}
            >
              <Trash className="w-4 h-4" />
            </button>
          )}

          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-2 items-center">
              <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">{c.type}</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  c.status === 'Pledged'
                    ? 'bg-green-100 text-green-800'
                    : c.status === 'Released'
                    ? 'bg-blue-100 text-blue-800'
                    : c.status === 'Forfeited'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {c.status}
              </span>
            </div>
            <div className="text-right">{renderEditable(c.id, 'estimated_value', c.estimated_value, 'number')}</div>
          </div>

          <div>
            <span className="font-medium">Description: </span>
            {renderEditable(c.id, 'description', c.description || '')}
          </div>

          {c.remarks && (
            <div className="mt-2">
              <span className="font-medium">Remarks: </span>
              {renderEditable(c.id, 'remarks', c.remarks)}
            </div>
          )}

          {/* Render details for Land / Vehicle / ATM */}
          {['land_details', 'vehicle_details', 'atm_details'].map((key) =>
            c[key as keyof Collateral] ? (
              <div key={key} className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {Object.entries(c[key as keyof Collateral]!).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-gray-500">{k}:</span>
                    {renderEditable(c.id, k, v)}
                  </div>
                ))}
              </div>
            ) : null
          )}
        </div>
      ))}
    </div>
  );
}
