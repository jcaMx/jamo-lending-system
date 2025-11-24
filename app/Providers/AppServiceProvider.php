<?php

namespace App\Providers;

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
        $this->app->bind(\App\Repositories\Interfaces\ICollateralRepository::class,\App\Repositories\Eloquent\CollateralRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
