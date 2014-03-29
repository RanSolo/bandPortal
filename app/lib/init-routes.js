'use strict';

var d = require('../lib/request-debug');
var initialized = false;

module.exports = function(req, res, next){
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){
  var home = require('../routes/home');
  var users = require('../routes/users');
  var applications = require('../routes/applications');

  app.get('/', d, home.index);
  app.get('/register', d, users.fresh);
  app.get('/calendar', d, home.calendar);
  app.post('/register', d, users.create);
  app.get('/login', d, users.login);
  app.post('/login', d, users.authenticate);
  app.get('/users/:id', d, users.show);
  //app.get('/applications', d,  applications.index);
  app.get('/applications/new', d, applications.new);
  app.get('/applications/:id', d, applications.show);
  app.post('/applications', d, applications.create);
  app.put('/applications/:id', d, applications.update);
  //app.post('/applications/:id', d, applications.photoAdd);
  app.post('/logout', d, users.logout);

  console.log('Routes Loaded');
  fn();
}
