<?php

use App\Http\Controllers\DashboardController;

Route::get('/dashboard-stats', [DashboardController::class, 'stats']);
Route::get('/dashboard-loans', [DashboardController::class, 'loans']);
Route::get('/dashboard-collections', [DashboardController::class, 'collections']);
Route::get('/all-loans', [DashboardController::class, 'allLoans']);




use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoleController;

Route::prefix('v1')->group(function () {
    Route::apiResource('users', UserController::class)->parameters(['users' => 'id']);
    Route::get('roles', [RoleController::class,'index']);
    Route::post('roles', [RoleController::class,'store']);

    
});
