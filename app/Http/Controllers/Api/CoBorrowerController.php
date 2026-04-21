<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CoBorrower;

class CoBorrowerController extends Controller
{
    public function coBorrowers(Request $request)
    {
        $search = trim($request->search ?? '');

        $query = CoBorrower::query();

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        return $query
            ->limit(10)
            ->get()
            ->map(function ($c) {
                return [
                    'id' => $c->ID ?? $c->id, // 🔥 prevents mismatch bug
                    'full_name' => trim($c->first_name . ' ' . $c->last_name),

                    'first_name' => $c->first_name,
                    'last_name' => $c->last_name,

                    'birth_date' => $c->birth_date,
                    'marital_status' => $c->marital_status,

                    'mobile' => $c->contact_no,
                    'address' => $c->address,
                    'occupation' => $c->occupation,
                    'position' => $c->position,
                    'employer_address' => $c->agency_address,

                    'email' => $c->email,
                    'net_pay' => $c->net_pay,
                ];
            })
            ->values();
    }
}