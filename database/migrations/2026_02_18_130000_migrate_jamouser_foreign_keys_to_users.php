<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $this->migrateForeignKey('loan', 'approved_by', 'FK_Loan_User');
        $this->migrateForeignKey('collateral', 'appraised_by', 'FK_Collateral_User');
        $this->migrateForeignKey('payment', 'verified_by', 'FK_Payment_Users');
        $this->migrateForeignKey('loancomments', 'commented_by', 'FK_LoanComments_User');

        if (Schema::hasTable('jamouser')) {
            Schema::dropIfExists('jamouser');
        }
    }

    public function down(): void
    {
        // This migration intentionally does not recreate jamouser.
    }

    private function migrateForeignKey(string $table, string $column, string $legacyConstraint): void
    {
        if (! Schema::hasTable($table) || ! Schema::hasTable('users') || ! Schema::hasColumn($table, $column)) {
            return;
        }

        if ($this->foreignKeyExistsByName($table, $legacyConstraint)) {
            Schema::table($table, function (Blueprint $table) use ($legacyConstraint) {
                $table->dropForeign($legacyConstraint);
            });
        }

        if (! $this->foreignKeyExistsOnColumn($table, $column)) {
            Schema::table($table, function (Blueprint $table) use ($column) {
                $table->foreign($column)->references('id')->on('users')->nullOnDelete();
            });
        }
    }

    private function foreignKeyExistsByName(string $table, string $constraintName): bool
    {
        $database = Schema::getConnection()->getDatabaseName();

        $result = DB::select(
            'SELECT CONSTRAINT_NAME
             FROM information_schema.TABLE_CONSTRAINTS
             WHERE TABLE_SCHEMA = ?
               AND TABLE_NAME = ?
               AND CONSTRAINT_TYPE = ?
               AND CONSTRAINT_NAME = ?',
            [$database, $table, 'FOREIGN KEY', $constraintName]
        );

        return count($result) > 0;
    }

    private function foreignKeyExistsOnColumn(string $table, string $column): bool
    {
        $database = Schema::getConnection()->getDatabaseName();

        $result = DB::select(
            'SELECT CONSTRAINT_NAME
             FROM information_schema.KEY_COLUMN_USAGE
             WHERE TABLE_SCHEMA = ?
               AND TABLE_NAME = ?
               AND COLUMN_NAME = ?
               AND REFERENCED_TABLE_NAME IS NOT NULL',
            [$database, $table, $column]
        );

        return count($result) > 0;
    }
};
