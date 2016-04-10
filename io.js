'use strict'

module.exports = (function(io) {
  console.log('Assigning io events');
  io.on('connection', function(_io) {
    console.log("SOMEONE CONNECTED");
    _io.on('getAllSongs', function() {

      _io.emit('getAllSongs', {
        data: [],
      });
    });
  }); 
});

