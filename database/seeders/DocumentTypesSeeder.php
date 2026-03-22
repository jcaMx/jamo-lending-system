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
            ['code' => 'OTHER_ID', 'name' => 'Other ID', 'category' => 'borrower_identity'],

            // =========================
            // Borrower Address Documents
            // =========================
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
            // Collateral Documents
            // =========================
            ['code' => 'LAND_TITLE', 'name' => 'Land Title', 'category' => 'collateral'],
            ['code' => 'OR_CR', 'name' => 'Official Receipt / Certificate of Registration (Vehicle)', 'category' => 'collateral'],
            ['code' => 'APPRAISAL_REPORT', 'name' => 'Appraisal Report', 'category' => 'collateral'],
            ['code' => 'COLLATERAL_PHOTO', 'name' => 'Collateral Photos', 'category' => 'collateral'],

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
                    'category' => $doc['category'],
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }
}
