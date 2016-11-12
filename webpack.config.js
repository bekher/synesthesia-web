var path = require('path');
var webpack = require('webpack');

var node_modules_dir = path.resolve(__dirname, 'node-modules');

module.exports = {
  cache: true,
  entry: [
    './assets/app'
  ],
  devtool: 'eval-source-map',
  output: {
    path: __dirname + '/build',
    filename: 'app.js',
    publicPath: '/pub/'
  },
  resolve: {
    root: __dirname,
    extentions: ['', '.js', '.jsx'],
    modulesDirectory: ['assets', 'bower_components', 'node_modules']
  },
  module: {
    loaders: [{
        test: /\.jsx?$/,
        loader: 'babel' ,
        include: path.join(__dirname, 'assets'),
        exclude: [node_modules_dir],
        query: {
          cacheDirectory: true,
          presets: ['es2015', 'react']
        }
      }]
  }
};
