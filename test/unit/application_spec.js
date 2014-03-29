'use strict';

process.env.DBNAME = 'bandPortal-unit-application';
var expect = require('chai').expect;
var fs = require('fs');
var exec = require('child_process').exec;
var Mongo = require('mongodb');
var User;
var Application;

describe('Application', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      Application = require('../../app/models/application');
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    var testdir = __dirname + '/../../app/static/img/test*';
    var cmd = 'rm -rf ' + testdir;

    exec(cmd,  function(){
      var origfile = __dirname + '/../fixtures/theband.png';
      var copy1file = __dirname + '/../fixtures/theband-copy1.png';
      var copy2file = __dirname + '/../fixtures/theband-copy2.png';
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy1file));
      fs.createReadStream(origfile).pipe(fs.createWriteStream(copy2file));
      global.nss.db.dropDatabase(function(err, result){
        done();
      });
    });
  });


  describe('new', function(){
    it('should create a new Application object', function(){
      var o = {};
      o.bandName = 'test The Band';
      o.date = '2010-03-25';
      this.city = 'Nashville';
      var a1 = new Application(o);
      expect(a1).to.be.instanceof(Application);
      expect(a1.bandName).to.equal('test The Band');
      expect(a1.date).to.be.instanceof(Date);
    });
  });

  describe('#addCover', function(){
    it('should add a cover to the Application', function(){
      var o = {};
      o.bandName = 'test the Band';
      o.date = '2010-03-25';
      var a1 = new Application(o);
      var oldname = __dirname + '/../fixtures/theband-copy1.png';
      a1.addCover(oldname);
      expect(a1.cover).to.equal('/img/testtheband/cover.png');
    });
  });

  describe('#addPhoto', function(){
    var a1;

    beforeEach(function(done){
      a1 = new Application({bandName:'Test A', date:'2012-03-25'});
      var oldname = __dirname + '/../fixtures/theband-copy1.png';
      a1.addCover(oldname);
      a1.insert(function(){
        done();
      });
    });

    it('should add a photo to the Application', function(done){
      var id = a1._id.toString();
      Application.findById(id, function(application){
        var photo = __dirname + '/../fixtures/theband-copy2.png';
        application.addPhoto(photo, 'france.jpg');
        expect(application.photos).to.have.length(1);
        expect(application.photos[0]).to.equal('/img/testa/france.jpg');
        done();
      });
    });
  });

  describe('#insert', function(){
    it('should insert a new Application into Mongo', function(done){
      var o = {};
      o.bandName = 'Test band songs';
      o.date = '2010-03-25';
      var a1 = new Application(o);
      var oldname = __dirname + '/../fixtures/theband-copy1.png';
      a1.addCover(oldname);
      a1.insert(function(err){
        expect(a1._id).to.be.instanceof(Mongo.ObjectID);
        expect(a1._id.toString()).to.have.length(24);
        done();
      });
    });
  });

  describe('#update', function(){
    var a1;

    beforeEach(function(done){
      a1 = new Application({bandName:'Test A', date:'2012-03-25'});
      var oldname = __dirname + '/../fixtures/theband-copy1.png';
      a1.addCover(oldname);
      a1.insert(function(){
        done();
      });
    });


    it('should update an existing application', function(done){
      var id = a1._id.toString();
      Application.findById(id, function(application){
        var photo = __dirname + '/../fixtures/theband-copy2.png';
        application.addPhoto(photo, 'france.jpg');
        expect(application.photos).to.have.length(1);
        expect(application.photos[0]).to.equal('/img/testa/france.jpg');
        application.update(function(err, count){
          expect(count).to.equal(1);
          done();
        });
      });
    });
  });

  describe('Find Methods', function(){
    var a1, a2, a3, a4;

    beforeEach(function(done){
      a1 = new Application({bandName:'Test A', date:'2012-03-25'});
      a2 = new Application({bandName:'Test B', date:'2012-03-26'});
      a3 = new Application({bandName:'Test C', userId:'123451234512345123451234', date:'2012-03-27'});
      a4 = new Application({bandName:'Test D', userId:'123451234512345123451234', date:'2012-03-25'});

      a1.insert(function(){
        a2.insert(function(){
          a3.insert(function(){
            a4.insert(function(){
              done();
            });
          });
        });
      });
    });

    describe('.findAll', function(){
      it('should find all the applications in the database', function(done){
        Application.findAll(function(applications){
          expect(applications).to.have.length(4);
          expect(applications[0].photos).to.have.length(0);
          done();
        });
      });
    });

    describe('.findById', function(){
      it('should find a specific application in the database', function(done){
        Application.findById(a1._id.toString(), function(application){
          expect(application._id).to.deep.equal(a1._id);
          expect(application._id).to.be.instanceof(Mongo.ObjectID);
          expect(application).to.respondTo('addCover');
          done();
        });
      });
    });

    describe('.findByDate', function(){
      it('should find all applications by date in the database', function(done){

        Application.findByDate(a1.date, function(applications){
          expect(a1.date).to.deep.equal(a4.date);
          expect(applications).to.have.length(2);
          expect(a1.date).to.be.instanceof(Date);
          done();
        });
      });
    });

    describe('.findByUserId', function(){
      it('should find all applications by its the user', function(done){
        Application.findByUserId(a4.userId, function(records){
          expect(a4.userId).to.deep.equal(a3.userId);
          expect(records[0].userId).to.deep.equal(a3.userId);
          expect(records[0].userId).to.deep.equal(a4.userId);
          expect(records).to.have.length(2);
          done();
        });
      });
    });

    describe('.destroy', function(){
      it('should delete one application by its Id', function(done){
        Application.destroy(a4._id.toString(), function(count){
          Application.findById(a4._id.toString(), function(record){
            expect(record).to.equal(null);
            expect(count).to.deep.equal(1);
            done();
          });

        });
      });
    });
    ////end of find by before alls
  });
