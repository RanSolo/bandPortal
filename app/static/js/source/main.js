/*jshint camelcase:false */
/* global SC:false */

(function(){

  'use strict';

  $(document).ready(initialize);


  function initialize(){
    $(document).foundation();

    SC.initialize({
      client_id: '7d6b9bbba79c13d598cefdd1970a5fba'
    });

    SC.get('/tracks', { genres:'ambient' }, function(tracks) {
      $(tracks).each(function(index, track) {
          $('#results').append($('<li></li>').html(track.title + ' - ' + track.genre));
        });
    });
/*
    SC.record({
      start: function(){
      window.setTimeout(function(){
        SC.recordPlay();
      }, 5000);
    }
  });*/
  }

})();
