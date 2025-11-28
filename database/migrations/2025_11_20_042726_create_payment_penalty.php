<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

// return new class extends Migration {
//     public function up(): void
//     {
//         Schema::create('payment', function (Blueprint $table) {
//             $table->id();
//             $table->dateTime('payment_date')->default(DB::raw('CURRENT_TIMESTAMP'));
//             $table->decimal('amount', 10, 2);
//             $table->enum('payment_method', ['Cheque','Cash','GCash','Cebuana','Metrobank'])->nullable();
//             $table->string('reference_no', 50);
//             $table->string('remarks', 100)->nullable();
//             // Create verified_by column without FK to avoid constraint formation errors.
//             // FK can be added in a separate migration after users table is guaranteed to exist.
//             $table->unsignedBigInteger('verified_by')->nullable();
//             $table->dateTime('verified_date')->nullable();
//             // Create schedule_id column without FK to avoid constraint formation errors.
//             $table->unsignedBigInteger('schedule_id')->nullable();
//             $table->foreignId('loan_id')->constrained('loan')->cascadeOnDelete();
//         });

//         Schema::create('penalty', function (Blueprint $table) {
//             $table->id();
//             $table->enum('type', ['Late_Payment','Bounced_Cheque','Other'])->nullable();
//             $table->decimal('amount', 15, 2);
//             $table->date('date_applied')->default(DB::raw('CURDATE()'));
//             $table->foreignId('schedule_id')->constrained('amortizationschedule')->cascadeOnDelete();
//             $table->enum('status', ['Pending','Paid','Waived'])->default('Pending');
//         });
//     }

//     public function down(): void
//     {
//         Schema::dropIfExists('penalty');
//         Schema::dropIfExists('payment');
//     }
// };
