<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SprintController;
use App\Http\Controllers\TaskController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    // Admin → Employees
    Route::post('/admin/users', [AdminUserController::class, 'store']);
    Route::get('/users', [UserController::class, 'index']);

    // Sprints
    Route::get('/sprints', [SprintController::class, 'index']);
    Route::post('/sprints', [SprintController::class, 'store']);
    Route::get('/sprints/{id}/history', [SprintController::class, 'history']);

    // Tasks
    Route::post('/tasks', [TaskController::class, 'store']);
    Route::get('/sprints/{sprintId}/tasks', [TaskController::class, 'sprintTasks']);
    Route::patch('/tasks/{id}/status', [TaskController::class, 'updateStatus']);
    Route::patch('/tasks/{id}', [TaskController::class, 'update']);
    Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
});
