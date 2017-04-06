const elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

const paths = {
    'bootstrap': '/node_modules/bootstrap-sass/assets/'
};

elixir(mix => {
    mix.sass('app.scss', 'public/assets/dashboard/css/app.css', null, {
	    	includePaths: [
    			__dirname + paths.bootstrap + 'stylesheets'
	    	]
    	}
    )
    .webpack('index.js', 'public/assets/dashboard/js/app.js')
	.copy('node_modules/bootstrap-sass/assets/fonts/**', 'public/assets/dashboard/fonts')
    ;
});