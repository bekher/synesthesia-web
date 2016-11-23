'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var async = require('async');
var _ = require('lodash');

var SongSchema = Schema({
  title: {
    type: String,
    index: true,
    unique: true
  },
  transform: String,
  length: String, //seconds
  created: Date,
  format: String,
  artist: String,
  album: String,
  genre: String,
  completedTransform: Boolean,
  startedTransform: Boolean,
  preprocessComplete: Boolean,
  filename: {
    type: String,
    index: true,
    unique: true
  },
  imageMods: Boolean

});

mongoose.model('Song', SongSchema);
