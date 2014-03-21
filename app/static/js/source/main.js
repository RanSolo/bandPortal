/*jshint camelcase:false */
/* global SC:false */

(function(){

  'use strict';

  $(document).ready(initialize);


  function initialize(){
    $(document).foundation();
  }
  
  SC.initialize({
    clientId: '7d6b9bbba79c13d598cefdd1970a5fba',
    redirect_url: 'http://make-nashville-weird.com'
  });
/*
  $('a.connect').click(function(e) {
    e.preventDefault();
    SC.connect(function(){
        SC.get('/me', function(me){
          $('#username').html(me.username);
        });
      });
  });
*/
  SC.get('/tracks', { genres:'ambient' }, function(tracks) {
    $(tracks).each(function(index, track) {
        $('#results').append($('<li></li>').html(track.title + ' - ' + track.genre));
      });
  });


})();
