<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Step 1 & 2: Drop old columns and foreign key safely
        Schema::table('loan_product_rules', function (Blueprint $table) {
            if (Schema::hasColumn('loan_product_rules', 'loan_product_id')) {
                // Wrap in try-catch to ignore if foreign key doesn't exist
                try {
                    $table->dropForeign(['loan_product_id']);
                } catch (\Exception $e) {}
            }

            $columnsToDrop = [];
            if (Schema::hasColumn('loan_product_rules', 'requires_collateral')) $columnsToDrop[] = 'requires_collateral';
            if (Schema::hasColumn('loan_product_rules', 'requires_coborrower')) $columnsToDrop[] = 'requires_coborrower';
            if (Schema::hasColumn('loan_product_rules', 'collateral_required_above')) $columnsToDrop[] = 'collateral_required_above';

            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });

        // Step 3: Add new dynamic rule columns
        Schema::table('loan_product_rules', function (Blueprint $table) {
            if (!Schema::hasColumn('loan_product_rules', 'rule_type')) {
                $table->enum('rule_type', ['collateral', 'coborrower'])
                      ->after('loan_product_id');
            }

            if (!Schema::hasColumn('loan_product_rules', 'condition_key')) {
                $table->string('condition_key')->after('rule_type');
            }

            if (!Schema::hasColumn('loan_product_rules', 'operator')) {
                $table->string('operator', 5)->after('condition_key');
            }

            if (!Schema::hasColumn('loan_product_rules', 'condition_value')) {
                $table->decimal('condition_value', 15, 4)->nullable()->after('operator');
            }

            // Recreate foreign key safely
            try {
                $table->foreign('loan_product_id')->references('id')->on('loan_products')->cascadeOnDelete();
            } catch (\Exception $e) {}
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
