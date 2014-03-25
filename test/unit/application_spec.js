'use strict';

process.env.DBNAME = 'application-test2';
var expect = require('chai').expect;
var fs = require('fs');
var exec = require('child_process').exec;
var Mongo = require('mongodb');
var Application;

describe('Application', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Application = require('../../app/models/application');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/test*';
//    var testdir2 = __dirname + '/../../app/static/audios/test*';
    var cmd = 'rm -rf ' + testdir;
//    var cmd2 = 'rm -rf ' + testdir2;

    exec(cmd, function(){
      var origfile = __dirname + '/../fixtures/theband.png';
      var origfile2 = __dirname + '/../fixtures/singingtheblues.mp3';
      var copy1file = __dirname + '/../fixtures/theband-copy1.png';
      var copy2file = __dirname + '/../fixtures/theband-copy2.png';
      var copy1file2  = __dirname + '/../fixtures/singingtheblues-copy1.mp3';
      var copy2file2 = __dirname + '/../fixtures/singingtheblues-copy2.mp3';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy1file));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy2file));
      fs.createReadStream(origfile2).pipe(fs.createWriteStream(copy1file2));
      fs.createReadStream(origfile2).pipe(fs.createWriteStream(copy2file2));
      global.nss.db.dropDatabase(function(err, result){
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new Application object', function(){
      var o = {};
      o.name = 'test The Band';
      o.submitted = '2010-03-25';
      var a1 = new Application(o);
      expect(a1).to.be.instanceof(Application);
      expect(a1.name).to.equal('test The Band');
      expect(a1.entryDate).to.be.instanceof(Date);
      expect(a1.songs).to.have.length(0);
    });
  });

  describe('#addCover', function(){
    it('should add a cover to the Application', function(){
      var o = {};
      o.name = 'test the Band';
      o.taken = '2010-03-25';
      var a1 = new Application(o);
      var oldname = __dirname + '/../fixtures/theband-copy1.png';
      a1.addCover(oldname);
      expect(a1.cover).to.equal('/img/testtheband/cover.png');
    });
  });

  describe('#addSong', function(){
    var a1;

    beforeEach(function(done){
      a1 = new Application({name:'Test A', taken:'2012-03-25', youTubePath: 'www.youtube.com'});
      var oldname = __dirname + '/../fixtures/theband-copy1.png';
      a1.addCover(oldname);
      a1.insert(function(){
        done();
      });
    });

    it('should add a song to the Application', function(done){
      var id = a1._id.toString();
      Application.findById(id, function(application){
        console.log(application, '0000000000');
        var song = __dirname + '/../fixtures/singingtheblues-copy2.mp3';
        application.addSong(song, 'Damn And Dang.mp3');
        expect(application.songs).to.have.length(1);
     //   expect(application.songs[0]).to.equal('/audios/testa/damnanddang.mp3');
        done();
      });
    });
  });

  describe('#insert', function(){
    it('should insert a new Application into Mongo', function(done){
      var o = {};
      o.name = 'Test band songs';
      o.taken = '2010-03-25';
      var a1 = new Application(o);
      var oldname = __dirname + '/../fixtures/theband-copy1.png';
      a1.addCover(oldname);
      a1.insert(function(err){
        expect(a1._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('#update', function(){
    var a1;

    beforeEach(function(done){
      a1 = new Application({name:'Test A', taken:'2012-03-25'});
      var oldname = __dirname + '/../fixtures/singingtheblues-copy1.mp3';
      a1.addCover(oldname);
      a1.insert(function(){
        done();
      });
    });

    it('should update an existing application', function(done){
      var id = a1._id.toString();
      Application.findById(id, function(application){
        var song = __dirname + '/../fixtures/singingtheblues-copy2.mp3';
        application.addSong(song, 'Damn And Dang.mp3');
        expect(application.songs).to.have.length(1);
     //   expect(application.songs[0]).to.equal('/audios/testa/damnanddang.mp3');
        application.update(function(err, count){
          expect(count).to.equal(1);
          done();
        });
      });
    });
  });

  describe('Find Methods', function(){
    var a1, a2, a3;

    beforeEach(function(done){
      a1 = new Application({name:'Test A', taken:'2012-03-25'});
      a2 = new Application({name:'Test B', taken:'2012-03-26'});
      a3 = new Application({name:'Test C', taken:'2012-03-27'});

      a1.insert(function(){
        a2.insert(function(){
          a3.insert(function(){
            done();
          });
        });
      });
    });

    describe('.findAll', function(){
      it('should find all the applications in the database', function(done){
        Application.findAll(function(applications){
          expect(applications).to.have.length(3);
          expect(applications[0].songs).to.have.length(0);
          done();
        });
      });
    });

    describe('.findById', function(){
      it('should find a specific application in the database', function(done){
        Application.findById(a1._id.toString(), function(application){
          expect(application._id).to.deep.equal(a1._id);
          expect(application).to.respondTo('addCover');
          done();
        });
      });
    });
  });
  /////end document
});

