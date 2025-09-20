<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pilgrim extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'city',
        'country',
        'accommodation_type',
        'special_needs',
        'status',
        'registration_date',
    ];

    protected $casts = [
        'registration_date' => 'datetime',
    ];
}