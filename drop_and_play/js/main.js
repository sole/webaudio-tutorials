(function() {
	var h1 = document.querySelector('h1');
	h1.textContent = document.title;
	

	var waveCanvas = document.getElementById('waveCanvas');
	var waveCanvasContext = waveCanvas.getContext('2d');

	var osciCanvas = document.getElementById('oscilloscopeCanvas');
	var osciCanvasContext = osciCanvas.getContext('2d');


	// audio setup
	var audioContext = new AudioContext();
	var finalGain = audioContext.createGain();
	var analyser = audioContext.createAnalyser();
	var analyserData;
	var osciData;
	var bufferSource;

	analyser.fftSize = 2048;
	analyserData = new Uint8Array(analyser.frequencyBinCount);
	osciData = new Float32Array(analyser.frequencyBinCount);

	finalGain.connect(analyser);
	analyser.connect(audioContext.destination);

	// events
	window.addEventListener('dragover', cancel);
	window.addEventListener('dragenter', cancel);
	window.addEventListener('drop', drop);

	var filePicker = document.getElementById('filePicker');
	filePicker.addEventListener('change', pick);

	animate();

	// ---
	
	function cancel(evt) {
		evt.preventDefault();
		return false;
	}


	function drop(evt) {

		evt.preventDefault(); // so that the browser doesn't try to open the file with Quicktime or whatever
		
		var files = evt.dataTransfer.files;
		loadFromFiles(files);
	
	}


	function pick(evt) {
		
		var picker = evt.target;
		var files = picker.files;
		loadFromFiles(files);

	}


	function loadFromFiles(files) {

		if(files.length > 0) {

			var file = files[0];
			var reader = new FileReader();
			reader.addEventListener('error', onFileReaderError);
			reader.addEventListener('load', onFileLoaded);

			reader.readAsArrayBuffer(file);
		}

	}


	function onFileReaderError(evt) {

		var error = evt.target.error;

		switch(error.code) {
			case error.NOT_FOUND_ERR:
				console.log('file not found');
				break;
			case error.NOT_READABLE_ERR:
				console.log('file not readable');
				break;
			case error.ABORT_ERR:
				console.log('aborted');
				break;
			default:
				console.log('generic error?');
		}
	
	}


	function onFileLoaded(evt) {

		var buffer = evt.target.result;
		loadSample(buffer);

	}


	function loadSample(arrayBuffer) {

		audioContext.decodeAudioData(arrayBuffer, function success(buffer) {
			if(buffer) {
				useSample(buffer);
			}
		}, function fail(evt) {
			console.error('Error loading sample', evt);
		});

	}


	function useSample(buffer) {

		if(bufferSource) {
			bufferSource.disconnect(finalGain);
		}
		bufferSource = audioContext.createBufferSource();
		bufferSource.connect(finalGain);
		bufferSource.loop = true;
		bufferSource.buffer = buffer;
		bufferSource.start(0);

		drawSample(waveCanvas, buffer.getChannelData(0));

	}


	function animate() {

		requestAnimationFrame(animate);

		analyser.getByteTimeDomainData(analyserData);

		// the drawing function wants -1..1 values but the 
		// analyser data is a bunch of 0..255 so we need to 
		// map them to -1..1
		for(var i = 0; i < analyserData.length; i++) {
			osciData[i] = analyserData[i] / 128 - 1;
		}
		drawSample(osciCanvas, osciData);

	}

}).call(this);

