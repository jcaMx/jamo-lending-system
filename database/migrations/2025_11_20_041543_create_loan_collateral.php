<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Formula
        Schema::create('formula', function (Blueprint $table) {
            $table->id();
            $table->string('name', 20);
            $table->string('expression', 50);
            $table->string('variables', 20);
            $table->string('description', 100)->nullable();
            $table->timestamp('createdAt')->useCurrent();
        });

        // Loan
        Schema::create('loan', function (Blueprint $table) {
            $table->id();
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->integer('term_months');
            $table->enum('repayment_frequency', ['Weekly','Monthly','Yearly'])->nullable();
            $table->decimal('principal_amount', 10, 2);
            $table->float('interest_rate');
            $table->enum('interest_type', ['Simple','Compound','Deminishing'])->nullable();
            $table->string('loan_type', 50)->nullable();
            $table->enum('status', ['Active','Fully_Paid','Bad_Debt','Rejected','Pending'])->default('Pending');
            $table->decimal('balance_remaining', 10, 2);
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
            $table->foreignId('borrower_id')->constrained('borrower')->cascadeOnDelete();
            $table->foreignId('formula_id')->constrained('formula');
        });

        // Amortization schedule
        Schema::create('amortizationschedule', function (Blueprint $table) {
            $table->id();
            $table->integer('installment_no');
            $table->decimal('interest_amount', 15, 2);
            $table->decimal('penalty_amount', 15, 2)->default(0.00);
            $table->dateTime('due_date');
            $table->enum('status', ['Paid','Unpaid','Overdue'])->default('Unpaid');
            $table->foreignId('holiday_id')->nullable()->constrained('holidays')->nullOnDelete();
            $table->foreignId('loan_id')->constrained('loan')->cascadeOnDelete();
            $table->decimal('installment_amount', 15, 2)->nullable();
            $table->timestamps();
            $table->decimal('amount_paid', 10, 2)->default(0.00);
        });

        // Collateral
        Schema::create('collateral', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['Land','Vehicle','ATM'])->nullable();
            $table->decimal('estimated_value', 10, 2)->nullable();
            $table->dateTime('appraisal_date')->nullable();
            $table->unsignedBigInteger('ownership_proof')->nullable();
            $table->enum('status', ['Pledged','Released','Forfeited','Pending'])->nullable();
            $table->string('remarks', 100)->nullable();
            $table->string('description', 100)->nullable();
            $table->foreignId('appraised_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('loan_id')->constrained('loan')->cascadeOnDelete();
        });

        // ATM Collateral Details
        Schema::create('atmcollateraldetails', function (Blueprint $table) {
            $table->id();
            $table->enum('bank_name', ['BDO','BPI','LandBank','MetroBank']);
            $table->string('account_no', 20);
            $table->integer('cardno_4digits');
            $table->foreignId('collateral_id')->constrained('collateral')->cascadeOnDelete();
        });

        // Land Collateral Details
        Schema::create('landcollateraldetails', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('titleNo');
            $table->bigInteger('lotNo');
            $table->string('location', 50);
            $table->string('areaSize', 20);
            $table->foreignId('collateralID')->constrained('collateral')->cascadeOnDelete();
        });


        Schema::create('vehiclecollateraldetails', function (Blueprint $table) {
            $table->bigIncrements('ID'); // auto-increment primary key
            $table->enum('type', ['Car', 'Motorcycle', 'Truck'])->nullable();
            $table->string('brand', 20);
            $table->string('model', 20);
            $table->year('year_model')->nullable();
            $table->string('plate_no', 20)->nullable();
            $table->string('engine_no', 20)->nullable();
            $table->enum('transmission_type', ['Manual', 'Automatic'])->nullable();
            $table->string('fuel_type', 20)->nullable();
            $table->unsignedBigInteger('collateral_id');

            // If collateral_id references another table, add a foreign key:
            // $table->foreign('collateral_id')->references('id')->on('collaterals')->onDelete('cascade');

            $table->timestamps(); // optional, adds created_at and updated_at
        });

    }
    

    public function down(): void
    {
        Schema::dropIfExists('landcollateraldetails');
        Schema::dropIfExists('atmcollateraldetails');
        Schema::dropIfExists('vehiclecollateraldetails');
        Schema::dropIfExists('collateral');
        Schema::dropIfExists('amortizationschedule');
        Schema::dropIfExists('loan');
        Schema::dropIfExists('formula');
    }

};