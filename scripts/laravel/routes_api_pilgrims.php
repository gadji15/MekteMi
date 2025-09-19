<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PilgrimController;

/*
|-----------------------------------------------------------------------
| API Routes - Pilgrims (protected)
|-----------------------------------------------------------------------
| A coller dans routes/api.php sous un groupe auth:sanctum
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/pilgrims',        [PilgrimController::class, 'index']);
    Route::post('/pilgrims',       [PilgrimController::class, 'store']);
    Route::patch('/pilgrims/{id}', [PilgrimController::class, 'update']);
    Route::delete('/pilgrims/{id}',[PilgrimController::class, 'destroy']);
});