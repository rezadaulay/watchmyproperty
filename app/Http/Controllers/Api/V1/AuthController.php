<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use Hash;

use App\User;
use Authorizer;
use Validator;
use League\OAuth2\Server\Exception\OAuthException;

class AuthController extends Controller
{
	public function login(Request $request)
	{
		$validator = Validator::make($request->all(), [
			'grant_type' => 'required|in:password',
			'username' => 'required|email',
            'password' => 'required',
            //'uiid' => 'required',
            //'gcm_reg_id' => 'required',
        ],[
			'username.required' => 'Email wajib diisi.',
			'username.email' => 'Email tidak valid.',
            'password.required' => 'Password wajib diisi.',
            'uiid.required' => 'Perangkat anda tidak dikenali,Coba restart aplikasi & pastikan internet anda berjalan.',
            'gcm_reg_id.required' => 'Perangkat anda tidak dikenali,Coba restart aplikasi & pastikan internet anda berjalan.',
        ]);
		
		if ($validator->fails()) {
			return response()->json([
				'success' => false,
				'error' => $validator->getMessageBag()->first()
			], 400);
		}

		try {
			$r = Authorizer::issueAccessToken();
		}
		catch (OAuthException $e) {
			if( $e->errorType === 'invalid_client' )
				$message = 'Client id & Client secret salah.';
			else if( $e->errorType === 'invalid_credentials' )
				$message = 'Login Gagal,Silahkan periksa data anda.';
			else
				$message = $e->getMessage();
			return response()->json([
				'success' => false,
                'code' => $e->errorType,
                'error' => $message,
			], $e->httpStatusCode, $e->getHttpHeaders());
        }
		$user = User::where('email', $request->username)->first(['id', 'name']);
		/*$user->update([
			'uiid' => $request->uiid,
			'gcm_reg_id' => $request->gcm_reg_id,
			'device_type' => is_null($request->device_type)? 'android' : $request->device_type,
		]);*/
		return response()->json([
			'user_id' => $user->id ,
			'user_fullname' => $user->name ,
			'access_token' => $r['access_token'],
			'expires_in' => $r['expires_in'],
			'refresh_token' => $r['refresh_token'],
		]);
	}
	
	public function refeshToken(Request $request)
	{		
		try {
			return response()->json(Authorizer::issueAccessToken());
		}
		catch (OAuthException $e) {
			return response()->json([
				'success' => false,
                'code' => $e->errorType,
                'error' => $e->getMessage(),
			], $e->httpStatusCode, $e->getHttpHeaders());
        }
	}
	
	public function forgotpass(Request $request)
	{
		if( $request->client_id !== 'a5z723drs3dd81s1s43839b' || $request->client_secret !== '$2y$10$BOY5904A3ft2ixDItWTLF' )
			return response()->json([
				'success' => false,
				'code' => 'unauthorized',
				'error' => 'Perangkat anda tidak dikenali.',
			], 401);
		
		$validator = Validator::make($request->all(), [
			'username' => 'required',
        ],[
			'username.required' => 'No Hp/Telp wajib diisi.',
        ]);
		
        if ($validator->fails()) {
			return response()->json([
				'success' => false,
				'code' => 'invalid_request',
				'error' => $validator->getMessageBag()->first()
			], 400);
		}
		
		$user = User::join('role_user', 'users.id', '=', 'role_user.user_id')->where('role_user.role_id', 2)->where('phone', $request->username)->first(['users.id', 'users.safe_question']);
		if ( is_null($user) ) {
			return response()->json([
				'success' => false,
				'code' => 'not_found',
				'error' => 'No Hp Tidak Dikenali',
			], 404);
		}
		return response()->json([
			'success' => true,
			'code' => 'found',
			'data' => $user->safe_question
		]);
	}
	
	public function resetpass(Request $request)
	{
		if( $request->client_id !== 'a5z723drs3dd81s1s43839b' || $request->client_secret !== '$2y$10$BOY5904A3ft2ixDItWTLF' )
			return response()->json([
				'success' => false,
				'code' => 'unauthorized',
				'error' => 'Perangkat anda tidak dikenali.',
			], 401);
		
		$validator = Validator::make($request->all(), [
			'username' => 'required',
			'safe_answer' => 'required',
			'password' => 'required|confirmed|min:6',
        ],[
			'username.required' => 'No Hp/Telp wajib diisi.',
			'password.required' => 'Password wajib diisi.',
            'password.confirmed' => 'Password dan Konfirmasi password tidak sama.',
			'password.min' => 'No Hp/Telp min 6 karakter.',
            'safe_answer.required' => 'Jawaban keamanan wajib diisi.',
        ]);
		
        if ($validator->fails()) {
			return response()->json([
				'success' => false,
				'code' => 'invalid_request',
				'error' => $validator->getMessageBag()->first()
			], 400);
		}

		$user = User::join('role_user', 'users.id', '=', 'role_user.user_id')->where('role_user.role_id', 2)->where('phone', $request->username)->first(['users.id', 'users.safe_answer']);

		if ( is_null($user) || !Hash::check(strtolower($request->safe_answer), $user->safe_answer) ) {
			return response()->json([
				'success' => false,
				'code' => 'not_found',
				'errors' => 'Data jawaban tidak sesuai sesuai,coba periksa kembali data anda.',
			], 404);
		}
		$user->update([
			'password' => bcrypt($request->password),
		]);

		return response()->json([
			'success' => true,
			'code' => 'found',
			'data' => ''
		]);
	}
	
	public function logOut(Request $request)
	{
		try {
			$user = User::find(Authorizer::getResourceOwnerId(),['id', 'phone', 'name', 'password']);
			Authorizer::getChecker()->getAccessToken()->expire();
			/* \DB::table('oauth_sessions')->where('owner_type', 'user')->where('owner_id', Authorizer::getResourceOwnerId())->delete(); */
			$user->update([
				'uiid' => null,
				'gcm_reg_id' => null,
				'device_type' => null,
			]);
			return response()->json([
				'success' => true,
				'code' => 'loged_out',
				'message' => 'Anda Telah Log Out'
			]);
		}
		catch(\OAuthException $e){
			return response()->json([
				'success' => false,
                'code' => $e->errorType,
                'error' => $e->getMessage(),
			], $e->httpStatusCode, $e->getHttpHeaders());
        }
	}
}
