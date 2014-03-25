'use strict';

var Application = require('../models/application');
var moment = require('moment');

exports.new = function(req, res){
  res.render('applications/new', {title: 'New Application'});
};

exports.show = function(req, res){
  Application.findById(req.params._id, function(application){
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

exports.songAdd = function(req, res){
  Application.findById(req.params.id, function(application){
    application.addSong(req.files.song.path, req.files.song.name);
    console.log('lolololololooloolooloooolloololooxxooxoxoxox');
    console.log('req.files.song.name', req.files.song.name);
    application.update(function(){
      res.redirect('/applications/' + req.params.id);
    });
  });
};
