<?php

use Illuminate\Support\Facades\Mail;

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Testing Resend API connection to rafaeljoshsanchez11@gmail.com...\n";

try {
    Mail::raw('This is a test email via Resend API for JAMO Lending System defense.', function ($message) {
        $message->to('rafaeljoshsanchez11@gmail.com')
                ->subject('Resend API Test - JAMO Lending System');
    });
    echo "SUCCESS: Email sent successfully via Resend!\n";
} catch (\Exception $e) {
    echo "ERROR: Failed to send email.\n";
    echo $e->getMessage() . "\n";
}
