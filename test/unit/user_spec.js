/* jshint expr:true */

'use strict';

process.env.DBNAME = 'bandPortal-unit-user';
var expect = require('chai').expect;
var Mongo = require('mongodb');
var User;
var bob, u1, u2;

describe('User', function(){
  this.timeout(10000);

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
      u1 = new User({role:'applicant', userName:'bobTheBuilder', email:'bob@nomail.com', password:'1234'});
      u2 = new User({role:'venue', userName:'simonCowell', email:'simon@nomail.com', password:'abcd'});
      bob.register(function(used){
        u1.register(function(used){
          u2.register(function(used){
            done();
          });
        });
      });
    });
  });

  describe('new', function(){
    it('should create a new User object', function(){
      expect(u1).to.be.instanceof(User);
      expect(u1.email).to.equal('bob@nomail.com');
      //expect(u1.password).to.equal(u1.hash);
      expect(u1.role).to.equal('applicant');
      expect(u1.userName).to.equal('bobTheBuilder');
      expect(u2).to.be.instanceof(User);
      expect(u2.email).to.equal('simon@nomail.com');
      //expect(u2.password).to.equal('abcd');
      expect(u2.role).to.equal('venue');
      expect(u2.userName).to.equal('simonCowell');
    });
  });


  describe('#register', function(){
    it('should register a new User', function(done){
      //expect(err).to.not.be.ok;
      expect(u2.password).to.have.length(60);
      expect(u2._id.toString()).to.have.length(24);
      expect(u2._id).to.be.instanceof(Mongo.ObjectID);
//body = JSON.parse(body);
//        expect(body.id).to.be.ok;
      done();
    });
    it('should not register a new User', function(done){
      var u3 = new User({role:'guest', email:'bob@nomail.com', password:'1234'});
      u3.register(function(err){
        expect(u3._id).to.be.undefined;
        done();
      });
    });

  });

  describe('.findByEmailAndPassword', function(){
    it('should find a user', function(done){
      var u3 = new User({role:'guest', email:'hob@nomail.com', password:'1234'});
      u3.register(function(err){
        User.findByEmailAndPassword('hob@nomail.com', '1234', function(user){
          expect(user).to.be.ok;
          done();
        });
      });
    });
    it('should not find user - bad email', function(done){
      var u3 = new User({role:'guest', email:'hob@nomail.com', password:'1234'});
      u3.register(function(err){
        User.findByEmailAndPassword('jimmyjams@nomail.com', '1234', function(user){
          expect(user).to.be.undefined;
          done();
        });
      });
    });
    it('should not find user - bad password', function(done){
      var u3 = new User({role:'guest', email:'hob@nomail.com', password:'1234'});
      u3.register(function(err){
        User.findByEmailAndPassword('bob@nomail.com', 'wrong', function(user){
          expect(user).to.be.undefined;
          done();
        });
      });
    });
  });

  describe('.findById', function(){
    it('should find a user by their Id', function(done){
      var id = bob._id.toString();
      User.findById(id, function(record){
        expect(record.email).to.equal('bob@nomail.com');
        done();
      });
    });
  });
});
