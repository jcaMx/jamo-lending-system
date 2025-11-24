export default function LoanFilesTab({ borrower })  {
    return (
        <div className="max-w-4xl mx-auto py-8 px-4">

        {/* Reference screenshot (optional) */}
        <div className="mb-6">
          <h2 className="text-sm font-medium text-gray-600 mb-2">Reference Screenshot</h2>
          <img src="/mnt/data/d2b8086e-aa89-4031-8eb3-6115e8b89cf3.png" alt="screenshot" className="w-full rounded-lg border" />
        </div>

        {/* Card */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden border">
          <div className="px-6 py-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex gap-8">
                  <div>
                    <p className="text-sm text-gray-500">Loan Status</p>
                    <p className="font-semibold">Open</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loan Application ID</p>
                    <p className="font-semibold">APP023</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loan Type</p>
                    <p className="font-semibold">Personal Loan</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="bg-yellow-400 hover:bg-yellow-450 text-gray-800 px-4 py-2 rounded-md text-sm font-medium shadow-sm">
                  Print Statement
                </button>

                <button className="border border-yellow-400 text-yellow-600 px-3 py-2 rounded-md text-sm font-medium hover:bg-yellow-50">
                  Edit Loan
                </button>
              </div>
            </div>
          </div>

            {/* Separator */}
          <div className="border-t"></div>

          {/* Loan Terms */}
            <section className="px-6 py-5">
            <div className="bg-yellow-100 border-l-4 border-yellow-300 px-4 py-2 rounded-sm mb-4">
              <h3 className="font-medium text-yellow-800">Loan Terms</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Principal Amount</span>
                <span className="font-semibold">2000.00</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Loan Release Date</span>
                <span className="font-semibold">10/05/2020</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Loan Interest</span>
                <span className="font-semibold">Personal Loan</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Loan Duration</span>
                <span className="font-semibold">2000.00</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Repayment Frequency</span>
                <span className="font-semibold">Monthly</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Number of Installments</span>
                <span className="font-semibold">5</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Interest Start Date</span>
                <span className="font-semibold">10/05/2020</span>
              </div>
            </div>
          </section>

          <div className="border-t"></div>

          {/* Loan Releasing Fees */}
          <section className="px-6 py-5">
            <div className="bg-yellow-100 border-l-4 border-yellow-300 px-4 py-2 rounded-sm mb-4">
              <h3 className="font-medium text-yellow-800">Loan Releasing Fees</h3>
            </div>

            <div className="max-w-md">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Processing Fee (3%)</span>
                  <span className="font-semibold">60</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Insurance (2%)</span>
                  <span className="font-semibold">40</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Notary Fee (1%)</span>
                  <span className="font-semibold">20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Savings Contribution (1%)</span>
                  <span className="font-semibold">20</span>
                </div>

                <div className="flex justify-between border-t pt-2 mt-2">
                  <span className="font-semibold text-yellow-700">Total</span>
                  <span className="font-semibold text-yellow-700">140</span>
                </div>
              </div>
            </div>
          </section>

          <div className="border-t"></div>

          {/* System Generated Penalties */}
          <section className="px-6 py-5">
            <div className="bg-yellow-100 border-l-4 border-yellow-300 px-4 py-2 rounded-sm mb-4">
              <h3 className="font-medium text-yellow-800">System Generated Penalties</h3>
            </div>

            <p className="text-sm text-gray-600 mb-4">Late Repayment Penalty <span className="font-medium">(6% penalty is charged on overdue amounts.)</span></p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Penalty Fixed Amount</span>
                <span className="font-semibold">60</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Grace Period</span>
                <span className="font-semibold">3 days</span>
              </div>
            </div>
          </section>

          <div className="border-t"></div>

          {/* Footer / actions (optional) */}
          <div className="px-6 py-4 flex justify-end gap-3">
            <button className="text-sm px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-50">Close</button>
            <button className="text-sm px-4 py-2 rounded-md bg-yellow-400 hover:bg-yellow-450 text-gray-800">Print Statement</button>
          </div>
        </div>
        </div>

    
    );
  }
  