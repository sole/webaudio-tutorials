(function() {
	var h1 = document.querySelector('h1');
	h1.textContent = document.title;
	

	var canvas = document.querySelector('canvas');

	// events
	window.addEventListener('dragover', cancel);
	window.addEventListener('dragenter', cancel);
	window.addEventListener('drop', drop);


	function cancel(evt) {
		if(evt.preventDefault) {
			evt.preventDefault();
		}
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


	function loadSample(buffer) {
		console.log('loadSample', buffer);
	}


	

}).call(this);

