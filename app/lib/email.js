'use strict';

var request = require('request');
var fs = require('fs');
var jade = require('jade');

exports.sendWelcome = function(data, fn){
  send({from:'ransolo@me.com', to:data.to, subject:'Welcome to bandportal', template:'welcome'}, fn);
};

function send(data, fn){
  if(data.to.match(/@nomail.com/g)){fn(); return;}

  var key = process.env.MAILGUN;
  var url = 'https://api:' + key + '@api.mailgun.net/v2/ransolomusic.com/messages';
  var post = request.post(url, function(err, response, body){
    fn(err, body);
  });

  var form = post.form();
  form.append('from', data.from);
  form.append('to', data.to);
  form.append('subject', data.subject);
  form.append('html', compileJade(data));
}

function compileJade(data){
  var template = __dirname + '/../views/email/' + data.template + '.jade';
  var original = fs.readFileSync(template, 'utf8');
  var partial = jade.compile(original);
  var output = partial(data);

  return output;
}
