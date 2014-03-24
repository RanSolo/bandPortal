'use strict';

exports.index = function(req, res){
  res.render('home/index', {title: 'myPod bandPortal'});
};

exports.calendar = function(req, res){
  res.render('home/calendar', {title: 'bandPortal calendar'});
};
