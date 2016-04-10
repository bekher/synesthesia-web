var path = require('path');
var config = require('./config');
var express = require('express');
var webpack = require('webpack');
var util = require('util');
var fs = require('fs');
var wpConfig = require('./webpack.config');
var _ = require('lodash');

var mongoose = require('mongoose');
mongoose.set('debug', config.mongoose && config.mongoose.debug);
console.log(config.db);
var database = mongoose.connect(config.db || '', config.dbOptions || {}, function(err) {
  if (err) {
    console.error('Mongo error:' + err.message);
  }
});

var app = express();
var server = require('http').Server(app);
var compiler = webpack(wpConfig);

var io = require('socket.io')(server);
var ioroutes = require('./io.js');

//var fileupload = require('fileupload').createFileUpload(__dirname+'/uploads').middleware;
var multer = require('multer');
ioroutes(io);

app.socket = io;
app.databse = database

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: false,
  quiet: false,
  lazy: false,
  watchOptions: {
    aggregateTimeout: 300,
    poll: true
  },
  publicPath: wpConfig.output.publicPath
}));

app.use(multer({
  dest: "./uploads"
}).any());

var port = 8302;
var host = '0.0.0.0'

app.set('view engine', 'html');



app.get('/css/uikit.min.js', function (req,res) {
  res.sendFile(path.join(__dirname, 'build/css/uikit.min.css'));
});

app.post('/upload', function(req, res) {
  console.log(util.inspect(req.files));
  console.log('uploading...');
  res.redirect('/#/upload');
});

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.use(function(err, req, res, next) {
  if (typeof err !== 'string'){
    console.log(err);
    res.error(500);
  }
});

server.listen(port, host, function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('Listening at http://'+host+':'+port);
});
