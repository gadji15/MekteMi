<?php

namespace App\Http\Controllers;

use App\Http\Resources\ScheduleResource;
use App\Models\Schedule;

class ScheduleController extends Controller
{
    public function index()
    {
        $items = Schedule::orderBy('id')->get();
        return ScheduleResource::collection($items);
    }
}