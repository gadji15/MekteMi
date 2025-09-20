<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PointOfInterest extends Model
{
    protected $table = 'points_of_interest';

    protected $fillable = [
        'name',
        'description',
        'address',
        'latitude',
        'longitude',
        'category',
        'is_open',
        'opening_hours',
        'phone',
    ];

    protected $casts = [
        'is_open' => 'boolean',
        'latitude' => 'float',
        'longitude' => 'float',
    ];
}