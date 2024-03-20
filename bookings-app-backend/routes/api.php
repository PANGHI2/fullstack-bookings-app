<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

/* Authentication Routes */
Route::group([
    'middleware' => 'api',
    'prefix' => 'auth'
], function ($router) {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('me', [AuthController::class, 'me']);
});

/* Application Business Routes */
Route::middleware('auth')->get('/bookings', [BookingController::class, 'getMany']);
Route::middleware('auth')->get('/bookings/{bookingId}', [BookingController::class, 'getOne']);
Route::middleware('auth')->post('/bookings', [BookingController::class, 'createOne']);
Route::middleware('auth')->put('/bookings/{bookingId}', [BookingController::class, 'updateOne']);
Route::middleware('auth')->delete('/bookings/{bookingId}', [BookingController::class, 'deleteOne']);
