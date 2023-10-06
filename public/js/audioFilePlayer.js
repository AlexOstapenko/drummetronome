// Interacts with Web Audio API and plays given strokes
class AudioFilePlayer {

    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		this.strokeID2Buffer = {}; // map stroke id -> buffer, strokeID = <instr-name>_<strokeName>
		this.gainNode = null;
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

    turnOnSound()
	{
		this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.value = 1;

/*
		// Создаем DynamicsCompressorNode (компрессор)
		this.compressor = this.audioCtx.createDynamicsCompressor();

		// Настраиваем параметры компрессора
		this.compressor.threshold.value = -10; // Устанавливаем порог срабатывания компрессора (в децибелах)
		this.compressor.ratio.value = 4; // Устанавливаем коэффициент сжатия (4:1)
		this.compressor.attack.value = 0.005; // Время нарастания (атака) компрессора в секундах
		this.compressor.release.value = 0.1; // Время спада (релиз) компрессора в секундах

		this.gainNode.connect( this.compressor );

		// Подключаем компрессор к контексту аудио
		this.compressor.connect( this.audioCtx.destination );
		*/

		this.gainNode.connect( this.audioCtx.destination );

    }

    turnOffSound()
	{
		if (!this.gainNode) return;
		this.gainNode.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 5);
		this.gainNode.disconnect();
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
	            audioFilePlayer.filesLoaded( loadedAudioBuffers );
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
		        let path = folder + strokeInfo.file;
		        fetch(path)
		            .then(response => response.arrayBuffer())
		            .then(data => audioContext.decodeAudioData(data))
		            .then(buffer => {
		                loadedAudioBuffers[key] = buffer;
		                console.log( `Loaded file for ${key}`);
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

	filesLoaded( loadedAudioBuffers ) {
		Object.keys(loadedAudioBuffers).forEach( key => {
			this.strokeID2Buffer[key] = loadedAudioBuffers[key];
		});

		//this.strokeID2Buffer = loadedAudioBuffers;
		console.log( "All sound files are loaded." );
	}

	// strokeInfo may be string with stroke ID or object with two fields: instrumentName, strokeName
	playStroke( strokeInfo, when ) {

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

		// if the stroke in the instrument defines it's own gain - add it in the chain
		let nodeDestination = this.gainNode; // by default send it to the main gain node
		const strokeGainValue = instrumentManager.getGainValue( strokeID );
		if (strokeGainValue >=0 ) {
			const strokeGainNode = this.audioCtx.createGain();
			strokeGainNode.gain.value = strokeGainValue;
			nodeDestination = strokeGainNode; // redefine the destination for this stroke
			strokeGainNode.connect( this.gainNode ); // connect personal gain of the stroke to the main gain node
		}
		
		bufferSource.connect( nodeDestination );
		bufferSource.start(when);
	}

	
}

const audioFilePlayer = new AudioFilePlayer();