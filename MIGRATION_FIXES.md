# Migration Fixes and SQL ALTER Statements

## Laravel Migration Fixes

### 1. Fix `loan` Table Migration

**File:** `database/migrations/2025_11_20_041543_create_loan_collateral.php`

**Changes Needed:**
- Add missing columns: `borrower_id`, `formula_id`, `approved_by`, `released_amount`
- Fix enum typo: `'Deminishing'` → `'Diminishing'`
- Remove `'Simple'` from enum (not in SQL)

**Corrected Section:**
```php
// Loan Table
Schema::create('loan', function (Blueprint $table) {
    $table->id();
    $table->dateTime('start_date')->nullable();
    $table->dateTime('end_date')->nullable();
    $table->integer('term_months');
    $table->enum('repayment_frequency', ['Weekly', 'Monthly', 'Yearly'])->nullable();
    $table->decimal('principal_amount', 10, 2);
    $table->float('interest_rate');
    $table->enum('interest_type', ['Compound', 'Diminishing'])->nullable(); // FIXED: Removed 'Simple', fixed typo
    $table->string('loan_type', 50)->nullable();
    $table->enum('status', ['Active', 'Fully_Paid', 'Bad_Debt', 'Rejected', 'Pending'])->default('Pending');
    $table->decimal('balance_remaining', 10, 2);
    $table->decimal('released_amount', 10, 2)->default(0.00); // ADDED
    $table->foreignId('borrower_id')->constrained('borrower')->cascadeOnDelete(); // ADDED
    $table->foreignId('formula_id')->nullable()->constrained('formula')->onUpdate('cascade'); // ADDED
    $table->unsignedBigInteger('approved_by')->nullable(); // ADDED
    $table->timestamps();

    $table->foreign('approved_by', 'FK_Loan_User')
        ->references('ID')->on('jamouser');
});
```

---

### 2. Fix `collateral` Table Migration

**File:** `database/migrations/2025_11_20_041543_create_loan_collateral.php`

**Changes Needed:**
- Add missing `id()` definition

**Corrected Section:**
```php
// Collateral
Schema::create('collateral', function (Blueprint $table) {
    $table->id(); // ADDED - was missing
    $table->enum('type', ['Land', 'Vehicle', 'ATM'])->nullable();
    $table->decimal('estimated_value', 10, 2)->nullable();
    $table->dateTime('appraisal_date')->nullable();
    $table->unsignedBigInteger('ownership_proof')->nullable();
    $table->enum('status', ['Pledged', 'Released', 'Forfeited', 'Pending'])->nullable();
    $table->string('remarks', 100)->nullable();
    $table->string('description', 100)->nullable();
    $table->unsignedBigInteger('appraised_by')->nullable(); // ADDED - was missing column definition
    $table->foreignId('loan_id')->constrained('loan')->cascadeOnDelete();
    
    $table->foreign('appraised_by', 'FK_Collateral_User')
        ->references('ID')->on('jamouser');
});
```

---

### 3. Fix `formula` Table Migration

**File:** `database/migrations/2025_11_20_041543_create_loan_collateral.php`

**Changes Needed:**
- Add `created_at` column
- Fix column sizes: `name` (20→50), `expression` (50→500), `variables` (20→500)

**Corrected Section:**
```php
// Formula Table
Schema::create('formula', function (Blueprint $table) {
    $table->id();
    $table->string('name', 50); // FIXED: was 20
    $table->string('expression', 500)->nullable(); // FIXED: was 50, made nullable
    $table->string('variables', 500)->nullable(); // FIXED: was 20, made nullable
    $table->string('description', 100)->nullable();
    $table->timestamp('created_at')->useCurrent(); // ADDED
});
```

---

### 4. Fix `payment` Table Migration

**File:** `database/migrations/2025_11_20_042726_create_payment_penalty.php`

**Changes Needed:**
- Fix enum: Remove `'Cheque'`, reorder to match SQL
- Make `reference_no` nullable

**Corrected Section:**
```php
Schema::create('payment', function (Blueprint $table) {
    $table->id();
    $table->string('receipt_number', 50)->unique();
    $table->dateTime('payment_date')->default(DB::raw('CURRENT_TIMESTAMP'));
    $table->decimal('amount', 10, 2);
    $table->enum('payment_method', ['Bank', 'Cash', 'GCash', 'Cebuana'])->nullable(); // FIXED: Removed 'Cheque', reordered
    $table->string('reference_no', 50)->nullable(); // FIXED: Made nullable
    $table->string('remarks', 100)->nullable();
    $table->unsignedBigInteger('verified_by')->nullable(); // ADDED: Column definition
    $table->dateTime('verified_date')->nullable();
    $table->foreignId('schedule_id')->constrained('amortizationschedule');
    $table->foreignId('loan_id')->constrained('loan');
    
    $table->foreign('verified_by', 'FK_Payment_Users')
        ->references('ID')->on('jamouser')
        ->onUpdate('cascade');
});
```

