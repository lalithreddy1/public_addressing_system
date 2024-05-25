const { getAudioDuration } = require('get-audio-duration');

const audioPath = 'path/to/your/audio.mp3';

getAudioDuration(audioPath).then((duration) => {
  console.log(`The song is ${duration} seconds long.`);
});