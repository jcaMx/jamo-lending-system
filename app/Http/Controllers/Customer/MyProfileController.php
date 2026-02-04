<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class MyProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('login')->withErrors([
                'email' => 'Please log in to access your profile.',
            ]);
        }

        $borrower = $user->borrower()
            ->with(['borrowerEmployment', 'borrowerAddress'])
            ->first();

        if (! $borrower) {
            return Inertia::render('customer/profile', [
                'borrower' => null,
                'hasBorrower' => false,
            ]);
        }

        return Inertia::render('customer/profile', [
            'borrower' => [
                'id' => $borrower->ID,
                'name' => trim(($borrower->first_name ?? '').' '.($borrower->last_name ?? '')),
                'first_name' => $borrower->first_name,
                'last_name' => $borrower->last_name,
                'age' => $this->computeAge($borrower->birth_date),
                'occupation' => $borrower->borrowerEmployment?->occupation,
                'gender' => $borrower->gender,
                'address' => $borrower->borrowerAddress?->address,
                'city' => $borrower->borrowerAddress?->city,
                'zipcode' => $borrower->borrowerAddress?->postal_code ?? '',
                'email' => $borrower->email,
                'mobile' => $borrower->contact_no,
                'membership_date' => $borrower->membership_date,
                'status' => $borrower->status
            ],
            'hasBorrower' => true,
        ]);
    }

    /**
     * Leave this update method so profile edits can be wired later.
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('login');
        }

        $borrower = $user->borrower()->with(['borrowerAddress', 'borrowerEmployment'])->first();

        if (! $borrower) {
            return redirect()->back()->withErrors([
                'borrower' => 'Borrower profile not found.',
            ]);
        }

        $data = $request->validate([
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['nullable', 'string', 'max:255'],
            'email' => ['nullable', 'email', 'max:255'],
            'mobile' => ['nullable', 'string', 'max:50'],
            'occupation' => ['nullable', 'string', 'max:255'],
            'gender' => ['nullable', 'string', 'max:50'],
            'address' => ['nullable', 'string', 'max:500'],
            'city' => ['nullable', 'string', 'max:255'],
            'zipcode' => ['nullable', 'string', 'max:20'],
        ]);

        $borrower->update([
            'first_name' => $data['first_name'] ?? $borrower->first_name,
            'last_name' => $data['last_name'] ?? $borrower->last_name,
            'email' => $data['email'] ?? $borrower->email,
            'contact_no' => $data['mobile'] ?? $borrower->contact_no,
            'gender' => $data['gender'] ?? $borrower->gender,
        ]);

        if (! empty($data['occupation'])) {
            $borrower->borrowerEmployment()->updateOrCreate(
                ['borrower_id' => $borrower->ID],
                ['occupation' => $data['occupation']]
            );
        }

        if (! empty($data['address']) || ! empty($data['city']) || ! empty($data['zipcode'])) {
            $borrower->borrowerAddress()->updateOrCreate(
                ['borrower_id' => $borrower->ID],
                [
                    'address' => $data['address'] ?? $borrower->borrowerAddress?->address,
                    'city' => $data['city'] ?? $borrower->borrowerAddress?->city,
                    'postal_code' => $data['zipcode'] ?? $borrower->borrowerAddress?->postal_code,
                ]
            );
        }

        return redirect()->back()->with('success', 'Profile updated.');
    }

    private function computeAge($dateOfBirth): ?int
    {
        return $dateOfBirth ? Carbon::parse($dateOfBirth)->age : null;
    }
}
