import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Loans', href: '/Loans' },
  { title: 'View Loan Applications', href: '/Loans/VLA' },
  { title: 'Loan Details', href: '#' },
];

interface LoanDetailsProps {
  loan: {
    ID: number;
    principal_amount: number;
    interest_rate: number;
    interest_type: string;
    loan_type: string;
    term_months: number;
    repayment_frequency: string;
    start_date?: string;
    end_date?: string;
    status: string;
    balance_remaining: number;
    released_amount?: number;
    released_date?: string;
    borrower: {
      ID: number;
      first_name: string;
      last_name: string;
      email?: string;
      contact_no?: string;
      address?: string;
      coBorrowers?: Array<{
        ID: number;
        first_name: string;
        last_name: string;
        address?: string;
        email?: string;
        contact_no?: string;
        birth_date?: string;
        marital_status?: string;
        occupation?: string;
      }>;
      spouse?: {
        ID: number;
        full_name?: string;
        mobile_number?: string;
        agency_address?: string;
        occupation?: string;
      };
      borrowerEmployment?: {
        employer_name?: string;
        position?: string;
        monthly_income?: number;
      };
      borrowerAddress?: {
        address?: string;
        city?: string;
        province?: string;
      };
    };
    collateral?: {
      ID: number;
      type: string;
      description?: string;
      estimated_value?: number;
      landDetails?: {
        titleNo?: string;
        lotNo?: number;
        location?: string;
        areaSize?: string;
      };
      vehicleDetails?: {
        type?: string;
        brand?: string;
        model?: string;
        year_model?: number;
        plate_no?: string;
        engine_no?: string;
        transmission_type?: string;
        fuel_type?: string;
      };
      atmDetails?: {
        bank_name?: string;
        account_no?: string;
        cardno_4digits?: number;
      };
    };
    amortizationSchedules?: Array<{
      ID: number;
      installment_no: number;
      installment_amount: number;
      interest_amount: number;
      due_date: string;
      amount_paid: number;
      penalty_amount: number;
      status: string;
    }>;
  };
}

