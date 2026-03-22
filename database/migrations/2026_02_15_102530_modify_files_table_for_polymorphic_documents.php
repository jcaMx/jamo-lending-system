<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('files', function (Blueprint $table) {

            // 1. Remove enum for flexibility
            $table->dropColumn('file_type');

            // 2. Increase length for file name and path
            $table->string('file_name', 255)->change();
            $table->string('file_path', 255)->change();
            $table->string('description', 255)->nullable()->change();

            // 3. Make collateral_id nullable (not all files are collateral)
            $table->unsignedBigInteger('collateral_id')->nullable()->change();

            // 4. Add polymorphic support
            $table->unsignedBigInteger('documentable_id')->nullable();
            $table->string('documentable_type')->nullable();

            // 5. Add status for verification workflow
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');

            // 6. Track verifier
            $table->unsignedBigInteger('verified_by')->nullable()->after('status');
            $table->timestamp('verified_at')->nullable()->after('verified_by');

            // Optional: add foreign key for verified_by if you have users table
            $table->foreign('verified_by')->references('id')->on('users')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('files', function (Blueprint $table) {
            // Reverse changes if needed
            $table->enum('file_type', ['id_document','photo','contract','collateral_documennt'])->nullable();
            $table->string('file_name', 20)->change();
            $table->string('file_path', 100)->change();
            $table->string('description', 100)->nullable()->change();
            $table->unsignedBigInteger('collateral_id')->change();

            $table->dropColumn(['documentable_id','documentable_type','status','verified_by','verified_at']);
        });
    }
};
