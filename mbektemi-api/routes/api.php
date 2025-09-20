<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\PilgrimController;
use App\Http\Controllers\NotificationController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Copiez-collez tout ce fichier dans routes/api.php de votre projet Laravel.
| Il expose l'authentification (Sanctum cookies SPA), les pèlerins, les
| notifications et les horaires.
|
| Prérequis:
| - Sanctum installé et migré
| - SANCTUM_STATEFUL_DOMAINS / SESSION_DOMAIN / CORS configurés
*/

/* ---------------------------- Auth (Sanctum SPA) ----------------------- */
/* Utilisation de la session => middleware 'web' requis pour login/logout */
Route::prefix('auth')->middleware('web')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
    Route::post('/logout',   [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me',        [AuthController::class, 'me'])->middleware('auth:sanctum');
});

/* ----------------------------- Schedules ------------------------------- */
/* Public: adaptez si vous souhaitez protéger */
Route::get('/schedules', [ScheduleController::class, 'index']);

/* ----------------------------- Notifications (public GET) -------------- */
Route::get('/notifications', [NotificationController::class, 'index']);

/* ----------------------------- Pilgrims ----------------------------- */
/* Rendre l'inscription publique; les autres actions restent protégées */
Route::post('/pilgrims', [PilgrimController::class, 'store']);

/* ----------------------- Routes protégées (token/cookie) --------------- */
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/pilgrims',         [PilgrimController::class, 'index']);
    Route::patch('/pilgrims/{id}',  [PilgrimController::class, 'update']);
    Route::delete('/pilgrims/{id}', [PilgrimController::class, 'destroy']);

    /* --------------------------- Notifications -------------------------- */
    Route::post('/notifications',          [NotificationController::class, 'store']);
    Route::put('/notifications/{id}',      [NotificationController::class, 'update']);
    Route::delete('/notifications/{id}',   [NotificationController::class, 'destroy']);
});