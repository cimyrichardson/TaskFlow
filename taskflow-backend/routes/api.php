<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\CategoryController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Routes pour les tâches
    Route::apiResource('tasks', TaskController::class);
    Route::put('/tasks/{task}/status', [TaskController::class, 'updateStatus']);

    // Routes pour les catégories
    Route::apiResource('categories', CategoryController::class)->except(['update', 'show']);
});