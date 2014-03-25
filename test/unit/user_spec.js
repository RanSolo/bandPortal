/* jshint expr:true */

'use strict';

process.env.DBNAME = 'test';
var expect = require('chai').expect;
var Mongo = require('mongodb');
var User;
var bob;

describe('User', function(){

  before(function(done){
    var initMongo = require('../../app/lib/init-mongo');
    initMongo.db(function(){
      User = require('../../app/models/user');
      done();
    });
  });

  beforeEach(function(done){
    global.nss.db.dropDatabase(function(err, result){
      bob = new User({role:'applicant', userName:'bobTheBuilder', bandName:'jerkSquad', email:'bob@nomail.com', password:'1234'});
      bob.register(function(){
        done();
      });
    });
  });

  describe('new', function(){
    it('should create a new User object', function(){
      var u1 = new User({role:'applicant', userName:'bobTheBuilder', email:'bob@nomail.com', password:'1234'});
      var u2 = new User({role:'venue', userName:'simonCowell', email:'simon@nomail.com', password:'abcd'});
      expect(u1).to.be.instanceof(User);
      expect(u1.email).to.equal('bob@nomail.com');
      expect(u1.password).to.equal('1234');
      expect(u1.role).to.equal('applicant');
      expect(u1.userName).to.equal('bobTheBuilder');
      expect(u2).to.be.instanceof(User);
      expect(u2.email).to.equal('simon@nomail.com');
      expect(u2.password).to.equal('abcd');
      expect(u2.role).to.equal('venue');
      expect(u2.userName).to.equal('simonCowell');
    });
  });


  describe('#register', function(){
    it('should register a new User', function(done){
//      var u1 = new User({role:'applicant', userName:'bobTheBuilder', email:'bob@nomail.com', password:'1234'});
      var u2 = new User({role:'venue', userName:'simonCowell', email:'simon@nomail.com', password:'abcd'});
      u2.register(function(err, body){
        expect(err).to.not.be.ok;
        expect(u2.password).to.have.length(60);
        expect(u2._id).to.be.instanceof(Mongo.ObjectID);
//body = JSON.parse(body);
//        expect(body.id).to.be.ok;
        done();
      });
    });
    it('should not register a new User', function(done){
      var u1 = new User({role:'guest', email:'bob@nomail.com', password:'1234'});
      u1.register(function(err){
        expect(u1._id).to.be.undefined;
        done();
      });
    });

  });

  describe('.findByEmailAndPassword', function(){
    it('should find a user', function(done){
      User.findByEmailAndPassword('bob@nomail.com', '1234', function(user){
        expect(user).to.be.ok;
        done();
      });
    });
    it('should not find user - bad email', function(done){
      User.findByEmailAndPassword('jimmyjams@nomail.com', '1234', function(user){
        expect(user).to.be.undefined;
        done();
      });
    });
    it('should not find user - bad password', function(done){
      User.findByEmailAndPassword('bob@nomail.com', 'wrong', function(user){
        expect(user).to.be.undefined;
        done();
      });
    });
  });

});

