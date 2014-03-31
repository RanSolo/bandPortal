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
  this._id = user._id ? Mongo.ObjectID(user._id.toString()) : undefined;
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


User.prototype.update = function(fn){
  users.update({_id:this._id}, this, function(err, count){
    fn(count);
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

User.findAll = function(fn){
  users.find().toArray(function(err, records){
    fn(records);
  });
};
