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
        Schema::create('loan_product_rules', function (Blueprint $table) {
            $table->id();

            $table->foreignId('loan_product_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->boolean('requires_collateral')->default(false);
            $table->boolean('requires_coborrower')->default(false);

            $table->decimal('collateral_required_above', 15, 2)
                ->nullable(); // optional dynamic rule

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loan_product_rules');
    }
};
