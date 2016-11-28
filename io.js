'use strict'

var mongoose = require('mongoose');

var Song = mongoose.model('Song');
var camanTransform = require('./camanTransform');
var soundTransform = require('./transform');

module.exports = (function(io) {
  console.log('Assigning io events');
  io.on('connection', function(_io) {
    _io.on('getOneSong', function(id) {
      Song.find({filename: id}).limit(1).exec(function(err, song){
        _io.emit('getOneSong', {
          error: null,
          data: ((song.length > 0) ? song[0] : null)
        });
      });
    });
    _io.on('getAllSongs', function() {
      Song.find({}).sort([['created', -1]]).exec(function(err, songs) {
        _io.emit('getAllSongs', {
          error: null,
          data: songs
        });
      });
    });
    _io.on('camanTransform', function(data) {
      Song.find({filename: data.id}).limit(1).exec(function(err, song) {
        if (!err) {
          camanTransform(data.id, data.filters, function() {
            _io.emit('camanTransform', {
              error: null,
              data: data.id
            });
            console.log("caman transform complete for "+data.id);
          });
        } else {
          _io.emit('camanTransform', {
            error: null,
            data: null
          });
        }
      });
    });
    _io.on('camanToAudio', function(data) {
      // make sure song exists in db
      Song.find({filename: data.id}).limit(1).exec(function(err, song) {
        if (!err) {
          soundTransform.pic(data.id, function() {
            // emit to all with io
            io.emit('camanToAudio', {
              error: null,
              data: data.id,
            });
          });
        }
      });

    });
  }); 
});

