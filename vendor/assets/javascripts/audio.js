var audioContext = null, audioList = [];

function initAudio(){
  audioList = [];

  var tmpAudioList = [];


  for(var i = 0; i < AUDIO_SOURCES.length; i++)
  {
    var audio = new Audio();

    var extension =audio.canPlayType('audio/mpeg;') ? '.mp3' : '.ogg';
    audio.src = AUDIO_ROOT + AUDIO_SOURCES[i] + extension;

    audio.controls = false;
    audio.autoplay = false;
    audio.loop = true;

    document.body.appendChild(audio);
    tmpAudioList.push(audio);
  }

  if(typeof webkitAudioContext != 'undefined')
    audioContext = new webkitAudioContext();

  window.addEventListener('load', function(e){
    for(var i = 0; i < tmpAudioList.length; i++){
      var audio = tmpAudioList[i];

      if(audioContext != null)
      {
        var source = audioContext.createMediaElementSource(audio);
        source.loop = true;

        var volumeControl = audioContext.createGainNode();
        volumeControl.gain.value = 0;
        audio.volume = 0;

        var filter = audioContext.createBiquadFilter();
        filter.type = 0; // Low-pass filter. See BiquadFilterNode docs
        //filter.frequency.value = 800;
        filter.frequency.value = 20000;

        source.connect(filter);
        filter.connect(volumeControl);
        volumeControl.connect(audioContext.destination);

        audioList[i] = {'audio': audio, 'source': source, 'volume':volumeControl, 'filter': filter};

        //if(i == AUDIO_SOURCES.indexOf(MAIN_AUDIO_SOURCE))
          //playAudio(i);
      }
      else{
        audio.volume = 0;

        audioList[i] = {'audio': audio};
      }

      audio.play();
    }
  });

};

function playAudio(index){
  if(index >= audioList.length) return;

    audioList[index].audio.volume = 1;

  if(typeof audioList[index].volume != 'undefined')
    audioList[index].volume.gain.value = 1;

};

function pauseAudio(index){
  if(index >= audioList.length) return;

  audioList[index].audio.volume = 0;

  if(typeof audioList[index].volume != 'undefined')
    audioList[index].volume.gain.value = 0;
};

function pauseAllAudio(){
  for(var i = 0; i < audioList.length; i++)
    pauseAudio(i);
};

function setPlaybackRate(rate){
  for(var i = 0; i < audioList.length; i++){
    if(typeof audioList[i].volume == 'undefined')
      audioList[i].audio.playbackRate = rate;
    else
      audioList[i].source.mediaElement.playbackRate = rate;
  }
};
