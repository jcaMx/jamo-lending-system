import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import InfoCard from '@/components/InfoCard'

/* ---------------- TYPES ---------------- */

type Loan = {
  loanNo: string
  released: string
  maturity: string
  repayment: string
  principal: number
  interest: string
  interestType: string
  penalty: number
  due: number
  balance: number
  status: string
}

interface Props {
  borrower: {
    name: string
    email: string
    contact_no: string
  } | null
  loan: Loan | null
}

/* ---------------- COMPONENT ---------------- */

export default function CustomerDashboard({ borrower, loan }: Props) {
  const safeLoan: Loan = loan ?? {
    loanNo: '-',
    released: '-',
    maturity: '-',
    repayment: '-',
    principal: 0,
    interest: '-',
    interestType: '-',
    penalty: 0,
    due: 0,
    balance: 0,
    status: 'No Active Loan',
  }

  return (
    <AppLayout>
      <Head title="My Loan Dashboard" />

      {!borrower ? (
        /* ---------------- NO BORROWER STATE ---------------- */
        <div className="flex items-center justify-center min-h-[70vh]">
          <div className="bg-white rounded-xl shadow p-8 max-w-md text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              No borrower record found
            </h2>
            <p className="text-gray-500 mb-6">
              You don’t have an active borrower profile yet.
            </p>

            <a
              href="/applynow"
              className="inline-block px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition"
            >
              Apply for a Loan
            </a>
          </div>
        </div>
      ) : (
        <>
          {/* ---------------- BORROWER INFO ---------------- */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Borrower Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoCard title="Name" value={borrower.name} />
              <InfoCard title="Email" value={borrower.email} />
              <InfoCard title="Contact" value={borrower.contact_no} />
            </div>
          </section>

          {/* ---------------- LOAN INFO ---------------- */}
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Loan Overview
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <InfoCard title="Loan No." value={safeLoan.loanNo} />
              <InfoCard title="Released" value={safeLoan.released} />
              <InfoCard title="Maturity" value={safeLoan.maturity} />
              <InfoCard title="Repayment" value={safeLoan.repayment} />

              <InfoCard
                title="Principal"
                value={`₱${safeLoan.principal.toLocaleString()}`}
              />

              <InfoCard
                title="Interest"
                value={safeLoan.interest}
              />

              <InfoCard
                title="Balance"
                value={`₱${safeLoan.balance.toLocaleString()}`}
              />

              <InfoCard
                title="Status"
                value={safeLoan.status}
                badge={safeLoan.status}
                badgeColor={
                  safeLoan.status === 'Active'
                    ? 'green'
                    : safeLoan.status === 'Fully_Paid'
                    ? 'blue'
                    : 'yellow'
                }
              />
            </div>
          </section>
        </>
      )}
    </AppLayout>
  )
}
