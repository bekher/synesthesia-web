'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var async = require('async');
var _ = require('lodash');

var SongSchema = Schema({
  name: String,
  transform: String,
  length: Number, //seconds
  created: Date,
  format: String,
  artist: String,
  album: String,
  completed: Boolean

});
