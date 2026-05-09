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
        DB::table('system_settings')->insertOrIgnore([
            ['key' => 'rebate_min_days_early', 'value' => '0', 'type' => 'integer', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'rebate_apply_to_full_payoff', 'value' => '1', 'type' => 'boolean', 'created_at' => now(), 'updated_at' => now()],
            ['key' => 'rebate_require_good_standing', 'value' => '1', 'type' => 'boolean', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('system_settings')->whereIn('key', [
            'rebate_min_days_early',
            'rebate_apply_to_full_payoff',
            'rebate_require_good_standing',
        ])->delete();
    }
};
