/*jshint camelcase:false */
/* global SC:false */

(function(){

  'use strict';
  var date = new Date();
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();
  SC.initialize({
    client_id: '7d6b9bbba79c13d598cefdd1970a5fba',
    redirect_uri: 'http://10.0.0.163:4000/login'
  });

  $(document).ready(initialize);

  function initialize(){
    $(document).foundation();
    $('#toggleApplication').click(toggleApplication);
  //////event handlers
///////start recording ///////
///////hides start shows stop
///////calls SC.record and updates timer
    $('#submitApplication').click(youTubeIt, fileUpload);

    $('#startRecording a').click(function(e){
      updateTimer(0);
      $('#startRecording').hide();
      $('#stopRecording').show();
      e.preventDefault();
      SC.record({
        progress: function(ms, avgPeak){
          updateTimer(ms);
        }
      });
    });
    ////////stop recording/////
    ////////hides stop shows playback and upload
    ///////calls SC.recordStop()
    $('#stopRecording a').click(function(e){
      e.preventDefault();
      $('#stopRecording').hide();
      $('#playBack').show();
      $('#upload').show();
      SC.recordStop();
    });
    ////////playback///////
    ///////updates timer to 0 calls SC.recordPlay()
    //////updates timer in ms
    $('#playback a').click(function(e){
      e.preventDefault();
      updateTimer(0);
      SC.recordPlay({
        progress: function(ms){
          updateTimer(ms);
        }
      });
    });
    ////////upload///////
    ///////calls SC.connect for auth/////
    ///////updates status calls SC.recordUpload()
    //////passes name and sharing

    $('#upload a').click(function(e){
      alert('HEY');
      e.preventDefault();
      SC.connect({
        connected:
        function(){
          $('.status').html('Uploading...');
          SC.recordUpload({
            track:{
              name: 'My recording',
              sharing: 'private'
            }
          }, function(track){
            console.log(track);
            $('.status').html('uploaded: <a href="' + track.permalink_url +'">' + track.permalink_url + '</a>');
          });
        }
      });
    });
    //////end init/////
    /////submit functions////
    function youTubeIt(path){
      console.log(path);
    }
    function toggleApplication(event){
      alert('hey');
      $('a#createApplication').toggleClass('hide');
      event.preventdefault();
    }
    ////jquery ui/////////
    //
    $('#cal').datepicker();

    $('#calendar').fullCalendar({
      editable: true,
      events:[
        {name: 'All Day Event',
        start: new Date(y, m, d + 3)
    }
      ]
    });

    function updateTimer(ms){
      $('.status').text(SC.Helper.millisecondsToHMS(ms));
    }



    SC.get('/tracks/313104', function(track){
      SC.oEmbed(track.permalink_url, document.getElementById('player'));
      console.log(track.permalink_url);
    });

    SC.get('/tracks', { genres:'ambient' }, function(tracks) {

      $(tracks).each(function(index, track) {
        $('#results').append($('<li></li>').html(track.name + ' - ' + track.genre));
      });
    });

    SC.stream('/tracks/293', function(sound){
      $('#start').click(function(e){
        e.preventDefault();
        sound.start();
      });
      $('#stop').click(function(e){
        e.preventDefault();
        sound.stop();
      });
    });

    function fileUpload(track){
      SC.connect(function() {
        SC.record({
          start: function() {
            window.setTimeout(function() {
              SC.recordStop();
              SC.recordUpload({
                track: { name: 'This is my sound' }
              });
            }, 5000);
          }
        });
      });
    }
    /*
    <iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/132753131&color=ff5500"></iframe>

    SC.record({
      start: function(){
               window.setTimeout(function(){
                 SC.recordPlay();
      }, 5000);
    }
  });*/
  }
})();
