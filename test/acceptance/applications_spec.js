'use strict';

process.env.DBNAME = 'application-test';
var app = require('../../app/app');
var request = require('supertest');
var fs = require('fs');
var exec = require('child_process').exec;
var Application;

describe('applications', function(){

  before(function(done){
    request(app)
    .get('/')
    .end(function(err, res){
      Application = require('../../app/models/application');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/test*';
    var cmd = 'rm -rf ' + testdir;

    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/theBand.jpg';
      var copy1file = __dirname + '/../fixtures/shaggs.jpg';
      var copy2file = __dirname + '/../fixtures/bad4good.jpg';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy1file));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy2file));
      global.nss.db.dropDatabase(function(err, result){
        done();
      });
    });
  });

  describe('GET /', function(){
    it('should display the application home page', function(done){
      request(app)
      .get('/')
      .expect(200, done);
    });
  });

  describe('GET /applications/3', function(){
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
      .expect(200, done);
    });
  });
/*

  describe('GET /applications/new', function(){
    it('should display the new application html page', function(done){
      request(app)
      .get('/applications/new')
      .expect(200, done);
    });
  });

  describe('POST /applications', function(){
    it('should create a new application and send user back to home', function(done){
      var filename = __dirname + '/../fixtures/theBand.jpg';
      request(app)
      .post('/applications')
      .attach('cover', filename)
      .field('name', 'Test The Band')
      .field('entryDate', '2014-02-25')
      .expect(302, done);
    });
  });

  describe('POST /applications/3', function(){
    var a1;

    beforeEach(function(done){
      a1 = new Application({name:'Test A', entryDate:'2012-03-25'});
      var oldname = __dirname + '/../fixtures/euro-copy1.jpg';
      a1.addCover(oldname);
      a1.insert(function(){
        done();
      });
    });

    it('should add a photo to the application', function(done){
      var filename = __dirname + '/../fixtures/euro-copy2.jpg';
      request(app)
      .post('/applications/' + a1._id.toString())
      .attach('photo', filename)
      .expect(302, done);
    });
  });
*/
});
