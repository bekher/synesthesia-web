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

// import the magic
var transform = require('./transform');

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

// song uploads
/*
app.use(multer({
  dest: "./uploads"
}).any());
*/
var port = config.http.port;
var host = '0.0.0.0'

app.set('view engine', 'html');

/*
app.get('/css/uikit.min.js', function (req,res) {
  res.sendFile(path.join(__dirname, 'build/css/uikit.min.css'));
});
*/
var preprocessCB = function(filename) {
  //spl = filename.split("/");
  //relpath = spl[spl.length-1];
   SongSchema.findOneAndUpdate({'filename': filename}, {'preprocessComplete': true},{upsert:true, new:true}, function(err, item) {
    if (err) {
      console.log('Mongo error while updating '+err)
    } else {
      console.log('updated item');
      console.log(item);
      io.sockets.emit(filename, {
        error: err,
        data: item  
      });
    }
  });
};

var transformCompleteCB = function(filename) {
    SongSchema.findOneAndUpdate({'filename': filename}, {'completedTransform': true},{upsert:true, new:true}, function(err, item) {
    if (err) {
      console.log('Mongo error while updating '+err)
    } else {
      console.log('updated item');
      console.log(item);
      io.sockets.emit(filename, {
        error: err,
        data: item  
      });
    }
  });
};

var imageTransformCompleteCB = function(filename) {
    SongSchema.findOneAndUpdate({'filename': filename}, {'imageMods': true}, {upsert:true, new:true}, 
      function(err, item)    {
        if (err) {
          console.log('Mongo error while updating '+err)
        } else {
          console.log('updated item');
          console.log(item);
          io.sockets.emit(filename, {
            error: err,
            data: item  
          });
        }
  });

}

var fileFilter = function(req, file, cb) {
  var type = file.mimetype;
  console.log(type);
  if (type == 'audio/mpeg') {
    cb(null, true); 
  } else {
    cb(null, false);
  }
}

app.post('/upload', multer({dest:"./uploads", fileFilter: fileFilter}).any(), function(req, res) {
  console.log('uploading...');
  if (req.files.length <= 0) {
    console.log('error in uploading, no files selected');
    return;
  }
  var songPath = __dirname+'/'+req.files[0].path;
  id3({file: songPath, type: id3.OPEN_LOCAL}, function(err, data) {
    if (err) {
      console.log('Error parsing mp3 metadata' + err);
      res.redirect('/#/uploadError');
    } else {
      console.log(data);
      if (data.title == null) {
        console.log('err or in uploading: title null');
        res.redirect('/#/uploadError');
        return;
      }
      var title = String(data.title) || req.files[0].filename || 'No Title';
      var filename = req.files[0].filename;
      SongSchema.find({title: title}).limit(1).exec(
        function(err, items) {
          if (err) {
            console.log('Mongoose error: '+err);
          } else if (items && items.length > 0) {
            console.log('song already in database');
          } else {
            console.log('song not in db, adding');
            var hasImage = false;
            var artUrl = "";
            if (data.v2 && data.v2.image && data.v2.image.mime && data.v2.image.data ) {
              hasImage = true;
              console.log('has image' + hasImage);
              var fileType = data.v2.image.mime.split('/')[1];
              artUrl = '/albumArt/' + filename + '.' + fileType;
              var artPath = __dirname + artUrl;
              fs.writeFile(artPath, new Buffer(data.v2.image.data), "binary", function (err) {
                if (err) {
                  console.log("could not get album art");
                  console.log(err);
                  hasImage = false;
                }
              });
            }
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
                completedTransform: false,
                startedTransform: false,
                preprocessComplete: false,
                imageMods: false,
                filename: filename,
                hasAlbumArt: hasImage,
                albumArtPath : artUrl
              };
              new SongSchema(songobj).save(function(err, songitem) {
                if (err) {
                  console.log('Mongoose error while saving '+err);
                } else {
                  console.log('Saved song! Beginning pre-processing');
                  transform.getImg(filename, preprocessCB);
                }
              });
              console.log('redirecting....');
            });
          }
        });
    }
  });
});

app.get('/transform/:id/:type', function(req, res) {
  console.log('got '+req.params.id+' with '+req.params.type);
  SongSchema.findOneAndUpdate({'filename': req.params.id}, { 'startedTransform': true, 'transform':req.params.type},{upsert:true}, function(err, item) {
    if (err) {
      console.log('Mongo error while updating '+err)
    } else {
      console.log('updated item');
      console.log(item);
      if (!item.preprocessComplete) {
        console.log('Preprocess not complete yet');
      } else {
      //var target = 'python '+__dirname+'/dream.py '+ __dirname+'/uploads/'+req.params.id+' '+req.params.type
      //console.log('executing: '+target);
      /*exec(target, function(err, stdout, stderr) {
        console.log('stdout: ${stdout}');
        console.log('stderr: ${stderr}');
        if (err) {
          console.log('error '+err);
        }
      });*/
      
        // copy file
        fs.createReadStream('inputs/images/'+req.params.id+'.png').pipe(fs.createWriteStream('outputs/images/'+req.params.id+'.png'));
        transform.transformPartial(req.params.id, req.params.type, transformCompleteCB);
      }
    }
  });
  res.redirect('/app/#/view/'+req.params.id);
});

app.post('/transformImg/:id/', multer({dest:"imgUploads", maxCount: 1}).any(), function(req, res) {
  var imgPath = __dirname+'/'+req.files[0].path;
  /* TODO:
   * mv uploaded file path to given directory name
   * set startedRetransform,
   * launch dream.py, set output to 
   * */
  console.log(imgPath);
  fs.createReadStream(imgPath).pipe(fs.createWriteStream('outputs/images/'+req.params.id+'.png'));
});

if (config.dev) {
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
} else {
  // send some webpack
  app.get('/pub/app.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'build/app.js'));
  });
  app.get('/pub/caman.js', function(req,res) {
    res.sendFile(path.join(__dirname, 'build/caman.js'));
  });
}
app.use(function(err, req, res, next) {
  if (typeof err !== 'string'){
    console.log(err);
    res.error(500);
  }
});
app.use('/inputs/audio', express.static(__dirname+'/uploads', {redirect: false}));
app.use('/inputs/images', express.static(__dirname+'/inputs/images', {redirect: false}));
app.use('/outputs/audio', express.static(__dirname+'/outputs/audio', {redirect: false}));
app.use('/outputs/images', express.static(__dirname+'/outputs/images', {redirect: false}));
app.use('/albumArt', express.static(__dirname+'/albumArt', {redirect: false}));
app.use('/css', express.static(__dirname+'/build/css', {redirect: false}));

app.get('/app(|/*)|', function(req, res) {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});


/*
app.get('/', function(req, res) {
  res.redirect('/app/');
});
*/
server.listen(port, host, function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('Listening at http://'+host+':'+port);
});
