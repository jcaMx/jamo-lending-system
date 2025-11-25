<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Borrower;

class DashboardController extends Controller
{
    public function stats() {
        $totalBorrowers = \App\Models\Borrower::count(); // Count all borrowers

        return response()->json([
            'totalBorrowers' => $totalBorrowers,

        ]);
    }

    public function loans()
{
    $loans = Loan::selectRaw('MONTHNAME(created_at) as month, COUNT(*) as value')
        ->groupBy('month')
        ->orderByRaw('MIN(created_at)')
        ->get();

    return response()->json($loans);
}


    public function collections()
{
    $collections = Collection::selectRaw('MONTHNAME(created_at) as month, SUM(amount) as value')
        ->groupBy('month')
        ->orderByRaw('MIN(created_at)')
        ->get();

    return response()->json($collections);
}


    
}
