<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| On expose ici les routes d'authentification Sanctum en mode SPA avec
| des cookies de session. On les namespacera sous /api/auth afin de
| rester cohérent côté frontend (NEXT_PUBLIC_API_BASE_URL + /api/auth/*).
*/

Route::prefix('api/auth')->middleware('web')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
    Route::post('/logout',   [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('/me',        [AuthController::class, 'me'])->middleware('auth:sanctum');
});

Route::get('/', function () {
    return view('welcome');
});
