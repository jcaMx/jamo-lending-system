<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loancomments', function (Blueprint $table) {
            $table->id();
            $table->string('comment_text', 100);
            $table->unsignedBigInteger('commented_by');
            $table->dateTime('comment_date')->useCurrent()->useCurrentOnUpdate();
            $table->foreignId('loan_id')->constrained('loan')->cascadeOnDelete();

            $table->foreign('commented_by', 'FK_LoanComments_User')
                ->references('ID')->on('jamouser');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loancomments');
    }
};



