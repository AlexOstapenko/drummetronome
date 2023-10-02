// Interacts with Web Audio API and plays given strokes
class AudioFilePlayer {

    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		this.strokeID2Buffer = {}; // map stroke id -> buffer, strokeID = <instr-name>_<strokeName>
		this.gainNode = null;
		this.compressor = null;
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
			let key = audioFilePlayer.makeStrokeID(instrumentName, strokeName);

	    	if (!stroke2file.file || stroke2file.file==="" ) {
	    		loadedAudioBuffers[key] = null;	
	    		loadCount++;
                checkComplete();
	    	}
	    	else {
		        let path = folder + stroke2file.file;
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
		if (!buffer) return; // if there is no audio buffer – just do nothing

		let bufferSource = this.audioCtx.createBufferSource();
		bufferSource.buffer = buffer;
		
		bufferSource.connect( this.gainNode );
		bufferSource.start(when);
	}

	
}

const audioFilePlayer = new AudioFilePlayer();