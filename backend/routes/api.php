<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\JobController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\Admin\UserController as AdminUserController;

// Group API routes with security headers
Route::middleware(['security.headers'])->group(function () {
    // Public
    Route::get('/jobs', [JobController::class, 'index']);
    Route::get('/jobs/{job}', [JobController::class, 'show']);

    // Auth (throttle to prevent abuse)
    Route::post('/auth/register', [AuthController::class, 'register'])->middleware('throttle:10,1');
    Route::post('/auth/login', [AuthController::class, 'login'])->middleware('throttle:10,1');

    Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/user/jobs', [JobController::class, 'myJobs']);

    // Job management (employer/admin)
    Route::post('/jobs', [JobController::class, 'store']);
    Route::put('/jobs/{job}', [JobController::class, 'update']);
    Route::delete('/jobs/{job}', [JobController::class, 'destroy']);

    // Applications
        Route::post('/jobs/{job}/apply', [ApplicationController::class, 'store'])->middleware('throttle:20,1');
    Route::get('/applications', [ApplicationController::class, 'index']);
        Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus'])->middleware('throttle:30,1');
    Route::get('/applications/{application}/resume', [ApplicationController::class, 'downloadResume']);

    // Admin
    Route::get('/admin/users', [AdminUserController::class, 'index']);
    Route::patch('/admin/users/{user}/role', [AdminUserController::class, 'updateRole']);
});
});
