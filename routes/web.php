<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BorrowerController;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;
use Laravel\Fortify\Http\Controllers\RegisteredUserController;

use App\Http\Controllers\UserController;
use App\Http\Controllers\RepaymentController;
use App\Http\Controllers\CollectionSheetController;
use App\Http\Controllers\Reports\DCPRController;
use App\Http\Controllers\Reports\MCPRController;
use Spatie\Permission\Middleware\RoleMiddleware;

/*
|--------------------------------------------------------------------------
| Public / Guest Routes
|--------------------------------------------------------------------------
*/

Route::get('/', fn() => Inertia::render('index'))->name('home');

Route::get('/apply', fn() => Inertia::render('BorrowerApplication'))->name('apply');
Route::get('/applynow', fn() => Inertia::render('LoanApplication'))->name('applynow');

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

    // Dashboard (your Wayfinder dashboard().url likely resolves this name)
    Route::get('/dashboard', fn() => Inertia::render('dashboard'))->name('dashboard');

    // Logout
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Borrowers
    Route::prefix('borrowers')->middleware(['role:admin|cashier'])->group(function () {
        Route::get('/', [BorrowerController::class, 'index'])->name('borrowers.index');
    });
    Route::prefix('borrowers')->middleware(['role:admin'])->group(function () {
        Route::get('/add', [BorrowerController::class, 'add'])->name('borrowers.add');
        Route::get('/{id}', [BorrowerController::class, 'show'])->name('borrowers.show');
        Route::get('/{id}/edit', [BorrowerController::class, 'show'])->name('borrowers.edit');
    });

    // Loans (match sidebar hrefs: /Loans/VAL, /Loans/PMD, etc.)
    Route::prefix('Loans')->middleware(['role:admin|cashier'])->group(function () {
        Route::get('/1MLL', fn() => Inertia::render('Loans/1MLL'))->name('loans.one-month-late');
        Route::get('/3MLL', fn() => Inertia::render('Loans/3MLL'))->name('loans.three-month-late');
        Route::get('/PMD', fn() => Inertia::render('Loans/PMD'))->name('loans.past-maturity-date');
        Route::get('/VLA', fn() => Inertia::render('Loans/VLA'))->name('loans.applications');
        Route::get('/VAL', fn() => Inertia::render('Loans/VAL'))->name('loans.view');
    });
    Route::prefix('Loans')->middleware(['role:admin'])->group(function () {
        Route::get('/AddLoan', fn() => Inertia::render('Loans/AddLoan'))->name('loans.add-loan');
    });

    // Daily Collection Sheets
    Route::get('/daily-collections', [CollectionSheetController::class, 'index'])->name('daily-collections.index');

    // Repayments (match sidebar hrefs: /repayments, /repayments/add)
    Route::prefix('repayments')
        ->middleware(['role:cashier|admin'])
        ->group(function () {
            Route::get('/', [RepaymentController::class, 'index'])->name('repayments.index');
            Route::get('/add', [RepaymentController::class, 'add'])->name('repayments.add');
        });

    // Reports (match sidebar hrefs: /Reports/DCPR, /Reports/MonthlyReport)
    Route::prefix('Reports')->middleware([RoleMiddleware::class . ':admin'])->group(function () {
        Route::get('/DCPR', fn() => Inertia::render('Reports/DCPR'))->name('reports.dcpr');
        Route::post('/dcpr/export-pdf', [DCPRController::class, 'exportPdf'])->name('reports.dcpr.export');
        Route::post('/dcpr/print', [DCPRController::class, 'printPreview'])->name('reports.dcpr.print');

        Route::get('/MonthlyReport', fn() => Inertia::render('Reports/MonthlyReport'))->name('reports.monthly');
        Route::post('/monthly/export-pdf', [MCPRController::class, 'exportPdf'])->name('reports.monthly.export');
        Route::post('/monthly/print', [MCPRController::class, 'printPreview'])->name('reports.monthly.print');
    });

    // Users
    Route::middleware([RoleMiddleware::class . ':admin'])->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/add', [UserController::class, 'add'])->name('users.add');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');

        Route::get('/users/credentials/{id}', [UserController::class, 'credentials'])->name('users.newUserCredentials');

        Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
        Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
    });
});

require __DIR__.'/settings.php';
