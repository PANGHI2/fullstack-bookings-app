<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

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
Route::middleware('auth')->get('/bookings', function (Request $request) {
    return [
        [
            'id' => 123,
            'fullname' => 'Gheorghe Pantis',
            'roomNumber' => '1201',
            'checkIn' => now(),
            'checkOut' => now(),
        ],
        [
            'id' => 124,
            'fullname' => 'Alexandra Pantis',
            'roomNumber' => '933',
            'checkIn' => now(),
            'checkOut' => now(),
        ]
    ];
});

Route::middleware('auth')->post('/bookings', function (Request $request) {

});
