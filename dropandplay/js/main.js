(function() {
	var h1 = document.querySelector('h1');
	h1.textContent = document.title;
	

	var canvas = document.querySelector('canvas');
	var canvasContext = canvas.getContext('2d');

	// audio setup
	var audioContext = new AudioContext();
    var bufferSource;

	// events
	window.addEventListener('dragover', cancel);
	window.addEventListener('dragenter', cancel);
	window.addEventListener('drop', drop);

	var filePicker = document.getElementById('filePicker');
	filePicker.addEventListener('change', pick);

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
			bufferSource.disconnect(audioContext.destination);
		}
		bufferSource = audioContext.createBufferSource();
		bufferSource.connect(audioContext.destination);
		bufferSource.loop = true;
		bufferSource.buffer = buffer;
		bufferSource.start(0);

		drawSample(buffer);

	}


	function drawSample(buffer) {

		var width = canvas.width;
		var height = canvas.height;
		var halfHeight = height * 0.5;
		var bufferData = buffer.getChannelData(0);
		var bufferLength = bufferData.length;

		canvasContext.fillStyle = 'rgb(0, 0, 0)';
		canvasContext.fillRect(0, 0, width, height);

		canvasContext.lineWidth = 1;
		canvasContext.strokeStyle = 'rgb(255, 0, 0)';

		canvasContext.beginPath();

		var sliceWidth = width * 1.0 / bufferLength;
		var x = 0;

		for(var i = 0; i < bufferLength; i++) {

			var v = bufferData[i];
			var y = (v + 1) * halfHeight;

			if(i === 0) {
				canvasContext.moveTo(x, y);
			} else {
				canvasContext.lineTo(x, y);
			}

			x += sliceWidth;
		}

		canvasContext.lineTo(width, halfHeight);

		canvasContext.stroke();

	}
	

}).call(this);

