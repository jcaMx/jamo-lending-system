<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;


Route::get('/', function () {
    return Inertia::render('index', [
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

Route::middleware(['auth', 'verified'])->prefix('Loans')->group(function () {
    Route::get('/VAL', fn() => Inertia::render('Loans/VAL'))->name('loans.val');
    Route::get('/PMD', fn() => Inertia::render('Loans/PMD'))->name('loans.past-maturity-date');
    Route::get('/1MLL', fn() => Inertia::render('Loans/1MLL'))->name('loans.one-month-late');
    Route::get('/3MLL', fn() => Inertia::render('Loans/3MLL'))->name('loans.three-month-late');
    Route::get('/AddLoan', fn() => Inertia::render('Loans/AddLoan'))->name('loans.add-loan');
    Route::get('/VLA', fn() => Inertia::render('Loans/VLA'))->name('loans.vla');
   
});


require __DIR__.'/settings.php';
