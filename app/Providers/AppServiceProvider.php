<?php

namespace App\Providers;

use App\Repositories\Interfaces\IHolidayService;
use App\Repositories\Interfaces\IPenaltyCalculator;
use App\Repositories\Interfaces\IRepaymentRepository;
use App\Services\Amortization\CompoundAmortizationCalculator;
use App\Services\Amortization\DiminishingAmortizationCalculator;
use App\Services\CalendarHolidayService;
use App\Services\DefaultPenaltyService;
use App\Services\FormulaService;
use App\Services\RepaymentService;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;


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

        $this->app->bind(IRepaymentRepository::class, RepaymentService::class);

        $this->app->bind(IPenaltyCalculator::class, function ($app) {
            return new DefaultPenaltyService(
                $app->make(FormulaService::class),
                $app->make(IHolidayService::class)
            );
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::useBuildDirectory('build/vite');

        // Force HTTPS in production (Railway uses a proxy that terminates SSL)
        if (config('app.env') === 'production') {
            \Illuminate\Support\Facades\URL::forceScheme('https');
        }

        // Register Custom Resend Mailer
        \Illuminate\Support\Facades\Mail::extend('resend', function (array $config) {
            return new class extends \Symfony\Component\Mailer\Transport\AbstractTransport {
                protected function doSend(\Symfony\Component\Mailer\SentMessage $message): void
                {
                    $email = \Symfony\Component\Mime\MessageConverter::toEmail($message->getOriginalMessage());
                    
                    \Illuminate\Support\Facades\Http::withHeaders([
                        'Authorization' => 'Bearer ' . config('mail.mailers.resend.key'),
                        'Content-Type' => 'application/json',
                    ])->post('https://api.resend.com/emails', [
                        'from' => config('mail.from.address'),
                        'to' => array_map(fn($t) => $t->getAddress(), $email->getTo()),
                        'subject' => $email->getSubject(),
                        'html' => $email->getHtmlBody() ?: $email->getTextBody(),
                    ]);
                }
                public function __toString(): string { return 'resend'; }
            };
        });

        Inertia::share([
            'auth' => fn () => auth()->check()
                ? [
                    'user' => [
                        'id'    => auth()->user()->id,
                        'name'  => auth()->user()->name,
                        'email' => auth()->user()->email,
                    ],
                    'roles' => auth()->user()->getRoleNames()->toArray(), // 👈 Spatie-correct
                ]
                : null,
        ]);
    }
}
