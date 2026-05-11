classDiagram
    %% Borrower Management Subsystem Architecture

    %% Borrower Domain Models
    class Borrower {
        +int ID
        +int user_id
        +string first_name
        +string last_name
        +string email
        +string contact_no
        +string land_line
        +string marital_status
        +string home_ownership
        +date birth_date
        +date membership_date
        +string status
        +loans() HasMany
        +loan() HasOne
        +borrowerEmployment() HasOne
        +borrowerAddress() HasOne
        +borrowerId() HasOne
        +coBorrowers() HasMany
        +spouse() HasOne
        +files() HasMany
        +disbursements() HasMany
        +user() BelongsTo
    }

    class BorrowerAddress {
        +int ID
        +int borrower_id
        +string address
        +string city
        +belongsToBorrower() BelongsTo
    }

    class BorrowerEmployment {
        +int ID
        +string employment_status
        +string income_source
        +string occupation
        +string position
        +string agency_address
        +decimal monthly_income
        +int borrower_id
        +belongsToBorrower() BelongsTo
    }

    class Spouse {
        +int ID
        +string first_name
        +string last_name
        +string contact_no
        +string occupation
        +string position
        +string agency_address
        +int borrower_id
        +belongsToBorrower() BelongsTo
    }

    class CoBorrower {
        +int ID
        +string first_name
        +string last_name
        +int age
        +date birth_date
        +string address
        +string email
        +string contact_no
        +string occupation
        +string position
        +string agency_address
        +string marital_status
        +string home_ownership
        +int borrower_id
        +belongsToBorrower() BelongsTo
    }

    class BorrowerId {
        +int ID
        +int borrower_id
        +string id_type
        +string id_number
        +belongsToBorrower() BelongsTo
    }

    class Files {
        +int ID
        +string file_type
        +string file_name
        +string file_path
        +datetime uploaded_at
        +string description
        +int borrower_id
        +int collateral_id
        +borrower() BelongsTo
    }

    class Loan {
        +int ID
        +int borrower_id
        +string status
        +decimal balance_remaining
        +hasCollateral() HasOne
    }

    class Disbursement {
        +int ID
        +int borrower_id
        +int loan_id
        +loan() BelongsTo
    }

    class LoanComment {
        +int ID
        +string comment_text
        +datetime comment_date
        +int loan_id
        +belongsToLoan() BelongsTo
    }

    class User {
        +int id
        +string name
        +string email
        +notify(notification) void
    }

    class DocumentType {
        +int id
        +string code
        +string name
        +string category
        +string description
        +bool is_active
    }

    %% Services
    class BorrowerService {
        +getBorrowersForIndex() Collection
        +getBorrowerForShow(borrowerId) array
        +createBorrower(data) Borrower
        +updateBorrower(borrower, data) Borrower
        +update(borrower, data) void
        +deleteBorrower(borrowerId) bool
        +computeAge(dateOfBirth) int
    }

    class UserService {
        +createCustomerUser(data) array
    }

    class DisbursementService {
        +getHistoricalOrCurrentFeeBreakdown(loan) array
    }

    %% Controllers
    class BorrowerController {
        +index() Response
        +add() Response
        +show(id) Response
        +store(request) Response
        +update(request, borrower) Response
        +destroy(id) Response
        +checkLoans(id) JsonResponse
        +income(id) JsonResponse
    }

    %% Relationships
    Borrower --> BorrowerAddress : hasOne
    Borrower --> BorrowerEmployment : hasOne
    Borrower --> BorrowerId : hasOne
    Borrower --> Spouse : hasOne
    Borrower --> CoBorrower : hasMany
    Borrower --> Files : hasMany
    Borrower --> Loan : hasMany
    Borrower --> Disbursement : hasMany
    Borrower --> User : belongsTo

    BorrowerAddress --> Borrower : belongsTo
    BorrowerEmployment --> Borrower : belongsTo
    Spouse --> Borrower : belongsTo
    CoBorrower --> Borrower : belongsTo
    BorrowerId --> Borrower : belongsTo
    Files --> Borrower : belongsTo

    Loan --> Borrower : belongsTo
    LoanComment --> Loan : belongsTo
    Disbursement --> Loan : belongsTo

    BorrowerService --> UserService : uses
    BorrowerService --> DisbursementService : uses
    BorrowerService --> Borrower : uses
    BorrowerService --> Files : uses
    BorrowerService --> BorrowerAddress : uses
    BorrowerService --> BorrowerEmployment : uses
    BorrowerService --> Spouse : uses
    BorrowerService --> CoBorrower : uses
    BorrowerService --> BorrowerId : uses
    BorrowerService --> DocumentType : uses

    BorrowerController --> BorrowerService : uses
    BorrowerController --> Borrower : uses
    BorrowerController --> Loan : uses
    BorrowerController --> DocumentType : uses