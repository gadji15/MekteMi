<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePilgrimRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Public registration
    }

    public function rules(): array
    {
        return [
            'firstName' => ['required','string','max:255'],
            'lastName'  => ['required','string','max:255'],
            'email'     => ['required','email','max:255','unique:pilgrims,email'],
            'phone'     => ['required','string','max:50'],
            'city'      => ['required','string','max:255'],
            'country'   => ['required','string','max:100'],
            'accommodationType' => ['nullable','string','max:100'],
            'specialNeeds'      => ['nullable','string'],
        ];
    }

    public function payload(): array
    {
        $v = $this->validated();
        return [
            'first_name'         => $v['firstName'],
            'last_name'          => $v['lastName'],
            'email'              => $v['email'],
            'phone'              => $v['phone'],
            'city'               => $v['city'],
            'country'            => $v['country'],
            'accommodation_type' => $v['accommodationType'] ?? null,
            'special_needs'      => $v['specialNeeds'] ?? null,
            'status'             => 'pending',
            'registration_date'  => now(),
        ];
    }
}