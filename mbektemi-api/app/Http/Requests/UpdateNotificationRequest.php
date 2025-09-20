<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNotificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Protect via middleware/routes for admin only
    }

    public function rules(): array
    {
        return [
            'title'   => ['sometimes','required','string','max:200'],
            'message' => ['sometimes','required','string'],
            'type'    => ['sometimes','required','in:info,warning,urgent'],
        ];
    }
}