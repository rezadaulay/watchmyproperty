<?php

use Illuminate\Database\Seeder;

class OauthClientTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('oauth_clients')->insert([
            'id' => '321123433',
            'secret' => 'ASSJ2738fSd83gSF',
            'name' => 'React Web App V1',
        ]);
    }
}
