<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

//Route::get('dashboard', function () {
//    return redirect('home/dashboard');
//});

$app->get('/', function (){
    return view('index');
});

$app->get('/{name}', function (){
    return view('index');
});

$app->get('/{name}/{index}', function (){
    return view('index');
});

$api = $app->make(Dingo\Api\Routing\Router::class);

$api->version('v1', function ($api) {
    $api->post('/auth/login', [
        'as' => 'api.auth.login',
        'uses' => 'App\Http\Controllers\Auth\AuthController@postLogin',
    ]);

    $api->post('/auth/register', [
        'as' => 'api.auth.register',
        'uses' => 'App\Http\Controllers\Auth\AuthController@postRegister',
    ]);

    $api->group([
        'middleware' => 'api.auth',
    ], function ($api) {
        $api->get('/', [
            'uses' => 'App\Http\Controllers\APIController@getIndex',
            'as' => 'api.index'
        ]);
        $api->get('/auth/user', [
            'uses' => 'App\Http\Controllers\Auth\AuthController@getUser',
            'as' => 'api.auth.user'
        ]);
        $api->patch('/auth/refresh', [
            'uses' => 'App\Http\Controllers\Auth\AuthController@patchRefresh',
            'as' => 'api.auth.refresh'
        ]);
        $api->delete('/auth/invalidate', [
            'uses' => 'App\Http\Controllers\Auth\AuthController@deleteInvalidate',
            'as' => 'api.auth.invalidate'
        ]);

        $api->get('/contacts', [
            'uses' => 'App\Http\Controllers\ContactController@getContactsWithUser',
            'as' => 'api.contacts'
        ]);

        /** Add new Contact */
        $api->post('/contact/new', [
            'uses'  => 'App\Http\Controllers\ContactController@addNewContact',
            'as'    => 'api.contact.new'
        ]);

        /** Update Existing Contact */
        $api->post('/contact/update', [
            'uses'  => 'App\Http\Controllers\ContactController@updateContact',
            'as'    => 'api.contact.update'
        ]);

        /** Contact Gruop Add */
        $api->post('/contact/group/add', [
            'uses'  => 'App\Http\Controllers\ContactController@addNewGroup',
            'as'    => 'api.contact.group.add'
        ]);

        /** Contact Gruop Delete */
        $api->post('/contact/group/delete', [
            'uses'  => 'App\Http\Controllers\ContactController@deleteGroup',
            'as'    => 'api.contact.group.delete'
        ]);

        /** Add Star to Contact */
        $api->post('/contact/addStar', [
           'uses'   => 'App\Http\Controllers\ContactController@addStar',
            'as'    => 'api.contact.addStar'
        ]);
        
        /** Delete A Contact */
        $api->post('/contact/delete', [
           'uses'   => 'App\Http\Controllers\ContactController@deleteContact',
            'as'    => 'api.contact.deleteContact'
        ]);
        
        /** Assign Contact to a Group */
        $api->post('/contact/assign/group', [
            'uses'   => 'App\Http\Controllers\ContactController@addToGroup',
            'as'    => 'api.contact.addToGroup'
        ]);

    });
});
