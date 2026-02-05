-- =====================================================
-- SQL ALTER Statements for Schema Synchronization
-- Database: jamolending
-- Engine: InnoDB, MariaDB 10.4+
-- =====================================================
-- 
-- WARNING: Backup your database before running these statements!
-- Test on development environment first.
--
-- These statements are designed to be safe (no data loss).
-- However, always verify column existence before modifying.
-- =====================================================

-- =====================================================
-- 1. Fix loan table
-- =====================================================
-- Add missing columns (only if they don't exist)
-- Check first: DESCRIBE loan;

ALTER TABLE `loan`
    MODIFY COLUMN `interest_type` enum('Compound','Diminishing') DEFAULT NULL;

-- Add released_amount if missing
-- Check first: SHOW COLUMNS FROM loan LIKE 'released_amount';
ALTER TABLE `loan`
    ADD COLUMN IF NOT EXISTS `released_amount` decimal(10,2) DEFAULT 0.00 AFTER `balance_remaining`;

-- Note: borrower_id, formula_id, approved_by should already exist from migration
-- If they don't exist, add them:
-- ALTER TABLE `loan`
--     ADD COLUMN IF NOT EXISTS `borrower_id` bigint(20) UNSIGNED NOT NULL AFTER `balance_remaining`,
--     ADD COLUMN IF NOT EXISTS `formula_id` bigint(20) UNSIGNED DEFAULT NULL AFTER `borrower_id`,
--     ADD COLUMN IF NOT EXISTS `approved_by` bigint(20) UNSIGNED DEFAULT NULL AFTER `formula_id`;


-- =====================================================
-- 2. Fix formula table
-- =====================================================
ALTER TABLE `formula`
    MODIFY COLUMN `name` varchar(50) NOT NULL,
    MODIFY COLUMN `expression` varchar(500) DEFAULT NULL,
    MODIFY COLUMN `variables` varchar(500) DEFAULT NULL;

-- Add created_at if missing
ALTER TABLE `formula`
    ADD COLUMN IF NOT EXISTS `created_at` datetime DEFAULT CURRENT_TIMESTAMP AFTER `variables`;


-- =====================================================
-- 3. Fix payment table
-- =====================================================
ALTER TABLE `payment`
    MODIFY COLUMN `payment_method` enum('Bank','Cash','GCash','Cebuana') NULL,
    MODIFY COLUMN `reference_no` varchar(50) DEFAULT NULL;


-- =====================================================
-- 4. Fix co_borrower table
-- =====================================================
ALTER TABLE `co_borrower`
    MODIFY COLUMN `age` int(11) DEFAULT NULL;

-- Add net_pay if missing
ALTER TABLE `co_borrower`
    ADD COLUMN IF NOT EXISTS `net_pay` decimal(10,2) DEFAULT NULL AFTER `home_ownership`;


-- =====================================================
-- 5. Fix files table
-- =====================================================
ALTER TABLE `files`
    MODIFY COLUMN `file_type` enum('id_document','photo','contract','collateral_documennt') DEFAULT NULL,
    MODIFY COLUMN `collateral_id` bigint(20) UNSIGNED NOT NULL;


-- =====================================================
-- 6. Create loancomments table if missing
-- =====================================================
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


-- =====================================================
-- Verification Queries
-- =====================================================
-- Run these after applying changes to verify:

-- Check loan table structure
-- DESCRIBE `loan`;
-- SHOW CREATE TABLE `loan`;

-- Check formula table structure
-- DESCRIBE `formula`;

-- Check payment enum values
-- SHOW COLUMNS FROM `payment` LIKE 'payment_method';

-- Verify foreign keys
-- SELECT 
--     TABLE_NAME,
--     CONSTRAINT_NAME,
--     REFERENCED_TABLE_NAME,
--     REFERENCED_COLUMN_NAME
-- FROM information_schema.KEY_COLUMN_USAGE
-- WHERE TABLE_SCHEMA = 'jamolending'
--     AND REFERENCED_TABLE_NAME IS NOT NULL
-- ORDER BY TABLE_NAME, CONSTRAINT_NAME;

-- =====================================================
-- Rollback Statements (if needed)
-- =====================================================
-- Only use if you need to revert changes

-- Rollback loan changes
-- ALTER TABLE `loan`
--     DROP COLUMN IF EXISTS `released_amount`,
--     MODIFY COLUMN `interest_type` enum('Simple','Compound','Deminishing') DEFAULT NULL;

-- Rollback formula changes
-- ALTER TABLE `formula`
--     MODIFY COLUMN `name` varchar(20) NOT NULL,
--     MODIFY COLUMN `expression` varchar(50) DEFAULT NULL,
--     MODIFY COLUMN `variables` varchar(20) DEFAULT NULL,
--     DROP COLUMN IF EXISTS `created_at`;

-- Rollback payment changes
-- ALTER TABLE `payment`
--     MODIFY COLUMN `payment_method` enum('Cheque','Cash','GCash','Cebuana','Bank') NULL,
--     MODIFY COLUMN `reference_no` varchar(50) NOT NULL;

-- Rollback co_borrower changes
-- ALTER TABLE `co_borrower`
--     MODIFY COLUMN `age` int(11) NOT NULL,
--     DROP COLUMN IF EXISTS `net_pay`;

-- Rollback files changes
-- ALTER TABLE `files`
--     MODIFY COLUMN `file_type` enum('id_document','photo','contract','collateral_document') DEFAULT NULL,
--     MODIFY COLUMN `collateral_id` bigint(20) UNSIGNED NULL;



