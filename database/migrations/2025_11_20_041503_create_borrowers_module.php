<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Borrowers
        Schema::create('borrower', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 20);
            $table->string('last_name', 20);
            $table->integer('age')->nullable();
            $table->enum('gender', ['Male','Female'])->nullable();
            $table->string('email', 50);
            $table->string('contact_no', 15);
            $table->string('land_line', 20)->nullable();
            $table->char('marital_status', 10)->nullable();
            $table->integer('numof_dependentchild')->nullable();
            $table->enum('home_ownership', ['Owned','Rented','Mortgage'])->nullable();
            $table->timestamp('membership_date')->useCurrent();
            $table->enum('status', ['Active','Closed','Blacklisted'])->nullable();
            $table->date('birth_date')->nullable();
        });

        // Borrower Addresses
        Schema::create('borrower_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('borrower_id')->constrained('borrower')->cascadeOnDelete();
            $table->string('address', 50);
            $table->string('city', 20);
        });

        // Borrower Employments
        Schema::create('borrower_employments', function (Blueprint $table) {
            $table->id();
            $table->enum('employment_status', ['Employed','UnEmployed'])->nullable();
            $table->string('income_source', 20)->nullable();
            $table->string('occupation', 20)->nullable();
            $table->string('position', 20)->nullable();
            $table->string('agency_address', 50)->nullable();
            $table->decimal('monthly_income', 10, 2);
            $table->foreignId('borrower_id')->constrained('borrower')->cascadeOnDelete();
        });

        // Borrower IDs
        Schema::create('borrower_ids', function (Blueprint $table) {
            $table->id();
            $table->string('id_type', 20);
            $table->string('id_nummber', 20);
            $table->foreignId('borrower_id')->constrained('borrower')->cascadeOnDelete();
        });

        // Co-borrower
        Schema::create('co_borrower', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 20);
            $table->string('last_name', 20);
            $table->integer('age');
            $table->date('birth_date');
            $table->string('address', 50);
            $table->string('email', 50);
            $table->string('contact_no', 15);
            $table->string('occupation', 20)->nullable();
            $table->string('position', 20)->nullable();
            $table->string('agency_address', 50)->nullable();
            $table->char('marital_status', 10)->nullable();
            $table->enum('home_ownership', ['Owned','Rented','Mortgage'])->nullable();
            $table->foreignId('borrower_id')->constrained('borrower')->cascadeOnDelete();
        });

        // Files
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->enum('file_type', ['id_document','photo','contract','collateral_documennt'])->nullable();
            $table->string('file_name', 20);
            $table->string('file_path', 100);
            $table->timestamp('uploaded_at')->useCurrent();
            $table->string('description', 100)->nullable();
            $table->foreignId('borrower_id')->constrained('borrower')->cascadeOnDelete();
            $table->foreignId('collateral_id')->constrained('collateral')->cascadeOnDelete();
        });

        // SPOUSE TABLE
        Schema::create('spouse', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 20);
            $table->string('last_name', 20);
            $table->string('contact_no', 15);
            $table->string('occupation', 20)->nullable();
            $table->string('position', 20)->nullable();
            $table->string('agency_address', 50)->nullable();
            $table->foreignId('borrower_id')->constrained('borrower')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('files');
        Schema::dropIfExists('co_borrower');
        Schema::dropIfExists('borrower_ids');
        Schema::dropIfExists('borrower_employments');
        Schema::dropIfExists('borrower_addresses');
        Schema::dropIfExists('borrower');
    }
};
