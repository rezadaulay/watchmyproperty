<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/


Route::get('/', 'Dashboard\HomeController@index');

Route::group(['prefix' => 'api/v1', 'middleware' => ['cors'] ], function () {

	Route::post('auth/refresh', ['uses' => 'Api\V1\AuthController@refeshToken']);
	Route::post('auth/login', 'Api\V1\AuthController@login');

	Route::group(['middleware' => ['oauth', 'oauth-user']], function() {
		Route::resource('properties', 'Api\V1\PropertyController', ['except' => [
			'create', 'edit'
		]]);
	});
});