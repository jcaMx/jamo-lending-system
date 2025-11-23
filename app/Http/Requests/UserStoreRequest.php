<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // or add your own logic
    }

    // public function rules(): array
    // {
    //     return [
    //         'first_name' => 'nullable|string|max:100',
    //         'last_name' => 'nullable|string|max:100',
    //         'email' => 'required|email|unique:users,email',
    //         'password' => 'required|string|min:6|confirmed',
    //         'phone' => 'nullable|string|max:30',
    //         'role' => 'nullable|string|exists:roles,name',
    //         'profile' => 'nullable|array',
    //     ];
    // }

    public function rules(): array
    {
        return [
            'fName'    => ['required', 'string', 'max:255'],
            'lName'    => ['required', 'string', 'max:255'],
            'email'    => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'role_id'  => ['required', 'exists:roles,id'],
            'password' => ['required', 'string', 'confirmed', Rules\Password::defaults()],
        ];
    }
}
