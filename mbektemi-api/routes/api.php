<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\PilgrimController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PointOfInterestController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
| Expose les endpoints REST publics/protégés (hors auth SPA qui vit dans web.php).
| Prérequis:
| - Sanctum installé et migré
| - SANCTUM_STATEFUL_DOMAINS / SESSION_DOMAIN / CORS configurés
| - Middleware stateful appliqué aux requêtes du front (web ou EnsureFrontendRequestsAreStateful)
*/

/* ----------------------------- Schedules ------------------------------- */
/* Public: adaptez si vous souhaitez protéger */
Route::get('/schedules', [ScheduleController::class, 'index']);

/* ----------------------------- Notifications (public GET) -------------- */
Route::get('/notifications', [NotificationController::class, 'index']);

/* ----------------------------- Points of Interest ---------------------- */
Route::get('/points-of-interest', [PointOfInterestController::class, 'index']);

/* ----------------------------- Pilgrims ----------------------------- */
/* Rendre l'inscription publique; les autres actions restent protégées */
Route::post('/pilgrims', [PilgrimController::class, 'store']);

/* ----------------------- Routes protégées (session Sanctum SPA) -------- */
/* On applique 'web' + 'auth:sanctum' afin que les requêtes issues du SPA
   soient traitées comme stateful (cookies) sur /api/* également. */
Route::middleware(['web', 'auth:sanctum'])->group(function () {
    Route::get('/pilgrims',         [PilgrimController::class, 'index']);
    Route::patch('/pilgrims/{id}',  [PilgrimController::class, 'update']);
    Route::delete('/pilgrims/{id}', [PilgrimController::class, 'destroy']);

    /* ------------------------------ Users ------------------------------- */
    Route::get('/users',        [UserController::class, 'index']);
    Route::patch('/users/{id}', [UserController::class, 'update']);
    Route::delete('/users/{id}',[UserController::class, 'destroy']);

    /* --------------------------- Notifications -------------------------- */
    Route::post('/notifications',          [NotificationController::class, 'store']);
    Route::put('/notifications/{id}',      [NotificationController::class, 'update']);
    Route::delete('/notifications/{id}',   [NotificationController::class, 'destroy']);

    /* --------------------------- Schedules (CRUD) ----------------------- */
    Route::post('/schedules',         [ScheduleController::class, 'store']);
    Route::put('/schedules/{id}',     [ScheduleController::class, 'update']);
    Route::delete('/schedules/{id}',  [ScheduleController::class, 'destroy']);

    /* ------------------------ Points of Interest ------------------------ */
    Route::post('/points-of-interest',          [PointOfInterestController::class, 'store']);
    Route::put('/points-of-interest/{id}',      [PointOfInterestController::class, 'update']);
    Route::delete('/points-of-interest/{id}',   [PointOfInterestController::class, 'destroy']);
});