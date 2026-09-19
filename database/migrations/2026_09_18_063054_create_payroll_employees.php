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
        Schema::create('payroll_employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('payroll_import_id')->constrained()->cascadeOnDelete();
             $table->integer('row_number');
             $table->string('nip')->nullable();
             $table->string('rekening')->nullable();
             $table->string('bank')->nullable();
             $table->string('nama')->nullable();
             $table->string('departement')->nullable();
             $table->string('email')->nullable();

            // UPAH
            $table->decimal('lembur_biasa', 15, 2)->default(0);
            $table->decimal('jam_lb', 15, 2)->default(0);
            $table->decimal('jumlah_lb', 15, 2)->default(0);
            $table->decimal('lembur_libur', 15, 2)->default(0);
            $table->decimal('jam_ll', 15, 2)->default(0);
            $table->decimal('jumlah_ll', 15, 2)->default(0);
            $table->decimal('total_lembur', 15, 2)->default(0);

            $table->boolean('email_sent')->default(false);
            $table->timestamp('email_sent_at')->nullable();
            $table->string('pdf_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payroll_employees');
    }
};
