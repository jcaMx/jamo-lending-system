# Database Schema Comparison Analysis
## SQL Backup vs Laravel Migrations

**Date:** 2026-01-28  
**Database:** jamolending  
**Engine:** InnoDB, MariaDB 10.4+  
**Charset:** utf8mb4

---

## Executive Summary

**Total Tables in SQL Backup:** 38  
**Total Tables with Migrations:** 30  
**Missing Migrations:** 1 (loancomments)  
**Legacy Tables (no migration needed):** 3 (useraccount, permission, role, rolepermission)  
**Critical Issues:** 12  
**Data Loss Risk:** LOW (most issues are structural)

---

## Table Classification

### Core Data Tables (MUST PRESERVE DATA)
- `borrower`, `borrower_addresses`, `borrower_employments`, `borrower_ids`
- `loan`, `amortizationschedule`, `payment`, `penalty`
- `collateral`, `atmcollateraldetails`, `landcollateraldetails`, `vehiclecollateraldetails`
- `users`, `user_profiles`, `jamouser`
- `holidays`, `formula`
- `files`

### Derived/Generated Tables (SAFE TO REGENERATE)
- `cache`, `cache_locks`, `sessions`
- `jobs`, `job_batches`, `failed_jobs`
- `migrations`
- `permissions`, `roles`, `model_has_permissions`, `model_has_roles`, `role_has_permissions`

### Legacy Tables (DEPRECATED - Can be dropped)
- `useraccount` - Replaced by `users` table
- `permission`, `role`, `rolepermission` - Replaced by Spatie permissions package

### Missing Tables
- `loancomments` - Exists in SQL but no migration found

---

## Detailed Mismatches

### 1. **loan** Table

**Issues:**
- ❌ Missing column definitions: `borrower_id`, `formula_id`, `approved_by`, `released_amount`
- ❌ Enum typo: Migration has `'Deminishing'`, SQL has `'Diminishing'`
- ❌ Foreign key mismatch: `approved_by` references `jamouser.ID` but should reference `users.id` (based on migration 2025_11_28_000001)

**SQL Schema:**
```sql
`borrower_id` bigint(20) UNSIGNED NOT NULL
`formula_id` bigint(20) UNSIGNED DEFAULT NULL
`approved_by` bigint(20) UNSIGNED DEFAULT NULL
`released_amount` decimal(10,2) DEFAULT 0.00
`interest_type` enum('Compound','Diminishing')
```

**Migration Status:** ❌ INCOMPLETE

**Action:** UPDATE MIGRATION (add missing columns, fix enum, fix FK)

---

### 2. **payment** Table

**Issues:**
- ❌ Enum order/value mismatch: Migration has `'Cheque'` first, SQL has `'Bank'` first, SQL doesn't include `'Cheque'`
- ❌ `reference_no` nullable mismatch: Migration has NOT NULL, SQL has nullable
- ❌ Foreign key mismatch: `verified_by` references `jamouser.ID` in SQL, but migration 2025_11_28_000001 tries to reference `users.id`

**SQL Schema:**
```sql
`payment_method` enum('Bank','Cash','GCash','Cebuana') NOT NULL
`reference_no` varchar(50) DEFAULT NULL
`verified_by` bigint(20) UNSIGNED DEFAULT NULL
```

**Migration Status:** ⚠️ PARTIAL MATCH

**Action:** UPDATE MIGRATION (fix enum, make reference_no nullable, fix FK)

---

### 3. **formula** Table

**Issues:**
- ❌ Missing `created_at` column
- ❌ Column size mismatches:
  - `name`: Migration varchar(20), SQL varchar(50)
  - `expression`: Migration varchar(50), SQL varchar(500)
  - `variables`: Migration varchar(20), SQL varchar(500)

**SQL Schema:**
```sql
`created_at` datetime DEFAULT current_timestamp()
`name` varchar(50) NOT NULL
`expression` varchar(500) DEFAULT NULL
`variables` varchar(500) DEFAULT NULL
```

**Migration Status:** ❌ INCOMPLETE

**Action:** UPDATE MIGRATION (add created_at, fix column sizes)

---

### 4. **collateral** Table

**Issues:**
- ❌ Missing `id()` definition in migration (line 71 is empty)
- ⚠️ Foreign key: `appraised_by` references `jamouser.ID` in SQL, but migration 2025_11_28_000001 tries to reference `users.id`

**SQL Schema:**
```sql
`ID` bigint(20) UNSIGNED NOT NULL PRIMARY KEY
```

**Migration Status:** ❌ BROKEN (missing primary key)

**Action:** UPDATE MIGRATION (add id() definition)

---

### 5. **co_borrower** Table

**Issues:**
- ❌ Missing `net_pay` column
- ❌ `age` nullable mismatch: Migration has NOT NULL, SQL has nullable

**SQL Schema:**
```sql
`age` int(11) DEFAULT NULL
`net_pay` decimal(10,2) DEFAULT NULL
```

**Migration Status:** ⚠️ PARTIAL MATCH

**Action:** UPDATE MIGRATION (add net_pay, make age nullable)

---

### 6. **files** Table

**Issues:**
- ❌ Enum typo: Migration has `'collateral_document'`, SQL has `'collateral_documennt'` (double 'n')
- ⚠️ `collateral_id` nullable: Migration has nullable, SQL has NOT NULL

