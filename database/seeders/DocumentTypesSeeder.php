<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DocumentTypesSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $documentTypes = [
            // =========================
            // Borrower Identity Documents
            // =========================
            ['code' => 'VALID_GOV_ID', 'name' => 'Valid Government ID', 'category' => 'borrower_identity'],
            ['code' => 'SELFIE_WITH_ID', 'name' => 'Selfie with ID', 'category' => 'borrower_identity'],
            ['code' => 'PH_PASSPORT', 'name' => 'Philippine Passport', 'category' => 'borrower_identity'],
            ['code' => 'DRIVERS_LICENSE', 'name' => "Driver's License", 'category' => 'borrower_identity'],
            ['code' => 'SSS_ID', 'name' => 'SSS ID', 'category' => 'borrower_identity'],
            ['code' => 'GSIS_ID', 'name' => 'GSIS ID', 'category' => 'borrower_identity'],
            ['code' => 'PHILHEALTH_ID', 'name' => 'PhilHealth ID', 'category' => 'borrower_identity'],
            ['code' => 'PRC_LICENSE', 'name' => 'PRC License', 'category' => 'borrower_identity'],
            ['code' => 'VOTERS_ID', 'name' => "Voter's ID", 'category' => 'borrower_identity'],
            ['code' => 'BARANGAY_ID', 'name' => 'Barangay ID', 'category' => 'borrower_identity'],
            ['code' => 'UMID', 'name' => 'Unified Multi-Purpose ID (UMID)', 'category' => 'borrower_identity'],
            ['code' => 'BIRTH_CERT', 'name' => 'Birth Certificate', 'category' => 'borrower_identity'],
            ['code' => 'MARRIAGE_CERT', 'name' => 'Marriage Certificate', 'category' => 'borrower_identity'],
            ['code' => 'OTHER_ID', 'name' => 'Other ID', 'category' => 'borrower_identity'],

            // =========================
            // Borrower Address Documents
            // =========================
            ['code' => 'PROOF_OF_ADDRESS', 'name' => 'Proof of Address', 'category' => 'borrower_address'],
            ['code' => 'PROOF_OF_BILLING', 'name' => 'Proof of Billing', 'category' => 'borrower_address'],
            ['code' => 'UTILITY_BILL', 'name' => 'Utility Bill (Electricity/Water/Internet)', 'category' => 'borrower_address'],
            ['code' => 'BARANGAY_CERT', 'name' => 'Barangay Certificate', 'category' => 'borrower_address'],
            ['code' => 'LEASE_CONTRACT', 'name' => 'Lease Contract', 'category' => 'borrower_address'],

            // =========================
            // Borrower Employment / Income Documents
            // =========================
            ['code' => 'PAYSLIP', 'name' => 'Payslip', 'category' => 'borrower_employment'],
            ['code' => 'COE', 'name' => 'Certificate of Employment', 'category' => 'borrower_employment'],
            ['code' => 'ITR', 'name' => 'Income Tax Return (ITR)', 'category' => 'borrower_employment'],
            ['code' => 'BANK_STATEMENT', 'name' => 'Bank Statement', 'category' => 'borrower_employment'],
            ['code' => 'EMPLOYMENT_CONTRACT', 'name' => 'Employment Contract', 'category' => 'borrower_employment'],

            // =========================
            // Business Loan Documents
            // =========================
            ['code' => 'BUSINESS_DTI_CERT', 'name' => 'DTI Certificate', 'category' => 'business_registration'],
            ['code' => 'BUSINESS_SEC_REG', 'name' => 'SEC Registration', 'category' => 'business_registration'],
            ['code' => 'BUSINESS_CDA_REG', 'name' => 'CDA Registration', 'category' => 'business_registration'],

            ['code' => 'MAYORS_PERMIT', 'name' => "Mayor's Permit", 'category' => 'business_permits'],
            ['code' => 'BUSINESS_BARANGAY_CLEARANCE', 'name' => 'Barangay Clearance', 'category' => 'business_permits'],

            ['code' => 'BIR_2303', 'name' => 'BIR 2303', 'category' => 'business_tax'],
            ['code' => 'BUSINESS_ITR', 'name' => 'Income Tax Return (ITR)', 'category' => 'business_tax'],
            ['code' => 'BUSINESS_OFFICIAL_RECEIPTS', 'name' => 'Official Receipts', 'category' => 'business_tax'],

            ['code' => 'BUSINESS_BANK_STATEMENT', 'name' => 'Bank Statement', 'category' => 'business_financial'],
            ['code' => 'FINANCIAL_STATEMENTS', 'name' => 'Financial Statements', 'category' => 'business_financial'],
            ['code' => 'SALES_RECORDS', 'name' => 'Sales Records / Receipts', 'category' => 'business_financial'],
            ['code' => 'INCOME_STATEMENT', 'name' => 'Income Statement', 'category' => 'business_financial'],
            ['code' => 'BALANCE_SHEET', 'name' => 'Balance Sheet', 'category' => 'business_financial'],
            ['code' => 'CASH_FLOW_STATEMENT', 'name' => 'Cash Flow Statement', 'category' => 'business_financial'],

            // =========================
            // Business Operational Documents
            // =========================
            ['code' => 'BUSINESS_PHOTOS', 'name' => 'Business Photos', 'category' => 'business_operational'],
            ['code' => 'BUSINESS_LEASE_CONTRACT', 'name' => 'Lease Contract', 'category' => 'business_operational'],
            ['code' => 'INVENTORY_LIST', 'name' => 'Inventory List', 'category' => 'business_operational'],

            // =========================
            // Collateral Vehicle Documents
            // =========================
            ['code' => 'VEHICLE_OR', 'name' => 'Official Receipt (OR)', 'category' => 'collateral_vehicle'],
            ['code' => 'VEHICLE_CR', 'name' => 'Certificate of Registration (CR)', 'category' => 'collateral_vehicle'],
            ['code' => 'BARANGAY_CLEARANCE', 'name' => 'Barangay Clearance', 'category' => 'collateral_vehicle'],

            // =========================
            // Collateral Equipment Documents
            // =========================
            ['code' => 'EQUIPMENT_DOCUMENTS', 'name' => 'Equipment Documents', 'category' => 'collateral_equipment'],

            // =========================
            // Collateral General Documents
            // =========================
            ['code' => 'APPRAISAL_REPORT', 'name' => 'Appraisal Report', 'category' => 'collateral_general'],
            ['code' => 'COLLATERAL_PHOTO', 'name' => 'Collateral Photos', 'category' => 'collateral_general'],

            // =========================
            // Collateral Land Documents
            // =========================
            ['code' => 'LAND_TITLE', 'name' => 'Land Title', 'category' => 'collateral_land'],
            ['code' => 'TAX_DECLARATION', 'name' => 'Latest Tax Declaration', 'category' => 'collateral_land'],
            ['code' => 'PROPERTY_PHOTO', 'name' => 'Picture of Property', 'category' => 'collateral_land'],
            ['code' => 'TRANSFER_CERT', 'name' => 'Certificate of True Copy of Transfer', 'category' => 'collateral_land'],
            ['code' => 'REAL_ESTATE_TAX', 'name' => 'Updated Real Estate Tax Receipt', 'category' => 'collateral_land'],
            ['code' => 'TAX_CLEARANCE', 'name' => 'Tax Clearance', 'category' => 'collateral_land'],
            ['code' => 'VICINITY_MAP', 'name' => 'Vicinity Map', 'category' => 'collateral_land'],

            // =========================
            // Co-borrower Documents
            // =========================
            ['code' => 'COB_ID', 'name' => 'Co-borrower ID', 'category' => 'coborrower'],
            ['code' => 'COB_PAYSLIP', 'name' => 'Co-borrower Payslip', 'category' => 'coborrower'],
            ['code' => 'COB_COE', 'name' => 'Co-borrower Certificate of Employment', 'category' => 'coborrower'],

 
        ];

        foreach ($documentTypes as $doc) {
            DB::table('document_types')->updateOrInsert(
                ['code' => $doc['code']],
                [
                    'name' => $doc['name'],
                    'category' => trim($doc['category']),
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }
}
