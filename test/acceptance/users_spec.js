'use strict';

process.env.DBNAME = 'bpaccuser_test';
var app = require('../../app/app');
var request = require('supertest');
var expect = require('chai').expect;
var User;
var bob;
var cookie;

describe('users', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      bob = new User({userName: 'Bob', role:'venue', email:'bob@nomail.com', password:'1234'});
      bob.register(function(){
        request(app)
        .post('/login')
        .field('email', 'bob@nomail.com')
        .field('password', '1234')
        .field('role', 'venue')
        .end(function(err, res){
          cookie = res.headers['set-cookie'];
          done();
        });
      });
    });
  });

  describe('GET /', function(){
    it('should display the home page', function(done){
      request(app)
      .get('/')
      .expect(200, done);
    });
  });

  describe('GET /register', function(){
    it('should display the register page', function(done){
      request(app)
      .get('/register')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        done();
      });
    });
  });

  describe('POST /register', function(){
    it('should register a new user', function(done){
      request(app)
      .post('/register')
      .field('email', 'sue@nomail.com')
      .field('password', '1234')
      .field('role', 'guest')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        expect(res.text).to.equal('Moved Temporarily. Redirecting to /login');
        done();
      });
    });

    it('should not register a new user', function(done){
      request(app)
      .post('/register')
      .field('email', 'bob@nomail.com')
      .field('password', '1234')
      .field('role', 'guest')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Register');
        done();
      });
    });
  });

  describe('GET /login', function(){
    it('should display the login page', function(done){
      request(app)
      .get('/login')
      .end(function(err, res){
        expect(res.status).to.equal(200);
        expect(res.text).to.include('Login');
        done();
      });
    });
  });

  describe('POST /login', function(){
    it('should login a user', function(done){
      request(app)
      .post('/login')
      .field('email', 'bob@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });

    it('should not login a new user', function(done){
      request(app)
      .post('/login')
      .field('email', 'wrong@nomail.com')
      .field('password', '1234')
      .end(function(err, res){
        expect(res.status).to.equal(302);
        done();
      });
    });
  });

  describe('GET /users/:id', function(){
    it('should show a user profile page', function(done){
      request(app)
      .get('/users/' + bob._id.toString())
      .set('cookie', cookie)
      .expect(200, done);
    });
  });


  // describe('GET /users/:id', function(){
  //   it('should get a user\'s profile  page', function(done){
  //     request(app)
  //     .get('/users/:id')
  //     .set('cookie', cookie)
  //     .end(function(err, res){
  //       expect(res.status).to.equal(200);
  //       //  expect(res.text).to.include('This is the edit profile page.');
  //       done();
  //     });
  //   });
  // });

  //
  // describe('GET /applications/:id', function(){
  //   var a1, a2, a3;
  //
  //   beforeEach(function(done){
  //     a1 = new Application({name:'Test A', entryDate:'2012-03-25'});
  //     a2 = new Application({name:'Test B', entryDate:'2012-03-26'});
  //     a3 = new Application({name:'Test C', entryDate:'2012-03-27'});
  //
  //     a1.insert(function(){
  //       a2.insert(function(){
  //         a3.insert(function(){
  //           done();
  //         });
  //       });
  //     });
  //   });
  //
  //   it('should display the application show page', function(done){
  //     request(app)
  //     .get('/applications/' + a1._id.toString())
  //     .expect(200, done);
  //   });
  // });





  describe('POST /logout', function(){
      it('should logout user', function(done){
        request(app)
        .post('/logout')
        .end(function(err, res){
          expect(res.status).to.equal(302);
          done();
        });
      });
    });

  ////end document
});
