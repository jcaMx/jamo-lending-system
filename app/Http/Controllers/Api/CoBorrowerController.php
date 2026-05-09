<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class CoBorrowerController extends Controller
{
    public function coBorrowers(Request $request)
    {
        $search = trim($request->search ?? '');

        $coBorrowerQuery = DB::table('co_borrower')
            ->select([
                'ID as id',
                'first_name',
                'last_name',
                'birth_date',
                'marital_status',
                'contact_no as mobile',
                'address',
                'occupation',
                'position',
                'agency_address as employer_address',
                'email',
                'net_pay',
                DB::raw("'Co-Borrower' as type")
            ]);

        $borrowerQuery = DB::table('borrower')
            ->leftJoin('borrower_employments', 'borrower.ID', '=', 'borrower_employments.borrower_id')
            ->leftJoin('borrower_addresses', 'borrower.ID', '=', 'borrower_addresses.borrower_id')
            ->select([
                'borrower.ID as id',
                'borrower.first_name',
                'borrower.last_name',
                'borrower.birth_date',
                'borrower.marital_status',
                'borrower.contact_no as mobile',
                'borrower_addresses.address',
                'borrower_employments.occupation',
                'borrower_employments.position',
                'borrower_employments.agency_address as employer_address',
                'borrower.email',
                'borrower_employments.monthly_income as net_pay',
                DB::raw("'Borrower' as type")
            ]);

        if (!empty($search)) {
            $coBorrowerQuery->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });

            $borrowerQuery->where(function ($q) use ($search) {
                $q->where('borrower.first_name', 'like', "%{$search}%")
                  ->orWhere('borrower.last_name', 'like', "%{$search}%");
            });
        }

        $excludeBorrowerId = $request->input('borrower_id') ?: Auth::user()?->borrower?->ID;

        if ($excludeBorrowerId) {
            $excludeBorrower = DB::table('borrower')->where('ID', $excludeBorrowerId)->first();
            if ($excludeBorrower) {
                $borrowerQuery->where('borrower.ID', '!=', $excludeBorrowerId);
                
                $coBorrowerQuery->whereRaw("NOT (first_name = ? AND last_name = ?)", [
                    $excludeBorrower->first_name, 
                    $excludeBorrower->last_name
                ]);
            }
        }

        $results = $coBorrowerQuery->union($borrowerQuery)
            ->limit(50)
            ->get();

        return $results->map(function ($c) {
            return [
                'id' => $c->id, // 🔥 prevents mismatch bug
                'full_name' => trim($c->first_name . ' ' . $c->last_name),

                'first_name' => $c->first_name,
                'last_name' => $c->last_name,

                'birth_date' => $c->birth_date,
                'marital_status' => $c->marital_status,

                'mobile' => $c->mobile,
                'address' => $c->address,
                'occupation' => $c->occupation,
                'position' => $c->position,
                'employer_address' => $c->employer_address,

                'email' => $c->email,
                'net_pay' => $c->net_pay,
                'type' => $c->type,
            ];
        })
        ->unique(fn ($c) => strtolower($c['full_name']))
        ->take(10)
        ->values();
    }
}