//end document
});
/*
    exec(cmd2,  function(){
      var origfile2 = __dirname + '/../fixtures/singingtheblues.mp3';
      var copy1file2  = __dirname + '/../fixtures/singingtheblues-copy1.mp3';
      var copy2file2 = __dirname + '/../fixtures/singingtheblues-copy2.mp3';
      fs.createReadStream(origfile2).pipe(fs.createWriteStream(copy2file2));
      fs.createReadStream(origfile2).pipe(fs.createWriteStream(copy1file2));
      global.nss.db.dropDatabase(function(err, result){
        done();
      });
    });*/

/*
  describe('#addPhoto', function(){
    var a1;

    beforeEach(function(done){
      a1 = new Application({name:'Test A', date:'2012-03-25'});
      var oldname = __dirname + '/../fixtures/theband-copy1.png';
      a1.addCover(oldname);
      a1.insert(function(){
        done();
      });
    });

    it('should add a photo to the Application', function(done){
      var id = a1._id.toString();
      Application.findById(id, function(application){
        var photo = __dirname + '/../fixtures/theband-copy2.png';
        application.addPhoto(photo, 'france.jpg');
        expect(application.photos).to.have.length(1);
        expect(application.photos[0]).to.equal('/img/testa/france.jpg');
        done();
      });
    });
  });

  describe('#addSong', function(){
    var a1;

    beforeEach(function(done){
      a1 = new Application({name:'Test A', date:'2012-03-25'});
      var oldname = __dirname + '/../fixtures/singingtheblues-copy1.mp3';
      a1.addCover(oldname);
      a1.insert(function(){
        done();
      });
    });

    it('should add a song to the Application', function(done){
      var id = a1._id.toString();
      Application.findById(id, function(application){
        var song = __dirname + '/../fixtures/singingtheblues-copy2.mp3';
        application.addSong(song, 'Damn And Dang.mp3');
        expect(application.songs).to.have.length(1);
        console.log('SONGS YEAH!', application.songs);
        expect(application.songs[0]).to.equal('/audios/testadamnanddang.mp3');
        done();
      });
    });*/
