//pobieranie DOM elementów
const recBtns = document.querySelectorAll('.player__rec');
const stopBtns = document.querySelectorAll('.player__stop');
const delBtns = document.querySelectorAll('.player__del');
const instruments = document.querySelector('.instrumets__wrapper').children;
const playBtn = document.querySelector('.player__play');

//tworzenie obiektu który zawiera dżwięki
const instrumensSounds = {
  'drum': ['KeyD', document.querySelector('.drum')],
  'trumpet': ['KeyT', document.querySelector('.trumpet')],
  'guitar': ['KeyG', document.querySelector('.guitar')],
  'piano': ['KeyP', document.querySelector('.piano')],
  'xylophone': ['KeyX', document.querySelector('.xylophone')],
  'maracas': ['KeyM', document.querySelector('.maracas')]
}

//obiekt który odpowiada za przechowywanie, nagrywanie i odtwarzanie kanałów
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
  // funkcja która zaczyna nagrywanie kanału
  startRecord: function (actualTrack) {
    this.isRecordingActive = true;
    this.recordStartTime = Date.now();
    this.trackInRecording = actualTrack;
  },

  //funkcja która nagrywa dźwięki, dodaje nowy element do tablicy kanału
  record: function (keySound) {
    const timeFromStart = Date.now() - this.recordStartTime;
    this[this.trackInRecording].push({
      keySound,
      timeFromStart
    })
  },

  //funkcja która kończy nagrywanie kanału
  stopRecord: function () {
    this.isRecordingActive = false;
    this.recordStartTime = null;
  },

  //funkcja która usuwa nagrany kanał
  delRecord: function (trackToDel) {
    this[trackToDel] = [];
  },

  // funkcja która odtwarza nagrywanie przekazanego w parametrze kanału
  playTrack: function (trackToPlay) {
    for (let i = 0; i < this[trackToPlay].length; i++) {
      const soundToPlay = this[trackToPlay][i],
        audio = instrumensSounds[soundToPlay.keySound][1];
      setTimeout(function () {
        audio.currentTime = 0;
        audio.play();
      }, soundToPlay.timeFromStart)

      // zwracanie długości kanału w ms
      if (i === this[trackToPlay].length - 1) {
        return soundToPlay.timeFromStart;
      }
    }
  }
}

// funkcja która odtwarza dżwięk przy pomocy klika myszą lub klawiszą na klawiaturze
const playSounds = function (e) {
  let keySound,
    audio;

  // funkcja która sprawdza czy aktualnie jest jakikolwiek kanał w trakcie nagrania
  const recAudio = function (keySound) {
    if (tracks.isRecordingActive === false) return;
    tracks.record(keySound);
  }

  if (e.type === 'click') {
    audio = instrumensSounds[e.target.dataset.key][1];
    keySound = e.target.dataset.key;
    recAudio(keySound);
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

//funkcja która sprawdza wybrane kanały (w checkbox) i zwraca listę wybranych w postaci tablicy
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

//funkcja obsługuje kliknięcie przycisku REC
const handleRecBtn = function (e) {
  const recBtn = e.target;
  recBtn.classList.add('player__rec--non-active');
  recBtn.nextElementSibling.classList.remove('player__stop--non-active');
  recBtn.parentElement.children[3].classList.add('player__music-track--animate');
  tracks.startRecord(recBtn.parentElement.dataset.track);
}

//funkcja obsługuje kliknięcie przycisku STOP
const handleStopBtn = function (e) {
  const stopBtn = e.target;
  stopBtn.previousElementSibling.classList.remove('player__rec--non-active');
  stopBtn.classList.add('player__stop--non-active');
  stopBtn.parentElement.children[3].classList.remove('player__music-track--animate');
  stopBtn.parentElement.children[3].classList.add('player__music-track--recorded');
  stopBtn.parentElement.children[2].classList.remove('player__del--locked');
  tracks.stopRecord();
}

//funkcja obsługuje kliknięcie przycisku DEL
const handleDelBtn = function (e) {
  const delBtn = e.target;
  delBtn.nextElementSibling.classList.remove('player__music-track--recorded');
  delBtn.parentElement.children[2].classList.add('player__del--locked');
  delBtn.parentElement.children[4].children[0].checked = false;

  tracks.delRecord(delBtn.parentElement.dataset.track);

}

//funkcja obsługuje kliknięcie przycisku PLAY
const handlePlayBtn = function (e) {
  const playBtn = e.target;
  const tracksToPlay = getAllCheckedTracks();
  const lastSoundTime = [];

  playBtn.classList.add('player__play--locked');

  for (let i = 0; i < tracksToPlay.length; i++) {
    lastSoundTime.push(tracks.playTrack(tracksToPlay[i]));
  }

  //odblokowanie przycisku Play po upływie czasu nagrania najdłuższego kanału
  const playBtnUnlockTimeOut = Math.max.apply(null, lastSoundTime)
  setTimeout(function () {
    playBtn.classList.remove('player__play--locked')
  }, playBtnUnlockTimeOut);
}

//dodanie nasłuchiwania na DOM element body przy naciśnięciu dowolnej klawiszy
document.body.addEventListener('keypress', playSounds);

//dodanie nasłuchiwania na obrazki intrumentów przy kliknięciu myszki
for (let i = 0; i < instruments.length; i++) {
  instruments[i].addEventListener('click', playSounds);
}

//dodanie nasłuchiwania na przyciski 'REC' przy kliknięciu myszki
for (let i = 0; i < recBtns.length; i++) {
  recBtns[i].addEventListener('click', handleRecBtn)
}

//dodanie nasłuchiwania na przyciski 'STOP' przy kliknięciu myszki
for (let i = 0; i < stopBtns.length; i++) {
  stopBtns[i].addEventListener('click', handleStopBtn)
}

//dodanie nasłuchiwania na przyciski 'DEL' przy kliknięciu myszki
for (let i = 0; i < delBtns.length; i++) {
  delBtns[i].addEventListener('click', handleDelBtn)
}

//dodanie nasłuchiwania na przycisk 'PLAY' przy kliknięciu myszki
playBtn.addEventListener('click', handlePlayBtn);
