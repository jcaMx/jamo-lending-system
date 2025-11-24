import React, { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Repayments", href: "/repayments/add" },
];

export default function Add({ borrowers, collectors }) {
  const [search, setSearch] = useState("");
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [collectedBy, setCollectedBy] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");

  const filteredBorrowers = useMemo(() => {
    return borrowers.filter((b) =>
      b.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, borrowers]);

  const handleSubmit = (e) => {
    e.preventDefault();

    router.post("/repayments/store", {
      borrower_id: selectedBorrower?.id,
      loanNo: selectedBorrower?.loanNo,
      amount,
      method,
      collectedBy,
      collectionDate,
      referenceNumber,
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Repayment" />

      <div className="w-full h-full mx-auto bg-white shadow-lg rounded-2xl p-10 mb-16 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-10">
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
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search borrower..."
                    className="w-full border rounded-lg p-2 pr-10"
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                </div>

                {search.length > 0 && (
                  <div className="border rounded-lg mt-2 bg-white shadow max-h-32 overflow-y-auto">
                    {filteredBorrowers.length > 0 ? (
                      filteredBorrowers.map((b) => (
                        <div
                          key={b.id}
                          onClick={() => {
                            setSelectedBorrower(b);
                            setSearch(b.name);
                          }}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {b.name}
                        </div>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-gray-500">
                        No results found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Loan Number */}
              <div>
                <label className="block text-sm font-medium mb-1">Loan Number</label>
                <input
                  type="text"
                  value={selectedBorrower?.loanNo || ""}
                  readOnly
                  className="w-full border rounded-lg p-2 bg-gray-100"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Gcash">Gcash</option>
                </select>
              </div>

              {/* Reference Number - Conditional */}
              {(method === "Gcash" || method === "Bank Transfer" || method === "Gcash") && (
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Reference Number
                  </label>
                  <input
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="Enter reference number"
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              )}

              {/* Collector Dropdown */}
              <div>
                <label className="block text-sm font-medium mb-1">Collected By</label>
                <select
                  value={collectedBy}
                  onChange={(e) => setCollectedBy(e.target.value)}
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select collector</option>
                  {collectors.map((c, index) => (
                    <option key={index} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Collection Date */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Collection Date
                </label>
                <input
                  type="date"
                  value={collectionDate}
                  onChange={(e) => setCollectionDate(e.target.value)}
                  className="w-full border rounded-lg p-2"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end">

            <button type="submit" className="px-6 py-2 text-black bg-[#FABF24] rounded-lg hover:bg-amber-600 " >
               Submit Repayment
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
