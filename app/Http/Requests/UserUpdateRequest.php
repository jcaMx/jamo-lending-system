<?php
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
    public function authorize() { return true; }

    public function rules(): array
    {
        $id = $this->route('id');
        return [
            'first_name' => 'nullable|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'email' => ['required','email', Rule::unique('users','email')->ignore($id)],
            'password' => 'nullable|string|min:6|confirmed',
            'phone' => 'nullable|string|max:30',
            'role' => 'nullable|string|exists:roles,name',
            'profile' => 'nullable|array',
        ];
    }
}
