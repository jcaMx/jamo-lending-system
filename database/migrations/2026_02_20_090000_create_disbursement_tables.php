<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('disbursement')) {
            Schema::create('disbursement', function (Blueprint $table) {
                $table->id();
                $table->foreignId('loan_id')->constrained('loan')->restrictOnDelete();
                $table->foreignId('borrower_id')->constrained('borrower')->restrictOnDelete();

                $table->string('disbursement_no', 50)->unique();
                $table->decimal('amount', 10, 2);
                $table->char('currency', 3)->default('PHP');
                $table->enum('method', ['Bank', 'Cash', 'GCash', 'Cebuana', 'Cheque Voucher']);
                $table->string('reference_no', 100)->nullable();

                $table->enum('status', ['Draft', 'Pending', 'Processing', 'Completed', 'Failed', 'Reversed'])
                    ->default('Pending');
                $table->dateTime('requested_at')->useCurrent();
                $table->dateTime('disbursed_at')->nullable();

                $table->unsignedBigInteger('approved_by')->nullable();
                $table->dateTime('approved_at')->nullable();
                $table->unsignedBigInteger('processed_by')->nullable();

                $table->string('failure_code', 50)->nullable();
                $table->string('failure_reason', 255)->nullable();
                $table->string('remarks', 255)->nullable();

                $table->string('idempotency_key', 64)->unique();
                $table->unsignedBigInteger('created_by');

                $table->timestamps();

                $table->index(['loan_id', 'status'], 'idx_disbursement_loan_status');
                $table->index('disbursed_at', 'idx_disbursement_disbursed_at');

                $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete();
                $table->foreign('processed_by')->references('id')->on('users')->nullOnDelete();
                $table->foreign('created_by')->references('id')->on('users')->restrictOnDelete();
            });
        } else {
            // Align method enum for existing tables to include Cheque Voucher.
            try {
                DB::statement("ALTER TABLE disbursement MODIFY method ENUM('Bank','Cash','GCash','Cebuana','Cheque Voucher') NOT NULL");
            } catch (\Throwable $e) {
                // Keep migration resilient across engines/versions.
            }
        }

        if (! Schema::hasTable('disbursement_events')) {
            Schema::create('disbursement_events', function (Blueprint $table) {
                $table->id();
                $table->foreignId('disbursement_id')->constrained('disbursement')->cascadeOnDelete();
                $table->string('event_type', 50);
                $table->string('old_status', 20)->nullable();
                $table->string('new_status', 20)->nullable();
                $table->json('payload')->nullable();
                $table->unsignedBigInteger('actor_id')->nullable();
                $table->dateTime('created_at')->useCurrent();

                $table->index('disbursement_id', 'idx_disbursement_events_disbursement');
                $table->index('created_at', 'idx_disbursement_events_created_at');
                $table->foreign('actor_id')->references('id')->on('users')->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('disbursement_events');
        Schema::dropIfExists('disbursement');
    }
};
