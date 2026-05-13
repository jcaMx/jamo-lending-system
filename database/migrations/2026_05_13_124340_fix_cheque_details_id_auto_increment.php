<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('cheque_details', function (Blueprint $table) {
            // Using raw SQL to ensure it works regardless of current state
            DB::statement('ALTER TABLE cheque_details MODIFY COLUMN ID BIGINT UNSIGNED AUTO_INCREMENT');
        });
    }

    public function down(): void
    {
        Schema::table('cheque_details', function (Blueprint $table) {
            DB::statement('ALTER TABLE cheque_details MODIFY COLUMN ID BIGINT UNSIGNED');
        });
    }
};
