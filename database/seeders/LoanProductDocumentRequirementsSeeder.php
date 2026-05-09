<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LoanProductDocumentRequirementsSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $loanProducts = DB::table('loan_products')
            ->pluck('id', 'name');

        $documentTypes = DB::table('document_types')
            ->pluck('id', 'code');

        if ($loanProducts->isEmpty()) {
            $this->command?->warn('Skipping LoanProductDocumentRequirementsSeeder: no loan products found.');

            return;
        }

        $requirementsByLoanProduct = [
            'personal loan' => [
                'category_requirements' => [
                    [
                        'document_category' => 'borrower_identity',
                        'subject_type' => 'borrower',
                        'is_required' => true,
                        'min_count' => 2,
                        'max_count' => null,
                        'sort_order' => 10,
                        'notes' => 'Identity Verification: submit any 2 identity documents.',
                    ],
                    [
                        'document_category' => 'borrower_address',
                        'subject_type' => 'borrower',
                        'is_required' => true,
                        'min_count' => 1,
                        'max_count' => null,
                        'sort_order' => 20,
                        'notes' => 'Submit at least 1 proof of address.',
                    ],
                    [
                        'document_category' => 'borrower_employment',
                        'subject_type' => 'employment',
                        'is_required' => true,
                        'min_count' => 2,
                        'max_count' => null,
                        'sort_order' => 30,
                        'notes' => 'Income Proof: submit any 2 employment or income documents.',
                    ],
                    [
                        'document_category' => 'coborrower',
                        'subject_type' => 'coborrower',
                        'is_required' => false,
                        'min_count' => 1,
                        'max_count' => null,
                        'sort_order' => 40,
                        'notes' => 'Optional supporting documents for co-borrower.',
                    ],
                ],
                'document_requirements' => [
                    'vehicle' => [
                        ['code' => 'VEHICLE_OR', 'sort_order' => 110],
                        ['code' => 'VEHICLE_CR', 'sort_order' => 120],
                        ['code' => 'APPRAISAL_REPORT', 'sort_order' => 130],
                    ],
                    'land' => [
                        ['code' => 'LAND_TITLE', 'sort_order' => 210],
                        ['code' => 'APPRAISAL_REPORT', 'sort_order' => 220],
                    ],
                ],
            ],
            'business loan' => [
                'category_requirements' => [
                    [
                        'document_category' => 'borrower_identity',
                        'subject_type' => 'borrower',
                        'is_required' => true,
                        'min_count' => 2,
                        'max_count' => null,
                        'sort_order' => 10,
                        'notes' => 'Identity Verification: submit any 2 identity documents.',
                    ],
                    [
                        'document_category' => 'borrower_address',
                        'subject_type' => 'borrower',
                        'is_required' => true,
                        'min_count' => 1,
                        'max_count' => null,
                        'sort_order' => 20,
                        'notes' => 'Submit at least 1 proof of address.',
                    ],
                    [
                        'document_category' => 'borrower_employment',
                        'subject_type' => 'borrower',
                        'is_required' => true,
                        'min_count' => 2,
                        'max_count' => null,
                        'sort_order' => 30,
                        'notes' => 'Income Proof: submit any 2 owner income documents.',
                    ],
                    [
                        'document_category' => 'business_registration',
                        'subject_type' => 'business',
                        'is_required' => true,
                        'min_count' => 1,
                        'max_count' => null,
                        'sort_order' => 40,
                        'notes' => 'Submit at least 1 registration document such as DTI or SEC.',
                    ],
                    [
                        'document_category' => 'business_permits',
                        'subject_type' => 'business',
                        'is_required' => true,
                        'min_count' => 2,
                        'max_count' => null,
                        'sort_order' => 50,
                        'notes' => 'Submit permit documents such as business permit and barangay clearance.',
                    ],
                    [
                        'document_category' => 'business_tax',
                        'subject_type' => 'business',
                        'is_required' => true,
                        'min_count' => 1,
                        'max_count' => null,
                        'sort_order' => 60,
                        'notes' => 'Submit at least 1 tax document such as BIR Form 2303 or ITR.',
                    ],
                    [
                        'document_category' => 'business_financial',
                        'subject_type' => 'business',
                        'is_required' => true,
                        'min_count' => 2,
                        'max_count' => null,
                        'sort_order' => 70,
                        'notes' => 'Submit any 2 financial documents.',
                    ],
                    [
                        'document_category' => 'business_operational',
                        'subject_type' => 'business',
                        'is_required' => false,
                        'min_count' => 1,
                        'max_count' => null,
                        'sort_order' => 80,
                        'notes' => 'Optional operational documents such as business photos or lease contract.',
                    ],
                    [
                        'document_category' => 'coborrower',
                        'subject_type' => 'coborrower',
                        'is_required' => false,
                        'min_count' => 1,
                        'max_count' => null,
                        'sort_order' => 90,
                        'notes' => 'Optional supporting documents for co-borrower.',
                    ],
        
                ],
                'document_requirements' => [
                    'vehicle' => [
                        ['code' => 'VEHICLE_OR', 'sort_order' => 210],
                        ['code' => 'VEHICLE_CR', 'sort_order' => 220],
                        ['code' => 'APPRAISAL_REPORT', 'sort_order' => 230],
                    ],
                    'land' => [
                        ['code' => 'LAND_TITLE', 'sort_order' => 310],
                        ['code' => 'APPRAISAL_REPORT', 'sort_order' => 320],
                    ],
                    'equipment' => [
                        ['code' => 'EQUIPMENT_DOCUMENTS', 'sort_order' => 410],
                        ['code' => 'APPRAISAL_REPORT', 'sort_order' => 420],
                    ],
                ],
            ],
        ];

        foreach ($loanProducts as $loanProductName => $loanProductId) {
            $config = $requirementsByLoanProduct[mb_strtolower($loanProductName)] ?? null;

            if (! $config) {
                continue;
            }

            foreach ($config['category_requirements'] as $requirement) {
                DB::table('loan_product_document_requirements')->updateOrInsert(
                    [
                        'loan_product_id' => $loanProductId,
                        'requirement_type' => 'category',
                        'document_category' => $requirement['document_category'],
                        'subject_type' => $requirement['subject_type'],
                        'collateral_type' => null,
                    ],
                    [
                        'document_type_id' => null,
                        'is_required' => $requirement['is_required'],
                        'min_count' => $requirement['min_count'],
                        'max_count' => $requirement['max_count'],
                        'sort_order' => $requirement['sort_order'],
                        'notes' => $requirement['notes'],
                        'is_active' => true,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );
            }

            foreach ($config['document_requirements'] as $collateralType => $requirements) {
                foreach ($requirements as $requirement) {
                    $documentTypeId = $documentTypes[$requirement['code']] ?? null;

                    if (! $documentTypeId) {
                        $this->command?->warn("Skipping missing document type code [{$requirement['code']}] for loan product [{$loanProductName}].");
                        continue;
                    }

                    DB::table('loan_product_document_requirements')->updateOrInsert(
                        [
                            'loan_product_id' => $loanProductId,
                            'requirement_type' => 'document_type',
                            'document_type_id' => $documentTypeId,
                            'subject_type' => 'collateral',
                            'collateral_type' => $collateralType,
                        ],
                        [
                            'document_category' => null,
                            'is_required' => true,
                            'min_count' => 1,
                            'max_count' => 1,
                            'sort_order' => $requirement['sort_order'],
                            'notes' => ucfirst($collateralType).' collateral ownership requirement. Collateral Ownership: submit all required documents.',
                            'is_active' => true,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ]
                    );
                }
            }
        }
    }
}
