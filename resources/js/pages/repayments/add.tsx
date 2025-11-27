import React, { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { Search } from "lucide-react";
import { type BreadcrumbItem } from "@/types";

type Borrower = {
  id: number;
  name: string;
  loanNo: string;
  current_due: number;
  due_date: string;
};

type Collector = { id: number; name: string };

type Props = { borrowers: Borrower[]; collectors: Collector[] };

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Repayments", href: "/repayments/add" }
];

const inputClass =
  "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FABF24] focus:border-transparent";

export default function Add({ borrowers: initialBorrowers, collectors: initialCollectors }: Props) {
  const [form, setForm] = useState({
    search: "",
    selectedBorrower: null as Borrower | null,
    amount: "",
    method: "",
    collectedBy: "",
    collectionDate: "",
    referenceNumber: ""
  });

  const [submittedRefs, setSubmittedRefs] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState("");

  const filteredBorrowers = useMemo(() => {
    return initialBorrowers.filter((b) =>
      b.name.toLowerCase().includes(form.search.toLowerCase())
    );
  }, [form.search, initialBorrowers]);

  // -------------------- HANDLERS --------------------

  const update = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSelectBorrower = (b: Borrower) => {
    update("selectedBorrower", b);
    update("search", b.name);
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
      amount: "",
      method: "",
      collectedBy: "",
      collectionDate: "",
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

              <div>
                <label className="block text-sm font-medium mb-1">Amount Due</label>
                <input
                  type="text"
                  value={form.selectedBorrower?.current_due || ""}
                  readOnly
                  className={inputClass + " bg-gray-100"}
                />

                <label className="block text-sm font-medium mt-2">Due Date</label>
                <input
                  type="text"
                  value={form.selectedBorrower?.due_date || ""}
                  readOnly
                  className={inputClass + " bg-gray-100"}
                />
              </div>

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
                  onChange={(e) => update("method", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Gcash">Gcash</option>
                </select>
              </div>

              {/* ---------------- REFERENCE NUMBER (Hide for Cash) ---------------- */}
              {form.method !== "Cash" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Reference Number</label>
                  <input
                    value={form.referenceNumber}
                    onChange={(e) => update("referenceNumber", e.target.value)}
                    placeholder="Enter reference number"
                    className={inputClass}
                  />
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
              className="px-6 py-2 text-black bg-[#FABF24] rounded-lg hover:bg-amber-600"
            >
              Submit Repayment
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
