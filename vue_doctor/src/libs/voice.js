
const Voice = function (base) {
  this.context;
  this.base = base;
  this.gAudioContext;
}
Voice.prototype = {
  play : function(){
    var data = this._base64ToArrayBuffer(this.base);
    this.playAmrArray(data);
  },
  _base64ToArrayBuffer : function(base64) {
    var base64 = base64.replace(new RegExp(/\s/g),'')
    var binary_string =  window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array( len );
    for (var i = 0; i < len; i++)        {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes;
  },
  getAudioContext : function() {
    if (!this.gAudioContext) {
      if(window.AudioContext) {
        this.gAudioContext = new AudioContext();
      } else {
        this.gAudioContext = new window.webkitAudioContext();
      }
    }
    return this.gAudioContext;
  },
  playAmrArray : function(data) {
    if(window.AudioContext) {
      var samples = AMR.decode(data);
      if (!samples) {
        alert('Failed to decode!');
        return;
      }
      this.playPcm(samples);
    } else {
      this.playIos(data);
    }
  },
  playPcm : function(samples) {
    var context = this.getAudioContext();
    // alert(context);
    var buffer = context.createBuffer(1, samples.length, 8000);
    if (buffer.copyToChannel) {
      buffer.copyToChannel(samples, 0, 0)
    } else {
      var channelBuffer = buffer.getChannelData(0);
      channelBuffer.set(samples);
    }
    this.playSound(context, buffer);
  },
  playIos : function(data) {
    var context = this.getAudioContext();
    this.context = context;
    var source = context.createBufferSource();
    var wav = AMR.toWAV(data)
    var buffer = context.createBuffer(wav.buffer, false);
    source.buffer = buffer;
    source.connect(context.destination);
    source.start(0);
  },
  playSound : function(context, buffer) {
    this.context = context;
    var source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);
    source.start();
  }
}
export  default  Voice;
