<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BorrowerController;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;
use Laravel\Fortify\Http\Controllers\RegisteredUserController;

/*
|--------------------------------------------------------------------------
| Public / Guest Routes
|--------------------------------------------------------------------------
*/

Route::get('/', fn() => Inertia::render('welcome'))->name('home');

// Guest-only routes
Route::middleware('guest')->group(function () {
    // Login
    Route::get('/login', fn() => Inertia::render('auth/login'))->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');

    // Register
    Route::get('/register', fn() => Inertia::render('auth/register'))->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');
});


/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard
    Route::get('/dashboard', function() { return Inertia::render('dashboard'); })->name('dashboard');

    // Logout
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Borrowers
    Route::prefix('borrowers')->group(function () {
        Route::get('/', [BorrowerController::class, 'index'])->name('borrowers.index');
        Route::get('/add', [BorrowerController::class, 'add'])->name('borrowers.add');
        Route::get('/{id}', [BorrowerController::class, 'show'])->name('borrowers.show');
        Route::get('/{id}/loans', [BorrowerController::class, 'loans'])->name('borrowers.loans');
        Route::get('/{id}/repayments', [BorrowerController::class, 'repayments'])->name('borrowers.repayments');
    });

    // Loans
    Route::prefix('Loans')->group(function () {
        Route::get('/AddLoan', fn() => Inertia::render('Loans/AddLoan'))->name('loans.add-loan');
        Route::get('/1MLL', fn() => Inertia::render('Loans/1MLL'))->name('loans.one-month-late');
        Route::get('/3MLL', fn() => Inertia::render('Loans/3MLL'))->name('loans.three-month-late');
        Route::get('/PMD', fn() => Inertia::render('Loans/PMD'))->name('loans.past-maturity-date');
        Route::get('/VLA', fn() => Inertia::render('Loans/VLA'))->name('loans.applications');
        Route::get('/VAL', fn() => Inertia::render('Loans/VAL'))->name('loans.view');
    });

    // Reports
    Route::prefix('Reports')->group(function () {
        Route::get('/DCPR', fn() => Inertia::render('Reports/DCPR'))->name('reports.dcpr');
        Route::get('/MonthlyReport', fn() => Inertia::render('Reports/MonthlyReport'))->name('reports.monthly');
        Route::get('/IncomeStatement', fn() => Inertia::render('Reports/IncomeStatement'))->name('reports.income');
    });

});

require __DIR__.'/settings.php';
