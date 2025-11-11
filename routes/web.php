<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->prefix('Reports')->group(function () {
    Route::get('/DCPR', fn() => Inertia::render('Reports/DCPR'))->name('reports.dcpr');
    Route::get('/MonthlyReport', fn() => Inertia::render('Reports/MonthlyReport'))->name('reports.monthly');
    Route::get('/IncomeStatement', fn() => Inertia::render('Reports/IncomeStatement'))->name('reports.income');
});



require __DIR__.'/settings.php';
