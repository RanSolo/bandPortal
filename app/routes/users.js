'use strict';

var User = require('../models/user');

exports.fresh = function(req, res){
  res.render('users/fresh', {title: 'Register User'});
};

exports.create = function(req, res){
  var user = new User(req.body);
  user.register(function(){
    if(user._id){
      res.redirect('/');
    }else{
      res.render('users/fresh', {title: 'Register User'});
    }
  });
};

exports.login = function(req, res){
  res.render('users/login', {title: 'Login User'});
};

exports.authenticate = function(req, res){
  User.findByEmailAndPassword(req.body.email, req.body.password, function(user){
    if(user){
      req.session.regenerate(function(){
        req.session.userId = user._id;
        req.session.save(function(){
          res.redirect('/users/' + user._id.toString());
        });
      });
    }else{
      res.redirect('/register');
    }
  });
};

exports.show = function(req, res){
  User.findById(req.params.id, function(showUser){
    if(showUser.role === 'venue'){
      res.render('users/venue-show', {title: 'venue-show page'});
    }
    if(showUser.role === 'applicant'){
      res.render('users/applicant-show', {title: 'applicant-show page'});
    }

//    Application.findByUserId(req.params.id, function(){
  //    res.render('users/show');
  //  });
  });
};
// exports.show = function(req, res){
//   User.findById(req.params._id, function(user){
//     console.log('IIIUSIRUSODIUFOISDUFOISDUFOI', user);
//       if(user.role === 'venue'){
//       res.render('users/venue-show', {title: 'venue-show page'});
//     }else{
//       res.render('users/applicant-show', {title: 'applicant-show page'});
//     }
//   });
// };

exports.logout = function(req, res){
  req.session.destroy(function(){
    res.redirect('/');
  });
};
