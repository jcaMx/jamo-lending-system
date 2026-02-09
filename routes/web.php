<?php
use Illuminate\Support\Facades\Auth;

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\BorrowerController;
use App\Http\Controllers\DailyCollectionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\RepaymentController;
use App\Http\Controllers\Reports\DCPRController;
use App\Http\Controllers\Reports\MCPRController;
use App\Http\Controllers\UserController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;
use Laravel\Fortify\Http\Controllers\RegisteredUserController;
use Spatie\Permission\Middleware\RoleMiddleware;
use App\Models\Loan;
use App\Http\Controllers\LoanCommentController;



use App\Http\Controllers\Customer\CustomerDashboardController;
use App\Http\Controllers\Customer\MyLoanController;
use App\Http\Controllers\Customer\MyRepaymentsController;

use App\Http\Controllers\Customer\MyProfileController;

/*
|--------------------------------------------------------------------------
| Public / Guest Routes
|--------------------------------------------------------------------------
*/

Route::get('/dashboard-stats', [DashboardController::class, 'stats']);
Route::get('/dashboard-loans', [DashboardController::class, 'loans']);
Route::get('/dashboard-collections', [DashboardController::class, 'collections']);
Route::get('/dashboard-upcoming-schedules', [DashboardController::class, 'upcomingDueSchedules']);
Route::get('/', fn () => Inertia::render('index'))->name('home');

// Guest-only routes
Route::middleware('guest')->group(function () {
    // Login
    Route::get('/login', fn () => Inertia::render('auth/login'))->name('login');
    Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');

    // Register
    Route::get('/register', fn () => Inertia::render('auth/register'))->name('register');
    Route::post('/register', [RegisteredUserController::class, 'store'])->name('register.store');
});

