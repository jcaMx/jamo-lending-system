Absolutely! Here's a clear and structured **Markdown documentation** for your lending system's document and borrower/loan requirements:

---

# 📄 Jamo Lending - Document & Borrower Requirements

## 1. Overview

This documentation describes the **document management system** and **borrower/loan requirements** in Jamo Lending.

* All uploaded documents are stored in a **polymorphic `documents` table**.
* Document types are defined in a central **`document_types` table**.
* Loan products define whether **collateral** or **co-borrower** forms are required.
* Borrower registration is structured in **multi-step forms**, each requiring specific documents.

---

## 2. Database Tables

### 2.1 `document_types`

Defines all possible document types in the system.

| Field        | Type            | Description                                                                                             |
| ------------ | --------------- | ------------------------------------------------------------------------------------------------------- |
| `id`         | bigint          | Primary key                                                                                             |
| `code`       | string (unique) | System identifier (e.g., GOV_ID, PAYSLIP, LAND_TITLE)                                                   |
| `name`       | string          | Human-readable name                                                                                     |
| `category`   | string          | Category of document (borrower_identity, borrower_address, borrower_employment, collateral, coborrower) |
| `is_active`  | boolean         | Whether this document type is currently active                                                          |
| `timestamps` | datetime        | Created/updated timestamps                                                                              |

**Example Entries:**

| code          | name           | category            |
| ------------- | -------------- | ------------------- |
| GOV_ID        | Government ID  | borrower_identity   |
| UTILITY_BILL  | Utility Bill   | borrower_address    |
| PAYSLIP       | Payslip        | borrower_employment |
| LAND_TITLE    | Land Title     | collateral          |
| COBORROWER_ID | Co-borrower ID | coborrower          |

---

### 2.2 `documents`

Stores uploaded files using a polymorphic relationship.

| Field               | Type      | Description                                                     |
| ------------------- | --------- | --------------------------------------------------------------- |
| `id`                | bigint    | Primary key                                                     |
| `document_type_id`  | bigint    | Foreign key to `document_types`                                 |
| `file_name`         | string    | Uploaded file name                                              |
| `file_path`         | string    | File storage path                                               |
| `mime_type`         | string    | File MIME type                                                  |
| `file_size`         | bigint    | File size in bytes                                              |
| `description`       | text      | Optional description                                            |
| `documentable_id`   | bigint    | Polymorphic owner ID                                            |
| `documentable_type` | string    | Polymorphic owner type (Borrower, Collateral, CoBorrower, Loan) |
| `status`            | enum      | `pending`, `approved`, `rejected`                               |
| `verified_by`       | bigint    | Staff user ID who verified document                             |
| `verified_at`       | timestamp | Verification timestamp                                          |
| `timestamps`        | datetime  | Created/updated timestamps                                      |

**Polymorphic Owners:**

* Borrower → Profile, Address, Employment
* Collateral → Land, Vehicle, Property
* CoBorrower → Co-borrower identification
* Loan → Loan-specific documents (optional)

---

### 2.3 `loan_product_rules`

Defines dynamic rules for loan products regarding collateral and co-borrowers.

| Field                       | Type     | Description                                        |
| --------------------------- | -------- | -------------------------------------------------- |
| `id`                        | bigint   | Primary key                                        |
| `loan_product_id`           | bigint   | Reference to loan product                          |
| `requires_collateral`       | boolean  | Whether collateral form is required                |
| `requires_coborrower`       | boolean  | Whether co-borrower form is required               |
| `collateral_required_above` | decimal  | Optional amount above which collateral is required |
| `timestamps`                | datetime | Created/updated timestamps                         |

---

## 3. Borrower Registration Flow

### Step 1: Profile

* **Required Documents:** 2+ valid IDs (GOV_ID, PASSPORT, etc.)
* Polymorphic owner: Borrower

### Step 2: Address

* **Required Documents:** 1+ (Utility Bill, Barangay Certificate, Lease Contract)
* Polymorphic owner: Borrower

### Step 3: Employment

