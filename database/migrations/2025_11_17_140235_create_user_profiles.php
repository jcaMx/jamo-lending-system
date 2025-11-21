<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // --------------------------
        // USERS
        // --------------------------
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
            $table->timestamps();
        });

        // --------------------------
        // ROLES
        // --------------------------
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name');     // Admin, Manager, Staff, etc.
            $table->string('slug')->unique();
            $table->timestamps();
        });

        // --------------------------
        // TEAMS
        // --------------------------
        // Schema::create('teams', function (Blueprint $table) {
        //     $table->id();
        //     $table->string('team_name');
        //     $table->timestamps();
        // });

        // --------------------------
        // USER PROFILES
        // --------------------------
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            // $table->foreignId('team_id')->nullable()->constrained('teams')->nullOnDelete();
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
            $table->string('avatar')->nullable();
            $table->date('birthdate')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
        Schema::dropIfExists('teams');
        Schema::dropIfExists('users');
        Schema::dropIfExists('roles');
    }
};
