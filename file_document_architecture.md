classDiagram
    %% File and Document Management System Architecture

    %% Models
    class File {
        +int id
        +int documentable_id
        +string documentable_type
        +int document_type_id
        +string status
        +int verified_by
        +datetime verified_at
        +string file_type
        +string file_name
        +string file_path
        +datetime uploaded_at
        +string description
        +int borrower_id (legacy)
        +int collateral_id (legacy)
        +documentable() MorphTo
        +documentType() BelongsTo
        +borrower() BelongsTo
        +collateral() BelongsTo
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
        +collateral() BelongsTo
    }

    class DocumentType {
        +int id
        +string code
        +string name
        +string category
        +string description
        +bool is_active
    }

    class LoanProductDocumentRequirement {
        +int id
        +int loan_product_id
        +string requirement_type
        +int document_type_id
        +string document_category
        +string subject_type
        +string collateral_type
        +bool is_required
        +int min_count
        +int max_count
        +int sort_order
        +string notes
        +bool is_active
        +loanProduct() BelongsTo
        +documentType() BelongsTo
    }

    class Borrower {
        +int ID
        +string name
        +files() MorphMany
    }

    class Collateral {
        +int ID
        +string type
        +files() MorphMany
    }

    %% Services
    class FileService {
        +FileRepository repository
        +getAll() File[]
        +getById(id) File
        +create(data) File
        +update(id, data) File
        +delete(id) bool
    }

    %% Repositories
    class FileRepository {
        +all() File[]
        +find(id) File
        +create(data) File
        +update(id, data) File
        +delete(id) bool
    }

    %% Controllers
    class FileController {
        +FileService service
        +index() JsonResponse
        +show(id) JsonResponse
        +store(request) JsonResponse
        +update(request, id) JsonResponse
        +destroy(id) JsonResponse
    }

    class FilesController {
        +store(request) void
    }

    %% Relationships
    File --> DocumentType : belongsTo
    File --> Borrower : morphTo (documentable)
    File --> Collateral : morphTo (documentable)
    Files --> Borrower : belongsTo
    Files --> Collateral : belongsTo
    LoanProductDocumentRequirement --> DocumentType : belongsTo

    FileService --> FileRepository : uses
    FileController --> FileService : uses
    FilesController --> Files : uses

    Borrower --> File : morphMany (files)
    Collateral --> File : morphMany (files)