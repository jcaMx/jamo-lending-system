<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

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
                if (!$this->foreignKeyExists('loan', 'loan_approved_by_foreign')) {
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
                if (!$this->foreignKeyExists('collateral', 'collateral_appraised_by_foreign')) {
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
                if (!$this->foreignKeyExists('amortizationschedule', 'amortizationschedule_holiday_id_foreign')) {
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
                if (!$this->foreignKeyExists('payment', 'payment_verified_by_foreign')) {
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
                if (!$this->foreignKeyExists('payment', 'payment_schedule_id_foreign')) {
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
                if (!$this->foreignKeyExists('sessions', 'sessions_user_id_foreign')) {
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
    private function foreignKeyExists(string $table, string $constraintName): bool
    {
        try {
            $connection = Schema::getConnection();
            $database = $connection->getDatabaseName();

            $result = DB::select(
                "SELECT CONSTRAINT_NAME 
                 FROM information_schema.KEY_COLUMN_USAGE 
                 WHERE TABLE_SCHEMA = ? 
                 AND TABLE_NAME = ? 
                 AND CONSTRAINT_NAME = ?",
                [$database, $table, $constraintName]
            );

            return count($result) > 0;
        } catch (\Exception $e) {
            // If we can't check, assume it doesn't exist and let the migration try to create it
            return false;
        }
    }
};
