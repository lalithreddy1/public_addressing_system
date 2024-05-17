 var connectBtn = document.getElementById("connectBtn");
    var pauseBtn = document.getElementById("pauseBtn");
    var continueBtn = document.getElementById("continueBtn");

    connectBtn.disabled = false;
    pauseBtn.disabled = true;
    continueBtn.disabled = true;








(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.PCMPlayer = factory());
})(this, (function () { 'use strict';

  class PCMPlayer {
    constructor(option) {
      this.init(option);
    }

    init(option) {
      const defaultOption = {
        inputCodec: 'Int16', // ?????????????,??16?
        channels: 1, // ???
        sampleRate: 8000, // ??? ??Hz
        flushTime: 1000 // ???? ?? ms
      };

      this.option = Object.assign({}, defaultOption, option); // ????????
      this.samples = new Float32Array(); // ??????
      this.interval = setInterval(this.flush.bind(this), this.option.flushTime);
      this.convertValue = this.getConvertValue();
      this.typedArray = this.getTypedArray();
      this.initAudioContext();
      this.bindAudioContextEvent();
    }

    getConvertValue() {
      // ???????????
      // ?????????????
      const inputCodecs = {
        'Int8': 128,
        'Int16': 32768,
        'Int32': 2147483648,
        'Float32': 1
      };
      if (!inputCodecs[this.option.inputCodec]) throw new Error('wrong codec.please input one of these codecs:Int8,Int16,Int32,Float32')
      return inputCodecs[this.option.inputCodec]
    }

    getTypedArray() {
      // ???????????
      // ???????????????????
      // ??TypedArray????
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
      const typedArrays = {
        'Int8': Int8Array,
        'Int16': Int16Array,
        'Int32': Int32Array,
        'Float32': Float32Array
      };
      if (!typedArrays[this.option.inputCodec]) throw new Error('wrong codec.please input one of these codecs:Int8,Int16,Int32,Float32')
      return typedArrays[this.option.inputCodec]
    }

    initAudioContext() {
      // ???????????
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      // ????? GainNode
      // https://developer.mozilla.org/en-US/docs/Web/API/BaseAudioContext/createGain
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = 0.1;
      this.gainNode.connect(this.audioCtx.destination);
      this.startTime = this.audioCtx.currentTime;
    }

    static isTypedArray(data) {
      // ?????????? TypedArray ??? ArrayBuffer ??
      return (data.byteLength && data.buffer && data.buffer.constructor == ArrayBuffer) || data.constructor == ArrayBuffer;
    }

    isSupported(data) {
      // ????????
      // ???? ArrayBuffer ?? TypedArray
      if (!PCMPlayer.isTypedArray(data)) throw new Error('???ArrayBuffer????TypedArray')
      return true
    }

    feed(data) {
      this.isSupported(data);

      // ???????buffer
      data = this.getFormattedValue(data);
      // ????buffer??
      // ????Float32Array???
      const tmp = new Float32Array(this.samples.length + data.length);
      // ????????buffer?(??buff)
      // ??(0)????
      tmp.set(this.samples, 0);
      // ????????
      // ???buff????
      tmp.set(data, this.samples.length);
      // ?????buff?????samples
      // interval??????samples??????
      this.samples = tmp;
    }

    getFormattedValue(data) {
      if (data.constructor == ArrayBuffer) {
        data = new this.typedArray(data);
      } else {
        data = new this.typedArray(data.buffer);
      }

      let float32 = new Float32Array(data.length);

      for (let i = 0; i < data.length; i++) {
        // buffer ??????,???IEEE754 ?32????PCM,???-1?+1
        // ?????????
        // ?????????,??-1?+1???
        // float32[i] = data[i] / 0x8000;
        float32[i] = data[i] / this.convertValue;
      }
      return float32
    }

    volume(volume) {
      this.gainNode.gain.value = volume;
    }

    destroy() {
      if (this.interval) {
        clearInterval(this.interval);
      }
      this.samples = null;
      this.audioCtx.close();
      this.audioCtx = null;
    }

    flush() {
      if (!this.samples.length) return
      const self = this;
      var bufferSource = this.audioCtx.createBufferSource();
      if (typeof this.option.onended === 'function') {
        bufferSource.onended = function (event) {
          self.option.onended(this, event);
        };
      }
      const length = this.samples.length / this.option.channels;
      const audioBuffer = this.audioCtx.createBuffer(this.option.channels, length, this.option.sampleRate);

      for (let channel = 0; channel < this.option.channels; channel++) {
        const audioData = audioBuffer.getChannelData(channel);
        let offset = channel;
        let decrement = 50;
        for (let i = 0; i < length; i++) {
          audioData[i] = this.samples[offset];
          /* fadein */
          if (i < 50) {
            audioData[i] = (audioData[i] * i) / 50;
          }
          /* fadeout*/
          if (i >= (length - 51)) {
            audioData[i] = (audioData[i] * decrement--) / 50;
          }
          offset += this.option.channels;
        }
      }

      if (this.startTime < this.audioCtx.currentTime) {
        this.startTime = this.audioCtx.currentTime;
      }
      bufferSource.buffer = audioBuffer;
      bufferSource.connect(this.gainNode);
      bufferSource.start(this.startTime);
      this.startTime += audioBuffer.duration;
      this.samples = new Float32Array();
    }

    async pause() {
      await this.audioCtx.suspend();
    }

    async continue() {
      await this.audioCtx.resume();
    }

    bindAudioContextEvent() {
      const self = this;
      if (typeof self.option.onstatechange === 'function') {
        this.audioCtx.onstatechange = function (event) {
          self.audioCtx && self.option.onstatechange(this, event, self.audioCtx.state);
        };
      }
    }

  }

  return PCMPlayer;

}));











    let player;
 

        connectBtn.disabled = !connectBtn.disabled;
        pauseBtn.disabled = !pauseBtn.disabled;

        player = new PCMPlayer({
            inputCodec: 'Int16',
            channels: 1,
            sampleRate: 16000,
            //sampleRate: 44100,
        });
        const WS_URL = 'ws://45.249.79.39/websocket'
        var ws = new WebSocket(WS_URL)
        ws.binaryType = 'arraybuffer'
        ws.addEventListener('message', function (event) {

                console.log(event.data);
                player.feed(event.data);
                player.volume(1);
            
        });

    window.changeVolume = function changeVolume(e) {
        player.volume(document.querySelector('#range').value)
    }
    window.pause = async function pause() {
        pauseBtn.disabled = true;
        continueBtn.disabled = false;
        await player.pause()
    }
    window.continuePlay = function continuePlay() {
        player.continue()
        pauseBtn.disabled = false;
        continueBtn.disabled = true;
    }

   