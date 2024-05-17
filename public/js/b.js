let websocket_uri = 'ws://45.249.79.39/websocket';
let bufferSize=4096,
    AudioContext,
    context,
    processor,
    input,
    globalStream,
    websocket,
    t;
    
    let player;
    let clickcount=0;
    

    var pauseBtn= 1;
    
    
// Initialize WebSocket
initWebSocket();


var SW9 = new SiriWave({
      style: "ios9",
      container: document.getElementById("container-9"),
      autostart: false,
    });

  
    window.continuePlay = function continuePlay() {
        if(!player){
        player = new PCMPlayer({
            inputCodec: 'Int16',
            channels: 1,
            sampleRate: 16000,
            //sampleRate: 44100,
        });
        
         websocket.binaryType = 'arraybuffer';
        websocket.addEventListener('message', function (event) {
                if(pauseBtn==1){
                player.feed(event.data);
                }
            });
        
        }
        
        player.continue();
        pauseBtn= 1;
        
    }


    window.pause = async function pause() {
        pauseBtn = 0;
        
        await player.pause();
    }

window.changeVolume = function changeVolume(e) {
        
        player.volume(document.querySelector('#range').value)
    }
  


      function toggle(){
       if(clickcount % 2 == 0 ){
        continuePlay();
        SW9.start();
       }
       else{
         pause();
         SW9.stop();
       }
       
       clickcount++;
      if (clickcount === 2) {
        clickCount = 0;
      }
    }

       
 function abc(){
        t=document.getElementById("a").src;
        if(document.getElementById("a").src=="http://45.249.79.39/images/KLU_PAS.png")
        {
            document.getElementById("a").src="./images/KLU_PAS_R.png";
           
            startRecording();
        }
        else{
            document.getElementById("a").src="./images/KLU_PAS.png";
            
            stopRecording();
        }
            

    }

function startRecording() {
    streamStreaming = true;
    AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext({
      // if Non-interactive, use 'playback' or 'balanced' // https://developer.mozilla.org/en-US/docs/Web/API/AudioContextLatencyCategory
      latencyHint: 'interactive',
      sampleRate:  44100,
    });
    processor = context.createScriptProcessor(bufferSize, 1, 1);
    processor.connect(context.destination);
    context.resume();
    var handleSuccess = function (stream) {
      globalStream = stream;
      input = context.createMediaStreamSource(stream);
      input.connect(processor);

      processor.onaudioprocess = function (e) {
        var left = e.inputBuffer.getChannelData(0);  // Left channel
        var left16 = downsampleBuffer(left, 44100, 16000);
        websocket.send(left16);
      };
    };
  
    navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(handleSuccess);
} // closes function startRecording()


function stopRecording() {
    streamStreaming = false;
  
    let track = globalStream.getTracks()[0];   
    track.stop();
    input.disconnect(processor);
    processor.disconnect(context.destination);
    context.close().then(function () {
      input = null;
      processor = null;
      context = null;
      AudioContext = null;
    });
} // closes function stopRecording()






function initWebSocket() {
    // Create WebSocket
    websocket = new WebSocket(websocket_uri);
  
    // WebSocket Definitions: executed when triggered webSocketStatus
    
    
    websocket.onclose = function(e) {
      document.getElementById("webSocketStatus").innerHTML = 'Not Connected';
    }
    
    websocket.onmessage = function(e) {
  
      try {
        result = JSON.parse(e.data);
      }  catch (e) {
        $('.message').html('Error retrieving data: ' + e);
      }
  
      if (typeof(result) !== 'undefined' && typeof(result.error) !== 'undefined') {
        $('.message').html('Error: ' + result.error);
      }
      else {
        $('.message').html('KLU Public Addressing System!');
      }
    }
    
    
   
} // closes function initWebSocket()

function downsampleBuffer (buffer, sampleRate, outSampleRate) {
    if (outSampleRate == sampleRate) {
      return buffer;
    }
    if (outSampleRate > sampleRate) {
      throw 'downsampling rate show be smaller than original sample rate';
    }
    var sampleRateRatio = sampleRate / outSampleRate;
    var newLength = Math.round(buffer.length / sampleRateRatio);
    var result = new Int16Array(newLength);
    var offsetResult = 0;
    var offsetBuffer = 0;
    while (offsetResult < result.length) {
      var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      var accum = 0,
        count = 0;
      for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
  
      result[offsetResult] = Math.min(1, accum / count) * 0x7fff;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result.buffer;
}