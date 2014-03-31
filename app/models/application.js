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
  //this.cover = application.cover || ('');
  this.bio = application.bio || ('');
  this.website = application.website || ('');
  this.facebook = application.facebook || ('');
  this.youTubePath = application.youTubePath || ('');
  this.soundCloudPath = application.soundCloudPath || ('');
  this.epk = application.epk || ('');
  this.date = new Date(application.date);
  this.userId = application.userId ? new Mongo.ObjectID(application.userId) : application.userId;
  this.phone = application.phone ||('');
  this.email = application.email || ('');
}

Application.prototype.addCover = function(oldname){
  var self = this;
  var dirname = this.bandName.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/img/' + dirname + '/';
  fs.mkdir(abspath + relpath, function(){
    var base = path.basename(oldname);
    relpath += base;
    fs.rename(oldname, abspath + relpath, function(){
      self.cover = relpath;
    });
  });
};
/*
Application.prototype.addCover = function(oldname){
  var filename = this.bandName.replace(/\s/g, '').toLowerCase();
  var abspath = __dirname + '/../static';
  var relpath = '/img/covers/' + filename;

  var extension = path.extname(oldname);
  relpath += extension;
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
*/
Application.prototype.insert = function(fn){
  var self = this;
  applications.insert(self, function(err, record){
    // User.applications.push(record);
    fn(record);

  });
};

Application.destroy = function(id, fn){
  var _id = new Mongo.ObjectID(id);
  applications.remove({_id:_id}, function(err, count){
    fn(count);
  });
};

Application.prototype.update = function(fn){
  applications.update({_id:this._id}, this, function(err, count){
    fn(count);
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
  console.log(':FSLKDJ:FLKSDJF:SLKJFS:DLKJF:DSLKJFS:LDKJFS:LDKJFS:LDKJF:SDLKJFS:DLKJ', userId);
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
