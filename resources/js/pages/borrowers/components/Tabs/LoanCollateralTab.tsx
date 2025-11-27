import React from 'react';

type Collateral = {
  id: number;
  type: 'Land' | 'Vehicle' | 'ATM';
  estimated_value: number;
  appraisal_date?: string;
  status: 'Pledged' | 'Released' | 'Forfeited' | 'Pending';
  description?: string;
  remarks?: string;
  land_details?: {
    titleNo: number;
    lotNo: number;
    location: string;
    areaSize: string;
  };
  vehicle_details?: {
    type: 'Car' | 'Motorcycle' | 'Truck';
    brand: string;
    model: string;
    year_model?: number;
    plate_no?: string;
    engine_no?: string;
    transmission_type?: 'Manual' | 'Automatic';
    fuel_type?: string;
  };
  atm_details?: {
    bank_name: 'BDO' | 'BPI' | 'LandBank' | 'MetroBank';
    account_no: string;
    cardno_4digits: number;
  };
};

interface LoanCollateralTabProps {
  collaterals: Collateral[];
}

export default function LoanCollateralTab({ collaterals }: LoanCollateralTabProps) {
  if (!collaterals.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No collaterals registered for this loan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {collaterals.map((collateral) => (
        <div
          key={collateral.id}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                  {collateral.type}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    collateral.status === 'Pledged'
                      ? 'bg-green-100 text-green-800'
                      : collateral.status === 'Released'
                      ? 'bg-blue-100 text-blue-800'
                      : collateral.status === 'Forfeited'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {collateral.status}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900">{collateral.description || 'No description'}</h4>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900">
                ₱
                {parseFloat(String(collateral.estimated_value || 0)).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              {collateral.appraisal_date && (
                <p className="text-sm text-gray-500">
                  Appraised: {new Date(collateral.appraisal_date).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>

          {collateral.type === 'Land' && collateral.land_details && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Title No:</span>
                  <p className="font-medium">{collateral.land_details.titleNo}</p>
                </div>
                <div>
                  <span className="text-gray-500">Lot No:</span>
                  <p className="font-medium">{collateral.land_details.lotNo}</p>
                </div>
                <div>
                  <span className="text-gray-500">Location:</span>
                  <p className="font-medium">{collateral.land_details.location}</p>
                </div>
                <div>
                  <span className="text-gray-500">Area Size:</span>
                  <p className="font-medium">{collateral.land_details.areaSize}</p>
                </div>
              </div>
            </div>
          )}

          {collateral.type === 'Vehicle' && collateral.vehicle_details && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Brand/Model:</span>
                  <p className="font-medium">
                    {collateral.vehicle_details.brand} {collateral.vehicle_details.model}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500">Year:</span>
                  <p className="font-medium">{collateral.vehicle_details.year_model ?? 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Plate No:</span>
                  <p className="font-medium">{collateral.vehicle_details.plate_no || 'N/A'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Type:</span>
                  <p className="font-medium">{collateral.vehicle_details.type}</p>
                </div>
                {collateral.vehicle_details.engine_no && (
                  <div>
                    <span className="text-gray-500">Engine No:</span>
                    <p className="font-medium">{collateral.vehicle_details.engine_no}</p>
                  </div>
                )}
                {collateral.vehicle_details.transmission_type && (
                  <div>
                    <span className="text-gray-500">Transmission:</span>
                    <p className="font-medium">{collateral.vehicle_details.transmission_type}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {collateral.type === 'ATM' && collateral.atm_details && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Bank:</span>
                  <p className="font-medium">{collateral.atm_details.bank_name}</p>
                </div>
                <div>
                  <span className="text-gray-500">Account No:</span>
                  <p className="font-medium">{collateral.atm_details.account_no}</p>
                </div>
                <div>
                  <span className="text-gray-500">Card (Last 4):</span>
                  <p className="font-medium">****{collateral.atm_details.cardno_4digits}</p>
                </div>
              </div>
            </div>
          )}

          {collateral.remarks && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Remarks:</span> {collateral.remarks}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

