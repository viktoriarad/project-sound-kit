const recBtns = document.querySelectorAll('.player__rec');
const stopBtns = document.querySelectorAll('.player__stop');
const delBtns = document.querySelectorAll('.player__del');
const instruments = document.querySelector('.instrumets__wrapper').children;
const playBtn = document.querySelector('.player__play');


const instrumensSounds = {
  'drum': ['KeyD', document.querySelector('.drum')],
  'trumpet': ['KeyT', document.querySelector('.trumpet')],
  'guitar': ['KeyG', document.querySelector('.guitar')],
  'piano': ['KeyP', document.querySelector('.piano')],
  'xylophone': ['KeyX', document.querySelector('.xylophone')],
  'maracas': ['KeyM', document.querySelector('.maracas')]
}

const tracks = {
  isRecordingActive: false,
  recordStartTime: null,
  trackInRecording: '',
  firstTrack: [],
  secondTrack: [],
  thirdTrack: [],
  fourthTrack: [],
  fifthTrack: [],
  sixthTrack: [],
  startRecord: function (actualTrack) {
    this.isRecordingActive = true;
    this.recordStartTime = Date.now();
    this.trackInRecording = actualTrack;
  },
  record: function (keySound) {
    const timeFromStart = Date.now() - this.recordStartTime;
    this[this.trackInRecording].push({
      keySound,
      timeFromStart
    })
  },
  stopRecord: function () {
    this.isRecordingActive = false;
    this.recordStartTime = null;
  },
  delRecord: function (trackToDel) {
    this[trackToDel] = [];
  },
  playTrack: function (trackToPlay) {
    for (let i = 0; i < this[trackToPlay].length; i++) {
      const soundToPlay = this[trackToPlay][i],
        audio = instrumensSounds[soundToPlay.keySound][1];
      setTimeout(function () {
        audio.currentTime = 0;
        audio.play();
      }, soundToPlay.timeFromStart)
    }
  }
}

const playSounds = function (e) {
  const time = Date.now();
  let keySound,
    audio;

  const recAudio = function (keySound) {
    if (tracks.isRecordingActive === false) return;
    tracks.record(keySound);
  }

  if (e.type === 'click') {
    audio = instrumensSounds[e.target.dataset.key][1];
    keySound = e.target.dataset.key;
    recAudio(keySound, );
  } else if (e.type === 'keypress') {
    for (key in instrumensSounds) {
      if (e.code === instrumensSounds[key][0]) {
        keySound = key;
        audio = instrumensSounds[key][1];
        recAudio(keySound);
      }
    }
  }
  if (!audio) return;

  audio.currentTime = 0;
  audio.play();
}

const playCheckedTracks = function () {

}

const getAllCheckedTracks = function () {
  const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
  const checkedTracks = [];
  for (let i = 0; i < checkBoxes.length; i++) {
    const checkBox = checkBoxes[i];
    if (checkBox.checked === true) {
      checkedTracks.push(checkBox.parentElement.parentElement.dataset.track);
    }
  }

  return checkedTracks;
}

document.body.addEventListener('keypress', playSounds);

for (let i = 0; i < instruments.length; i++) {
  instruments[i].addEventListener('click', playSounds);
}

for (let i = 0; i < recBtns.length; i++) {
  recBtns[i].addEventListener('click', function (e) {
    e.target.classList.add('player__rec--non-active');
    e.target.nextElementSibling.classList.remove('player__stop--non-active');
    e.target.parentElement.children[3].classList.add('player__music-track--animate');
    tracks.startRecord(e.target.parentElement.dataset.track);
  })
}

for (let i = 0; i < stopBtns.length; i++) {
  stopBtns[i].addEventListener('click', function (e) {
    e.target.previousElementSibling.classList.remove('player__rec--non-active');
    e.target.classList.add('player__stop--non-active');
    e.target.parentElement.children[3].classList.remove('player__music-track--animate');
    e.target.parentElement.children[3].classList.add('player__music-track--recorded');
    e.target.parentElement.children[2].classList.remove('player__del--locked');
    tracks.stopRecord();
  })
}

for (let i = 0; i < delBtns.length; i++) {
  delBtns[i].addEventListener('click', function (e) {
    e.target.nextElementSibling.classList.remove('player__music-track--recorded');
    e.target.parentElement.children[2].classList.add('player__del--locked');
    tracks.delRecord(e.target.parentElement.dataset.track);
  })
}

playBtn.addEventListener('click', function () {

  const tracksToPlay = getAllCheckedTracks();
  for (let i = 0; i < tracksToPlay.length; i++) {
    debugger;
    tracks.playTrack(tracksToPlay[i]);
  }
});
