import React from "react";
import { Head } from "@inertiajs/react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import show from "../users/show";

type Loan = {
  loanNo: string;
  released: string;
  maturity: string;
  principal: number;
  interest: string | number;
  interestType: string;
  due: number;
  balance: number;
  status: string;
};

type Collateral = {
  id: number;
  type: "Land" | "Vehicle" | "ATM";
  estimated_value: number;
  appraisal_date?: string;
  status: "Pledged" | "Released" | "Forfeited" | "Pending";
  description?: string;
  remarks?: string;
  land_details?: {
    titleNo: number;
    lotNo: number;
    location: string;
    areaSize: string;
  };
  vehicle_details?: {
    type: "Car" | "Motorcycle" | "Truck";
    brand: string;
    model: string;
    year_model?: number;
    plate_no?: string;
    engine_no?: string;
    transmission_type?: "Manual" | "Automatic";
    fuel_type?: string;
  };
  atm_details?: {
    bank_name: "BDO" | "BPI" | "LandBank" | "MetroBank";
    account_no: string;
    cardno_4digits: number;
  };
};

export default function MyLoanApplicationSummary({
  authUser,
  pendingLoan,
  collaterals = [],
}: {
  authUser: any;
  pendingLoan: Loan | null;
  collaterals: Collateral[];
}) {
  if (!authUser) {
    return (
      <DashboardLayout>
        <Head title="Loan Application Summary" />
        <div className="m-4">
          <p className="text-sm text-gray-600">No borrower profile found.</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!pendingLoan) {
    return (
      <DashboardLayout>
        <Head title="Loan Application Summary" />
        <div className="m-4">
          <p className="text-sm text-gray-600">No pending loan application found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Head title="Loan Application Summary" />

      <div className="space-y-1.5 m-3">
        <p className="text-xl md:text-2xl font-semibold text-gray-900">Loan Application Summary</p>
        <p className="text-sm text-gray-600 max-w-xl">
          Your application is currently pending review. Here is a summary of your submission.
        </p>
      </div>

      <div className="m-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Applicant</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Name</p>
            <p className="font-medium text-gray-900">{authUser.name ?? "-"}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium text-gray-900">{authUser.email ?? "-"}</p>
          </div>
          <div>
            <p className="text-gray-500">Mobile</p>
            <p className="font-medium text-gray-900">{authUser.mobile ?? "-"}</p>
          </div>
          <div>
            <p className="text-gray-500">Address</p>
            <p className="font-medium text-gray-900">{authUser.address ?? "-"}</p>
          </div>
        </div>
      </div>

      <div className="m-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Loan Details</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Loan No.</p>
            <p className="font-medium text-gray-900">{pendingLoan.loanNo}</p>
          </div>
          <div>
            <p className="text-gray-500">Status</p>
            <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 uppercase">
              {pendingLoan.status}
            </span>
          </div>
          <div>
            <p className="text-gray-500">Principal</p>
            <p className="font-medium text-gray-900">PHP {Number(pendingLoan.principal).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-gray-500">Interest Rate</p>
            <p className="font-medium text-gray-900">{pendingLoan.interest}%</p>
          </div>
          <div>
            <p className="text-gray-500">Interest Type</p>
            <p className="font-medium text-gray-900">{pendingLoan.interestType || "-"}</p>
          </div>
          <div>
            <p className="text-gray-500">Balance</p>
            <p className="font-medium text-gray-900">PHP {Number(pendingLoan.balance).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="m-4 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Collateral</h2>
        {collaterals.length === 0 ? (
          <p className="text-sm text-gray-600">No collateral details provided.</p>
        ) : (
          <div className="space-y-4 text-sm">
            {collaterals.map((collateral) => (
              <div key={collateral.id} className="border rounded-md p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{collateral.type}</p>
                  <span className="text-xs font-semibold uppercase text-gray-600">
                    {collateral.status}
                  </span>
                </div>
                <div className="mt-2 grid md:grid-cols-2 gap-3">
                  <div>
                    {/* ATM */}
                    {collateral.type === "ATM" && (
                      <>
                        <p className="text-gray-500">Bank</p>
                        <p className="font-medium text-gray-900">
                          {collateral.atm_details?.bank_name ?? "-"}
                        </p>

                        <p className="text-gray-500">Account No.</p>
                        <p className="font-medium text-gray-900">
                          {collateral.atm_details?.account_no ?? "-"}
                        </p>

                        <p className="text-gray-500">Card No. (Last 4 digits)</p>
                        <p className="font-medium text-gray-900">
                          {collateral.atm_details?.cardno_4digits ?? "-"}
                        </p>
                      </>
                    )}

                    {/* Vehicle */}
                    {collateral.type === "Vehicle" && (
                      <>
                        <p className="text-gray-500">Brand & Model</p>
                        <p className="font-medium text-gray-900">
                          {`${collateral.vehicle_details?.brand ?? "-"} ${
                            collateral.vehicle_details?.model ?? ""
                          }`}
                        </p>
                      </>
                    )}

                    {/* Land */}
                    {collateral.type === "Land" && (
                      <>
                        <p className="text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">
                          {collateral.land_details?.location ?? "-"}
                        </p>
                      </>
                    )}

                    {/* Fallback */}
                    {!["ATM", "Vehicle", "Land"].includes(collateral.type) && (
                      <>
                        <p className="text-gray-500">Description</p>
                        <p className="font-medium text-gray-900">
                          {collateral.description ?? "-"}
                        </p>
                      </>
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">
                      
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Description</p>
                    <p className="font-medium text-gray-900">{collateral.description ?? "-"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
