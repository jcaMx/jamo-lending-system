<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loan_charges', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description')->nullable();
            $table->decimal('rate', 5, 4);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index('is_active');
        });

        // Seed default charges
        DB::table('loan_charges')->insert([
            ['name' => 'Processing Fee', 'rate' => 0.03, 'is_active' => true, 'created_at' => now()],
            ['name' => 'Insurance Fee', 'rate' => 0.02, 'is_active' => true, 'created_at' => now()],
            ['name' => 'Notary Fee', 'rate' => 0.01, 'is_active' => true, 'created_at' => now()],
            ['name' => 'Savings Contribution', 'rate' => 0.02, 'is_active' => true, 'created_at' => now()],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('loan_charges');
    }
};
