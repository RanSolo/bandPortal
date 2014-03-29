'use strict';

module.exports = User;
var bcrypt = require('bcrypt');
var Mongo = require('mongodb');
var users = global.nss.db.collection('users');
//var email = require('../lib/email');

//var Application = require('../../app/models/user');

/* ---------------------------------- *
 * User
 * _id
 * email
 * password
 * role
 *
 * #register
 * .findByEmailAndPassword
 * ---------------------------------- */

function User(user){
  this.userName = user.userName;
  this.email = user.email;
  this.password = user.password;
  this.role = user.role;
  this.applications = user.applications || [];
}

User.prototype.register = function(fn){
  var self = this;

  hashPassword(self.password, function(hashedPwd){
    self.password = hashedPwd;
    insert(self, function(err, records){
  /*    if(self._id){
        email.sendWelcome({to:self.email}, function(err, body){
          fn(body);
        });
      }else{
        fn();
      }*/
      fn(records);
    });
  });
};


User.findByEmailAndPassword = function(email, password, fn){
  users.findOne({email:email}, function(err, user){
    if(user){
      bcrypt.compare(password, user.password, function(err, result){
        if(result){
          fn(user);
        }else{
          fn();
        }
      });
    }else{
      fn();
    }
  });
};

function insert(user, fn){
  users.findOne({email:user.email}, function(err, userFound){
    if(!userFound){
      users.insert(user, function(err, record){
        fn(err, record);
      });
    }else{
      fn(err);
    }
  });
}

function hashPassword(password, fn){
  bcrypt.hash(password, 8, function(err, hash){
    fn(hash);
  });
}

User.findById = function(Id, fn){
  var _id = new Mongo.ObjectID(Id);
  users.findOne({_id:_id}, function(err, record){
    fn(record);
  });
};
