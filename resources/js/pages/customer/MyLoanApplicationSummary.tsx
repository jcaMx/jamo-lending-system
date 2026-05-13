import React, { useEffect, useMemo, useState } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Edit2 } from "lucide-react";

type Loan = {
  id: number;
  loanNo: string;
  released: string;
  maturity: string;
  principal: number;
  interest: string | number;
  interestType: string;
  loan_type?: string;
  due: number;
  balance: number;
  status: string;
};

type LoanProductOption = {
  id: number;
  name: string;
};

type UploadedFile = {
  id?: number | null;
  file_name?: string | null;
  file_path?: string | null;
  description?: string | null;
  document_type_name?: string | null;
  uploaded_at?: string | null;
};

type CoBorrower = {
  id: number;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  mobile?: string | null;
  birth_date?: string | null;
  marital_status?: string | null;
  occupation?: string | null;
  position?: string | null;
  employer_address?: string | null;
  address?: string | null;
};

type Collateral = {
  id: number;
  type: "Land" | "Vehicle" | "ATM";
  estimated_value: number;
  appraisal_date?: string;
  status: "Pledged" | "Released" | "Forfeited" | "Pending";
  description?: string;
  remarks?: string;
  files?: UploadedFile[];
  land_details?: {
    titleNo?: number | null;
    lotNo?: number | null;
    location?: string | null;
    areaSize?: string | null;
  };
  vehicle_details?: {
    type?: "Car" | "Motorcycle" | "Truck" | null;
    brand?: string | null;
    model?: string | null;
    year_model?: number | null;
    plate_no?: string | null;
    engine_no?: string | null;
    transmission_type?: "Manual" | "Automatic" | null;
    fuel_type?: string | null;
  };
  atm_details?: {
    bank_name?: string | null;
    account_no?: string | null;
    cardno_4digits?: number | string | null;
  };
};

type FormData = {
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  address: string;
  principal: string;
  loanType: string;
  interestType: string;
  collateral: {
    description: string;
    land_details: {
      titleNo: string;
      location: string;
      areaSize: string;
    };
    vehicle_details: {
      type: string;
      brand: string;
      model: string;
      year_model: string;
      plate_no: string;
      engine_no: string;
      transmission_type: string;
      fuel_type: string;
    };
    atm_details: {
      bank_name: string;
      account_no: string;
      cardno_4digits: string;
    };
  };
};

function ReadOnlyField({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
      <p className="text-base font-bold text-gray-900">{value || "-"}</p>
    </div>
  );
}

function toStorageUrl(filePath?: string | null) {
  if (!filePath) return "#";
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) return filePath;

  return `/storage/${filePath.replace(/^\/+/, "").replace(/^public\//, "")}`;
}

function formatDateValue(value?: string | null) {
  if (!value) return "-";

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
}

