<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pilgrim extends Model
{
    use HasFactory;

    protected $fillable = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'city',
        'country',
        'accommodationType',
        'specialNeeds',
        'status',
        'registrationDate',
    ];

    protected $casts = [
        'registrationDate' => 'datetime',
    ];
}