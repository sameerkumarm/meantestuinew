var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
  // cheap-eval-source-map is faster, inline-source-map gives better debug experience
  //devtool: 'cheap-eval-source-map',
  // devtool: 'inline-source-map',
    entry: 
    { 
      "DefaultDataView":['./views/index.js']
    },
    //target: 'node',
    output: {
        path: path.resolve(__dirname + '/build'),
        filename: '[name].js',
        //the following 2 params exports the module as global variable
        libraryTarget: "var",
        library: "[name]",
        publicPath: '/build'
    },
    plugins: [
	    new webpack.DefinePlugin({
	      'process.env': {
	        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
	      }
	    }),	
	    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
	    new webpack.optimize.OccurrenceOrderPlugin(),
	    new webpack.HotModuleReplacementPlugin(),
	    new webpack.NoErrorsPlugin(),
	    new webpack.ProvidePlugin({
	      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
	    })
  ],
  module: {
	    loaders: [
	      {
	        test:	/\.json$/,
	        loader: 'json'
	      },
	      {
	        test: /\.js$/,
	        loaders: ['babel'],
	        exclude: /node_modules/,
	      },
	      { test: /\.md$/, loader: 'html!markdown' },
	      { test: /\.less$/, loader: 'style!css!postcss!less' },
	      { test: /\.css$/, loader: 'style!css' },
	      { test: /\.woff2{0,1}$/, loader: 'url-loader?limit=10000&&mimetype=application/font-woff&name=/[name].[ext]' },
	      { test: /\.(otf|eot|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?name=/[name].[ext]'},
	      { test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192&name=/[name].[ext]'}
	    ]
  },
  postcss: [autoprefixer({ browsers: ['last 2 versions'] })]
};