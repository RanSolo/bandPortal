'use strict';

var Application = require('../models/application');
//var User = require('.../models/user');
var moment = require('moment');

exports.new = function(req, res){
  res.render('applications/new', {name: 'New Application'});
};

exports.show = function(req, res){
  Application.findById(req.params.id, function(record){
    // console.log('HHHHHHEEEEEEEYYYYYYYYYUAAAAAALLLL', record)
    
    // Application.findByUserId(req.params.userID, function)
    res.render('applications/show', {title: 'Application show', record:record});
  });
};
// exports.show = function(req, res){
//   User.findById(req.params.id, function(showUser){
//     Application.findByUserId(req.params.userId, function(showApplication){
//       console.log('reqreqreqreqreqreqrerqreqreqreqreq', req.params.id);
//       if(showUser.role === 'venue'){
//         res.render('users/venue-show', {title:showUser.email, showUser:showUser});
//       }else{
//         res.render('users/applicant-show', {title:showUser.email, showApplication:showApplication, showUser:showUser});
//       }
//     });
// //    Application.findByUserId(req.params.id, function(){
//   //    res.render('users/show');
//   //  });
//   });
// };

exports.update = function(req, res){
  var app = new Application(req.body);
  app.update(function(){
    res.redirect('/applications/' + req.params.id);
  });
};

exports.index = function(req, res){
  Application.findAll(function(applications){
    res.render('applications/index', {moment:moment, applications:applications, title: 'Band Applications'});
  });
};

exports.create = function(req, res){
  var application = new Application(req.body);
  if(req.body.cover){
    application.addCover(req.files.cover.path);
  }
  application.insert(function(application){
    // console.log('HHHHHHHHHHHHHJJJJJJJJJJJJJJHHHHHHHHJJJJJ', application[0]);
    res.redirect('/applications/' + application[0]._id.toString());
  });
};

exports.photoAdd = function(req, res){
  Application.findById(req.params._id, function(application){
    application.addPhoto(req.files.photo.path, req.files.photo.name);
    application.update(function(){
      res.redirect('/applications/' + req.params.id);
    });
  });
};