function FileList({
  title,
  files,
  emptyMessage,
}: {
  title: string;
  files: UploadedFile[];
  emptyMessage: string;
}) {
  return (
    <div className="rounded-md border p-4">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      {files.length === 0 ? (
        <p className="mt-3 text-sm text-gray-600">{emptyMessage}</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {files.map((file, index) => (
            <li key={file.id ?? `${file.file_path ?? "file"}-${index}`} className="rounded-md border border-gray-100 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Document Type: {file.document_type_name || "Unspecified document"}
              </p>
              <a
                href={toStorageUrl(file.file_path)}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block break-all text-sm font-medium text-blue-600 hover:underline"
              >
                {file.file_name || `File ${index + 1}`}
              </a>
              <p className="mt-1 text-xs text-gray-500">
                Uploaded: {formatDateValue(file.uploaded_at)}
              </p>
              {file.description ? <p className="mt-1 text-xs text-gray-500">Notes: {file.description}</p> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export default function MyLoanApplicationSummary({
  authUser,
  pendingLoan,
  collaterals = [],
  loanProducts = [],
}: {
  authUser: {
    first_name?: string | null;
    last_name?: string | null;
    name?: string | null;
    email?: string | null;
    mobile?: string | null;
    address?: string | null;
    coBorrowers?: CoBorrower[];
    files?: UploadedFile[];
  } | null;
  pendingLoan: Loan | null;
  collaterals: Collateral[];
  loanProducts?: LoanProductOption[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const collateral = collaterals[0] ?? null;
  const coBorrowers = authUser?.coBorrowers ?? [];
  const borrowerFiles = authUser?.files ?? [];
  const collateralFiles = collateral?.files ?? [];
  const { flash } = usePage().props as { flash?: { success?: string } };
  const loanTypeOptions = useMemo(
    () => loanProducts.map((product) => ({ value: product.name, label: product.name })),
    [loanProducts]
  );
  const interestTypeOptions = useMemo(
    () => [
      { value: "compound", label: "Compound" },
      { value: "diminishing", label: "Diminishing" },
    ],
    []
  );

  const initialData = useMemo<FormData>(
    () => ({
      first_name: authUser?.first_name ?? authUser?.name?.split(" ")[0] ?? "",
      last_name:
        authUser?.last_name ??
        authUser?.name?.split(" ").slice(1).join(" ") ??
        "",
      email: authUser?.email ?? "",
      mobile: authUser?.mobile ?? "",
      address: authUser?.address ?? "",
      principal: pendingLoan?.principal != null ? String(pendingLoan.principal) : "",
      loanType: pendingLoan?.loan_type ?? "",
      interestType: pendingLoan?.interestType ?? "",
      collateral: {
        description: collateral?.description ?? "",
        land_details: {
          titleNo: collateral?.land_details?.titleNo != null ? String(collateral.land_details.titleNo) : "",
          location: collateral?.land_details?.location ?? "",
          areaSize: collateral?.land_details?.areaSize ?? "",
        },
        vehicle_details: {
          type: collateral?.vehicle_details?.type ?? "",
          brand: collateral?.vehicle_details?.brand ?? "",
          model: collateral?.vehicle_details?.model ?? "",
          year_model:
            collateral?.vehicle_details?.year_model != null
              ? String(collateral.vehicle_details.year_model)
              : "",
          plate_no: collateral?.vehicle_details?.plate_no ?? "",
          engine_no: collateral?.vehicle_details?.engine_no ?? "",
          transmission_type: collateral?.vehicle_details?.transmission_type ?? "",
          fuel_type: collateral?.vehicle_details?.fuel_type ?? "",
        },
        atm_details: {
          bank_name: collateral?.atm_details?.bank_name ?? "",
          account_no: collateral?.atm_details?.account_no ?? "",
          cardno_4digits:
            collateral?.atm_details?.cardno_4digits != null
              ? String(collateral.atm_details.cardno_4digits)
              : "",
        },
      },
    }),
    [authUser, collateral, pendingLoan]
  );

  const { data, setData, put, processing, errors, reset, setDefaults } = useForm<FormData>(initialData);
  const formError = (errors as Record<string, string | undefined>).error;

  useEffect(() => {
    setDefaults(initialData);
    setData(initialData);
  }, [initialData, setData, setDefaults]);

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

  const updateLand = (field: keyof FormData["collateral"]["land_details"], value: string) => {
    setData("collateral", {
      ...data.collateral,
      land_details: {
        ...data.collateral.land_details,
        [field]: value,
      },
    });
  };

  const updateVehicle = (
    field: keyof FormData["collateral"]["vehicle_details"],
    value: string
  ) => {
    setData("collateral", {
      ...data.collateral,
      vehicle_details: {
        ...data.collateral.vehicle_details,
        [field]: value,
      },
    });
  };

  const updateAtm = (field: keyof FormData["collateral"]["atm_details"], value: string) => {
    setData("collateral", {
      ...data.collateral,
      atm_details: {
        ...data.collateral.atm_details,
        [field]: value,
      },
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    put("/my-loan", {
      preserveScroll: true,
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleCancel = () => {
    setData(initialData);
    reset();
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <Head title="Loan Application Summary" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mx-4 my-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Application Summary</h1>
            <p className="max-w-xl text-sm font-medium text-gray-400 leading-relaxed">
              Your application is currently pending review. You can edit your submission before it is officially reviewed.
            </p>
            {flash?.success ? <p className="text-sm font-bold text-emerald-600 animate-fade-in">{flash.success}</p> : null}
            {formError ? <p className="text-sm font-bold text-red-600 animate-fade-in">{formError}</p> : null}
          </div>

          <div className="flex shrink-0">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-amber-500 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-amber-600 shadow-md hover:shadow-amber-100 uppercase tracking-wider"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Application
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  type="submit"
                  disabled={processing}
                  className="inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70 shadow-md hover:shadow-emerald-100 uppercase tracking-wider"
                >
                  {processing ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={processing}
                  className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-600 transition-all duration-300 hover:bg-gray-50 uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mx-4 my-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="mb-8 text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
            Personal Information
          </h2>
          <div className="grid gap-8 text-sm grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {isEditing ? (
              <>
                <Field label="First Name" value={data.first_name} onChange={(value) => setData("first_name", value)} />
                <Field label="Last Name" value={data.last_name} onChange={(value) => setData("last_name", value)} />
                <Field label="Email" value={data.email} onChange={(value) => setData("email", value)} type="email" />
                <Field label="Mobile" value={data.mobile} onChange={(value) => setData("mobile", value)} />
                <div className="sm:col-span-2 lg:col-span-3">
                  <Field label="Address" value={data.address} onChange={(value) => setData("address", value)} />
                </div>
              </>
            ) : (
              <>
                <ReadOnlyField label="Name" value={authUser.name ?? `${data.first_name} ${data.last_name}`.trim()} />
                <ReadOnlyField label="Email Address" value={authUser.email} />
                <ReadOnlyField label="Mobile Number" value={authUser.mobile} />
                <div className="sm:col-span-2 lg:col-span-3">
                  <ReadOnlyField label="Residential Address" value={authUser.address} />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="mx-4 my-6 rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="mb-8 text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
            Loan Details
          </h2>
          <div className="grid gap-8 text-sm grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <ReadOnlyField label="Loan Number" value={pendingLoan.loanNo} />
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 border border-amber-200">
                {pendingLoan.status}
              </span>
            </div>

            {isEditing ? (
              <>
                <Field label="Principal" value={data.principal} onChange={(value) => setData("principal", value)} type="number" />
                <SelectField
                  label="Loan Type"
                  value={data.loanType}
                  onChange={(value) => setData("loanType", value)}
                  options={loanTypeOptions}
                  placeholder="Select loan type"
                />
                <SelectField
                  label="Interest Type"
                  value={data.interestType}
                  onChange={(value) => setData("interestType", value)}
                  options={interestTypeOptions}
                  placeholder="Select interest type"
                />
                <ReadOnlyField label="Interest Rate" value={`${pendingLoan.interest}%`} />
              </>
            ) : (
              <>
                <ReadOnlyField label="Principal" value={`PHP ${Number(pendingLoan.principal).toLocaleString()}`} />
                <ReadOnlyField label="Loan Type" value={pendingLoan.loan_type || "-"} />
                <ReadOnlyField label="Interest Rate" value={`${pendingLoan.interest}%`} />
                <ReadOnlyField label="Interest Type" value={pendingLoan.interestType || "-"} />
                <ReadOnlyField label="Balance" value={`PHP ${Number(pendingLoan.balance).toLocaleString()}`} />
              </>
            )}
          </div>
        </div>

        <div className="m-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Collateral</h2>
          {!collateral ? (
            <p className="text-sm text-gray-600">No collateral details provided.</p>
          ) : (
            <div className="space-y-4 text-sm">
              <div className="rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{collateral.type}</p>
                  <span className="text-xs font-semibold uppercase text-gray-600">{collateral.status}</span>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {isEditing ? (
                    <>
                      <div className="md:col-span-2">
                        <Field
                          label="Description"
                          value={data.collateral.description}
                          onChange={(value) =>
                            setData("collateral", {
                              ...data.collateral,
                              description: value,
                            })
                          }
                        />
                      </div>

                      {collateral.type === "Land" && (
                        <>
                          <Field
                            label="Title No."
                            value={data.collateral.land_details.titleNo}
                            onChange={(value) => updateLand("titleNo", value)}
                            type="number"
                          />
                          <Field
                            label="Location"
                            value={data.collateral.land_details.location}
                            onChange={(value) => updateLand("location", value)}
                          />
                          <Field
                            label="Area Size"
                            value={data.collateral.land_details.areaSize}
                            onChange={(value) => updateLand("areaSize", value)}
                          />
                        </>
                      )}

                      {collateral.type === "Vehicle" && (
                        <>
                          <Field
                            label="Vehicle Type"
                            value={data.collateral.vehicle_details.type}
                            onChange={(value) => updateVehicle("type", value)}
                          />
                          <Field
                            label="Brand"
                            value={data.collateral.vehicle_details.brand}
                            onChange={(value) => updateVehicle("brand", value)}
                          />
                          <Field
                            label="Model"
                            value={data.collateral.vehicle_details.model}
                            onChange={(value) => updateVehicle("model", value)}
                          />
                          <Field
                            label="Year Model"
                            value={data.collateral.vehicle_details.year_model}
                            onChange={(value) => updateVehicle("year_model", value)}
                            type="number"
                          />
                          <Field
                            label="Plate No."
                            value={data.collateral.vehicle_details.plate_no}
                            onChange={(value) => updateVehicle("plate_no", value)}
                          />
                          <Field
                            label="Engine No."
                            value={data.collateral.vehicle_details.engine_no}
                            onChange={(value) => updateVehicle("engine_no", value)}
                          />
                          <Field
                            label="Transmission Type"
                            value={data.collateral.vehicle_details.transmission_type}
                            onChange={(value) => updateVehicle("transmission_type", value)}
                          />
                          <Field
                            label="Fuel Type"
                            value={data.collateral.vehicle_details.fuel_type}
                            onChange={(value) => updateVehicle("fuel_type", value)}
                          />
                        </>
                      )}

                      {collateral.type === "ATM" && (
                        <>
                          <Field
                            label="Bank"
                            value={data.collateral.atm_details.bank_name}
                            onChange={(value) => updateAtm("bank_name", value)}
                          />
                          <Field
                            label="Account No."
                            value={data.collateral.atm_details.account_no}
                            onChange={(value) => updateAtm("account_no", value)}
                          />
                          <Field
                            label="Card No. (Last 4 digits)"
                            value={data.collateral.atm_details.cardno_4digits}
                            onChange={(value) => updateAtm("cardno_4digits", value)}
                          />
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      {collateral.type === "ATM" && (
                        <>
                          <ReadOnlyField label="Bank" value={collateral.atm_details?.bank_name} />
                          <ReadOnlyField label="Account No." value={collateral.atm_details?.account_no} />
                          <ReadOnlyField
                            label="Card No. (Last 4 digits)"
                            value={collateral.atm_details?.cardno_4digits}
                          />
                        </>
                      )}

                      {collateral.type === "Vehicle" && (
                        <>
                          <ReadOnlyField label="Vehicle Type" value={collateral.vehicle_details?.type} />
                          <ReadOnlyField
                            label="Brand & Model"
                            value={`${collateral.vehicle_details?.brand ?? "-"} ${collateral.vehicle_details?.model ?? ""}`.trim()}
                          />
                          <ReadOnlyField label="Plate No." value={collateral.vehicle_details?.plate_no} />
                          <ReadOnlyField label="Engine No." value={collateral.vehicle_details?.engine_no} />
                        </>
                      )}

                      {collateral.type === "Land" && (
                        <>
                          <ReadOnlyField label="Title No." value={collateral.land_details?.titleNo} />
                          <ReadOnlyField label="Location" value={collateral.land_details?.location} />
                          <ReadOnlyField label="Area Size" value={collateral.land_details?.areaSize} />
                        </>
                      )}

                      <div className="md:col-span-2">
                        <ReadOnlyField label="Description" value={collateral.description} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="m-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Co-Borrowers</h2>
          {coBorrowers.length === 0 ? (
            <p className="text-sm text-gray-600">No co-borrower details provided for this application.</p>
          ) : (
            <div className="space-y-4">
              {coBorrowers.map((coBorrower, index) => {
                const fullName = `${coBorrower.first_name ?? ""} ${coBorrower.last_name ?? ""}`.trim();

                return (
                  <div key={coBorrower.id ?? index} className="rounded-md border p-4">
                    <p className="mb-4 font-medium text-gray-900">
                      {fullName || `Co-Borrower ${index + 1}`}
                    </p>
                    <div className="grid gap-4 text-sm md:grid-cols-2">
                      <ReadOnlyField label="Name" value={fullName} />
                      <ReadOnlyField label="Mobile" value={coBorrower.mobile} />
                      <ReadOnlyField label="Email" value={coBorrower.email} />
                      <ReadOnlyField label="Birth Date" value={formatDateValue(coBorrower.birth_date)} />
                      <ReadOnlyField label="Marital Status" value={coBorrower.marital_status} />
                      <ReadOnlyField label="Occupation" value={coBorrower.occupation} />
                      <ReadOnlyField label="Position" value={coBorrower.position} />
                      <ReadOnlyField label="Employer Address" value={coBorrower.employer_address} />
                      <div className="md:col-span-2">
                        <ReadOnlyField label="Address" value={coBorrower.address} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="m-4 rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Uploaded Files</h2>
          <p className="mb-4 text-sm text-gray-600">
            Application documents are currently stored under the borrower and collateral records.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <FileList
              title="Borrower Files"
              files={borrowerFiles}
              emptyMessage="No borrower files uploaded."
            />
            <FileList
              title="Collateral Files"
              files={collateralFiles}
              emptyMessage="No collateral files uploaded."
            />
          </div>
        </div>
      </form>
    </DashboardLayout>
  );
}
