module.exports = {
  entry: [
    './resources/assets/js/index.js'
  ],
  /*output: {
    path: __dirname,
    publicPath: '/public',
    filename: './assets/dashboard/app.js'
  },*/
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel'
    }]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './'
  }
};
