'use strict';

exports.index = function(req, res){
  res.render('home/index', {name: 'myPod bandPortal'});
};

exports.calendar = function(req, res){
  res.render('home/calendar', {name: 'bandPortal calendar'});
};

exports.applications = function(req, res){
  res.render('applications/index', {name: 'bandPortal Application'});
};
