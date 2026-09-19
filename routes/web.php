<?php

use Illuminate\Support\Facades\Route;

// Route::inertia('/', 'welcome')->name('home');

Route::get('/', function () {
    return redirect()->route('login');
});


