<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('penalty') || Schema::hasColumn('penalty', 'loan_id')) {
            return;
        }

        Schema::table('penalty', function (Blueprint $table) {
            $table->foreignId('loan_id')
                ->nullable()
                ->after('schedule_id')
                ->constrained('loan')
                ->cascadeOnDelete();
        });

        DB::table('penalty')
            ->join('amortizationschedule', 'penalty.schedule_id', '=', 'amortizationschedule.ID')
            ->update(['penalty.loan_id' => DB::raw('amortizationschedule.loan_id')]);
    }

    public function down(): void
    {
        if (! Schema::hasTable('penalty') || ! Schema::hasColumn('penalty', 'loan_id')) {
            return;
        }

        Schema::table('penalty', function (Blueprint $table) {
            $table->dropConstrainedForeignId('loan_id');
        });
    }
};