/*
|--------------------------------------------------------------------------
| Authenticated - Staff Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    $user = Auth::user();

    if ($user && $user->hasRole('customer')) {
        return redirect()->route('customer.dashboard');
    }

    // staff / admin / others
    return Inertia::render('dashboard');
})->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {

    // Dashboard (your Wayfinder dashboard().url likely resolves this name)
    // Route::get('/dashboard', fn () => Inertia::render('dashboard'))->name('dashboard');

    // Logout
    Route::post('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Borrowers
    Route::prefix('borrowers')->middleware(['role:admin|cashier'])->group(function () {
        Route::get('/', [BorrowerController::class, 'index'])->name('borrowers.index');
        Route::get('/search', [BorrowerController::class, 'search'])->name('borrowers.search');
        Route::get('/{id}/loans', [BorrowerController::class, 'checkLoans'])->name('borrowers.check-loans');
        Route::delete('{id}', [BorrowerController::class, 'destroy'])->name('borrowers.destroy');
    });
    Route::prefix('borrowers')->middleware(['role:admin'])->group(function () {
        Route::get('/add', [BorrowerController::class, 'add'])->name('borrowers.add');
        Route::post('/', [BorrowerController::class, 'store'])->name('borrowers.store');
        Route::get('/{id}', [BorrowerController::class, 'show'])->name('borrowers.show');
        Route::get('/{id}/edit', [BorrowerController::class, 'show'])->name('borrowers.edit');
        // Route::put('/borrowers/{borrower}', [BorrowerController::class, 'update'])->name('borrowers.update');
        Route::put('/{borrower}', [BorrowerController::class, 'update'])->name('borrowers.update');
    });

    // Loans (match sidebar hrefs: /Loans/VAL, /Loans/PMD, etc.)
    Route::prefix('Loans')->middleware(['role:admin|cashier'])->group(function () {
        Route::get('/', fn () => Inertia::render('Loans/Index'))->name('loans.index');
        Route::get('/AddLoan', [LoanController::class, 'add'])->name('loans.add');
        Route::get('/1MLL', [LoanController::class, 'oneMonthLate'])->name('loans.one-month-late');
        Route::get('/3MLL', [LoanController::class, 'threeMonthLate'])->name('loans.three-month-late');
        Route::get('/PMD', [LoanController::class, 'pastMaturityDate'])->name('loans.past-maturity-date');
        Route::get('/VLA', [LoanController::class, 'index'])->name('loans.view');
        Route::get('/VAL', [LoanController::class, 'viewApproved'])->name('loans.view-all');
        Route::get('/ViewLoans', [LoanController::class, 'viewApproved'])->name('loans.view-approved');
        Route::get('/{loan}/schedule', [LoanController::class, 'showSchedule'])->name('loans.schedule');
        Route::post('/', [LoanController::class, 'store'])->name('loans.store');
        Route::get('/{loan}', [LoanController::class, 'show'])->name('loans.show');
        Route::middleware(['role:admin'])->group(function () {
            Route::post('/approve/{loan}', [LoanController::class, 'approve'])->name('loans.approve');
            Route::post('/reject/{loan}', [LoanController::class, 'reject'])->name('loans.reject');
            Route::post('/close/{loan}', [LoanController::class, 'close'])->name('loans.close');
        });
    });

    // Daily Collection Sheets
    Route::get('/daily-collections', [DailyCollectionController::class, 'index'])->name('index');

    // Repayments (match sidebar hrefs: /repayments, /repayments/add)
    Route::prefix('repayments')
        ->middleware(['role:cashier|admin'])
        ->group(function () {
            Route::get('/', [RepaymentController::class, 'index'])->name('repayments.index');
            Route::get('/add', [RepaymentController::class, 'add'])->name('repayments.add');
            Route::post('/store', [RepaymentController::class, 'store'])->name('repayments.store');
        });

    // Reports (match sidebar hrefs: /Reports/DCPR, /Reports/MonthlyReport)
    Route::prefix('Reports')->middleware([RoleMiddleware::class.':admin'])->group(function () {
        Route::get('/DCPR', fn () => Inertia::render('Reports/DCPR'))->name('reports.dcpr');
        Route::post('/dcpr/export-pdf', [DCPRController::class, 'exportPdf'])->name('reports.dcpr.export');
        Route::post('/dcpr/print', [DCPRController::class, 'printPreview'])->name('reports.dcpr.print');

        Route::get('/MonthlyReport', fn () => Inertia::render('Reports/MonthlyReport'))->name('reports.monthly');
        Route::post('/monthly/export-pdf', [MCPRController::class, 'exportPdf'])->name('reports.monthly.export');
        Route::post('/monthly/print', [MCPRController::class, 'printPreview'])->name('reports.monthly.print');
    });

    // Users
    Route::middleware([RoleMiddleware::class.':admin'])->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/add', [UserController::class, 'add'])->name('users.add');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');

        Route::get('/users/credentials/{id}', [UserController::class, 'credentials'])->name('users.newUserCredentials');

        Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
        Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
    });

    // Applications
    Route::post('/applications', [ApplicationController::class, 'storeBorrower'])->name('applications.store');
    Route::post('/applications/{application}/co-borrower', [ApplicationController::class, 'storeCoBorrower'])->name('applications.coBorrower.store');
    Route::post('/applications/{application}/collateral', [ApplicationController::class, 'storeCollateral'])->name('applications.collateral.store');
    Route::post('/applications/{application}/loan-details', [ApplicationController::class, 'storeLoanDetails'])->name('applications.loan.store');
    Route::post('/applications/confirm', [ApplicationController::class, 'confirm'])->name('applications.confirm');
    Route::get('/applications/{application}', [ApplicationController::class, 'show'])->name('applications.show');

    Route::prefix('api')->group(function () {
    Route::get('/dashboard-stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard-loans', [DashboardController::class, 'loans']);
    Route::get('/dashboard-collections', [DashboardController::class, 'collections']);
    Route::get('/all-loans', [DashboardController::class, 'allLoans']);
});

   Route::post('/loans/{loan}/comments', [LoanCommentController::class, 'store'])
    ->name('loans.comments.store');

});

Route::middleware(['auth', 'role:admin|cashier'])->group(function () {
    Route::post('/loans/{loan}/comments', [LoanController::class, 'addComment'])->name('loans.comments.add');
    Route::delete('/loans/comments/{comment}', [LoanController::class, 'deleteComment'])->name('loans.comments.delete');
});


/*
|--------------------------------------------------------------------------
| Authenticated- Customer Routes
|--------------------------------------------------------------------------
*/

// Route::middleware(['web', 'auth', 'role:customer'])->group(function () {
//     Route::get('/customer/dashboard', function () {
//         return Inertia::render('customer/dashboard');
//     })->name('customer.dashboard');
// });

Route::middleware(['auth', 'verified', 'role:customer'])->group(function () {
    Route::get('/customer/dashboard', [CustomerDashboardController::class, 'index'])
        ->name('customer.dashboard');

    Route::get('/my-loan', [MyLoanController::class, 'index'])
        ->name('customer.MyLoan');
    
    Route::get('/my-repayments', [MyRepaymentsController::class, 'index'])->name('customer.repayments');

    Route::get('/my-profile', [MyProfileController::class, 'index'])
    ->name('customer.profile');

    Route::put('/my-profile', [MyProfileController::class, 'update'])
    ->name('customer.profile.update');

    Route::get('/applynow', fn () => Inertia::render('BorrowerApplication'))->name('apply');

    Route::get('/my-loan-details', fn () => redirect('/my-loan'))->name('customer.loan.details');

});





require __DIR__.'/settings.php';
