'use strict';

module.exports = Application;

var applications = global.nss.db.collection('applications');
var fs = require('fs');
var path = require('path');
var Mongo = require('mongodb');
var _ = require('lodash');

function Application(application){
  this._id = application._id;
  this.name = application.name;
  this.links = [];
  this.youTubePath = application.youTubePath;
  this.songs = application.songs;
  this.soundCloudPath = application.soundCloudPath;
  this.entryDate = new Date(application.entryDate);
  this.photos = [];
}

Application.prototype.addCover = function(oldpath){
  var dirname = this.name.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/img/' + dirname;
  fs.mkdirSync(abspath + relpath);
  var extension = path.extname(oldpath);
  relpath += '/cover' + extension;
  fs.renameSync(oldpath, abspath + relpath);

  this.cover = relpath;
};
Application.prototype.addPhoto = function(oldpath, name){
  var dirname = this.name.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/img/' + dirname + '/' + name;
  fs.renameSync(oldpath, abspath + relpath);

  this.photos.push(relpath);
};

Application.prototype.insert = function(fn){
  applications.insert(this, function(err, records){
    fn(err);
  });
};

Application.prototype.update = function(fn){
  applications.update({_id:this._id}, this, function(err, count){
    fn(err, count);
  });
};

Application.findAll = function(fn){
  applications.find().toArray(function(err, records){
    fn(records);
  });
};

Application.findById = function(id, fn){
  var _id = Mongo.ObjectID(id);

  applications.findOne({_id:_id}, function(err, record){
    fn(_.extend(record, Application.prototype));
  });
};
