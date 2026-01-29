<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Formula Table
        Schema::create('formula', function (Blueprint $table) {
            $table->id();
            $table->string('name', 20);
            $table->string('expression', 50);
            $table->string('variables', 20);
            $table->string('description', 100)->nullable();
            // $table->timestamp('created_at')->useCurrent();
        });

        // Loan Table
        Schema::create('loan', function (Blueprint $table) {
            $table->id();
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->integer('term_months');
            $table->enum('repayment_frequency', ['Weekly', 'Monthly', 'Yearly'])->nullable();
            $table->decimal('principal_amount', 10, 2);
            $table->float('interest_rate');
            $table->enum('interest_type', ['Simple', 'Compound', 'Deminishing'])->nullable();
            $table->string('loan_type', 50)->nullable();
            $table->enum('status', ['Active', 'Fully_Paid', 'Bad_Debt', 'Rejected', 'Pending'])->default('Pending');
            $table->decimal('balance_remaining', 10, 2);
            // `users` table may be created in a different migration file.
            // Create the column without an immediate foreign key constraint
            // to avoid ordering issues during `migrate:fresh`.
            $table->timestamps();

            $table->foreign('borrower_id', 'FK_Loan_Borrower')
            ->references('id')->on('borrower')
            ->onDelete('cascade');
  
            $table->foreign('formula_id', 'FK_Loan_Formula')
                    ->references('id')->on('formula')
                    ->onUpdate('cascade');
        
            $table->foreign('approved_by', 'FK_Loan_User')
                    ->references('id')->on('jamouser');
        });

        // Amortization table
        Schema::create('amortizationschedule', function (Blueprint $table) {
            $table->id();
            $table->integer('installment_no');

            $table->decimal('interest_amount', 15, 2);
            $table->decimal('penalty_amount', 15, 2)->default(0.00);
            $table->dateTime('due_date');
            $table->enum('status', ['Paid', 'Unpaid', 'Overdue'])->default('Unpaid');
            // Create holiday_id column without FK to avoid constraint formation errors.
            // FK can be added in a separate migration if needed.
            $table->unsignedBigInteger('holiday_id')->nullable();
            $table->foreignId('loan_id')->constrained('loan')->cascadeOnDelete();
            $table->decimal('installment_amount', 15, 2)->nullable();
            $table->timestamps();
            $table->decimal('amount_paid', 10, 2)->default(0.00);
        });

        // Collateral
        Schema::create('collateral', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['Land', 'Vehicle', 'ATM'])->nullable();
            $table->decimal('estimated_value', 10, 2)->nullable();
            $table->dateTime('appraisal_date')->nullable();
            $table->unsignedBigInteger('ownership_proof')->nullable();
            $table->enum('status', ['Pledged', 'Released', 'Forfeited', 'Pending'])->nullable();
            $table->string('remarks', 100)->nullable();
            $table->string('description', 100)->nullable();
            // Create appraised_by column without FK to avoid dependency on users migration order.
            $table->foreign('loan_id', 'FK_Collateral_Loan')
            ->references('id')->on('loan')
            ->onDelete('cascade');

            $table->foreign('appraised_by', 'FK_Collateral_User')
                    ->references('id')->on('jamouser');
        });

        // ATM Collateral
        Schema::create('atmcollateraldetails', function (Blueprint $table) {
            $table->id();
            $table->enum('bank_name', ['BDO', 'BPI', 'LandBank', 'MetroBank']);
            $table->string('account_no', 20);
            $table->integer('cardno_4digits');
            $table->unsignedBigInteger('collateral_id');

            $table->foreign('collateral_id', 'FK_ATMCollateral_Collateral')
                  ->references('id')->on('collateral')
                  ->onDelete('cascade');
        });

        // Land Collateral
        Schema::create('landcollateraldetails', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('titleNo');
            $table->bigInteger('lotNo');
            $table->string('location', 50);
            $table->string('areaSize', 20);
            $table->unsignedBigInteger('collateral_id');

            $table->foreign('collateral_id', 'FK_LandCollateral_Collateral')
                  ->references('ID')->on('collateral')
                  ->onDelete('cascade');
        });

        // Vehicle Collateral
        Schema::create('vehiclecollateraldetails', function (Blueprint $table) {
            $table->id();
            $table->enum('type', ['Car', 'Motorcycle', 'Truck'])->nullable();
            $table->string('brand', 20);
            $table->string('model', 20);
            $table->year('year_model')->nullable();
            $table->string('plate_no', 20)->nullable();
            $table->string('engine_no', 20)->nullable();
            $table->enum('transmission_type', ['Manual', 'Automatic'])->nullable();
            $table->string('fuel_type', 20)->nullable();
            $table->timestamps();

            $table->unsignedBigInteger('collateral_id');

            $table->foreign('collateral_id', 'FK_VehicleCollateral_Collateral')
                  ->references('id')->on('collateral')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehiclecollateraldetails');
        Schema::dropIfExists('landcollateraldetails');
        Schema::dropIfExists('atmcollateraldetails');
        Schema::dropIfExists('collateral');
        Schema::dropIfExists('amortizationschedule');
        Schema::dropIfExists('loan');
        Schema::dropIfExists('formula');
    }
};
