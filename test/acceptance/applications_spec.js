'use strict';

process.env.DBNAME = 'accept-applicatison-test';
var app = require('../../app/app');
var request = require('supertest');
var fs = require('fs');
var exec = require('child_process').exec;
var User, Application;
var bob;
var cookie;

describe('users', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      User = require('../../app/models/user');
      Application = require('../../app/models/application');
      done();
    });
  });

  beforeEach(function(done){

    var testdir = __dirname + '/../../app/static/img/test*';
    var cmd = 'rm -rf ' + testdir;

    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/theband.png';
      var copy1file = __dirname + '/../fixtures/theband-copy1.png';
      var copy2file = __dirname + '/../fixtures/theband-copy2.png';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy1file));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy2file));
      global.nss.db.dropDatabase(function(err, result){
        bob = new User({userName: 'Bob', role:'applicant', email:'bob@nomail.com', password:'1234'});
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
  });

  describe('GET/applications', function(){
    it('should not display Applications page because user not logged in', function(done){
      request(app)
      .get('/applications')
      .expect(302, done);
    });
  });


  describe('GET /', function(){
    it('should display the application home page', function(done){
      request(app)
      .get('/')

      .expect(200, done);
    });
  });

  describe('GET /applications/new', function(){
    it('should display the new application html page', function(done){
      request(app)
      .get('/applications/new')
      .set('cookie', cookie)
      .expect(200, done);
    });
  });

  describe('GET /applications/:id', function(){
    var a1, a2, a3;

    beforeEach(function(done){
      a1 = new Application({name:'Test A', entryDate:'2012-03-25'});
      a2 = new Application({name:'Test B', entryDate:'2012-03-26'});
      a3 = new Application({name:'Test C', entryDate:'2012-03-27'});

      a1.insert(function(){
        a2.insert(function(){
          a3.insert(function(){
            done();
          });
        });
      });
    });

    it('should display the application show page', function(done){
      request(app)
      .get('/applications/' + a1._id.toString())
      .set('cookie', cookie)
      .expect(200, done);
    });
  });

  describe('POST /applications', function(){
    it('should create a new application and send user back to home', function(done){
      //var filename = __dirname + '/../fixtures/theband-copy1.png';
      var a1 = {bandName:'Test the band', userId:'121212121212121212121212', date:'2012-03-25'};
      request(app)
      .post('/applications')
      .send(a1)
      .set('cookie', cookie)
      .expect(302, done);
    });
  });
/*
  describe('POST /applications/songs/:id', function(){
    var a1;

    beforeEach(function(done){
      a1 = new Application({name:'Test A', entryDate:'2012-03-25'});
      var oldname = __dirname + '/../fixtures/singingtheblues-copy1.mp3';
      a1.addCover(oldname);
      a1.insert(function(){
        done();
      });
    });

    it('should add a song to the application', function(done){
      var filename = __dirname + '/../fixtures/singingtheblues-copy2.mp3';
      request(app)
      .post('/applications/songs' + a1._id.toString())
      .attach('song', filename)
      .expect(302, done);
    });
  });

  describe('POST /applications/photos/:id', function(){
    var a1;

    beforeEach(function(done){
      a1 = new Application({name:'Test A', entryDate:'2012-03-25'});
      var oldname = __dirname + '/../fixtures/singingtheblues-copy1.mp3';
      a1.addCover(oldname);
      a1.insert(function(){
        done();
      });
    });

    it('should add a photo to the application', function(done){
      var filename = __dirname + '/../fixtures/singingtheblues-copy2.mp3';
      request(app)
      .post('/applications/' + a1._id.toString())
      .attach('photo', filename)
      .expect(302, done);
    });
  });
*/
});
