<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class AuthenticatedSessionController extends Controller
{
    public function store(LoginRequest $request)
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = auth()->user();

        // ✅ Redirect CUSTOMER to customer dashboard
        if ($user->hasRole('customer')) {
            return redirect()->route('customer.dashboard');
        }

        // ✅ Admin / cashier default
        return redirect()->route('dashboard');
    }

    public function destroy(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
