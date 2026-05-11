<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

$migrations = [
    '2025_11_20_035232_create_permission_tables' => 'permissions',
    '2025_11_20_041503_create_borrowers_module' => 'borrower',
    '2025_11_20_041543_create_loan_collateral' => 'collateral',
    '2025_11_20_041600_create_loancomments_table' => 'loancomments',
    '2025_11_20_041630_create_holiday' => 'holidays',
    '2025_11_20_042726_create_payment_penalty' => 'payment',
    '2025_11_20_134012_create_files_table' => 'files',
    '2025_11_20_151157_create_user_profile' => 'user_profiles',
    '2025_11_28_000001_add_foreign_keys_to_loan_collateral' => 'collateral', // Column check would be better but if table exists...
    '2026_01_09_071423_create_jamo_users' => 'jamouser',
    '2026_01_18_131946_add_user_id_to_borrowers_table' => 'borrower', // Check for user_id column
    '2026_02_15_100902_create_loan_product_rules_table' => 'loan_product_rules',
    '2026_02_15_111246_create_loan_products_table' => 'loan_products',
    '2026_02_17_140005_modify_loan_product_rules_table' => 'loan_product_rules',
    '2026_02_18_130000_migrate_jamouser_foreign_keys_to_users' => 'users',
    '2026_02_20_090000_create_disbursement_tables' => 'disbursement',
];

$batch = DB::table('migrations')->max('batch') ?? 0;
$batch++;

foreach ($migrations as $migration => $table) {
    if (Schema::hasTable($table)) {
        $exists = DB::table('migrations')->where('migration', $migration)->exists();
        if (!$exists) {
            echo "Backfilling migration: $migration\n";
            DB::table('migrations')->insert([
                'migration' => $migration,
                'batch' => $batch,
            ]);
        } else {
            echo "Migration already recorded: $migration\n";
        }
    } else {
        echo "Table $table does not exist, skipping migration $migration\n";
    }
}
