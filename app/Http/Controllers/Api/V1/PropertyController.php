<?php

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;


use App\Property;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
		return response()->json([
			'success' => true,
			'code' => 'found',
			'datas' => Property::all()
		]);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        \DB::beginTransaction();
		try{
			$property = Property::create([
				'name' => $request->name ,
			]);
			\DB::commit();
			return response()->json([
				'success' => true,
				'code' => 'property_added',
				'data' => $property
			], 201);
		}
		catch(\Exception $e){
			\DB::rollback();
			return response()->json([
				'success' => false,
				'code' => 'property_failed',
				'error' => \Config::get('app.debug') ? $e->getMessage() : 'Opss.. Seperti nya terjadi kesalahan,silahkan coba kembali.' ,
			], 400);
		}
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
		return response()->json([
			'success' => true,
			'code' => 'found',
			'data' => Property::findOrFail($id, ['id', 'name'])
		]);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        
        \DB::beginTransaction();
		try{
			$property = Property::findOrFail($id, ['id', 'name']);
			$property->update([
				'name' => $request->name ,
			]);
			\DB::commit();
			return response()->json([
				'success' => true,
				'code' => 'property_edited',
				'data' => $property
			]);
		}
		catch(\Exception $e){
			\DB::rollback();
			return response()->json([
				'success' => false,
				'code' => 'edit_property_failed',
				'error' => \Config::get('app.debug') ? $e->getMessage() : 'Opss.. Seperti nya terjadi kesalahan,silahkan coba kembali.' ,
			], 400);
		}
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
		\DB::beginTransaction();
		try{
			Property::findOrFail($id, ['id', 'name'])->delete();
			\DB::commit();
			return response()->json([
				'success' => true,
				'code' => 'property_deleted',
				'data' => null
			] );
		}
		catch(\Exception $e){
			\DB::rollback();
			return response()->json([
				'success' => false,
				'code' => 'delete_property_failed',
				'error' => \Config::get('app.debug') ? $e->getMessage() : 'Opss.. Seperti nya terjadi kesalahan,silahkan coba kembali.' ,
			], 400);
		}
    }
}
