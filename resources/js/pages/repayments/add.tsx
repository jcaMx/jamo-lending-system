import React, { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Search } from "lucide-react";
import { type BreadcrumbItem } from "@/types";

type Schedule = {
  ID: number;
  installment_no: number;
  due_date: string;
  installment_amount: number;
  interest_amount: number;
  penalty_amount: number;
  amount_paid: number;
  status: string;
  total_due: number;
};

type BorrowerWithSchedules = {
  id: number;
  name: string;
  loanNo: string;
  loan_id: number;
  schedules: Schedule[];
  next_due_date?: string;
  next_due_amount: number;
};

type Collector = { id: number; name: string };

type Props = { borrowers: BorrowerWithSchedules[]; collectors: Collector[] };

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Repayments", href: "/repayments/add" }
];

const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"


const inputClass =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FABF24] focus:border-transparent";

const ONLINE_METHODS = ["Bank", "GCash", "Cebuana"];

export default function Add({ borrowers: initialBorrowers = [], collectors: initialCollectors = [] }: Props) {
  const today = new Date().toISOString().split('T')[0];

  const normalizedBorrowers = useMemo(() => {
    let data = initialBorrowers;
    if (data && typeof data === 'object' && !Array.isArray(data) && 'data' in data) {
      data = (data as any).data;
    }
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      data = Object.values(data);
    }
    return Array.isArray(data) ? data : [];
  }, [initialBorrowers]);

  const [form, setForm] = useState({
    search: "",
    selectedBorrower: null as BorrowerWithSchedules | null,
    selectedSchedules: [] as Schedule[],
    amount: "",
    method: "",
    collectedBy: initialCollectors.length > 0 ? String(initialCollectors[0].id) : "",
    collectionDate: today,
    referenceNumber: "",
    voucherNumber: "",
    voucherDate: "",
    chequeNumber: "",
    bankName: "",
    chequeDate: "",
  });

  const [submittedRefs, setSubmittedRefs] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const isCashMethod = form.method === "Cash";

  const filteredBorrowers = useMemo(() => {
    return normalizedBorrowers.filter((b) =>
      b.name.toLowerCase().includes(form.search.toLowerCase())
    );
  }, [form.search, normalizedBorrowers]);

  const generateReferenceNumber = () => {
    const prefix =
      form.method === "Metrobank"
        ? "MB"
        : form.method === "Cebuana"
        ? "CB"
        : form.method === "GCash"
        ? "GC"
        : "BN"; // default for other banks
    return `${prefix}-${Date.now().toString().slice(-8)}`;
  };

  const update = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSelectBorrower = (b: BorrowerWithSchedules) => {
    update("selectedBorrower", b);
    update("search", b.name);

    const nextDueSchedule = b.schedules
      .filter((s) => s.status !== "Paid")
      .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0] || null;

    if (nextDueSchedule) {
      update("selectedSchedules", [nextDueSchedule]);
      update("amount", nextDueSchedule.total_due.toFixed(2));
      if (nextDueSchedule.due_date) update("collectionDate", nextDueSchedule.due_date);
    } else {
      update("selectedSchedules", []);
      update("amount", "");
    }
  };

  const computeTotalDue = (schedules: Schedule[]) =>
    schedules.reduce((sum, s) => sum + (s.total_due || 0), 0);

  const getSortedSchedules = (schedules: Schedule[]) =>
    [...schedules].sort((a, b) => {
      const aTime = a.due_date ? new Date(a.due_date).getTime() : Number.MAX_SAFE_INTEGER;
      const bTime = b.due_date ? new Date(b.due_date).getTime() : Number.MAX_SAFE_INTEGER;
      return aTime - bTime;
    });

  const handleToggleSchedule = (schedule: Schedule) => {
    if (schedule.status === "Paid") return;

    const exists = form.selectedSchedules.some((s) => s.ID === schedule.ID);
    const nextSelected = exists
      ? form.selectedSchedules.filter((s) => s.ID !== schedule.ID)
      : [...form.selectedSchedules, schedule];

    const sortedSelected = getSortedSchedules(nextSelected);
    const nextAmount = computeTotalDue(sortedSelected);

    update("selectedSchedules", sortedSelected);
    update("amount", nextAmount ? nextAmount.toFixed(2) : "");

    if (sortedSelected.length > 0 && sortedSelected[0].due_date) {
      update("collectionDate", sortedSelected[0].due_date);
    }
  };

 const handleMethodChange = (method: string) => {
  let referenceNumber = "";
  let voucherNumber = "";
  let chequeNumber = "";

  const generateCode = (prefix: string) => {
    return `${prefix}-${Date.now().toString().slice(-8)}`;
  };

  // ONLINE PAYMENTS
  // if (["Bank", "GCash", "Cebuana"].includes(method)) {
  //   referenceNumber = generateCode("REF");
  // }

  // CASH VOUCHER (NO REFERENCE ❗)
  if (method === "Cash Voucher") {
    voucherNumber = generateCode("CV");
    referenceNumber = ""; // ✅ FIXED
  }

  // CHEQUE VOUCHER
  if (method === "Cheque Voucher") {
    chequeNumber = generateCode("CHK");
    referenceNumber = generateCode("REF");
  }

  setForm((prev) => ({
    ...prev,
    method,
    referenceNumber,
    voucherNumber,
    chequeNumber,
    voucherDate: "",
    bankName: "",
    chequeDate: "",
  }));
};

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  const { selectedBorrower, collectedBy, amount, method, collectionDate } = form;

  if (!selectedBorrower) return alert("Please select a borrower.");
  if (!form.selectedSchedules || form.selectedSchedules.length === 0) {
    return alert("Please select at least one schedule.");
  }
  if (!collectedBy) return alert("Please select a collector.");
  if (!amount || Number(amount) <= 0) return alert("Please enter a valid amount.");
  if (Number(amount) > 10_000_000) return alert("Amount cannot exceed 10,000,000.");
  if (!method) return alert("Please select a payment method.");
  if (!collectionDate) return alert("Please select a collection date.");

  // ❌ REMOVE FAKE STATUS (backend controls it)

  const payload: any = {
    borrower_id: selectedBorrower.id,
    loanNo: selectedBorrower.loanNo,
    schedule_ids: form.selectedSchedules.map((s) => s.ID),
    schedule_id: form.selectedSchedules[0]?.ID || null,
    amount,
    method,
    collectedBy,
    collectionDate,
    reference_number: form.referenceNumber?.trim() || null, // ✅ FIXED
  };

  if (method === "Cash Voucher") {
    if (!form.voucherNumber.trim()) {
      return alert("Voucher Number is required for Cash Voucher payments.");
    }
    payload.voucher_number = form.voucherNumber.trim();
    payload.voucher_date = form.voucherDate || null;
  }

  if (method === "Cheque Voucher") {
    if (!form.chequeNumber.trim()) return alert("Cheque Number is required.");
    if (!form.bankName.trim()) return alert("Bank Name is required.");
    if (!form.chequeDate) return alert("Cheque Date is required.");

    payload.cheque_number = form.chequeNumber.trim();
    payload.bank_name = form.bankName.trim();
    payload.cheque_date = form.chequeDate;
  }

  router.post("/repayments/store", payload, {
    onSuccess: () => {
      // ✅ ONLY pending methods redirect
      if (ONLINE_METHODS.includes(method) || method === "Cheque Voucher") {
        router.visit(`/repayments/pending?ref=${form.referenceNumber}`);
      } else {
        setSuccessMessage("Payment verified successfully!");
      }

      setForm({
        search: "",
        selectedBorrower: null,
        selectedSchedules: [],
        amount: "",
        method: "",
        collectedBy: initialCollectors.length > 0 ? String(initialCollectors[0].id) : "",
        collectionDate: today,
        referenceNumber: "",
        voucherNumber: "",
        voucherDate: "",
        chequeNumber: "",
        bankName: "",
        chequeDate: "",
      });
    },
    onError: (errors) => {
      const errorMessages = Object.values(errors).flat();
      setErrorMessage(errorMessages.join(", ") || "Failed to process payment.");
    },
  });
};

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Repayment" />
      <div className="w-full mx-auto bg-white shadow-lg rounded-2xl p-10 mb-16 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Repayment Section */}
          <section>
            <div className="border-b-4 border-[#FABF24] rounded-t-lg pb-3 mb-6 bg-[#FFF8E2] p-5">
              <h2 className="text-2xl font-semibold text-gray-800">Repayment</h2>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              {/* Borrower Search */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">Borrower</label>
                <div className="relative">
                  <input
                    type="text"
                    value={form.search}
                    onChange={(e) => update("search", e.target.value)}
                    placeholder="Search borrower..."
                    className={inputClass + " pr-10"}
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                </div>
                {form.search.length > 0 && (
                  <div className="border rounded-lg mt-2 bg-white shadow max-h-32 overflow-y-auto">
                    {filteredBorrowers.length > 0 ? (
                      filteredBorrowers.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => handleSelectBorrower(b)}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {b.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500">No results found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Loan Number */}
              <div>
                <label className="block text-sm font-medium mb-1">Loan Number</label>
                <input
                  type="text"
                  value={form.selectedBorrower?.loanNo || ""}
                  readOnly
                  className={inputClass + " bg-gray-100"}
                />
              </div>

              {/* Schedules Table */}
              {form.selectedBorrower && form.selectedBorrower.schedules?.length > 0 && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Amortization Schedule</label>
                  <div className="border rounded-lg overflow-hidden">
                    <div className="max-h-96 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold">#</th>
                            <th className="px-4 py-3 text-left font-semibold">Due Date</th>
                            <th className="px-4 py-3 text-left font-semibold">Installment</th>
                            <th className="px-4 py-3 text-left font-semibold">Interest</th>
                            <th className="px-4 py-3 text-left font-semibold">Penalty</th>
                            <th className="px-4 py-3 text-left font-semibold">Paid</th>
                            <th className="px-4 py-3 text-left font-semibold">Total Due</th>
                            <th className="px-4 py-3 text-left font-semibold">Status</th>
                            <th className="px-4 py-3 text-center font-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.selectedBorrower.schedules.map((schedule) => (
                            <tr
                              key={schedule.ID}
                              className={`border-t hover:bg-gray-50 ${
                                form.selectedSchedules.some((s) => s.ID === schedule.ID) ? 'bg-yellow-50' : ''
                              }`}
                            >
                              <td className="px-4 py-3">{schedule.installment_no}</td>
                              <td className="px-4 py-3">{schedule.due_date ? new Date(schedule.due_date).toLocaleDateString() : 'N/A'}</td>
                              <td className="px-4 py-3">₱{schedule.installment_amount.toLocaleString()}</td>
                              <td className="px-4 py-3">₱{schedule.interest_amount.toLocaleString()}</td>
                              <td className="px-4 py-3">₱{schedule.penalty_amount.toLocaleString()}</td>
                              <td className="px-4 py-3">₱{schedule.amount_paid.toLocaleString()}</td>
                              <td className="px-4 py-3 font-semibold">₱{schedule.total_due.toLocaleString()}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 rounded text-xs inline-block ${
                                    schedule.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                    schedule.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {schedule.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleSchedule(schedule)}
                                  className={`px-3 py-1 rounded text-xs font-medium ${
                                    form.selectedSchedules.some((s) => s.ID === schedule.ID)
                                      ? 'bg-yellow-500 text-white'
                                      : 'bg-blue-500 text-white hover:bg-blue-600'
                                  }`}
                                  disabled={schedule.status === 'Paid'}
                                >
                                  {form.selectedSchedules.some((s) => s.ID === schedule.ID) ? 'Selected' : 'Select'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    You can select multiple schedules. Payment is allocated by due date order.
                  </p>
                </div>
              )}

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => {
                    let v = parseFloat(e.target.value);
                    if (isNaN(v)) v = 0;
                    if (v < 0) v = 0;
                    if (v > 10000000) v = 10000000;
                    update("amount", v.toString());
                  }}
                  placeholder="Enter amount"
                  className={inputClass}
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select
                  value={form.method}
                  onChange={(e) => handleMethodChange(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select method</option>
                  <option value="Cash">Cash</option>
                  {/* <option value="Cash Voucher">Cash Voucher</option>
                  <option value="Cheque Voucher">Cheque Voucher</option> */}
                  <option value="Bank">Bank</option>
                  <option value="Cebuana">Cebuana</option>
                  <option value="GCash">GCash</option>
                </select>
              </div>

              {/* Conditional Fields */}
              {form.method === "Cash Voucher" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Voucher Number *</label>
                    <input
                      type="text"
                      value={form.voucherNumber}
                      onChange={(e) => update("voucherNumber", e.target.value)}
                      placeholder="e.g. CV-2025-00421"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Issued / Valid Until</label>
                    <input
                      type="date"
                      value={form.voucherDate}
                      onChange={(e) => update("voucherDate", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </>
              )}

              {form.method === "Cheque Voucher" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cheque Number *</label>
                    <input
                        type="text"
                        value={form.chequeNumber}
                        readOnly
                        className={inputClass + " bg-gray-100"}
                      />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Bank Name *</label>
                    <input
                      type="text"
                      value={form.bankName}
                      onChange={(e) => update("bankName", e.target.value)}
                      placeholder="e.g. BDO, Metrobank, BPI"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Cheque Date *</label>
                    <input
                      type="date"
                      value={form.chequeDate}
                      onChange={(e) => update("chequeDate", e.target.value)}
                      className={inputClass}
                    />
                  </div>
                </>
              )}

              {ONLINE_METHODS.includes(form.method) && (
                <div>
                  <label className="block text-sm font-medium mb-1">Reference Number</label>
                 <input 
                  type="text"
                  value={form.referenceNumber}
                  onChange={(e) => update("referenceNumber", e.target.value)}
                  className={inputClass}
                />
                </div>
              )}

              {/* Collector */}
              <div>
                <label className="block text-sm font-medium mb-1">Collected By</label>
                <select
                  value={form.collectedBy}
                  onChange={(e) => update("collectedBy", e.target.value)}
                  className={inputClass}
                  disabled={!isCashMethod}
                >
                  {initialCollectors.length > 0 ? (
                    initialCollectors.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No collectors available</option>
                  )}
                </select>
              </div>

              {/* Collection Date */}
              
              <div>
                <label className="block text-sm font-medium mb-1">Collection Date</label>
                <input
                  type="date"
                  value={form.collectionDate || today}//on default today
                  onChange={(e) => update("collectionDate", e.target.value)}
                  className={inputClass}
                  disabled={!isCashMethod}
                />
              </div>
            </div>
          </section>

          {/* Messages */}
          {successMessage && (
            <div className="bg-green-100 text-green-800 p-3 rounded-md">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="bg-red-100 text-red-800 p-3 rounded-md">{errorMessage}</div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 text-black bg-[#FABF24] rounded-lg hover:bg-[#f8b80f]"
            >
              Submit Repayment
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
