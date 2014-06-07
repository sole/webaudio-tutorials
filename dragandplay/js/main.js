(function() {
	var h1 = document.querySelector('h1');
	h1.textContent = document.title;
	

	var canvas = document.querySelector('canvas');

	// audio setup
	var audioContext = new AudioContext();
    var bufferSource;

	// events
	window.addEventListener('dragover', cancel);
	window.addEventListener('dragenter', cancel);
	window.addEventListener('drop', drop);


	// ---
	
	function cancel(evt) {
		evt.preventDefault();
		return false;
	}


	function drop(evt) {

		evt.preventDefault(); // so that the browser doesn't try to open the file with Quicktime or whatever
		
		var files = evt.dataTransfer.files;
		console.log('files=', files.length);
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
		console.log(evt);
		var buffer = evt.target.result;
		loadSample(buffer);
	}


	function loadSample(arrayBuffer) {
		console.log('loadSample', arrayBuffer);
		audioContext.decodeAudioData(arrayBuffer, function success(buffer) {
			if(buffer) {
				playSample(buffer);
			}
		}, function fail(evt) {
			console.error('Error loading sample', evt);
		});
	}

	function playSample(buffer) {
		if(bufferSource) {
			bufferSource.disconnect(audioContext.destination);
		}
		bufferSource = audioContext.createBufferSource();
		bufferSource.connect(audioContext.destination);
		bufferSource.loop = true;
		bufferSource.buffer = buffer;
		bufferSource.start(0);
	}
	

}).call(this);

