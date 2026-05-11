classDiagram
    %% Payment and Collection System Architecture

    %% Core Domain Models
    class Loan {
        +int ID
        +decimal balance_remaining
        +string status
        +string repayment_frequency
        +float interest_rate
        +int borrower_id
        +borrower() BelongsTo
        +amortizationSchedules() HasMany
        +payments() HasMany
    }

    class Borrower {
        +int ID
        +string first_name
        +string last_name
        +string email
        +loans() HasMany
    }

    class Payment {
        +int ID
        +string receipt_number
        +datetime payment_date
        +decimal amount
        +string status
        +string payment_method
        +string reference_no
        +int loan_id
        +int schedule_id
        +loan() BelongsTo
        +amortizationSchedule() BelongsTo
        +scheduleAllocations() HasMany
    }

    class AmortizationSchedule {
        +int ID
        +int installment_no
        +decimal installment_amount
        +decimal interest_amount
        +decimal penalty_amount
        +decimal amount_paid
        +decimal rebate_amount
        +datetime due_date
        +ScheduleStatus status
        +int loan_id
        +loan() BelongsTo
        +payment() HasMany
        +penalty() HasMany
    }

    class PaymentScheduleAllocation {
        +int ID
        +int payment_id
        +int loan_id
        +int schedule_id
        +decimal applied_amount
        +decimal principal_applied
        +decimal interest_applied
        +decimal penalty_applied
        +date due_date
        +date payment_date
        +payment() BelongsTo
        +loan() BelongsTo
        +amortizationSchedule() BelongsTo
    }

    class Penalty {
        +int ID
        +PenaltyType type
        +decimal amount
        +datetime date_applied
        +PenaltyStatus status
        +int schedule_id
        +amortizationSchedules() BelongsTo
    }

    class SystemSetting {
        +string key
        +string value
        +string type
        +getValue(key, default) mixed
        +setValue(key, value, type) Model
    }

    class ScheduleStatus {
        +Paid
        +Unpaid
        +Overdue
    }

    %% Services & Interfaces
    class RepaymentService {
        +fetchBorrowersForRepayment() array
        +processPayment(payment, preferredScheduleIds) void
        +applyAdvancePayment(payment, loan, remainingAmount, paymentDate, excludedScheduleIds) float
        +applyPaymentToSchedule(payment, loan, schedule, remainingAmount, paymentDate) float
        +isLoanFullyPaid(loan) bool
        +voidRemainingInterest(loan) void
        +updateLoanBalance(loan) void
        +getNextDueAmount(loan) float
        +getTotalPaid(loan) float
        +applyRebate(loan, currentSchedule) void
    }

    class IPenaltyCalculator {
        <<interface>>
        +calculate(loan) void
    }

    class DefaultPenaltyService {
        +calculate(loan) void
        +applyPenaltyToNextInstallment(loan, overdueSchedule) void
    }

    class LoanService {
        +calculatePenalties(loan) void
    }

    class HolidayService {
        <<interface>>
        +adjustDate(date) datetime
    }

    class FormulaService {
        +evaluate(name, data) mixed
    }

    %% Controllers
    class RepaymentController {
        +add() Response
        +store(request) Response
        +confirm(request, payment) Response
        +verify(payment) Response
    }

    %% Notification Dependency
    class NotifyUser {
        +__construct(message, subject, email, sms)
        +via(notifiable) array
        +toMail(notifiable) MailMessage
        +toArray(notifiable) array
    }

    %% Relationships
    Loan --> Borrower : belongsTo
    Loan --> AmortizationSchedule : hasMany
    Loan --> Payment : hasMany
    RepaymentService --> Loan : uses
    RepaymentService --> Payment : uses
    RepaymentService --> AmortizationSchedule : uses
    RepaymentService --> PaymentScheduleAllocation : uses
    RepaymentService --> SystemSetting : uses
    RepaymentService --> ScheduleStatus : uses

    Payment --> Loan : belongsTo
    Payment --> AmortizationSchedule : belongsTo
    PaymentScheduleAllocation --> Payment : belongsTo
    PaymentScheduleAllocation --> Loan : belongsTo
    PaymentScheduleAllocation --> AmortizationSchedule : belongsTo

    AmortizationSchedule --> Loan : belongsTo
    AmortizationSchedule --> Penalty : hasMany

    DefaultPenaltyService ..|> IPenaltyCalculator : implements
    LoanService --> IPenaltyCalculator : depends on
    DefaultPenaltyService --> Loan : uses
    DefaultPenaltyService --> HolidayService : uses
    DefaultPenaltyService --> FormulaService : uses
    DefaultPenaltyService --> Penalty : creates
    DefaultPenaltyService --> Borrower : notifies
    DefaultPenaltyService --> NotifyUser : uses

    RepaymentController --> RepaymentService : uses
    RepaymentController --> Payment : creates/updates
