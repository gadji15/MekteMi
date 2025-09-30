<?php

namespace App\Http\Controllers;

use App\Models\Schedule;

class ScheduleController extends Controller
{
    public function index()
    {
        return Schedule::query()
            ->orderBy('date')
            ->orderBy('start_time')
            ->orderBy('id')
            ->get();
    }
}