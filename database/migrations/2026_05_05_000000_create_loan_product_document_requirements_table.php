<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loan_product_document_requirements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('loan_product_id')
                ->constrained('loan_products')
                ->cascadeOnDelete();
            $table->enum('requirement_type', ['category', 'document_type']);
            $table->foreignId('document_type_id')
                ->nullable()
                ->constrained('document_types')
                ->nullOnDelete();
            $table->string('document_category', 100)->nullable();
            $table->string('subject_type', 50);
            $table->string('collateral_type', 50)->nullable();
            $table->boolean('is_required')->default(true);
            $table->unsignedSmallInteger('min_count')->default(1);
            $table->unsignedSmallInteger('max_count')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->string('notes', 255)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['loan_product_id', 'subject_type', 'is_active'], 'lpdr_product_subject_active_idx');
            $table->index(['loan_product_id', 'collateral_type', 'is_active'], 'lpdr_product_collateral_active_idx');
            $table->index(['requirement_type', 'document_type_id'], 'lpdr_requirement_document_idx');
            $table->index(['requirement_type', 'document_category'], 'lpdr_requirement_category_idx');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loan_product_document_requirements');
    }
};
