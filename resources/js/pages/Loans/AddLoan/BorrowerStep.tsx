import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { SharedFormData } from "@/pages/borrower-application/sharedFormData";
import StepIndicator from "@/pages/borrower-application/StepIndicator";


interface Borrower {
  id: number;
  name: string;
  has_active_or_pending_loan?: boolean;
  has_active_loan?: boolean;
  loan_status?: string;
}

interface BorrowerStepProps {
  borrowers: Borrower[];
  formData: SharedFormData;
  setFormData: React.Dispatch<React.SetStateAction<SharedFormData>>;
  onNext: () => void;
  fieldErrors?: Record<string, string>;
  submitError?: string;
  stepLabels?: string[];
  stepIndex?: number;
}

const BorrowerStep = ({
  borrowers,
  formData,
  setFormData,
  onNext,
  fieldErrors = {},
  submitError = "",
  stepLabels,
  stepIndex,
}: BorrowerStepProps) => {
  const [borrowerSearch, setBorrowerSearch] = useState("");
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
  const [borrowerError, setBorrowerError] = useState("");
  const [eligibilityById, setEligibilityById] = useState<Record<number, boolean>>({});
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);
  const [isFetchingIncome, setIsFetchingIncome] = useState(false);
  const defaultStepLabels = ["Borrower", "Loan Details", "Collateral", "Co-Borrowers", "Review"];
  const indicatorLabels = stepLabels && stepLabels.length > 0 ? stepLabels : defaultStepLabels;
  const indicatorIndex = stepIndex ?? 1;
  const backendBorrowerError = fieldErrors.borrower_name || fieldErrors.borrower_id || "";

  const focusField = useCallback((fieldName: string) => {
    if (typeof document === "undefined") return;

    window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>(`[data-field="${fieldName}"]`);
      if (!target) return;
      target.scrollIntoView({ behavior: "smooth", block: "center" });
      if ("focus" in target) {
        target.focus();
      }
    }, 100);
  }, []);

  const isActiveOrPendingStatus = useCallback((status?: string) => {
    if (!status) return false;
    return ["active", "pending"].includes(status.trim().toLowerCase());
  }, []);

  const getEligibilityFromBorrower = useCallback(
    (borrower: Borrower) => {
      if (borrower.has_active_or_pending_loan !== undefined && borrower.has_active_or_pending_loan !== null) {
        return !borrower.has_active_or_pending_loan;
      }
      if (borrower.has_active_loan !== undefined && borrower.has_active_loan !== null) {
        return !borrower.has_active_loan;
      }
      if (borrower.loan_status) {
        return !isActiveOrPendingStatus(borrower.loan_status);
      }
      return undefined;
    },
    [isActiveOrPendingStatus],
  );

  useEffect(() => {
    if (formData.borrower_id && formData.borrower_name) {
      const existing = borrowers.find((b) => String(b.id) === String(formData.borrower_id));
      if (existing) {
        setSelectedBorrower(existing);
        setBorrowerSearch(existing.name);
      }
    }
  }, [borrowers, formData.borrower_id, formData.borrower_name]);


  useEffect(() => {
    const updated: Record<number, boolean> = {};

    borrowers.forEach((b) => {
      const eligibility = getEligibilityFromBorrower(b);
      if (eligibility !== undefined) {
        updated[b.id] = eligibility;
      }
    });

    if (Object.keys(updated).length > 0) {
      setEligibilityById((prev) => ({ ...prev, ...updated }));
    }
  }, [borrowers, getEligibilityFromBorrower]);

  const checkBorrowerEligibility = useCallback(async (borrowerId: number) => {
    try {
      const response = await fetch(`/borrowers/${borrowerId}/loans`, {
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        return null;
      }

      const payload = (await response.json()) as {
        hasActiveLoan?: boolean;
        hasPendingLoan?: boolean;
        hasActiveOrPendingLoan?: boolean;
      };

      const hasActive =
        payload.hasActiveOrPendingLoan ??
        payload.hasActiveLoan ??
        payload.hasPendingLoan ??
        false;

      return !hasActive;
    } catch {
      return null;
    }
  }, []);

  const fetchBorrowerIncome = useCallback(
    async (borrowerId: number) => {
      setIsFetchingIncome(true);
      try {
        const response = await fetch(`/borrowers/${borrowerId}/income`, {
          credentials: "same-origin",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as { monthly_income?: number | null };
        setFormData((prev) => ({
          ...prev,
          monthly_income:
            payload.monthly_income !== undefined && payload.monthly_income !== null
              ? payload.monthly_income
              : "",
        }));
      } finally {
        setIsFetchingIncome(false);
      }
    },
    [setFormData],
  );

  useEffect(() => {
    if (!formData.borrower_id) return;
    if (String(formData.monthly_income ?? "").trim()) return;
    void fetchBorrowerIncome(Number(formData.borrower_id));
  }, [formData.borrower_id, formData.monthly_income, fetchBorrowerIncome]);

  const matchingBorrowers = useMemo(() => {
    if (!borrowerSearch.trim()) return [];

    return borrowers.filter((b) =>
      b.name.toLowerCase().includes(borrowerSearch.toLowerCase()),
    );
  }, [borrowerSearch, borrowers]);

  useEffect(() => {
    let isActive = true;

    const loadEligibility = async () => {
      if (!matchingBorrowers.length) return;

      const missing = matchingBorrowers.filter((b) => eligibilityById[b.id] === undefined);
      if (!missing.length) return;

      setIsCheckingEligibility(true);

      const results = await Promise.all(
        missing.map(async (b) => ({
          id: b.id,
          eligible: await checkBorrowerEligibility(b.id),
        })),
      );

      if (!isActive) return;

      const updates: Record<number, boolean> = {};
      results.forEach(({ id, eligible }) => {
        if (eligible === null) return;
        updates[id] = eligible;
      });

      if (Object.keys(updates).length > 0) {
        setEligibilityById((prev) => ({ ...prev, ...updates }));
      }

      setIsCheckingEligibility(false);
    };

    loadEligibility();

    return () => {
      isActive = false;
    };
  }, [matchingBorrowers, eligibilityById, checkBorrowerEligibility]);

  const getBorrowerEligibilityStatus = useCallback(
    (b: Borrower) => {
      const inferred = getEligibilityFromBorrower(b);
      if (inferred === false) return false;

      const resolved = eligibilityById[b.id];
      if (resolved === false) return false;

      return true;
    },
    [eligibilityById, getEligibilityFromBorrower]
  );

  const filteredBorrowers = useMemo(() => {
    return matchingBorrowers;
  }, [matchingBorrowers]);


  const handleSelectBorrower = async (borrower: Borrower) => {
    setIsCheckingEligibility(true);
    setBorrowerError("");
    try {
      if (borrower.id === selectedBorrower?.id) {
        return;
      }
      
      const inferredEligibility = getEligibilityFromBorrower(borrower);

      if (inferredEligibility === false) {
        setBorrowerError("This borrower has an active or pending loan. Existing loans must be fully paid before re-loaning.");
        setEligibilityById((prev) => ({ ...prev, [borrower.id]: false }));
        setSelectedBorrower(null);
        setFormData((prev) => ({
          ...prev,
          borrower_id: "",
          borrower_name: "",
          monthly_income: "",
        }));
        return;
      }

      if (inferredEligibility === true) {
        setEligibilityById((prev) => ({ ...prev, [borrower.id]: true }));
        setSelectedBorrower(borrower);
        setBorrowerSearch(borrower.name);
        setFormData((prev) => ({
          ...prev,
          borrower_id: borrower.id,
          borrower_name: borrower.name,
        }));
        await fetchBorrowerIncome(borrower.id);
        setBorrowerError("");
        return;
      }

      const knownEligibility = eligibilityById[borrower.id];

      if (knownEligibility === false) {
        setBorrowerError("This borrower has an active or pending loan. Existing loans must be fully paid before re-loaning.");
        setSelectedBorrower(null);
        setFormData((prev) => ({
          ...prev,
          borrower_id: "",
          borrower_name: "",
          monthly_income: "",
        }));
        return;
      }

      if (knownEligibility === undefined) {
        const eligible = await checkBorrowerEligibility(borrower.id);
        if (eligible === false) {
          setBorrowerError("This borrower has an active or pending loan. Existing loans must be fully paid before re-loaning.");
          setEligibilityById((prev) => ({ ...prev, [borrower.id]: false }));
          setSelectedBorrower(null);
          setFormData((prev) => ({
            ...prev,
            borrower_id: "",
            borrower_name: "",
            monthly_income: "",
          }));
          return;
        }

        if (eligible === true) {
          setEligibilityById((prev) => ({ ...prev, [borrower.id]: true }));
        }
      }

      setSelectedBorrower(borrower);
      setBorrowerSearch(borrower.name);
      setFormData((prev) => ({
        ...prev,
        borrower_id: borrower.id,
        borrower_name: borrower.name,
      }));
      await fetchBorrowerIncome(borrower.id);
      setBorrowerError("");
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  const handleNext = async () => {
    if (!selectedBorrower) {
      setBorrowerError("Please select a borrower from the list.");
      focusField("borrower_name");
      return;
    }

    setIsCheckingEligibility(true);
    try {
      const inferredEligibility = getEligibilityFromBorrower(selectedBorrower);
      if (inferredEligibility === false) {
        setBorrowerError("This borrower has an active or pending loan. Existing loans must be fully paid before re-loaning.");
        setEligibilityById((prev) => ({ ...prev, [selectedBorrower.id]: false }));
        return;
      }

      if (inferredEligibility === true) {
        setEligibilityById((prev) => ({ ...prev, [selectedBorrower.id]: true }));
        onNext();
        return;
      }

      const eligible = eligibilityById[selectedBorrower.id];
      if (eligible === false) {
        setBorrowerError("This borrower has an active or pending loan. Existing loans must be fully paid before re-loaning.");
        return;
      }

      if (eligible === undefined) {
        const verified = await checkBorrowerEligibility(selectedBorrower.id);
        if (verified === false) {
          setBorrowerError("This borrower has an active or pending loan. Existing loans must be fully paid before re-loaning.");
          return;
        }
      }

      onNext();
    } finally {
      setIsCheckingEligibility(false);
    }
  };

  return (
    <section className="py-8 md:py-16 px-6 md:px-12 bg-[#F7F5F3]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Borrower Selection</h1>
          <p className="text-sm text-gray-600 mb-5">Only borrowers without active or pending loans can proceed.</p>
          <StepIndicator currentStep={indicatorIndex} steps={indicatorLabels} />
          
        </div>

        <div className="bg-white rounded-lg p-6 md:p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Borrower Name
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="borrower_name"
                data-field="borrower_name"
                autoComplete="off"
                value={borrowerSearch}
                onChange={(e) => {
                  setBorrowerSearch(e.target.value);
                  setBorrowerError("");
                  if (!e.target.value) {
                    setSelectedBorrower(null);
                    setFormData((prev) => ({
                      ...prev,
                      borrower_id: "",
                      borrower_name: "",
                      monthly_income: "",
                    }));
                  }
                }}
                placeholder="Search borrower..."
                className="bg-[#F7F5F3] border-gray-300 rounded-md w-full border p-2"
              />
              {borrowerSearch.length > 0 && filteredBorrowers.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredBorrowers.map((b) => {
                    const isEligible = getBorrowerEligibilityStatus(b);
                    return (
                      <div
                        key={b.id}
                        onClick={() => void handleSelectBorrower(b)}
                        className={`px-3 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center ${
                          !isEligible ? "opacity-80 bg-red-50/40" : ""
                        }`}
                      >
                        <span className={!isEligible ? "text-gray-700 font-medium" : "text-gray-900"}>
                          {b.name}
                        </span>
                        {!isEligible && (
                          <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-semibold uppercase tracking-wider">
                            Has Existing Loan
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {selectedBorrower && (
              <p className="text-green-500 text-sm mt-1">Borrower selected (ID: {selectedBorrower.id})</p>
            )}
            {borrowerError && <p className="text-red-500 text-sm mt-1">{borrowerError}</p>}
            {!borrowerError && backendBorrowerError && (
              <p className="text-red-500 text-sm mt-1">{backendBorrowerError}</p>
            )}
            {!borrowerError && !backendBorrowerError && submitError && (
              <p className="text-red-500 text-sm mt-1">{submitError}</p>
            )}
            {!borrowerError && borrowerSearch && filteredBorrowers.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">No borrowers found.</p>
            )}
            {isCheckingEligibility && (
              <p className="text-xs text-gray-500 mt-1">Checking loan status...</p>
            )}
            {isFetchingIncome && (
              <p className="text-xs text-gray-500 mt-1">Loading borrower income...</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Borrower ID
              <span className="text-red-500 ml-1">*</span>
            </label>
            <input
              type="text"
              name="borrower_id"
              data-field="borrower_id"
              autoComplete="off"
              value={formData.borrower_id ?? ""}
              onChange={() => {}}
              className="bg-[#F7F5F3] border-gray-300 rounded-md w-full border p-2"
              readOnly
            />
            {fieldErrors.borrower_id && <p className="text-red-500 text-sm mt-1">{fieldErrors.borrower_id}</p>}
          </div>

          <div className="flex justify-end">
            <Button 
              type="button" 
              className="bg-golden text-black min-w-[120px]" 
              onClick={handleNext}
              disabled={isCheckingEligibility}
            >
              {isCheckingEligibility ? "Checking..." : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BorrowerStep;
