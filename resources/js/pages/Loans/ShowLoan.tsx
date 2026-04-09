import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { route } from 'ziggy-js';
import LoanCommentsTab from '@/pages/borrowers/components/Tabs/LoanCommentsTab';
import { SquarePen, Trash2 } from 'lucide-react';
import React from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/dashboard' },
  { title: 'Loans', href: '/Loans' },
  { title: 'View Loan Applications', href: '/Loans/VLA' },
  { title: 'Loan Details', href: '#' },
];

type FileItem = {
  ID?: number;
  id?: number;
  file_name?: string;
  file_path?: string;
  description?: string | null;
};

const toArray = <T,>(value: T[] | T | null | undefined): T[] => {
  if (Array.isArray(value)) return value;
  if (value) return [value];
  return [];
};

const toStorageUrl = (filePath?: string) => {
  if (!filePath) return '#';
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) return filePath;
  return `/storage/${filePath.replace(/^\/+/, '').replace(/^public\//, '')}`;
};

const formatCurrency = (value?: number | string | null) => {
  if (value === null || value === undefined || value === '') return 'N/A';

  const numericValue = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(numericValue)) return 'N/A';

  return `PHP ${numericValue.toLocaleString()}`;
};

const formatDateValue = (value?: string | null) => {
  if (!value) return 'N/A';

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 'N/A' : parsed.toLocaleDateString();
};

const getFormError = (errors: Record<string, string | undefined>, key: string) => errors[key];

const FilesList = ({ files }: { files: FileItem[] }) => {
  if (!files.length) {
    return <p className="text-sm text-gray-500">No files uploaded.</p>;
  }

  return (
    <ul className="space-y-2">
      {files.map((file, index) => {
        const key = file.ID ?? file.id ?? `${file.file_path}-${index}`;
        return (
          <li key={key} className="text-sm">
            <a
              href={toStorageUrl(file.file_path)}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {file.file_name || `File ${index + 1}`}
            </a>
            {file.description && <p className="text-xs text-gray-500">{file.description}</p>}
          </li>
        );
      })}
    </ul>
  );
};


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
    released_amount?: number | string | null;
    released_date?: string | null;
    borrower: {
      ID: number;
      first_name: string;
      last_name: string;
      email?: string;
      contact_no?: string;
      land_line?: string;
      gender?: string;
      marital_status?: string;
      birth_date?: string;
      age?: number;
      home_ownership?: string;
      occupation?: string;
      city?: string;
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
        occupation?: string;
        monthly_income?: number;
      };
      borrowerAddress?: {
        address?: string;
        city?: string;
        province?: string;
      };
      files?: FileItem[];
    };
    collateral?: {
      ID: number;
      type: string;
      description?: string;
      remarks?: string;
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
      files?: FileItem[] | FileItem;
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
    loanComments?: Array<{
      ID: number;
      comment_text: string;
      commented_by: string;
      comment_date: string;
    }>;
  };
}

