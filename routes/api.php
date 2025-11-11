use App\Http\Controllers\DashboardController;

Route::get('/dashboard-stats', [DashboardController::class, 'stats']);
Route::get('/dashboard-loans', [DashboardController::class, 'loans']);
Route::get('/dashboard-collections', [DashboardController::class, 'collections']);
