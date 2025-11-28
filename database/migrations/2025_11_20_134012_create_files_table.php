<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// return new class extends Migration {
//     public function up(): void
//     {
//         Schema::create('files', function (Blueprint $table) {
//             $table->id();
//             $table->enum('file_type', ['id_document','photo','contract','collateral_document'])->nullable();
//             $table->string('file_name', 20);
//             $table->string('file_path', 100);
//             $table->timestamp('uploaded_at')->useCurrent();
//             $table->string('description', 100)->nullable();

//             $table->foreignId('borrower_id')->constrained('borrower')->cascadeOnDelete();
//             $table->foreignId('collateral_id')->nullable()->constrained('collateral')->nullOnDelete();
//         });
//     }

//     public function down(): void
//     {
//         Schema::dropIfExists('files');
//     }
// };