export default function ShowLoan({ loan }: LoanDetailsProps) {
  // Fee percentages
  const PROCESSING_FEE_RATE = 0.03; // 3%
  const INSURANCE_FEE_RATE = 0.02; // 2%
  const NOTARY_FEE_RATE = 0.01; // 1%
  const SAVINGS_CONTRIBUTION_RATE = 0.02; // 2%
  const TOTAL_FEE_RATE = PROCESSING_FEE_RATE + INSURANCE_FEE_RATE + NOTARY_FEE_RATE + SAVINGS_CONTRIBUTION_RATE; // 8%

  // Calculate fees and released amount
  const principalAmount = loan.principal_amount;
  const processingFee = principalAmount * PROCESSING_FEE_RATE;
  const insuranceFee = principalAmount * INSURANCE_FEE_RATE;
  const notaryFee = principalAmount * NOTARY_FEE_RATE;
  const savingsContribution = principalAmount * SAVINGS_CONTRIBUTION_RATE;
  const totalFees = processingFee + insuranceFee + notaryFee + savingsContribution;
  const computedReleasedAmount = principalAmount - totalFees;

  const [releasedAmount, setReleasedAmount] = useState<string>(computedReleasedAmount.toFixed(2));
  const [releasedDate, setReleasedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showReleaseForm, setShowReleaseForm] = useState(false);

  const handleApprove = () => {
    const amount = parseFloat(releasedAmount);
    if (!releasedAmount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid released amount greater than 0.');
      return;
    }

    if (!releasedDate) {
      alert('Please select a releasing date.');
      return;
    }

    if (confirm(`Are you sure you want to approve this loan?\n\nPrincipal: ₱${principalAmount.toLocaleString()}\nReleased Amount: ₱${amount.toLocaleString()}\nReleasing Date: ${new Date(releasedDate).toLocaleDateString()}\n\nThis will generate amortization schedules.`)) {
      router.post(route('loans.approve', loan.ID), {
        released_amount: amount,
        released_date: releasedDate,
      }, {
        onSuccess: () => {
          router.visit(route('loans.view-approved'));
        },
        onError: (errors) => {
          console.error('Approval failed:', errors);
        },
      });
    }
  };

  const handleReject = () => {
    if (confirm('Are you sure you want to reject this loan?')) {
      router.post(route('loans.reject', loan.ID), {}, {
        onSuccess: () => {
          router.visit(route('loans.view')); // Go back to pending loans
        },
      });
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Loan Details" />
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-gray-800">Loan Details</h1>
          <div className="flex gap-2">
            {loan.status === 'Pending' && (
              <>
                {!showReleaseForm ? (
                  <Button
                    onClick={() => setShowReleaseForm(true)}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    Approve Loan
                  </Button>
                ) : (
                  <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg border">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-700">Loan Releasing Breakdown</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <p className="text-gray-600">Principal Amount:</p>
                          <p className="font-medium">₱{principalAmount.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Processing Fee (3%):</p>
                          <p className="font-medium">₱{processingFee.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Insurance (2%):</p>
                          <p className="font-medium">₱{insuranceFee.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Notary Fee (1%):</p>
                          <p className="font-medium">₱{notaryFee.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Savings Contribution (2%):</p>
                          <p className="font-medium">₱{savingsContribution.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total Fees (8%):</p>
                          <p className="font-medium">₱{totalFees.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t">
                        <div className="flex items-center gap-2 mb-3">
                          <label className="text-sm font-medium text-gray-700">Released Amount:</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={releasedAmount}
                            readOnly
                            className="px-4 py-2 border rounded shadow-sm w-48 bg-gray-100 cursor-not-allowed"
                          />
                          <span className="text-sm text-gray-500">(Computed: ₱{computedReleasedAmount.toFixed(2)})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <label className="text-sm font-medium text-gray-700">Releasing Date:</label>
                          <input
                            type="date"
                            value={releasedDate}
                            onChange={(e) => setReleasedDate(e.target.value)}
                            className="px-4 py-2 border rounded shadow-sm w-48"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleApprove}
                        className="bg-green-600 text-white hover:bg-green-700"
                      >
                        Confirm Approval
                      </Button>
                      <Button
                        onClick={() => {
                          setShowReleaseForm(false);
                          setReleasedAmount(computedReleasedAmount.toFixed(2));
                          setReleasedDate(new Date().toISOString().split('T')[0]);
                        }}
                        className="bg-gray-600 text-white hover:bg-gray-700"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                <Button
                  onClick={handleReject}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Reject
                </Button>
              </>
            )}
            <Button
              onClick={() => {
                // If loan is Active, go to View All Loans (VAL), otherwise go to View Loan Applications (VLA)
                if (loan.status === 'Active') {
                  router.visit(route('loans.view-all'));
                } else {
                  router.visit(route('loans.view'));
                }
              }}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              Back
            </Button>
          </div>
        </div>

        {/* Borrower Information */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Borrower Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{loan.borrower.first_name} {loan.borrower.last_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{loan.borrower.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Contact Number</p>
              <p className="font-medium">{loan.borrower.contact_no || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="font-medium">
                {loan.borrower.borrowerAddress?.address 
                  ? `${loan.borrower.borrowerAddress.address}, ${loan.borrower.borrowerAddress.city || ''}`.trim()
                  : 'N/A'}
              </p>
            </div>
            {loan.borrower.borrowerEmployment && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Employer</p>
                  <p className="font-medium">{loan.borrower.borrowerEmployment.employer_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Position</p>
                  <p className="font-medium">{loan.borrower.borrowerEmployment.position || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Income</p>
                  <p className="font-medium">₱{loan.borrower.borrowerEmployment.monthly_income?.toLocaleString() || 'N/A'}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Loan Details */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Loan Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Loan Number</p>
              <p className="font-medium">{loan.ID}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Loan Type</p>
              <p className="font-medium">{loan.loan_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Principal Amount</p>
              <p className="font-medium">₱{loan.principal_amount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Interest Rate</p>
              <p className="font-medium">{loan.interest_rate}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Interest Type</p>
              <p className="font-medium">{loan.interest_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Term</p>
              <p className="font-medium">{loan.term_months} months</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Repayment Frequency</p>
              <p className="font-medium">{loan.repayment_frequency}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium">{loan.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Balance Remaining</p>
              <p className="font-medium">₱{loan.balance_remaining.toLocaleString()}</p>
            </div>
            {loan.released_amount && (
              <div>
                <p className="text-sm text-gray-600">Released Amount</p>
                <p className="font-medium">₱{loan.released_amount.toLocaleString()}</p>
              </div>
            )}
            {loan.released_date && (
              <div>
                <p className="text-sm text-gray-600">Released Date</p>
                <p className="font-medium">{new Date(loan.released_date).toLocaleDateString()}</p>
              </div>
            )}
            {loan.start_date && (
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium">{new Date(loan.start_date).toLocaleDateString()}</p>
              </div>
            )}
            {loan.end_date && (
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-medium">{new Date(loan.end_date).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Collateral Information */}
        {loan.collateral && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Collateral Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium">{loan.collateral.type}</p>
              </div>
              {loan.collateral.estimated_value && (
                <div>
                  <p className="text-sm text-gray-600">Estimated Value</p>
                  <p className="font-medium">₱{loan.collateral.estimated_value.toLocaleString()}</p>
                </div>
              )}
              {loan.collateral.landDetails && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Title Number</p>
                    <p className="font-medium">{loan.collateral.landDetails.titleNo || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-medium">{loan.collateral.landDetails.location || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Area Size</p>
                    <p className="font-medium">{loan.collateral.landDetails.areaSize || 'N/A'}</p>
                  </div>
                </>
              )}
              {loan.collateral.vehicleDetails && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Vehicle Type</p>
                    <p className="font-medium">{loan.collateral.vehicleDetails.type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Brand</p>
                    <p className="font-medium">{loan.collateral.vehicleDetails.brand || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Model</p>
                    <p className="font-medium">{loan.collateral.vehicleDetails.model || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Year Model</p>
                    <p className="font-medium">{loan.collateral.vehicleDetails.year_model || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Plate Number</p>
                    <p className="font-medium">{loan.collateral.vehicleDetails.plate_no || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Engine Number</p>
                    <p className="font-medium">{loan.collateral.vehicleDetails.engine_no || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Transmission Type</p>
                    <p className="font-medium">{loan.collateral.vehicleDetails.transmission_type || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fuel Type</p>
                    <p className="font-medium">{loan.collateral.vehicleDetails.fuel_type || 'N/A'}</p>
                  </div>
                </>
              )}
              {loan.collateral.atmDetails && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Bank Name</p>
                    <p className="font-medium">{loan.collateral.atmDetails.bank_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Number</p>
                    <p className="font-medium">{loan.collateral.atmDetails.account_no || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Card Last 4 Digits</p>
                    <p className="font-medium">{loan.collateral.atmDetails.cardno_4digits || 'N/A'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Co-Borrowers */}
        {loan.borrower.coBorrowers && loan.borrower.coBorrowers.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Co-Borrowers</h2>
            <div className="space-y-4">
              {loan.borrower.coBorrowers.map((coBorrower, index) => (
                <div key={coBorrower.ID} className="border-b pb-4 last:border-none">
                  <h3 className="font-medium mb-2">Co-Borrower {index + 1}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{coBorrower.first_name} {coBorrower.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{coBorrower.email || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="font-medium">{coBorrower.contact_no || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">{coBorrower.address || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Occupation</p>
                      <p className="font-medium">{coBorrower.occupation || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Marital Status</p>
                      <p className="font-medium">{coBorrower.marital_status || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Spouse Information */}
        {loan.borrower.spouse && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Spouse Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{loan.borrower.spouse.full_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mobile Number</p>
                <p className="font-medium">{loan.borrower.spouse.mobile_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Occupation</p>
                <p className="font-medium">{loan.borrower.spouse.occupation || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Agency Address</p>
                <p className="font-medium">{loan.borrower.spouse.agency_address || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

        {/* Amortization Schedule */}
        {loan.amortizationSchedules && loan.amortizationSchedules.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Amortization Schedule</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Due Date</th>
                    <th className="px-4 py-2 text-right">Installment</th>
                    <th className="px-4 py-2 text-right">Interest</th>
                    <th className="px-4 py-2 text-right">Penalty</th>
                    <th className="px-4 py-2 text-right">Amount Paid</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loan.amortizationSchedules.map((schedule) => (
                    <tr key={schedule.ID} className="border-b">
                      <td className="px-4 py-2">{schedule.installment_no}</td>
                      <td className="px-4 py-2">
                        {schedule.due_date ? new Date(schedule.due_date).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-4 py-2 text-right">₱{schedule.installment_amount.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">₱{schedule.interest_amount.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">₱{schedule.penalty_amount.toLocaleString()}</td>
                      <td className="px-4 py-2 text-right">₱{schedule.amount_paid.toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          schedule.status === 'Paid' 
                            ? 'bg-green-100 text-green-800' 
                            : schedule.status === 'Overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {schedule.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}