import React, { useState, useMemo } from "react";
import { Head, router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { type BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

/* -------------------- Types -------------------- */

interface Borrower {
  id: number;
  name: string;
  loanNo: string;
}

interface Collector {
  id: number;
  name: string;
}

/* -------------------- Component -------------------- */

const breadcrumbs: BreadcrumbItem[] = [
  { title: "Add User", href: "/users/add" },
];

export default function Add({
  borrowers,
  collectors,
}: {
  borrowers: Borrower[];
  collectors: Collector[];
}) {
  /* -------------------- States -------------------- */

  const [search, setSearch] = useState("");
  const [selectedBorrower, setSelectedBorrower] =
    useState<Borrower | null>(null);

  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [collectedBy, setCollectedBy] = useState("");
  const [collectionDate, setCollectionDate] = useState("");

  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /* -------------------- Borrower Search -------------------- */

  const filteredBorrowers = useMemo(() => {
    return borrowers.filter((b: Borrower) =>
      b.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, borrowers]);

  /* -------------------- Amount Formatting -------------------- */

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^\d]/g, "");
    if (!raw) return setAmount("");

    const number = (parseInt(raw, 10) / 100).toFixed(2);
    setAmount("₱" + Number(number).toLocaleString());
  };

  /* -------------------- Form Validation -------------------- */

  const isValid =
    selectedBorrower &&
    amount &&
    method &&
    collectedBy &&
    collectionDate &&
    (method === "Cash" || referenceNumber.trim().length > 0);

  /* -------------------- Submit Logic -------------------- */

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid) {
      setErrorMsg("Please fill out all required fields.");
      return;
    }

    router.post(
      "/repayments/store",
      {
        borrower_id: selectedBorrower.id,
        loanNo: selectedBorrower.loanNo,
        amount: amount.replace(/[₱,]/g, ""), // cleaned numeric string
        method,
        referenceNumber,
        collectedBy,
        collectionDate,
      },
      {
        onSuccess: () => {
          setSuccessMsg("Repayment recorded successfully.");
          setErrorMsg("");
        },
        onError: () => {
          setErrorMsg("Something went wrong. Try again.");
          setSuccessMsg("");
        },
      }
    );
  };

  /* -------------------- JSX -------------------- */

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Add Repayment" />

      <div className="w-full h-full mx-auto bg-white shadow-lg rounded-2xl p-10 mb-16 border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Header */}
          <section>
            <div className="border-b-4 border-[#FABF24] rounded-t-lg pb-3 mb-6 bg-[#FFF8E2] p-5">
              <h2 className="text-2xl font-semibold text-gray-800">Repayment</h2>
            </div>

            {successMsg && (
              <p className="bg-green-100 text-green-700 p-2 mb-3 rounded">
                {successMsg}
              </p>
            )}
            {errorMsg && (
              <p className="bg-red-100 text-red-700 p-2 mb-3 rounded">
                {errorMsg}
              </p>
            )}

            {/* Grid */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-5">
              {/* Borrower Search */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Borrower
                </label>

                <div className="relative">
                  <input
                    type="text"
                    value={search}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search borrower..."
                    className="w-full border rounded-lg p-2 pr-10"
                  />
                  <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                </div>

                {search.length > 0 && (
                  <div className="border rounded-lg mt-2 bg-white shadow max-h-32 overflow-y-auto">
                    {filteredBorrowers.length > 0 ? (
                      filteredBorrowers.map((b: Borrower) => (
                        <div
                          key={b.id}
                          onClick={() => {
                            setSelectedBorrower(b);
                            setSearch(b.name);
                          }}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          {b.name} — {b.loanNo}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loan Number
                </label>
                <input
                  type="text"
                  value={selectedBorrower?.loanNo ?? ""}
                  readOnly
                  className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="₱0.00"
                  className="w-full border rounded-lg p-2"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={method}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setMethod(e.target.value)
                  }
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select method</option>
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Gcash">Gcash</option>
                </select>
              </div>

              {/* Reference Number */}
              {(method === "Gcash" || method === "Bank Transfer") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference Number
                  </label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setReferenceNumber(e.target.value)
                    }
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              )}

              {/* Collector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collected By
                </label>
                <select
                  value={collectedBy}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setCollectedBy(e.target.value)
                  }
                  className="w-full border rounded-lg p-2"
                >
                  <option value="">Select collector</option>
                  {collectors.map((c: Collector) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Collection Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collection Date
                </label>
                <input
                  type="date"
                  value={collectionDate}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setCollectionDate(e.target.value)
                  }
                  className="w-full border rounded-lg p-2"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <Button type="submit" disabled={!isValid} className="px-6 py-2">
              Submit Repayment
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
