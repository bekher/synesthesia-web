'use strict'

var mongoose = require('mongoose');

var Song = mongoose.model('Song');

module.exports = (function(io) {
  console.log('Assigning io events');
  io.on('connection', function(_io) {
    _io.on('getOneSong', function(id) {
      Song.find({filename: id}).limit(1).exec(function(err, song){
        _io.emit('getOneSong', {
          error: err,
          data: ((song.length > 0) ? song[0] : null)
        });
      });
    });
    _io.on('getAllSongs', function() {
      Song.find({}).exec(function(err, songs) {
        _io.emit('getAllSongs', {
          error: err,
          data: songs
        });
      });
    });
  }); 
});

