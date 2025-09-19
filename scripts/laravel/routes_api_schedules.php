<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ScheduleController;

/*
|-----------------------------------------------------------------------
| API Routes - Schedules (public)
|-----------------------------------------------------------------------
| A coller dans routes/api.php (public ou protégé selon vos besoins)
*/

Route::get('/schedules', [ScheduleController::class, 'index']);