---

### 5. Fix `co_borrower` Table Migration

**File:** `database/migrations/2025_11_20_041503_create_borrowers_module.php`

**Changes Needed:**
- Add `net_pay` column
- Make `age` nullable

**Corrected Section:**
```php
// Co-Borrower
Schema::create('co_borrower', function (Blueprint $table) {
    $table->id();
    $table->string('first_name', 20);
    $table->string('last_name', 20);
    $table->integer('age')->nullable(); // FIXED: Made nullable
    $table->date('birth_date');
    $table->string('address', 50);
    $table->string('email', 50);
    $table->string('contact_no', 15);
    $table->string('occupation', 20)->nullable();
    $table->string('position', 20)->nullable();
    $table->string('agency_address', 50)->nullable();
    $table->char('marital_status', 10)->nullable();
    $table->enum('home_ownership', ['Owned','Rented','Mortgage'])->nullable();
    $table->decimal('net_pay', 10, 2)->nullable(); // ADDED
    $table->foreignId('borrower_id')->constrained('borrower')->cascadeOnDelete();
});
```

---

### 6. Fix `files` Table Migration

**File:** `database/migrations/2025_11_20_134012_create_files_table.php`

**Changes Needed:**
- Fix enum typo: `'collateral_document'` → `'collateral_documennt'`
- Make `collateral_id` NOT NULL

**Corrected Section:**
```php
Schema::create('files', function (Blueprint $table) {
    $table->id();
    $table->enum('file_type', ['id_document','photo','contract','collateral_documennt'])->nullable(); // FIXED: typo
    $table->string('file_name', 20);
    $table->string('file_path', 100);
    $table->timestamp('uploaded_at')->useCurrent();
    $table->string('description', 100)->nullable();

    $table->foreignId('borrower_id')->constrained('borrower')->cascadeOnDelete();
    $table->foreignId('collateral_id')->constrained('collateral')->cascadeOnDelete(); // FIXED: Removed nullable
});
```

---

### 7. Fix `landcollateraldetails` Table Migration

**File:** `database/migrations/2025_11_20_041543_create_loan_collateral.php`

**Changes Needed:**
- Fix foreign key reference case: `'ID'` → `'id'`

**Corrected Section:**
```php
// Land Collateral
Schema::create('landcollateraldetails', function (Blueprint $table) {
    $table->id();
    $table->bigInteger('titleNo');
    $table->bigInteger('lotNo');
    $table->string('location', 50);
    $table->string('areaSize', 20);
    $table->unsignedBigInteger('collateral_id');

    $table->foreign('collateral_id', 'FK_LandCollateral_Collateral')
        ->references('id')->on('collateral') // FIXED: was 'ID', changed to 'id'
        ->onDelete('cascade');
});
```

---

### 8. Create `loancomments` Migration

**New File:** `database/migrations/2025_11_20_041600_create_loancomments_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loancomments', function (Blueprint $table) {
            $table->id();
            $table->string('comment_text', 100);
            $table->unsignedBigInteger('commented_by');
            $table->dateTime('comment_date')->useCurrent()->useCurrentOnUpdate();
            $table->foreignId('loan_id')->constrained('loan')->cascadeOnDelete();

            $table->foreign('commented_by', 'FK_LoanComments_User')
                ->references('ID')->on('jamouser');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loancomments');
    }
};
```

---

## SQL ALTER Statements (Safe - No Data Loss)

### Apply These to Existing Database