**SQL Schema:**
```sql
`file_type` enum('id_document','photo','contract','collateral_documennt')
`collateral_id` bigint(20) UNSIGNED NOT NULL
```

**Migration Status:** ⚠️ PARTIAL MATCH

**Action:** UPDATE MIGRATION (fix enum typo, make collateral_id NOT NULL)

---

### 7. **landcollateraldetails** Table

**Issues:**
- ❌ Foreign key reference mismatch: Migration references `collateral.ID` (uppercase), should be `collateral.id` (lowercase)

**SQL Schema:**
```sql
Foreign key references `collateral` (`ID`)
```

**Migration Status:** ⚠️ CASE SENSITIVITY ISSUE

**Action:** UPDATE MIGRATION (fix FK reference case)

---

### 8. **loancomments** Table

**Issues:**
- ❌ **MISSING MIGRATION** - Table exists in SQL but no migration file found

**SQL Schema:**
```sql
CREATE TABLE `loancomments` (
  `ID` bigint(20) UNSIGNED NOT NULL,
  `comment_text` varchar(100) NOT NULL,
  `commented_by` bigint(20) UNSIGNED NOT NULL,
  `comment_date` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `loan_id` bigint(20) UNSIGNED NOT NULL
)
```

**Migration Status:** ❌ MISSING

**Action:** CREATE NEW MIGRATION

---

### 9. **useraccount** Table (Legacy)

**Status:** Legacy table, replaced by `users` table  
**Action:** Can be dropped if not referenced elsewhere

---

### 10. **permission, role, rolepermission** Tables (Legacy)

**Status:** Legacy tables, replaced by Spatie permissions package (`permissions`, `roles`, etc.)  
**Action:** Can be dropped if not referenced elsewhere

---

## Foreign Key Inconsistencies

### Issue: Mixed References to `jamouser` vs `users`

**Tables referencing `jamouser.ID`:**
- `loan.approved_by` → `jamouser.ID` (SQL)
- `collateral.appraised_by` → `jamouser.ID` (SQL)
- `payment.verified_by` → `jamouser.ID` (SQL)
- `loancomments.commented_by` → `jamouser.ID` (SQL)

**Migration 2025_11_28_000001 tries to reference `users.id`:**
- `loan.approved_by` → `users.id`
- `collateral.appraised_by` → `users.id`
- `payment.verified_by` → `users.id`

**Decision Required:** 
- Option A: Keep `jamouser` as source of truth (update migration 2025_11_28_000001)
- Option B: Migrate to `users` table (requires data migration)

**Recommendation:** Keep `jamouser` for now (less disruptive)

---

## Data Type Mismatches Summary

| Table | Column | Migration | SQL Backup | Action |
|-------|--------|-----------|------------|--------|
| loan | interest_type | enum('Simple','Compound','Deminishing') | enum('Compound','Diminishing') | Fix enum values |
| payment | payment_method | enum('Cheque','Cash',...) | enum('Bank','Cash',...) | Remove 'Cheque', reorder |
| payment | reference_no | NOT NULL | NULL | Make nullable |
| formula | name | varchar(20) | varchar(50) | Increase size |
| formula | expression | varchar(50) | varchar(500) | Increase size |
| formula | variables | varchar(20) | varchar(500) | Increase size |
| formula | created_at | Missing | datetime | Add column |
| co_borrower | age | NOT NULL | NULL | Make nullable |
| co_borrower | net_pay | Missing | decimal(10,2) | Add column |
| files | file_type | 'collateral_document' | 'collateral_documennt' | Fix typo |
| files | collateral_id | nullable | NOT NULL | Make NOT NULL |

---

## Missing Columns Summary

| Table | Missing Column | Type | Default |
|-------|----------------|------|---------|
| loan | borrower_id | bigint(20) UNSIGNED | NOT NULL |
| loan | formula_id | bigint(20) UNSIGNED | NULL |
| loan | approved_by | bigint(20) UNSIGNED | NULL |
| loan | released_amount | decimal(10,2) | 0.00 |
| formula | created_at | datetime | CURRENT_TIMESTAMP |
| co_borrower | net_pay | decimal(10,2) | NULL |

---

## Recommended Actions

### Priority 1: Critical Fixes (Data Integrity)
1. ✅ Fix `loan` table - add missing columns
2. ✅ Fix `collateral` table - add missing primary key
3. ✅ Create `loancomments` migration
4. ✅ Fix foreign key inconsistencies

### Priority 2: Data Type Fixes
5. ✅ Fix `formula` table column sizes
6. ✅ Fix `payment` enum and nullable
7. ✅ Fix `co_borrower` missing column
8. ✅ Fix `files` enum typo

### Priority 3: Cleanup
9. ⚠️ Drop legacy tables (after verification)
10. ⚠️ Standardize foreign key references

---

## Data Loss Risk Assessment

**LOW RISK** - Most changes are:
- Adding missing columns (with defaults)
- Fixing enum values (existing data should map)
- Fixing column sizes (expanding, not reducing)
- Making columns nullable (safe)

**MEDIUM RISK:**
- Changing foreign key references (requires data migration if switching from `jamouser` to `users`)

**HIGH RISK:**
- None identified

---

## Next Steps

1. Review this analysis
2. Decide on `jamouser` vs `users` foreign key strategy
3. Apply fixes in order of priority
4. Test migrations on development database
5. Backup production before applying changes



