<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ApplicationController;

Route::get('/', function () {
    return view('welcome');
});

// Job application submission
Route::post('/jobs/{job}/apply', [ApplicationController::class, 'store']);

