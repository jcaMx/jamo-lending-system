<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('files', 'document_type_id')) {
            Schema::table('files', function (Blueprint $table) {
                $table->unsignedBigInteger('document_type_id')->nullable()->after('documentable_type');
                $table->foreign('document_type_id')->references('id')->on('document_types')->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('files', 'document_type_id')) {
            Schema::table('files', function (Blueprint $table) {
                $table->dropForeign(['document_type_id']);
                $table->dropColumn('document_type_id');
            });
        }
    }
};

