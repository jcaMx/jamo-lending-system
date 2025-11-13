<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
            public function stats() {
        return response()->json([
            'registered_borrowers' => DB::table('borrowers')->count(),
            'total_loans' => DB::table('loans')->sum('amount'),
            'total_collections' => DB::table('payments')->sum('amount'),
            'to_review_loans' => DB::table('loans')->where('status', 'pending')->count(),
            'open_loans' => DB::table('loans')->where('status', 'open')->count(),
            'fully_paid' => DB::table('loans')->where('status', 'paid')->count(),
            'restructured' => DB::table('loans')->where('status', 'restructured')->count(),
            'defaulted' => DB::table('loans')->where('status', 'defaulted')->count(),
        ]);
    }

    public function loans() {
        // Example: sum of loans grouped by month
        return DB::table('loans')
            ->selectRaw("MONTH(created_at) as month, SUM(amount) as value")
            ->groupByRaw("MONTH(created_at)")
            ->orderBy("month")
            ->get();
    }

    public function collections() {
        return DB::table('payments')
            ->selectRaw("MONTH(created_at) as month, SUM(amount) as value")
            ->groupByRaw("MONTH(created_at)")
            ->orderBy("month")
            ->get();
    }
}
