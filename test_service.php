<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "Testing BorrowerService...\n";

try {
    $service = app(\App\Services\BorrowerService::class);
    $result = $service->getBorrowerForShow(1);
    echo "Success! Borrower data retrieved.\n";

    if (isset($result['activeLoan']['releasing_fees'])) {
        echo "Releasing fees found in activeLoan:\n";
        print_r($result['activeLoan']['releasing_fees']);
    } else {
        echo "No releasing_fees found in activeLoan.\n";
    }

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}