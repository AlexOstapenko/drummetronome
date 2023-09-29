// Interacts with Web Audio API and plays given strokes
class AudioFilePlayer {

    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		this.strokeID2Buffer = {}; // map stroke id -> buffer, strokeID = <instr-name>_<strokeName>
		this.gainNode = null;
    }

	get audioContext() { 
		return this.audioCtx; 
	}

	resumeAudio() {
		return this.audioCtx.resume();
	}

    turnOnSound()
	{
		this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.value = 1;
        this.gainNode.connect( this.audioCtx.destination );
    }

    turnOffSound()
	{
		if (!this.gainNode) return;
		this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);
		this.gainNode.disconnect();
	}


	/*
	* instrumentInfo = {
			name: string,
    		folder: string,
    		stroke2file: array of objects {
				stroke: string,
				file: string
    		}
	  callback will receive object: {<instrName>_<strokeName> : AudioBuffer, ...}
	*/
	loadAudioFiles( instrumentInfo ) {

		let {folder, instrumentName, arrStrokeToFile} = instrumentInfo;
		const audioContext = this.audioContext;
	    let loadedAudioBuffers = {};
	    let loadCount = 0;

	    function checkComplete() {
	        if (loadCount === arrStrokeToFile.length) {
	            audioFilePlayer.filesLoaded(loadedAudioBuffers);
	        }
	    }

	    arrStrokeToFile.forEach(function (stroke2file) {
	        let strokeName = stroke2file.stroke;
	        let path = folder + stroke2file.file;

	        fetch(path)
	            .then(response => response.arrayBuffer())
	            .then(data => audioContext.decodeAudioData(data))
	            .then(buffer => {
	                let key = audioFilePlayer.makeStrokeID(instrumentName, strokeName);
	                loadedAudioBuffers[key] = buffer;

	                console.log( `Loaded file for ${key}`);
	                loadCount++;
	                checkComplete();
	            })
	            .catch(error => console.error('Error loading audio:', error));
	    });
	}

	filesLoaded( loadedAudioBuffers ) {
		this.strokeID2Buffer = loadedAudioBuffers;
		console.log( "All sound files are loaded." );
	}

	makeStrokeID(instrName, strokeName) {
		return `${instrName}_${strokeName}`;
	} 

	// strokeInfo may be string with stroke ID or object with two fields: instrumentName, strokeName
	playStroke( strokeInfo, when ) {

		let strokeID = "";
		if ( typeof strokeInfo == "string" ) {
			strokeID = strokeInfo;
		} else if (typeof strokeInfo == "object") {
			strokeID = this.makeStrokeID( strokeInfo.instrumentName, strokeInfo.strokeName);
		}
		
		let buffer = this.strokeID2Buffer[strokeID];
		var bufferSource = this.audioCtx.createBufferSource();
		bufferSource.buffer = buffer;
		
		bufferSource.connect( this.gainNode );
		bufferSource.start(when);
	}

	
}

const audioFilePlayer = new AudioFilePlayer();