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
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // boolean, integer, json, string
            $table->timestamps();
        });

        // Insert default rebate settings
        DB::table('system_settings')->insert([
            ['key' => 'enable_rebates', 'value' => '0', 'type' => 'boolean', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'rebate_percentage', 'value' => '0', 'type' => 'numeric', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'rebate_basis', 'value' => 'interest', 'type' => 'string', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_settings');
    }
};
