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
        Schema::create('jamouser', function (Blueprint $table) {
            $table->bigIncrements('ID'); // Primary key
            $table->string('first_name', 20);
            $table->string('last_name', 20);
            $table->string('email', 50)->unique();
            $table->string('contact_no', 15);
            $table->unsignedBigInteger('account_id');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jamouser', function (Blueprint $table) {
            $table->dropForeign(['account_id']);
            $table->dropIndex('FK_User_UserAccount');
        });

        Schema::dropIfExists('jamouser');
    }
};
