<?php

namespace App\Providers;

use App\Repositories\Interfaces\IHolidayService;
use App\Services\Amortization\CompoundAmortizationCalculator;
use App\Services\Amortization\DiminishingAmortizationCalculator;
use App\Services\CalendarHolidayService;
use App\Services\FormulaService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(\App\Repositories\Interfaces\IUserRepository::class, \App\Repositories\Eloquent\UserRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\IRoleRepository::class, \App\Repositories\Eloquent\RoleRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\IPermissionRepository::class, \App\Repositories\Eloquent\PermissionRepository::class);
        $this->app->bind(\App\Repositories\Interfaces\ICollateralRepository::class, \App\Repositories\Eloquent\CollateralRepository::class);
        $this->app->bind(IHolidayService::class, CalendarHolidayService::class);

        $this->app->bind(CompoundAmortizationCalculator::class, function ($app) {
            return new CompoundAmortizationCalculator($app->make(IHolidayService::class),
                $app->make(FormulaService::class));
        });

        $this->app->bind(DiminishingAmortizationCalculator::class, function ($app) {
            return new DiminishingAmortizationCalculator(
                $app->make(IHolidayService::class),
                $app->make(FormulaService::class)
            );
        });

        $this->app->singleton(FormulaService::class, function ($app) {
            return new FormulaService;
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
