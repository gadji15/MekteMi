<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNotificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Protect via middleware/routes for admin only
    }

    public function rules(): array
    {
        return [
            'title'   => ['required','string','max:200'],
            'message' => ['required','string'],
            'type'    => ['required','in:info,warning,urgent'],
        ];
    }
}