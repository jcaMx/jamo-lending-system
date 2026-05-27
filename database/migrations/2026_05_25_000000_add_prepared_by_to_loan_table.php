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
        Schema::table('loan', function (Blueprint $table) {
            $table->unsignedBigInteger('prepared_by')->nullable()->after('approved_by');
            $table->foreign('prepared_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('loan', function (Blueprint $table) {
            $table->dropForeign(['prepared_by']);
            $table->dropColumn('prepared_by');
        });
    }
};
