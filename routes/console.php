<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Services\LoanService;
use App\Models\Loan;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');


Schedule::call(function () {
    app(LoanService::class)->notifyUpcomingDue();
    
    Loan::where('status', 'Active')->get()->each(function ($loan) {
        app(LoanService::class)->calculatePenalties($loan);
    });
})->daily();