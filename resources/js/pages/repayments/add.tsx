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

const inputClass =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FABF24] focus:border-transparent";

export default function Add({ borrowers: initialBorrowers = [], collectors: initialCollectors = [] }: Props) {
  // Set today's date as default
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    search: "",
    selectedBorrower: null as BorrowerWithSchedules | null,
    selectedSchedule: null as Schedule | null,
    amount: "",
    method: "",
    collectedBy: "",
    collectionDate: today,
    referenceNumber: ""
  });

  const [submittedRefs, setSubmittedRefs] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  const filteredBorrowers = useMemo(() => {
    if (!Array.isArray(initialBorrowers)) {
      return [];
    }
    return initialBorrowers.filter((b) =>
      b.name.toLowerCase().includes(form.search.toLowerCase())
    );
  }, [form.search, initialBorrowers]);

  // Generate reference number when method changes
  const generateReferenceNumber = () => {
    const prefix = form.method === 'Metrobank' ? 'MB' : form.method === 'Cebuana' ? 'CB' : form.method === 'GCash' ? 'GC' : '';
    if (prefix) {
      return `${prefix}-${Date.now().toString().slice(-8)}`;
    }
    return '';
  };

  // -------------------- HANDLERS --------------------

  const update = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSelectBorrower = (b: BorrowerWithSchedules) => {
    update("selectedBorrower", b);
    update("search", b.name);
    // Auto-set loan number (already in borrower object)
    
    // Auto-select the next due schedule (only one is returned from backend)
    const nextDueSchedule = b.schedules[0] || null;
    if (nextDueSchedule) {
      update("selectedSchedule", nextDueSchedule);
      update("amount", nextDueSchedule.total_due.toFixed(2));
      if (nextDueSchedule.due_date) {
        update("collectionDate", nextDueSchedule.due_date);
      }
    } else {
      update("selectedSchedule", null);
      update("amount", "");
    }
  };

  const handleSelectSchedule = (schedule: Schedule) => {
    update("selectedSchedule", schedule);
    // Auto-set amount to schedule's total due
    update("amount", schedule.total_due.toFixed(2));
    // Auto-set due date from schedule
    if (schedule.due_date) {
      update("collectionDate", schedule.due_date);
    }
  };

  const handleMethodChange = (method: string) => {
    update("method", method);
    // Auto-generate reference number for non-cash methods
    if (method !== "Cash" && method !== "") {
      update("referenceNumber", generateReferenceNumber());
    } else {
      update("referenceNumber", "");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { selectedBorrower, collectedBy, amount, method, collectionDate, referenceNumber } = form;

    if (!selectedBorrower) return alert("Please select a borrower.");
    if (!collectedBy) return alert("Please select a collector.");
    if (!amount || Number(amount) <= 0) return alert("Please enter a valid amount.");
    if (Number(amount) > 10_000_000) return alert("Amount cannot exceed 10,000,000.");
    if (!method) return alert("Please select a payment method.");
    if (!collectionDate) return alert("Please select a collection date.");

    // Reference number check (only for non-cash)
    if (method !== "Cash" && referenceNumber && submittedRefs.includes(referenceNumber)) {
      return alert("This reference number has already been used.");
    }

    router.post("/repayments/store", {
      borrower_id: selectedBorrower.id,
      loanNo: selectedBorrower.loanNo,
      schedule_id: form.selectedSchedule?.ID || null,
      amount,
      method,
      collectedBy,
      collectionDate,
      referenceNumber: method === "Cash" ? null : referenceNumber || null
    });

    if (referenceNumber) {
      setSubmittedRefs((prev) => [...prev, referenceNumber]);
    }

    setSuccessMessage("Payment submitted successfully!");

    // Reset
    setForm({
      search: "",
      selectedBorrower: null,
      selectedSchedule: null,
      amount: "",
      method: "",
      collectedBy: "",
      collectionDate: today,
      referenceNumber: ""
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Repayment" />

      <div className="w-full h-full mx-auto bg-white shadow-lg rounded-2xl p-10 mb-16 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-10">

          {/* ------------------ HEADER -------------------- */}
          <section>
            <div className="border-b-4 border-[#FABF24] rounded-t-lg pb-3 mb-6 bg-[#FFF8E2] p-5">
              <h2 className="text-2xl font-semibold text-gray-800">Repayment</h2>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-5">

              {/* ------------------ BORROWER SEARCH ------------------ */}
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

              {/* ---------------- Loan Info ---------------- */}
              <div>
                <label className="block text-sm font-medium mb-1">Loan Number</label>
                <input
                  type="text"
                  value={form.selectedBorrower?.loanNo || ""}
                  readOnly
                  className={inputClass + " bg-gray-100"}
                />
              </div>

              {/* ---------------- Next Due Schedule Display (Read-only) ---------------- */}
              {form.selectedBorrower && form.selectedSchedule && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Next Due Schedule</label>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Installment #</p>
                        <p className="font-semibold">{form.selectedSchedule.installment_no}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Due Date</p>
                        <p className="font-semibold">
                          {form.selectedSchedule.due_date ? new Date(form.selectedSchedule.due_date).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Total Due</p>
                        <p className="font-semibold">₱{form.selectedSchedule.total_due.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <span className={`px-2 py-1 rounded text-xs inline-block ${
                          form.selectedSchedule.status === 'Paid' ? 'bg-green-100 text-green-800' :
                          form.selectedSchedule.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {form.selectedSchedule.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t text-xs text-gray-600">
                      <p>Breakdown: Installment ₱{form.selectedSchedule.installment_amount.toLocaleString()} + 
                         Interest ₱{form.selectedSchedule.interest_amount.toLocaleString()} + 
                         Penalty ₱{form.selectedSchedule.penalty_amount.toLocaleString()} - 
                         Paid ₱{form.selectedSchedule.amount_paid.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- AMOUNT ---------------- */}
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

              {/* ---------------- PAYMENT METHOD ---------------- */}
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select
                  value={form.method}
                  onChange={(e) => handleMethodChange(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select method</option>
                  <option value="Cash">Cash</option>
                  <option value="Metrobank">Metro Bank</option>
                  <option value="Cebuana">Cebuana</option>
                  <option value="GCash">GCash</option>
                </select>
              </div>

              {/* ---------------- REFERENCE NUMBER (Hide for Cash) ---------------- */}
              {form.method !== "Cash" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Reference Number (Auto-generated)</label>
                  <input
                    value={form.referenceNumber}
                    onChange={(e) => update("referenceNumber", e.target.value)}
                    placeholder="Auto-generated reference number"
                    className={inputClass + " bg-gray-50"}
                  />
                  <p className="text-xs text-gray-500 mt-1">You can edit this if needed</p>
                </div>
              )}

              {/* ---------------- COLLECTOR ---------------- */}
              <div>
                <label className="block text-sm font-medium mb-1">Collected By</label>
                <select
                  value={form.collectedBy}
                  onChange={(e) => update("collectedBy", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select collector</option>
                  {initialCollectors.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ---------------- COLLECTION DATE ---------------- */}
              <div>
                <label className="block text-sm font-medium mb-1">Collection Date</label>
                <input
                  type="date"
                  value={form.collectionDate}
                  onChange={(e) => update("collectionDate", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          {successMessage && (
            <div className="bg-green-100 text-green-800 p-3 rounded-md">{successMessage}</div>
          )}

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