export default function ShowLoan({ loan }: LoanDetailsProps) {
  const [isBorrowerModalOpen, setIsBorrowerModalOpen] = React.useState(false);
  const [isCollateralModalOpen, setIsCollateralModalOpen] = React.useState(false);
  const borrowerFiles = toArray<FileItem>(loan.borrower?.files);
  const collateralFiles = toArray<FileItem>(loan.collateral?.files);
  const borrowerForm = useForm({
    email: loan.borrower.email || '',
    contact_no: loan.borrower.contact_no || '',
    land_line: loan.borrower.land_line || '',
    occupation: loan.borrower.borrowerEmployment?.occupation || '',
    address: loan.borrower.borrowerAddress?.address || '',
    city: loan.borrower.borrowerAddress?.city || '',
    files: [] as File[],
  });
  const collateralForm = useForm({
    estimated_value: loan.collateral?.estimated_value?.toString() || '',
    description: loan.collateral?.description || '',
    remarks: loan.collateral?.remarks || '',
    titleNo: loan.collateral?.landDetails?.titleNo || '',
    location: loan.collateral?.landDetails?.location || '',
    areaSize: loan.collateral?.landDetails?.areaSize || '',
    vehicle_type: loan.collateral?.vehicleDetails?.type || '',
    brand: loan.collateral?.vehicleDetails?.brand || '',
    model: loan.collateral?.vehicleDetails?.model || '',
    year_model: loan.collateral?.vehicleDetails?.year_model?.toString() || '',
    plate_no: loan.collateral?.vehicleDetails?.plate_no || '',
    engine_no: loan.collateral?.vehicleDetails?.engine_no || '',
    transmission_type: loan.collateral?.vehicleDetails?.transmission_type || '',
    fuel_type: loan.collateral?.vehicleDetails?.fuel_type || '',
    bank_name: loan.collateral?.atmDetails?.bank_name || '',
    account_no: loan.collateral?.atmDetails?.account_no || '',
    cardno_4digits: loan.collateral?.atmDetails?.cardno_4digits?.toString() || '',
    files: [] as File[],
  });
  const borrowerErrorBag = borrowerForm.errors as Record<string, string | undefined>;
  const collateralErrorBag = collateralForm.errors as Record<string, string | undefined>;

  const resetBorrowerForm = () => {
    borrowerForm.setData({
      email: loan.borrower.email || '',
      contact_no: loan.borrower.contact_no || '',
      land_line: loan.borrower.land_line || '',
      occupation: loan.borrower.borrowerEmployment?.occupation || '',
      address: loan.borrower.borrowerAddress?.address || '',
      city: loan.borrower.borrowerAddress?.city || '',
      files: [],
    });
    borrowerForm.clearErrors();
  };

  const resetCollateralForm = () => {
    collateralForm.setData({
      estimated_value: loan.collateral?.estimated_value?.toString() || '',
      description: loan.collateral?.description || '',
      remarks: loan.collateral?.remarks || '',
      titleNo: loan.collateral?.landDetails?.titleNo || '',
      location: loan.collateral?.landDetails?.location || '',
      areaSize: loan.collateral?.landDetails?.areaSize || '',
      vehicle_type: loan.collateral?.vehicleDetails?.type || '',
      brand: loan.collateral?.vehicleDetails?.brand || '',
      model: loan.collateral?.vehicleDetails?.model || '',
      year_model: loan.collateral?.vehicleDetails?.year_model?.toString() || '',
      plate_no: loan.collateral?.vehicleDetails?.plate_no || '',
      engine_no: loan.collateral?.vehicleDetails?.engine_no || '',
      transmission_type: loan.collateral?.vehicleDetails?.transmission_type || '',
      fuel_type: loan.collateral?.vehicleDetails?.fuel_type || '',
      bank_name: loan.collateral?.atmDetails?.bank_name || '',
      account_no: loan.collateral?.atmDetails?.account_no || '',
      cardno_4digits: loan.collateral?.atmDetails?.cardno_4digits?.toString() || '',
      files: [],
    });
    collateralForm.clearErrors();
  };

  const openBorrowerModal = () => {
    resetBorrowerForm();
    setIsBorrowerModalOpen(true);
  };

  const closeBorrowerModal = () => {
    setIsBorrowerModalOpen(false);
    resetBorrowerForm();
  };

  const openCollateralModal = () => {
    resetCollateralForm();
    setIsCollateralModalOpen(true);
  };

  const closeCollateralModal = () => {
    setIsCollateralModalOpen(false);
    resetCollateralForm();
  };

  const saveBorrowerChanges = () => {
    borrowerForm.transform((data) => ({
      ...data,
      _method: 'put',
    }));

    borrowerForm.post(route('loans.borrower.update', loan.ID), {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        resetBorrowerForm();
        setIsBorrowerModalOpen(false);
      },
      onFinish: () => borrowerForm.transform((data) => data),
    });
  };

  const deleteBorrowerFile = (fileId: number) => {
    if (!confirm('Delete this borrower file?')) return;

    router.delete(route('loans.borrower-files.destroy', { loan: loan.ID, file: fileId }));
  };

  const saveCollateralChanges = () => {
    collateralForm.transform((data) => ({
      estimated_value: data.estimated_value || null,
      description: data.description,
      remarks: data.remarks,
      land_details: loan.collateral?.landDetails ? {
        titleNo: data.titleNo || null,
        location: data.location,
        areaSize: data.areaSize,
      } : undefined,
      vehicle_details: loan.collateral?.vehicleDetails ? {
        type: data.vehicle_type || null,
        brand: data.brand,
        model: data.model,
        year_model: data.year_model || null,
        plate_no: data.plate_no,
        engine_no: data.engine_no,
        transmission_type: data.transmission_type || null,
        fuel_type: data.fuel_type,
      } : undefined,
      atm_details: loan.collateral?.atmDetails ? {
        bank_name: data.bank_name,
        account_no: data.account_no,
        cardno_4digits: data.cardno_4digits || null,
      } : undefined,
    }));

    collateralForm.put(route('loans.collateral.update', loan.ID), {
      preserveScroll: true,
      onSuccess: () => {
        resetCollateralForm();
        setIsCollateralModalOpen(false);
      },
      onFinish: () => collateralForm.transform((data) => data),
    });
  };

  const uploadCollateralFiles = () => {
    if (!collateralForm.data.files.length) return;

    collateralForm.transform((data) => ({
      files: data.files,
    }));

    collateralForm.post(route('loans.collateral-files.store', loan.ID), {
      preserveScroll: true,
      forceFormData: true,
      onSuccess: () => {
        collateralForm.setData('files', []);
      },
      onFinish: () => collateralForm.transform((data) => data),
    });
  };

  const deleteCollateralFile = (fileId: number) => {
    if (!confirm('Delete this collateral file?')) return;

    router.delete(route('loans.collateral-files.destroy', { loan: loan.ID, file: fileId }));
  };
  const MAX_TERM_MONTHS = 840;

  const handleApprove = () => {
    if (!Number.isInteger(loan.term_months) || loan.term_months < 1 || loan.term_months > MAX_TERM_MONTHS) {
      alert(`Cannot approve this loan because term is invalid (${loan.term_months} months). Allowed range is 1-${MAX_TERM_MONTHS} months.`);
      return;
    }

    const amount = parseFloat(releasedAmount);
    if (!releasedAmount || isNaN(amount) || amount <= 0) {
      alert('Please enter a valid released amount greater than 0.');
      return;
    }

    if (!releasedDate) {
      alert('Please select a releasing date.');
      return;
    }

    if (confirm(`Are you sure you want to approve this loan? Disbursement and schedule generation will be handled in the Disbursements module.\n\nPrincipal: ₱${principalAmount.toLocaleString()}\nReleased Amount: ₱${amount.toLocaleString()}\nReleasing Date: ${new Date(releasedDate).toLocaleDateString()}\n\nThis will generate amortization schedules.`)) {
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
                <Button
                  onClick={handleApprove}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  Approve Loan
                </Button>
                <Button
                  onClick={handleReject}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Reject
                </Button>
              </>
            )}
            {loan.status === 'Active' && (
              <Button
                onClick={() => router.visit(`/disbursements?loan_id=${loan.ID}`)}
                className="bg-[#FABF24] text-black hover:bg-[#f8b80f]"
              >
                Disburse Loan
              </Button>
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
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-700">Borrower Information</h2>
            <Button
              type="button"
              variant="outline"
              onClick={openBorrowerModal}
              className="gap-2"
            >
              <SquarePen className="h-4 w-4" />
              Edit Borrower
            </Button>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Identity</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{loan.borrower.first_name} {loan.borrower.last_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gender</p>
                  <p className="font-medium">{loan.borrower.gender || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Age</p>
                  <p className="font-medium">{loan.borrower.age ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Birth Date</p>
                  <p className="font-medium">{loan.borrower.birth_date ? new Date(loan.borrower.birth_date).toLocaleDateString() : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Marital Status</p>
                  <p className="font-medium">{loan.borrower.marital_status || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Home Ownership</p>
                  <p className="font-medium">{loan.borrower.home_ownership || 'N/A'}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Contact</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{loan.borrower.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Contact Number</p>
                  <p className="font-medium">{loan.borrower.contact_no || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Landline</p>
                  <p className="font-medium">{loan.borrower.land_line || 'N/A'}</p>
                </div>
                <div className="md:col-span-3">
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">
                    {(loan.borrower.borrowerAddress?.address || loan.borrower.address)
                      ? [loan.borrower.borrowerAddress?.address || loan.borrower.address, loan.borrower.borrowerAddress?.city || loan.borrower.city].filter(Boolean).join(', ')
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Employment</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-600">Occupation</p>
                  <p className="font-medium">{loan.borrower.borrowerEmployment?.occupation || loan.borrower.occupation || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Position</p>
                  <p className="font-medium">{loan.borrower.borrowerEmployment?.position || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Income</p>
                  <p className="font-medium">{loan.borrower.borrowerEmployment?.monthly_income ? `PHP ${loan.borrower.borrowerEmployment.monthly_income.toLocaleString()}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Income Source</p>
                  <p className="font-medium">{(loan.borrower.borrowerEmployment as any)?.income_source || 'N/A'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Agency Address</p>
                  <p className="font-medium">{(loan.borrower.borrowerEmployment as any)?.agency_address || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 border-t pt-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-700">Borrower Files</h3>
              <span className="text-xs text-gray-500">Managed from borrower record for this loan.</span>
            </div>
            <FilesList files={borrowerFiles} />
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
              <p className="font-medium">{formatCurrency(loan.principal_amount)}</p>
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
              <p className="font-mediusm">{loan.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Balance Remaining</p>
              <p className="font-medium">{formatCurrency(loan.balance_remaining)}</p>
            </div>
            {loan.released_amount !== null && loan.released_amount !== undefined && loan.released_amount !== '' && (
              <div>
                <p className="text-sm text-gray-600">Released Amount</p>
                <p className="font-medium">{formatCurrency(loan.released_amount)}</p>
              </div>
            )}
            {loan.released_date && (
              <div>
                <p className="text-sm text-gray-600">Released Date</p>
                <p className="font-medium">{formatDateValue(loan.released_date)}</p>
              </div>
            )}
            {loan.start_date && (
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium">{formatDateValue(loan.start_date)}</p>
              </div>
            )}
            {loan.end_date && (
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-medium">{formatDateValue(loan.end_date)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Collateral Information */}
        {loan.collateral && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-700">Collateral Information</h2>
              <Button
              type="button"
              variant="outline"
              onClick={openCollateralModal}
              className="gap-2"
            >
                <SquarePen className="h-4 w-4" />
                Edit Collateral
              </Button>
            </div>
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
              <div>
                <p className="text-sm text-gray-600">Description</p>
                <p className="font-medium">{loan.collateral.description || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Remarks</p>
                <p className="font-medium">{loan.collateral.remarks || 'N/A'}</p>
              </div>
            </div>
            <div className="mt-5 border-t pt-4">
              <h3 className="text-base font-semibold text-gray-700 mb-2">Collateral Files</h3>
              <FilesList files={collateralFiles} />
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

        {/* Loan Comments Section */}
        <div className="bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold text-gray-700 p-6 pb-4">Loan Comments</h2>
          <LoanCommentsTab
            comments={loan.loanComments || []}
            loanId={loan.ID}
            canDelete={true}
          />
        </div>

        {isBorrowerModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b p-6">
                <h3 className="text-xl font-semibold text-gray-800">Edit Borrower Information</h3>
                <button onClick={closeBorrowerModal} className="text-gray-500 hover:text-gray-700">Close</button>
              </div>
              <div className="space-y-6 p-6">
                {borrowerForm.recentlySuccessful && (
                  <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                    Borrower information saved successfully.
                  </div>
                )}
                {getFormError(borrowerErrorBag, 'error') && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {getFormError(borrowerErrorBag, 'error')}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">Email</label>
                    <input className="w-full rounded-md border px-3 py-2" value={borrowerForm.data.email} onChange={(e) => borrowerForm.setData('email', e.target.value)} />
                    {borrowerForm.errors.email && <p className="mt-1 text-xs text-red-600">{borrowerForm.errors.email}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">Contact Number</label>
                    <input className="w-full rounded-md border px-3 py-2" value={borrowerForm.data.contact_no} onChange={(e) => borrowerForm.setData('contact_no', e.target.value)} />
                    {borrowerForm.errors.contact_no && <p className="mt-1 text-xs text-red-600">{borrowerForm.errors.contact_no}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">Landline</label>
                    <input className="w-full rounded-md border px-3 py-2" value={borrowerForm.data.land_line} onChange={(e) => borrowerForm.setData('land_line', e.target.value)} />
                    {borrowerForm.errors.land_line && <p className="mt-1 text-xs text-red-600">{borrowerForm.errors.land_line}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">Occupation</label>
                    <input className="w-full rounded-md border px-3 py-2" value={borrowerForm.data.occupation} onChange={(e) => borrowerForm.setData('occupation', e.target.value)} />
                    {borrowerForm.errors.occupation && <p className="mt-1 text-xs text-red-600">{borrowerForm.errors.occupation}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm text-gray-600">Address</label>
                    <input className="w-full rounded-md border px-3 py-2" value={borrowerForm.data.address} onChange={(e) => borrowerForm.setData('address', e.target.value)} />
                    {borrowerForm.errors.address && <p className="mt-1 text-xs text-red-600">{borrowerForm.errors.address}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">City</label>
                    <input className="w-full rounded-md border px-3 py-2" value={borrowerForm.data.city} onChange={(e) => borrowerForm.setData('city', e.target.value)} />
                    {borrowerForm.errors.city && <p className="mt-1 text-xs text-red-600">{borrowerForm.errors.city}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">Upload Borrower Files</label>
                    <input type="file" multiple className="w-full rounded-md border px-3 py-2" onChange={(e) => borrowerForm.setData('files', Array.from(e.target.files || []))} />
                    {borrowerForm.errors.files && <p className="mt-1 text-xs text-red-600">{borrowerForm.errors.files}</p>}
                  </div>
                </div>
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-gray-700">Existing Borrower Files</h4>
                  <div className="space-y-2">
                    {borrowerFiles.length === 0 && <p className="text-sm text-gray-500">No borrower files uploaded.</p>}
                    {borrowerFiles.map((file, index) => {
                      const fileId = file.ID ?? file.id;
                      return (
                        <div key={fileId ?? index} className="flex items-center justify-between rounded-md border px-3 py-2">
                          <a href={toStorageUrl(file.file_path)} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                            {file.file_name || `File ${index + 1}`}
                          </a>
                          {fileId && (
                            <button type="button" onClick={() => deleteBorrowerFile(fileId)} className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t bg-gray-50 p-6">
                <Button type="button" variant="outline" onClick={closeBorrowerModal}>Cancel</Button>
                <Button type="button" disabled={borrowerForm.processing} onClick={saveBorrowerChanges} className="bg-[#FABF24] text-black hover:bg-[#f8b80f]">
                  {borrowerForm.processing ? 'Saving...' : 'Save Borrower Changes'}
                </Button>
              </div>
            </div>
          </div>
        )}

        {isCollateralModalOpen && loan.collateral && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b p-6">
                <h3 className="text-xl font-semibold text-gray-800">Edit Collateral Information</h3>
                <button onClick={closeCollateralModal} className="text-gray-500 hover:text-gray-700">Close</button>
              </div>
              <div className="space-y-6 p-6">
                {collateralForm.recentlySuccessful && (
                  <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                    Collateral information saved successfully.
                  </div>
                )}
                {getFormError(collateralErrorBag, 'error') && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {getFormError(collateralErrorBag, 'error')}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">Estimated Value</label>
                    <input className="w-full rounded-md border px-3 py-2" value={collateralForm.data.estimated_value} onChange={(e) => collateralForm.setData('estimated_value', e.target.value)} />
                    {collateralForm.errors.estimated_value && <p className="mt-1 text-xs text-red-600">{collateralForm.errors.estimated_value}</p>}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm text-gray-600">Description</label>
                    <input className="w-full rounded-md border px-3 py-2" value={collateralForm.data.description} onChange={(e) => collateralForm.setData('description', e.target.value)} />
                    {collateralForm.errors.description && <p className="mt-1 text-xs text-red-600">{collateralForm.errors.description}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm text-gray-600">Remarks</label>
                    <input className="w-full rounded-md border px-3 py-2" value={collateralForm.data.remarks} onChange={(e) => collateralForm.setData('remarks', e.target.value)} />
                    {collateralForm.errors.remarks && <p className="mt-1 text-xs text-red-600">{collateralForm.errors.remarks}</p>}
                  </div>

                  {loan.collateral.landDetails && (
                    <>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Title Number</label>
                        <input className="w-full rounded-md border px-3 py-2" value={collateralForm.data.titleNo} onChange={(e) => collateralForm.setData('titleNo', e.target.value)} />
                        {getFormError(collateralErrorBag, 'land_details.titleNo') && <p className="mt-1 text-xs text-red-600">{getFormError(collateralErrorBag, 'land_details.titleNo')}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Location</label>
                        <input className="w-full rounded-md border px-3 py-2" value={collateralForm.data.location} onChange={(e) => collateralForm.setData('location', e.target.value)} />
                        {getFormError(collateralErrorBag, 'land_details.location') && <p className="mt-1 text-xs text-red-600">{getFormError(collateralErrorBag, 'land_details.location')}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Area Size</label>
                        <input className="w-full rounded-md border px-3 py-2" value={collateralForm.data.areaSize} onChange={(e) => collateralForm.setData('areaSize', e.target.value)} />
                        {getFormError(collateralErrorBag, 'land_details.areaSize') && <p className="mt-1 text-xs text-red-600">{getFormError(collateralErrorBag, 'land_details.areaSize')}</p>}
                      </div>
                    </>
                  )}

                  {loan.collateral.vehicleDetails && (
                    <>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Vehicle Type</label>
                        <input className="w-full rounded-md border px-3 py-2" value={collateralForm.data.vehicle_type} onChange={(e) => collateralForm.setData('vehicle_type', e.target.value)} />
                        {getFormError(collateralErrorBag, 'vehicle_details.type') && <p className="mt-1 text-xs text-red-600">{getFormError(collateralErrorBag, 'vehicle_details.type')}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Brand</label>
                        <input className="w-full rounded-md border px-3 py-2" value={collateralForm.data.brand} onChange={(e) => collateralForm.setData('brand', e.target.value)} />
                        {getFormError(collateralErrorBag, 'vehicle_details.brand') && <p className="mt-1 text-xs text-red-600">{getFormError(collateralErrorBag, 'vehicle_details.brand')}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Model</label>
                        <input className="w-full rounded-md border px-3 py-2" value={collateralForm.data.model} onChange={(e) => collateralForm.setData('model', e.target.value)} />
                        {getFormError(collateralErrorBag, 'vehicle_details.model') && <p className="mt-1 text-xs text-red-600">{getFormError(collateralErrorBag, 'vehicle_details.model')}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Year Model</label>
                        <input className="w-full rounded-md border px-3 py-2" value={collateralForm.data.year_model} onChange={(e) => collateralForm.setData('year_model', e.target.value)} />
                        {getFormError(collateralErrorBag, 'vehicle_details.year_model') && <p className="mt-1 text-xs text-red-600">{getFormError(collateralErrorBag, 'vehicle_details.year_model')}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Plate Number</label>
                        <input className="w-full rounded-md border px-3 py-2" value={collateralForm.data.plate_no} onChange={(e) => collateralForm.setData('plate_no', e.target.value)} />
                        {getFormError(collateralErrorBag, 'vehicle_details.plate_no') && <p className="mt-1 text-xs text-red-600">{getFormError(collateralErrorBag, 'vehicle_details.plate_no')}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Engine Number</label>
                        <input className="w-full rounded-md border px-3 py-2" value={collateralForm.data.engine_no} onChange={(e) => collateralForm.setData('engine_no', e.target.value)} />
                        {getFormError(collateralErrorBag, 'vehicle_details.engine_no') && <p className="mt-1 text-xs text-red-600">{getFormError(collateralErrorBag, 'vehicle_details.engine_no')}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Transmission Type</label>
                        <input className="w-full rounded-md border px-3 py-2" value={collateralForm.data.transmission_type} onChange={(e) => collateralForm.setData('transmission_type', e.target.value)} />
                        {getFormError(collateralErrorBag, 'vehicle_details.transmission_type') && <p className="mt-1 text-xs text-red-600">{getFormError(collateralErrorBag, 'vehicle_details.transmission_type')}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Fuel Type</label>
                        <input className="w-full rounded-md border px-3 py-2" value={collateralForm.data.fuel_type} onChange={(e) => collateralForm.setData('fuel_type', e.target.value)} />
                        {getFormError(collateralErrorBag, 'vehicle_details.fuel_type') && <p className="mt-1 text-xs text-red-600">{getFormError(collateralErrorBag, 'vehicle_details.fuel_type')}</p>}
                      </div>
                    </>
                  )}

                  {loan.collateral.atmDetails && (
                    <>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Bank Name</label>
                        <input className="w-full rounded-md border px-3 py-2" value={collateralForm.data.bank_name} onChange={(e) => collateralForm.setData('bank_name', e.target.value)} />
                        {getFormError(collateralErrorBag, 'atm_details.bank_name') && <p className="mt-1 text-xs text-red-600">{getFormError(collateralErrorBag, 'atm_details.bank_name')}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Account Number</label>
                        <input className="w-full rounded-md border px-3 py-2" value={collateralForm.data.account_no} onChange={(e) => collateralForm.setData('account_no', e.target.value)} />
                        {getFormError(collateralErrorBag, 'atm_details.account_no') && <p className="mt-1 text-xs text-red-600">{getFormError(collateralErrorBag, 'atm_details.account_no')}</p>}
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-gray-600">Card Last 4 Digits</label>
                        <input className="w-full rounded-md border px-3 py-2" value={collateralForm.data.cardno_4digits} onChange={(e) => collateralForm.setData('cardno_4digits', e.target.value)} />
                        {getFormError(collateralErrorBag, 'atm_details.cardno_4digits') && <p className="mt-1 text-xs text-red-600">{getFormError(collateralErrorBag, 'atm_details.cardno_4digits')}</p>}
                      </div>
                    </>
                  )}
                </div>
                <div className="border-t pt-4">
                  <h4 className="mb-3 text-sm font-semibold text-gray-700">Collateral Files</h4>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] md:items-end">
                    <div>
                      <label className="mb-1 block text-sm text-gray-600">Upload Collateral Files</label>
                      <input
                        type="file"
                        multiple
                        className="w-full rounded-md border px-3 py-2"
                        onChange={(e) => collateralForm.setData('files', Array.from(e.target.files || []))}
                      />
                      {collateralForm.errors.files && <p className="mt-1 text-xs text-red-600">{collateralForm.errors.files}</p>}
                    </div>
                    <Button type="button" variant="outline" disabled={collateralForm.processing} onClick={uploadCollateralFiles}>
                      {collateralForm.processing ? 'Uploading...' : 'Upload Files'}
                    </Button>
                  </div>
                  <div className="mt-4 space-y-2">
                    {collateralFiles.length === 0 && <p className="text-sm text-gray-500">No collateral files uploaded.</p>}
                    {collateralFiles.map((file, index) => {
                      const fileId = file.ID ?? file.id;
                      return (
                        <div key={fileId ?? index} className="flex items-center justify-between rounded-md border px-3 py-2">
                          <a href={toStorageUrl(file.file_path)} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">
                            {file.file_name || `Collateral File ${index + 1}`}
                          </a>
                          {fileId && (
                            <button type="button" onClick={() => deleteCollateralFile(fileId)} className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 border-t bg-gray-50 p-6">
                <Button type="button" variant="outline" onClick={closeCollateralModal}>Cancel</Button>
                <Button type="button" disabled={collateralForm.processing} onClick={saveCollateralChanges} className="bg-[#FABF24] text-black hover:bg-[#f8b80f]">
                  {collateralForm.processing ? 'Saving...' : 'Save Collateral Changes'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}