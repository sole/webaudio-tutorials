window.onload = function() {

    var audioContext = new AudioContext();

    // Creates a one-channel buffer with sampleRate length, using sampleRate sampling rate = 1 second of audio
    var buffer = audioContext.createBuffer(1, audioContext.sampleRate, audioContext.sampleRate);

    // Get a reference to the buffer data array
    // (just accessing channel 0 because there's only 1 channel)
    var data = buffer.getChannelData(0);
    
    // And fill it with a nice wave playing in A-4 (440 Hz)
    var bufferLength = audioContext.sampleRate;
    var increase = 440.0 * 2.0 * Math.PI / bufferLength;
    var t = 0;
    
    for(var i = 0; i < bufferLength; i++) {
        data[i] = Math.cos(t); // we're using cos because it starts at 0 so we won't clip when we start playing
        t += increase;
    }

    // Creates an audio buffer source - something that can play the buffer, and set it to loop
    var bufferSource = audioContext.createBufferSource();
    bufferSource.loop = true;
    bufferSource.buffer = buffer;

    // if you don't connect it, you don't hear it ;-)
    bufferSource.connect(audioContext.destination);

    // PLAY!
    bufferSource.start(0);

};
