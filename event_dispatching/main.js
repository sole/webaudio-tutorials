window.onload = function() {

	var audioContext = new AudioContext();
	var oscillator = audioContext.createOscillator();

	var events = [];
	var numEvents = 24;
    var sequenceLength = 2000; // ms
    var eventLength = sequenceLength / numEvents;
	var currentEventIndex = 0;
	var spanIndex = document.querySelector('.counter span');

	for(var i = 0; i < numEvents; i++) {

		var note = i*1 + 60;
		var ev = {
			timestamp: i * eventLength,
			frequency: 440.0 * Math.pow(2, (note - 69.0) / 12.0)
		};

		events.push(ev);

	}

    events.forEach(function(e) {
        console.log(e.timestamp, e.frequency);
    });

    oscillator.type = 'triangle';
    oscillator.connect(audioContext.destination);
    oscillator.start(0);

	// setInterval
	// setTimeout
	// ScriptNode/analyser
	
	var updateInterval = setInterval(updateWithInterval, 20);

	var startTime = Date.now();
	//var loopTime = 0;
	var loopTime = Date.now();

	function updateWithInterval() {
		var currentEvent = events[currentEventIndex];
		var time = Date.now(); //  - startTime - loopTime;
        var currentTimestamp = currentEvent.timestamp + loopTime;

        oscillator.frequency.setValueAtTime(currentEvent.frequency, audioContext.currentTime);

        spanIndex.innerHTML = currentEventIndex + ' ' + time;
		
        if(time >= currentTimestamp) {
			// do it!
			currentEventIndex++;
			
			if(currentEventIndex >= numEvents) {
				loopTime = Date.now();
				currentEventIndex = 0;
			}

		}
	}

};
