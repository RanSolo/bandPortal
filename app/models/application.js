'use strict';

module.exports = Application;

var applications = global.nss.db.collection('apps');
//var email = require('../lib/email');
var fs = require('fs');
var path = require('path');
var Mongo = require('mongodb');
var _ = require('lodash');
//var User = require('../models/user');

function Application(application){
  this.bandName = application.bandName;
  this.photos = application.photos || [];
  this.bio = application.bio || ('');
  this.website = application.website || ('');
  this.facebook = application.facebook || ('');
  this.youTubePath = application.youTubePath || ('');
  this.soundCloudPath = application.soundCloudPath || ('');
  this.sonicbids = application.sonicbids || ('');
  this.date = new Date(application.date);
  this.userId = application.userId ? new Mongo.ObjectID(application.userId.toString()) : application.userId;
}

Application.prototype.addCover = function(oldname){
  var dirname = this.bandName.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/img/' + dirname;
  fs.mkdirSync(abspath + relpath);

  var extension = path.extname(oldname);
  relpath += '/cover' + extension;
  fs.renameSync(oldname, abspath + relpath);

  this.cover = relpath;
};

Application.prototype.addPhoto = function(oldpath, name){
  var dirname = this.bandName.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/img/'+ dirname+ '/' +name;
  fs.renameSync(oldpath, abspath + relpath);

  this.photos.push(relpath);
};

Application.prototype.insert = function(fn){
  var self = this;
  applications.insert(self, function(err, records){
    fn(err, records);
  });
};

Application.destroy = function(id, fn){
  var _id = new Mongo.ObjectID(id);
  applications.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

Application.prototype.update = function(fn){
  applications.update({_id: this._id}, this, function(err, count){
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

Application.findByDate = function(date, fn){
  applications.find({date:date}).toArray(function(err, applications){
    fn(applications);
  });
};

Application.findByUserId = function(userId, fn){
  applications.find({userId:userId}).toArray(function(err, records){
    fn(records);
  });
};

/*
Application.findByVenueId = function(id, fn){});

*/
/*
Application.prototype.addPhoto = function(oldpath, name){
  var dirname = this.name.replace(/\s/g, '').toLowerCase();
  name = name.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/img/' + dirname +'/'+ name;
  fs.renameSync(oldpath, abspath + relpath);

  this.photos.push(relpath);
};

Application.prototype.addSong = function(oldpath, name){
  var dirname = this.name.replace(/\s/g, '').toLowerCase();
  name = name.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/audios/' + dirname + name;
  fs.renameSync(oldpath, abspath + relpath);

  this.songs.push(relpath);
};
*/
