<?php

use Illuminate\Database\Seeder;

class PropertiesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('properties')->insert(
			[
				'name' => 'House',
			]
		);
        DB::table('properties')->insert(
			[
				'name' => 'Hospital',
			]
		);
        DB::table('properties')->insert(
			[
				'name' => 'Office',
			]
		);
    }
}
