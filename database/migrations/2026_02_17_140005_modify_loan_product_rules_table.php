<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Step 1: Drop any foreign keys that might prevent column changes
        DB::statement('ALTER TABLE loan_product_rules DROP FOREIGN KEY IF EXISTS loan_product_rules_loan_product_id_foreign;');

        // Step 2: Drop old columns safely
        Schema::table('loan_product_rules', function (Blueprint $table) {
            $table->dropColumn([
                'requires_collateral',
                'requires_coborrower',
                'collateral_required_above',
            ]);
        });

        // Step 3: Add new dynamic rule columns
        Schema::table('loan_product_rules', function (Blueprint $table) {
            $table->enum('rule_type', ['collateral', 'coborrower'])
                  ->after('loan_product_id');

            $table->string('condition_key')->after('rule_type');
            $table->string('operator', 5)->after('condition_key');
            $table->decimal('condition_value', 15, 4)->nullable()->after('operator');

            // Recreate foreign key
            $table->foreign('loan_product_id')->references('id')->on('loan_products')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('loan_product_rules', function (Blueprint $table) {
            $table->dropForeign(['loan_product_id']);
            $table->dropColumn(['rule_type', 'condition_key', 'operator', 'condition_value']);
            $table->boolean('requires_collateral')->default(false);
            $table->boolean('requires_coborrower')->default(false);
            $table->decimal('collateral_required_above', 15, 2)->nullable();
            $table->foreign('loan_product_id')->references('id')->on('loan_products')->cascadeOnDelete();
        });
    }
};
