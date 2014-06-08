function drawSample(canvas, bufferData) {

	var width = canvas.width;
	var height = canvas.height;
	var halfHeight = height * 0.5;
	var bufferLength = bufferData.length;
	var canvasContext = canvas.getContext('2d');

	canvasContext.fillStyle = 'rgb(0, 0, 0)';
	canvasContext.fillRect(0, 0, width, height);

	canvasContext.lineWidth = 1;
	canvasContext.strokeStyle = 'rgb(255, 0, 0)';

	canvasContext.beginPath();

	var sliceWidth = width * 1.0 / bufferLength;
	var x = 0;

	for(var i = 0; i < bufferLength; i++) {

		var v = bufferData[i];
		var y = ((v + 1) * halfHeight) ;

		// make the line be in the middle of the pixel for max sharpness
		var xr = Math.round(x) + 0.5; 
		y = Math.round(y) + 0.5;

		if(i === 0) {
			canvasContext.moveTo(xr, y);
		} else {
			canvasContext.lineTo(xr, y);
		}

		x += sliceWidth;
	}

	canvasContext.lineTo(width, halfHeight);

	canvasContext.stroke();

}

