<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePilgrimRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Protected by auth middleware at route level
    }

    public function rules(): array
    {
        $id = $this->route('id');

        return [
            'firstName' => 'sometimes|required|string|max:255',
            'lastName'  => 'sometimes|required|string|max:255',
            'email'     => 'sometimes|required|email|max:255|unique:pilgrims,email,' . $id,
            'phone'     => 'sometimes|required|string|max:50',
            'city'      => 'sometimes|required|string|max:255',
            'country'   => 'sometimes|required|string|max:100',
            'accommodationType' => 'sometimes|nullable|string|max:100',
            'specialNeeds'      => 'sometimes|nullable|string',
            'status'            => 'sometimes|required|in:pending,confirmed,cancelled',
        ];
    }
}