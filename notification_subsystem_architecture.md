classDiagram
    %% Notification Subsystem Architecture

    %% Laravel Framework Components
    class Notification {
        <<interface>>
        +via(notifiable) array
        +toMail(notifiable) MailMessage
        +toArray(notifiable) array
    }

    class Notifiable {
        <<trait>>
        +notify(notification) void
        +notifications() HasMany
    }

    class ShouldQueue {
        <<interface>>
        +queue
        +delay
        +connection
    }

    class Queueable {
        <<trait>>
        +queue
        +delay
        +connection
        +onQueue(queue) self
        +onConnection(connection) self
    }

    class MailMessage {
        +subject(subject) self
        +line(text) self
        +action(text, url) self
        +view(template, data) self
    }

    class VonageMessage {
        +content(text) self
        +from(sender) self
    }

    %% Application Components
    class NotifyUser {
        -string message
        -string subject
        -string email
        -string sms
        +__construct(message, subject, email, sms)
        +via(notifiable) array
        +toMail(notifiable) MailMessage
        +toVonage(notifiable) VonageMessage
        +toArray(notifiable) array
    }

    %% Notifiable Models
    class User {
        +int id
        +string name
        +string email
        +string username
        +notify(notification) void
        +notifications() HasMany
    }

    class Borrower {
        +int ID
        +string first_name
        +string last_name
        +string email
        +string contact_no
        +notify(notification) void
        +notifications() HasMany
    }

    %% Services using Notifications
    class LoanService {
        +approveLoan(loan, userId) Loan
        +finalizeLoanDisbursement(loan, amount, date) Loan
        +rejectLoan(loan, reason) Loan
        +sendNotification(borrower, subject, message, email) void
    }

    class DisbursementService {
        +processDisbursement(disbursement) Disbursement
        +sendNotification(borrower, subject, message, email) void
    }

    class UserService {
        +createUser(data) User
        +updateUser(user, data) User
        +sendNotification(user, subject, message, email) void
    }

    class DefaultPenaltyService {
        +applyPenalty(loan) void
        +sendNotification(borrower, subject, message, email) void
    }

    %% Controllers using Notifications
    class DisbursementController {
        +store(request) JsonResponse
        +sendNotification(borrower, subject, message, email) void
    }

    %% Queue System
    class Queue {
        +push(job, queue) void
        +later(delay, job, queue) void
        +dispatch(job) void
    }

    class DatabaseQueue {
        +push(job) void
        +pop() Job
        +delete(job) void
    }

    %% Mail System
    class Mailer {
        +to(address) self
        +send(message) void
        +queue(message) void
    }

    class MailgunMailer {
        +send(message) void
        +queue(message) void
    }

    %% Relationships
    Notification <|-- NotifyUser : extends
    ShouldQueue <|.. NotifyUser : implements
    Queueable <|-- NotifyUser : uses

    Notifiable <|-- User : uses
    Notifiable <|-- Borrower : uses

    NotifyUser --> MailMessage : creates
    NotifyUser --> VonageMessage : creates

    User --> NotifyUser : sends
    Borrower --> NotifyUser : sends

    LoanService --> Borrower : notifies
    LoanService --> NotifyUser : uses

    DisbursementService --> Borrower : notifies
    DisbursementService --> NotifyUser : uses

    UserService --> User : notifies
    UserService --> NotifyUser : uses

    DefaultPenaltyService --> Borrower : notifies
    DefaultPenaltyService --> NotifyUser : uses

    DisbursementController --> Borrower : notifies
    DisbursementController --> NotifyUser : uses

    NotifyUser --> Queue : queued via
    Queue --> DatabaseQueue : uses

    NotifyUser --> Mailer : sends via
    Mailer --> MailgunMailer : uses