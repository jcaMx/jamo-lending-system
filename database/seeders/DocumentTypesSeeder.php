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
            // Collateral Vehicle Documents
            // =========================
            ['code' => 'VEHICLE_OR', 'name' => 'Official Receipt (OR)', 'category' => 'collateral_vehicle'],
            ['code' => 'VEHICLE_CR', 'name' => 'Certificate of Registration (CR)', 'category' => 'collateral_vehicle'],
            ['code' => 'BARANGAY_CLEARANCE', 'name' => 'Barangay Clearance', 'category' => 'collateral_vehicle'],

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
            // FK-safe: update if exists, insert if not
            $updated = DB::table('document_types')->updateOrInsert(
                ['code' => $doc['code']], // lookup by code only
                [
                    'name' => $doc['name'],
                    'category' => trim($doc['category']),
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );

            // Optional: show debug info in console
            dump($doc['code'], $updated ? 'inserted/updated' : 'skipped');
        }
    }
}
