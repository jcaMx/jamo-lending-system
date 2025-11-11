<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\BorrowerController;

// Route::get('/', function () {
//     return Inertia::render('Landing', [
//         'canRegister' => Features::enabled(Features::registration()),
//     ]);
// })->name('landing');

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Borrowers
    Route::get('/borrowers', [BorrowerController::class, 'index'])->name('borrowers.index');
    Route::get('/borrowers/add', [BorrowerController::class, 'add'])->name('borrowers.add');
    Route::get('/borrowers/{id}', [BorrowerController::class, 'show'])->name('borrowers.show');
    Route::get('/borrowers/{id}/loans', [BorrowerController::class, 'loans'])->name('borrowers.loans');
    Route::get('/borrowers/{id}/repayments', [BorrowerController::class, 'repayments'])->name('borrowers.repayments');


});

Route::middleware(['auth', 'verified'])->prefix('Reports')->group(function () {
    Route::get('/DCPR', fn() => Inertia::render('Reports/DCPR'))->name('reports.dcpr');
    Route::get('/MonthlyReport', fn() => Inertia::render('Reports/MonthlyReport'))->name('reports.monthly');
});



require __DIR__.'/settings.php';
