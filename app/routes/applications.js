'use strict';

var Application = require('../models/application');
var moment = require('moment');

exports.index = function(req, res){
  Application.findAll(function(applications){
    res.render('/', {moment:moment, applications:applications, title: 'Band Applications'});
  });
};

exports.show = function(req, res){
  Application.findById(req.params._id, function(application){
    console.log(application, '0000000000000');
    res.send('/');
  });
};

exports.new = function(req, res){
  res.render('applications/new', {title: 'New Application'});
};

exports.create = function(req, res){
  var application = new Application(req.body);
  application.addCover(req.files.cover.path);
  application.insert(function(){
    res.redirect('/');
  });
};
/*
exports.photoAdd = function(req, res){
  Application.findById(req.params.id, function(application){
    application.addPhoto(req.files.photo.path, req.files.photo.name);
    application.update(function(){
      res.redirect('/applications/' + req.params.id);
    });
  });
};
*/