* **Required Documents:** 2+ (Payslip, Certificate of Employment)
* Polymorphic owner: Borrower

### Step 4: Confirmation

* Verify all documents uploaded meet minimum requirements

---

## 4. Loan Creation Flow

* Loan products determine whether **Collateral** and **Co-borrower** forms are displayed.
* Rules are defined in `loan_product_rules`:

| Loan Product   | Collateral Required      | Co-borrower Required       |
| -------------- | ------------------------ | -------------------------- |
| Personal Loan  | ❌ Optional               | ⚠ Optional (based on risk) |
| Home Loan      | ✅ Required               | ⚠ Required/Conditional     |
| Business Loan  | ⚠ Required (high amount) | ⚠ Often Required           |
| Emergency Loan | ❌ Not required           | ❌ Not required             |

* Collateral and Co-borrower documents are uploaded using **polymorphic documents**.

---

## 5. Document Validation Rules

* Borrower cannot proceed until **minimum required documents** are uploaded.
* Collateral and Co-borrower requirements are **dynamically enforced** based on selected loan product.
* Each document has a **verification workflow**:

  * Status: `pending` → `approved` / `rejected`
  * Verified by staff user

---

## 6. Polymorphic Relationship

**Documents Table** → `documentable_type` / `documentable_id`
Examples:

| document_type | documentable_type | documentable_id |
| ------------- | ----------------- | --------------- |
| GOV_ID        | Borrower          | 5               |
| LAND_TITLE    | Collateral        | 3               |
| COBORROWER_ID | CoBorrower        | 2               |

---

## 7. Advantages of This Design

* Scalable for **any loan product**
* Supports **dynamic rules** for collateral & co-borrowers
* Clean **document tracking** and **verification workflow**
* Reusable for borrower, loan, collateral, and co-borrower
* Easy to extend in future (new document types, rules, or requirements)

---

## 8. Laravel Commands / Migrations

```bash
# Create migrations
php artisan make:migration create_document_types_table
php artisan make:migration create_documents_table
php artisan make:migration create_loan_product_rules_table

# Run all migrations
php artisan migrate
```

---

Absolutely! Here’s a **concise summary** of the changes you made to your lending system project so far:

---

## **Database Changes**

1. **`files` table (polymorphic documents)**

   * Replaced old rigid `files` table with polymorphic structure (`documentable_id`, `documentable_type`)
   * Tracks documents for **borrowers, collaterals, co-borrowers, loans**
   * Added `document_type_id`, `status`, `verified_by`, `verified_at`

2. **`document_types` table**

   * Lookup table for all document types
   * Categories: `borrower_identity`, `borrower_address`, `borrower_employment`, `collateral`, `coborrower`
   * Seeded with many IDs (Passport, Driver’s License, SSS, GSIS, Voter’s ID, UMID, etc.) and income documents (Payslip, ITR, COE)

3. **Loan products and rules**

   * `loan_products` table: stores products like Personal Loan, Home Loan, Business Loan, Emergency Loan
   * `loan_product_rules` table: defines **collateral & co-borrower requirements per product**

     * Example: Personal Loan → no collateral, co-borrower required
     * Home Loan → collateral + co-borrower required
     * Business Loan → collateral + co-borrower, with dynamic collateral threshold

---

## **Seeder Changes**

* `DocumentTypesSeeder` → populates all document types
* `LoanProductsSeeder` → populates loan products + associated rules

---

## **Form/Business Logic Implications**

1. Borrower registration now **requires documents by step**:

   * Step 1: IDs (2+)
   * Step 2: Address proof (utility bill, barangay cert, lease)
   * Step 3: Employment / income docs (payslip, ITR, COE)

2. Loan application dynamically shows **collateral & co-borrower forms** based on the chosen loan product.

---

In short:

> You now have a **flexible documents system**, **structured loan products with rules**, and **seeded data** so forms and validations can dynamically adjust per borrower and loan product.

---

If you want, I can also make a **tiny ERD diagram** showing **borrowers, files, collateral, co-borrowers, loan products, and rules** in one glance. It would be very handy for your dev team.

Do you want me to make that ERD?
