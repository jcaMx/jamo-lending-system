<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add foreign key constraint for loan.approved_by -> users.id
        if (Schema::hasTable('loan') && Schema::hasTable('users')) {
            Schema::table('loan', function (Blueprint $table) {
                if (! $this->foreignKeyOnColumnExists('loan', 'approved_by')) {
                    $table->foreign('approved_by')
                        ->references('id')
                        ->on('users')
                        ->nullOnDelete();
                }
            });
        }

        // Add foreign key constraint for collateral.appraised_by -> users.id
        if (Schema::hasTable('collateral') && Schema::hasTable('users')) {
            Schema::table('collateral', function (Blueprint $table) {
                if (! $this->foreignKeyOnColumnExists('collateral', 'appraised_by')) {
                    $table->foreign('appraised_by')
                        ->references('id')
                        ->on('users')
                        ->nullOnDelete();
                }
            });
        }

        // Add foreign key constraint for amortizationschedule.holiday_id -> holidays.id
        if (Schema::hasTable('amortizationschedule') && Schema::hasTable('holidays')) {
            Schema::table('amortizationschedule', function (Blueprint $table) {
                if (! $this->foreignKeyOnColumnExists('amortizationschedule', 'holiday_id')) {
                    $table->foreign('holiday_id')
                        ->references('id')
                        ->on('holidays')
                        ->nullOnDelete();
                }
            });
        }

        // Add foreign key constraint for payment.verified_by -> users.id
        if (Schema::hasTable('payment') && Schema::hasTable('users')) {
            Schema::table('payment', function (Blueprint $table) {
                if (! $this->foreignKeyOnColumnExists('payment', 'verified_by')) {
                    $table->foreign('verified_by')
                        ->references('id')
                        ->on('users')
                        ->nullOnDelete();
                }
            });
        }

        // Add foreign key constraint for payment.schedule_id -> amortizationschedule.id
        if (Schema::hasTable('payment') && Schema::hasTable('amortizationschedule')) {
            Schema::table('payment', function (Blueprint $table) {
                if (! $this->foreignKeyOnColumnExists('payment', 'schedule_id')) {
                    $table->foreign('schedule_id')
                        ->references('id')
                        ->on('amortizationschedule')
                        ->nullOnDelete();
                }
            });
        }

        // Add foreign key constraint for sessions.user_id -> users.id
        if (Schema::hasTable('sessions') && Schema::hasTable('users')) {
            Schema::table('sessions', function (Blueprint $table) {
                if (! $this->foreignKeyOnColumnExists('sessions', 'user_id')) {
                    $table->foreign('user_id')
                        ->references('id')
                        ->on('users')
                        ->nullOnDelete();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('sessions')) {
            Schema::table('sessions', function (Blueprint $table) {
                $table->dropForeign(['user_id']);
            });
        }

        if (Schema::hasTable('payment')) {
            Schema::table('payment', function (Blueprint $table) {
                $table->dropForeign(['schedule_id']);
                $table->dropForeign(['verified_by']);
            });
        }

        if (Schema::hasTable('amortizationschedule')) {
            Schema::table('amortizationschedule', function (Blueprint $table) {
                $table->dropForeign(['holiday_id']);
            });
        }

        if (Schema::hasTable('collateral')) {
            Schema::table('collateral', function (Blueprint $table) {
                $table->dropForeign(['appraised_by']);
            });
        }

        if (Schema::hasTable('loan')) {
            Schema::table('loan', function (Blueprint $table) {
                $table->dropForeign(['approved_by']);
            });
        }
    }

    /**
     * Check if a foreign key constraint exists.
     */
    private function foreignKeyOnColumnExists(string $table, string $columnName): bool
    {
        try {
            $connection = Schema::getConnection();
            $database = $connection->getDatabaseName();

            $result = DB::select(
                'SELECT CONSTRAINT_NAME 
                 FROM information_schema.KEY_COLUMN_USAGE 
                 WHERE TABLE_SCHEMA = ? 
                 AND TABLE_NAME = ? 
                 AND COLUMN_NAME = ?
                 AND REFERENCED_TABLE_NAME IS NOT NULL',
                [$database, $table, $columnName]
            );

            return count($result) > 0;
        } catch (\Exception $e) {
            // If we can't check, assume it doesn't exist and let the migration try to create it
            return false;
        }
    }
};
