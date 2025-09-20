<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pilgrims', function (Blueprint $table) {
            $table->id();
            $table->string('first_name', 255);
            $table->string('last_name', 255);
            $table->string('email', 255)->unique();
            $table->string('phone', 50);
            $table->string('city', 255);
            $table->string('country', 100);
            $table->string('accommodation_type', 100)->nullable();
            $table->text('special_needs')->nullable();
            $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');
            $table->timestamp('registration_date')->useCurrent();
            $table->timestamps();

            $table->index('status');
            $table->index('country');
            $table->index('registration_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pilgrims');
    }
};