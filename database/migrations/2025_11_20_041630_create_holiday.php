<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// return new class extends Migration {
//     public function up(): void
//     {
//         Schema::create('holidays', function (Blueprint $table) {
//             $table->id();
//             $table->string('holiday_name', 50);
//             $table->date('holiday_date');
//             $table->enum('holiday_type', ['Regular','Special','Company'])->default('Regular');
//             $table->string('description', 100)->nullable();
//             $table->boolean('is_Recurring');
//             $table->timestamp('created_at')->useCurrent();
//         });
//     }

//     public function down(): void
//     {
//         Schema::dropIfExists('holidays');
//     }
// };
