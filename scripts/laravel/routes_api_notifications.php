<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NotificationController;

/*
|-----------------------------------------------------------------------
| API Routes - Notifications (protected)
|-----------------------------------------------------------------------
| A coller dans routes/api.php sous un groupe auth:sanctum
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications',          [NotificationController::class, 'index']);
    Route::post('/notifications',         [NotificationController::class, 'store']);
    Route::put('/notifications/{id}',     [NotificationController::class, 'update']);
    Route::delete('/notifications/{id}',  [NotificationController::class, 'destroy']);
});