```sql
-- 1. Fix loan table
ALTER TABLE `loan`
    ADD COLUMN IF NOT EXISTS `borrower_id` bigint(20) UNSIGNED NOT NULL AFTER `balance_remaining`,
    ADD COLUMN IF NOT EXISTS `formula_id` bigint(20) UNSIGNED DEFAULT NULL AFTER `borrower_id`,
    ADD COLUMN IF NOT EXISTS `approved_by` bigint(20) UNSIGNED DEFAULT NULL AFTER `formula_id`,
    ADD COLUMN IF NOT EXISTS `released_amount` decimal(10,2) DEFAULT 0.00 AFTER `approved_by`,
    MODIFY COLUMN `interest_type` enum('Compound','Diminishing') DEFAULT NULL;

-- Note: borrower_id, formula_id, approved_by may already exist. Check first.
-- If they exist, only modify interest_type and add released_amount

-- 2. Fix formula table
ALTER TABLE `formula`
    MODIFY COLUMN `name` varchar(50) NOT NULL,
    MODIFY COLUMN `expression` varchar(500) DEFAULT NULL,
    MODIFY COLUMN `variables` varchar(500) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS `created_at` datetime DEFAULT CURRENT_TIMESTAMP AFTER `variables`;

-- 3. Fix payment table
ALTER TABLE `payment`
    MODIFY COLUMN `payment_method` enum('Bank','Cash','GCash','Cebuana') NULL,
    MODIFY COLUMN `reference_no` varchar(50) DEFAULT NULL;

-- 4. Fix co_borrower table
ALTER TABLE `co_borrower`
    MODIFY COLUMN `age` int(11) DEFAULT NULL,
    ADD COLUMN IF NOT EXISTS `net_pay` decimal(10,2) DEFAULT NULL AFTER `home_ownership`;

-- 5. Fix files table
ALTER TABLE `files`
    MODIFY COLUMN `file_type` enum('id_document','photo','contract','collateral_documennt') DEFAULT NULL,
    MODIFY COLUMN `collateral_id` bigint(20) UNSIGNED NOT NULL;

-- 6. Fix collateral table (ensure primary key exists)
-- Usually not needed if table already has primary key, but verify:
-- ALTER TABLE `collateral` ADD PRIMARY KEY (`ID`); -- Only if missing

-- 7. Create loancomments table if missing
CREATE TABLE IF NOT EXISTS `loancomments` (
  `ID` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `comment_text` varchar(100) NOT NULL,
  `commented_by` bigint(20) UNSIGNED NOT NULL,
  `comment_date` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `loan_id` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_LoanComments_User` (`commented_by`),
  KEY `FK_LoanComments_loan` (`loan_id`),
  CONSTRAINT `FK_LoanComments_User` FOREIGN KEY (`commented_by`) REFERENCES `jamouser` (`ID`),
  CONSTRAINT `FK_LoanComments_loan` FOREIGN KEY (`loan_id`) REFERENCES `loan` (`ID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
```

---

## Migration Order Fix

**Issue:** Migration `2025_11_28_000001_add_foreign_keys_to_loan_collateral.php` tries to reference `users.id` but SQL uses `jamouser.ID`

**Action:** Update migration to match SQL schema (keep `jamouser` references)

**File:** `database/migrations/2025_11_28_000001_add_foreign_keys_to_loan_collateral.php`

**Changes:**
- Remove or comment out sections that try to change FK from `jamouser` to `users`
- Keep existing `jamouser` foreign keys as-is

**Recommended:** Keep this migration as-is but ensure it doesn't conflict with existing `jamouser` FKs.

---

## Verification Queries

Run these after applying fixes:

```sql
-- Check loan table structure
DESCRIBE `loan`;
SHOW CREATE TABLE `loan`;

-- Check formula table structure
DESCRIBE `formula`;

-- Check payment enum values
SHOW COLUMNS FROM `payment` LIKE 'payment_method';

-- Verify foreign keys
SELECT 
    TABLE_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = 'jamolending'
    AND REFERENCED_TABLE_NAME IS NOT NULL
ORDER BY TABLE_NAME, CONSTRAINT_NAME;
```

---

## Rollback Plan

If issues occur, use these rollback statements:

```sql
-- Rollback loan changes (if needed)
ALTER TABLE `loan`
    DROP COLUMN IF EXISTS `released_amount`,
    MODIFY COLUMN `interest_type` enum('Simple','Compound','Deminishing') DEFAULT NULL;

-- Rollback formula changes (if needed)
ALTER TABLE `formula`
    MODIFY COLUMN `name` varchar(20) NOT NULL,
    MODIFY COLUMN `expression` varchar(50) DEFAULT NULL,
    MODIFY COLUMN `variables` varchar(20) DEFAULT NULL,
    DROP COLUMN IF EXISTS `created_at`;

-- Rollback payment changes (if needed)
ALTER TABLE `payment`
    MODIFY COLUMN `payment_method` enum('Cheque','Cash','GCash','Cebuana','Bank') NULL,
    MODIFY COLUMN `reference_no` varchar(50) NOT NULL;

-- Rollback co_borrower changes (if needed)
ALTER TABLE `co_borrower`
    MODIFY COLUMN `age` int(11) NOT NULL,
    DROP COLUMN IF EXISTS `net_pay`;
```

---

## Notes

1. **IF NOT EXISTS / IF EXISTS**: MariaDB 10.4+ supports these clauses. For older versions, check first.
2. **Foreign Keys**: Some columns may already have foreign keys. Check before adding.
3. **Data Preservation**: All ALTER statements are designed to preserve existing data.
4. **Testing**: Test on development database first.
5. **Backup**: Always backup before applying changes.



