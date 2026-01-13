<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();

            $table->string('task_no')->unique(); // ST-101
            $table->string('title');
            $table->text('description')->nullable();

            $table->unsignedTinyInteger('points')->default(1);

            $table->enum('priority', [
                'low',
                'medium',
                'high',
                'very_high'
            ])->default('medium');

            $table->enum('status', [
                'to_do',
                'in_progress',
                'in_code_review',
                'in_qa',
                'ready_to_deployment',
                'done'
            ])->default('to_do');

            $table->foreignId('sprint_id')
                  ->constrained('sprints')
                  ->cascadeOnDelete();

            $table->foreignId('assignee_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            $table->foreignId('qa_owner_id')
                  ->nullable()
                  ->constrained('users')
                  ->nullOnDelete();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
