<?php

use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\BorrowerController;
use App\Http\Controllers\Customer\CustomerDashboardController;
use App\Http\Controllers\Customer\MyLoanController;
use App\Http\Controllers\Customer\MyProfileController;
use App\Http\Controllers\Customer\MyRepaymentsController;
use App\Http\Controllers\DailyCollectionController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DisbursementController;
use App\Http\Controllers\LoanCommentController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\RepaymentController;
use App\Http\Controllers\Reports\DCPRController;
use App\Http\Controllers\Reports\MCPRController;
use App\Http\Controllers\UserController;
use App\Models\DocumentType;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Http\Controllers\AuthenticatedSessionController;
use Laravel\Fortify\Http\Controllers\RegisteredUserController;
use Spatie\Permission\Middleware\RoleMiddleware;
use App\Http\Controllers\LoanSettingController;
use App\Http\Controllers\Api\CoBorrowerController;


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

    //co-borrower   
Route::get('/co-borrowers', [CoBorrowerController::class, 'coBorrowers']);
    // Borrowers
    Route::prefix('borrowers')->middleware(['role:admin|cashier'])->group(function () {
        Route::get('/', [BorrowerController::class, 'index'])->name('borrowers.index');
        Route::get('/search', [BorrowerController::class, 'search'])->name('borrowers.search');
        Route::get('/{id}', [BorrowerController::class, 'show'])->name('borrowers.show')->whereNumber('id');
        Route::get('/{id}/loans', [BorrowerController::class, 'checkLoans'])->name('borrowers.check-loans')->whereNumber('id');
        Route::get('/{id}/income', [BorrowerController::class, 'income'])->name('borrowers.income')->whereNumber('id');
        Route::delete('{id}', [BorrowerController::class, 'destroy'])->name('borrowers.destroy')->whereNumber('id');
    });
    Route::prefix('borrowers')->middleware(['role:admin'])->group(function () {
        Route::get('/add', [BorrowerController::class, 'add'])->name('borrowers.add');
        Route::post('/', [BorrowerController::class, 'store'])->name('borrowers.store');
       
        Route::get('/{id}/edit', [BorrowerController::class, 'show'])->name('borrowers.edit')->whereNumber('id');
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
        Route::put('/{loan}/borrower', [LoanController::class, 'updateBorrowerDetails'])->name('loans.borrower.update');
        Route::delete('/{loan}/borrower-files/{file}', [LoanController::class, 'destroyBorrowerFile'])->name('loans.borrower-files.destroy');
        Route::put('/{loan}/collateral', [LoanController::class, 'updateCollateral'])->name('loans.collateral.update');
        Route::post('/{loan}/collateral-files', [LoanController::class, 'storeCollateralFiles'])->name('loans.collateral-files.store');
        Route::delete('/{loan}/collateral-files/{file}', [LoanController::class, 'destroyCollateralFile'])->name('loans.collateral-files.destroy');
        Route::middleware(['role:admin'])->group(function () {
            Route::post('/approve/{loan}', [LoanController::class, 'approve'])->name('loans.approve');
            Route::post('/reject/{loan}', [LoanController::class, 'reject'])->name('loans.reject');
            Route::post('/close/{loan}', [LoanController::class, 'close'])->name('loans.close');
            Route::delete('/{loan}', [LoanController::class, 'destroy'])->name('loans.destroy');
            // Loan settings routes
            Route::prefix('loan-settings')->group(function () {
                Route::get('/', [LoanSettingController::class, 'index'])->name('loan-settings.index');
                Route::post('/releasing-fees', [LoanSettingController::class, 'store'])->name('loan-settings.releasing-fees.store');
                Route::put('/releasing-fees/{releasingFee}', [LoanSettingController::class, 'update'])->name('loan-settings.releasing-fees.update');
                Route::delete('/releasing-fees/{releasingFee}', [LoanSettingController::class, 'destroy'])->name('loan-settings.releasing-fees.destroy');
            });

        });
        Route::get('/{loan}', [LoanController::class, 'show'])->name('loans.show');
    });

    // Daily Collection Sheets
    Route::get('/daily-collections', [DailyCollectionController::class, 'index'])->name('index');
    Route::post('/daily-collections/export-pdf', [DailyCollectionController::class, 'exportPdf'])
        ->name('daily-collections.export');

    // Disbursements
    Route::prefix('disbursements')
        ->group(function () {
            Route::middleware(['role:cashier|admin'])->group(function () {
            Route::get('/', [DisbursementController::class, 'index'])->name('disbursements.index');
            Route::get('/undisbursed-loans', [DisbursementController::class, 'undisbursedLoans'])->name('disbursements.undisbursed-loans');
            Route::get('/{disbursement}/voucher', [DisbursementController::class, 'printVoucher'])->name('disbursements.voucher.print');
            Route::get('/{disbursement}/cheque', [DisbursementController::class, 'printCheque'])->name('disbursements.cheque.print');
            Route::get('/{disbursement}/package', [DisbursementController::class, 'printChequePackage'])->name('disbursements.package.print');
            Route::post('/', [DisbursementController::class, 'store'])->name('disbursements.store');
            });

            Route::middleware(['role:admin'])->group(function () {
            Route::post('/bank-accounts', [DisbursementController::class, 'storeBankAccount'])->name('disbursements.bank-accounts.store');
            Route::post('/{disbursement}/approve', [DisbursementController::class, 'approve'])->name('disbursements.approve');
            Route::post('/{disbursement}/complete', [DisbursementController::class, 'complete'])->name('disbursements.complete');
            Route::post('/{disbursement}/fail', [DisbursementController::class, 'fail'])->name('disbursements.fail');
            Route::delete('/{disbursement}', [DisbursementController::class, 'destroy'])->name('disbursements.destroy');
            });
        });

    // Repayments (match sidebar hrefs: /repayments, /repayments/add)
    Route::prefix('repayments')
        ->middleware(['role:cashier|admin'])
        ->group(function () {
            Route::get('/', [RepaymentController::class, 'index'])->name('repayments.index');
            Route::get('/add', [RepaymentController::class, 'add'])->name('repayments.add');
            Route::post('/store', [RepaymentController::class, 'store'])->name('repayments.store');
            Route::get('/pending', [RepaymentController::class, 'pending'])->name('repayments.pending');
            Route::post('/verify/{payment}', [RepaymentController::class, 'verify'])->name('repayments.verify');
        });

    // Reports (match sidebar hrefs: /Reports/DCPR, /Reports/MonthlyReport)
    Route::prefix('Reports')->middleware([RoleMiddleware::class.':admin'])->group(function () {
        Route::get('/DCPR', [DCPRController::class, 'index'])->name('reports.dcpr');
        Route::post('/dcpr/export-pdf', [DCPRController::class, 'exportPdf'])->name('reports.dcpr.export');
        Route::post('/dcpr/print', [DCPRController::class, 'printPreview'])->name('reports.dcpr.print');

        Route::get('/MonthlyReport', [MCPRController::class, 'index'])->name('reports.monthly');
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
        Route::post('/staff/evaluate-loan-rules', [LoanController::class, 'evaluateRules'])
            ->middleware(['role:admin'])
            ->name('api.staff.evaluate-rules');
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

    Route::get('/applynow', function () {
        $collateralDocumentCategories = [
            'collateral_general',
            'collateral_vehicle',
            'collateral_land',
        ];

        $documentTypesByCategory = DocumentType::query()
            ->whereIn('category', $collateralDocumentCategories)
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'code', 'name', 'category'])
            ->groupBy('category')
            ->map(fn ($items) => $items->values())
            ->toArray();

        $borrower = Auth::user()?->borrower;
        $monthlyIncome = $borrower?->borrowerEmployment?->monthly_income;

        return Inertia::render('BorrowerApplication', [
            'documentTypesByCategory' => $documentTypesByCategory,
            'borrowerRuleContext' => [
                'monthly_income' => $monthlyIncome !== null ? (float) $monthlyIncome : null,
                'dti_ratio' => null, // can be hydrated from backend once available
            ],
        ]);
    })->name('apply');
    Route::post('/api/evaluate-loan-rules', [ApplicationController::class, 'evaluateRules'])
        ->name('api.evaluate-rules');

    Route::get('/my-loan-details', fn () => redirect('/my-loan'))->name('customer.loan.details');

    
    Route::get('/test-rule-evaluator', function () {
        $service = app(\App\Services\RuleEvaluatorService::class);
        $product = \App\Models\LoanProduct::with('rules')->first();

        if (! $product) {
            return 'No loan products found';
        }

        $result = $service->evaluate($product, null, [
            'loan_amount' => 200501,
            'monthly_income' => 50000,
            'term' => 12,
        ]);

        return $result;
    });

});

require __DIR__.'/settings.php';
