'use strict';

var Application = require('../models/application');
var moment = require('moment');

exports.new = function(req, res){
  res.render('applications/new', {title: 'New Application'});
};

exports.show = function(req, res){
  Application.findById(req.params._id, function(application){
    console.log('0000000000000APPLICATION0', application);
    res.render('applications/show');
  });
};
exports.index = function(req, res){
  Application.findAll(function(applications){
    res.render('applications/index', {moment:moment, applications:applications, title: 'Band Applications'});
  });
};



exports.create = function(req, res){
  var application = new Application(req.body);
  application.addCover(req.files.cover.path);
  application.insert(function(){
    res.redirect('/');
  });
};
exports.photoAdd = function(req, res){
  Application.findById(req.params.id, function(application){
    application.addPhoto(req.files.photo.path, req.files.photo.name);
    application.update(function(){
      res.redirect('/applications/' + req.params.id);
    });
  });
};
