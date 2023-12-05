// Interacts with Web Audio API and plays given strokes
class AudioFilePlayer {

    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		this.strokeID2Buffer = {}; // map stroke id -> buffer, strokeID = <instr-name>_<strokeName>
		this.masterGainNode = null;
		this.compressor = null;
		this.loadedInstrumentNames = [];
		
		// TODO
		//this.fileToBuffer = {}; // to make sure we don't load same file twice (two or more strokes can use the same file)
    }

	get audioContext() { 
		return this.audioCtx; 
	}

	resumeAudio() {
		return this.audioCtx.resume();
	}

    turnOnSound() {
		this.masterGainNode = this.audioCtx.createGain();
        this.masterGainNode.gain.value = 1;
		this.masterGainNode.connect( this.audioCtx.destination );
    }

    turnOffSound()
	{
		if (!this.masterGainNode) return;
		this.masterGainNode.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 5);
		this.masterGainNode.disconnect();
	}

	/*
	* instrumentInfo = {
			name: string,
    		folder: string,
    		strokeInfo: array of objects {
				stroke: string,
				file: string
    		}
	  callback will receive object: {<instrName>_<strokeName> : AudioBuffer, ...}
	*/
	loadAudioFiles( instrument, callback ) {
		let {folder, instrumentName, arrStrokeInfo} = instrument;
		if ( this.loadedInstrumentNames.indexOf( instrumentName ) >= 0 ) return;
		
		const audioContext = this.audioContext;
	    let loadedAudioBuffers = {};
	    let loadCount = 0;

	    function checkComplete() {
	        if (loadCount === arrStrokeInfo.length) {
	            audioFilePlayer.filesLoaded( loadedAudioBuffers, instrumentName );
	            audioFilePlayer.loadedInstrumentNames.push( instrumentName );
	            if (callback) callback( instrument ); 
	        }
	    }

	    arrStrokeInfo.forEach( function (strokeInfo) {
			let strokeName = strokeInfo.stroke;
			let key = InstrumentManager.makeStrokeID(instrumentName, strokeName);

	    	if (!strokeInfo.file || strokeInfo.file==="" ) {
	    		loadedAudioBuffers[key] = null;	
	    		loadCount++;
                checkComplete();
	    	}
	    	else {
		        let path = strokeInfo.folderRedefined ? strokeInfo.file : (folder + '/audio/' + strokeInfo.file);
		        fetch(path)
		            .then(response => response.arrayBuffer())
		            .then(data => audioContext.decodeAudioData(data))
		            .then(buffer => {
		                loadedAudioBuffers[key] = buffer;
		                //console.log( `Loaded ${key}`);
		                loadCount++;
		                checkComplete();
		            })
		            .catch(error => console.error('Error loading audio:', error));
	        }
	    });
	}

	// checks if the audio files for the given instrument are loaded
	isInstrumentLoaded( instrument ) {
		return this.loadedInstrumentNames.indexOf( instrument.instrumentName ) >= 0;
	}

	filesLoaded( loadedAudioBuffers, instrumentName ) {
		Object.keys(loadedAudioBuffers).forEach( key => {
			this.strokeID2Buffer[key] = loadedAudioBuffers[key];
		});

		//this.strokeID2Buffer = loadedAudioBuffers;
		console.log( `------------------------\n[${instrumentName}] - all sound files are loaded. `);
	}

	// strokeInfo may be string with stroke ID or object with two fields: instrumentName, strokeName,
	// masterGainNode (with set from outside gain value) and panNode.
	playStroke( strokeInfo, when ) {
		let a = 10;

		function isNumber(when) { return !isNaN(parseFloat(when)) && isFinite(when); }
		if (!isNumber(when) ) return;

		let strokeID = "";
		if ( typeof strokeInfo == "string" ) {
			strokeID = strokeInfo;
		} else if (typeof strokeInfo == "object") {
			strokeID = InstrumentManager.makeStrokeID( strokeInfo.instrumentName, strokeInfo.strokeName);
		}
		
		let buffer = this.strokeID2Buffer[strokeID];
		if (!buffer) return; // if there is no audio buffer – just do nothing

		let bufferSource = this.audioCtx.createBufferSource();
		bufferSource.buffer = buffer;

		let mixerGainNode = null;
		if ( strokeInfo.gainNode ) mixerGainNode = strokeInfo.gainNode;
		else {
			mixerGainNode = this.audioCtx.createGain();
			mixerGainNode.gain.value = 1;
		}

		let mixerPanNode = null;
		if (strokeInfo.panNode) mixerPanNode = strokeInfo.panNode;
		else {
			mixerPanNode = this.audioCtx.createStereoPanner();
			mixerPanNode.pan.value = 0;
		}

		const strokeGainValueByInstrument = instrumentManager.getGainValue( strokeID ); // check if we have special gain defined in instrument
	    const strokeGainNodeByInstrument = this.audioCtx.createGain();
	    strokeGainNodeByInstrument.gain.value = strokeGainValueByInstrument >=0 ? strokeGainValueByInstrument : 1;

		// Make the connections
		bufferSource.connect( strokeGainNodeByInstrument );
		strokeGainNodeByInstrument.connect( mixerGainNode );
		mixerGainNode.connect( mixerPanNode );
		mixerPanNode.connect( this.masterGainNode );
		bufferSource.start(when);
	}

	setMasterGainValue(value) {
		this.masterGainNode.gain.value = value;
	}
}

const audioFilePlayer = new AudioFilePlayer();