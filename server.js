// imports
var path = require('path');
var config = require('./config');
var express = require('express');
var webpack = require('webpack');
var util = require('util');
var fs = require('fs');
var id3 = require('id3js');
var async = require('async');
var _ = require('lodash');
var url = require('url');
var exec = require('child_process').exec;
var multer = require('multer');
var probe = require('node-ffprobe');

// mongo
var mongoose = require('mongoose');
mongoose.set('debug', config.mongoose && config.mongoose.debug);
require('./models/Song');
var database = mongoose.connect(config.db || '', config.dbOptions || {}, function(err) {
  if (err) {
    console.error('Mongo error:' + err.message);
  }
});

var SongSchema = mongoose.model('Song'); //use strict

// web & socket.io
var app = express();
var server = require('http').Server(app);

var wpConfig = require('./webpack.config');
var compiler = webpack(wpConfig);

var io = require('socket.io')(server);
var ioroutes = require('./io.js');

ioroutes(io);

app.socket = io;
app.database = database

app.use(multer({
  dest: "./uploads"
}).any());

var port = config.http.port;
var host = '0.0.0.0'

app.set('view engine', 'html');


app.get('/css/uikit.min.js', function (req,res) {
  res.sendFile(path.join(__dirname, 'build/css/uikit.min.css'));
});

var myRandom = function(l, h) {
  return Math.floor(Math.random() * (h-l) + l);
}
app.post('/upload', function(req, res) {
  console.log('uploading...');
  //var mp3data = fs.readFileSync(__dirname+'/'+req.files[0].path);
  //console.log(audioMetaData.mp3(mp3data));
  var songPath = __dirname+'/'+req.files[0].path;
  id3({file: songPath, type: id3.OPEN_LOCAL}, function(err, data) {
    if (err) {
      console.log('Error parsing mp3 metadata' + err);
      res.redirect('/#/');
    } else {
      console.log(data);
      var title = String(data.title) || req.files[0].filename || 'No Title';
      var filename = req.files[0].filename || 'No Title';
      SongSchema.find({title: title}).limit(1).exec(
        function(err, items) {
          if (err) {
            console.log('Mongoose error: '+err);
          } else if (items && items.length > 0) {
            console.log('song already in database');
          } else {
            console.log('song not in db, adding');
            probe(songPath, function(err, ffData) {
              var songobj = {
                title: title,
                transform: 'None',
                length: require('hh-mm-ss').fromS(parseInt(ffData.format.duration)),
                created: new Date(),
                format: 'mp3',
                artist: String(data.artist) || 'No artist',
                album: String(data.album) || 'No album',
                genre: String(ffData.metadata.genre) || 'Genre unknown',
                completed: false,
                filename: filename
              };
              new SongSchema(songobj).save(function(err, songitem) {
                if (err) {
                  console.log('Mongoose error while saving '+err);
                } else {
                  console.log('Saved song!');
                }
              });
              console.log('redirecting....');
              res.redirect('/app/#/view/'+filename);
            });
          }
        });
        res.redirect('/app/#/view/'+filename);
    }
  });
});

app.get('/transform/:id/:type', function(req, res) {
  console.log('got '+req.params.id+' with '+req.params.type);
  SongSchema.findOneAndUpdate({'filename': req.params.id}, {'completed': true, 'transform':req.params.type},{upsert:true}, function(err, item) {
    if (err) {
      console.log('Mongo error while updating '+err)
    } else {
      console.log('updated item');
      console.log(item);
      var target = 'python '+__dirname+'/dream.py '+ __dirname+'/uploads/'+req.params.id+' '+req.params.type
      console.log('executing: '+target);
      exec(target, function(err, stdout, stderr) {
        console.log('stdout: ${stdout}');
        console.log('stderr: ${stderr}');
        if (err) {
          console.log('error '+err);
        }

      });
    }
  }
  //child_process.
                             );
                             res.redirect('/app/#/view/'+req.params.id);
});


if (config.dev) {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    quiet: true,
    lazy: true,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
    publicPath: wpConfig.output.publicPath
  }));
} else {
  // send some webpack
  app.get('/pub/app.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'build/app.js'));
  });
}
app.get('/app(|/*)|', function(req, res) {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.use(function(err, req, res, next) {
  if (typeof err !== 'string'){
    console.log(err);
    res.error(500);
  }
});
app.use('/inputs/audio', express.static(__dirname+'/uploads'));
app.use('/inputs/images', express.static(__dirname+'/inputs/images'));
app.use('/outputs/audio', express.static(__dirname+'/outputs/audio'));
app.use('/outputs/images', express.static(__dirname+'/outputs/images'));

app.get('/', function(req, res) {
  res.redirect('/app/');
});

server.listen(port, host, function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('Listening at http://'+host+':'+port);
});
