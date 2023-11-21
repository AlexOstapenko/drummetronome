class KeyValueParser {

	static parse(text,splitter) {
		if (!splitter) splitter="=";

		// get non-empty trimmed lines
		let lines = text.split('\n')
			.filter( line => (line.trim().length > 0) )
			.map( line => line.trim() );
		let result = [];
		lines.forEach(line =>{
			let idx = line.indexOf(splitter);
			if (idx===-1) result[line] = "";
			else 
				result[line.substring(0,idx).trim()] = line.substring(idx+1).trim();
		});
		return result;
	}
}

/*
* Rhythm card contains all information to play a rhythm for Instrument Rack.
* Name of the instrument, rhythm text, audio settings (gain, panorama).
*/

class RhythmCard {

	constructor() {
		this.records = {};
		this.category = "";
		this.name = "";
		this.tempo = 90;
	}

	parseSingleInstrumentRecord(text) {
		let lines = text.split('\n');
		const result = {
			instrument: '',
			gain: 1.0,
			pan: -0.5,
			rhythm: '',
		};
		let rhythmSection = false;

		lines = lines.filter( line => (line.trim().length > 0) );
		lines = lines.map( line => line.trim() );

		lines.forEach( (line,idx) => {
			if (idx===0)
				result.instrument = line.trim();
			else if (line.startsWith('gain=')) {
			  result.gain = parseFloat(line.slice(5));
			} else if (line.startsWith('pan=')) {
			  result.pan = parseFloat(line.slice(4));
			} else if ( line.startsWith('rhythm:') ) {
			  rhythmSection = true;
			  result.rhythm += line.slice(7).trim();
			} else if (rhythmSection) {
			  result.rhythm += '\n' + line.trim();
			} 
		});

		return result;
	}

	parseCaption(caption) {
		let captionObj = KeyValueParser.parse(caption, ":");
		if (captionObj.category) this.category = captionObj.category;
		if (captionObj.name) this.name = captionObj.name;
		if (captionObj.tempo) this.tempo = parseInt(captionObj.tempo);
	}

	/* Structure of text:
	category: ...
	name: ...
	tempo: ...
	#####
	Name-of-instrument
	gain=...
	pan=...
	rhythm:
	text-of-rhythm
	@@@@@
	... next instrument ...
	*/
	parseRhythmCardText(text) {

		let caption = "";
		let arrCardParts = text.split( "#####" );
		if (arrCardParts.length===2) {
			caption = arrCardParts[0];
			text = arrCardParts[1];
		} else text = arrCardParts[0]; // no caption

		this.parseCaption( caption );
		this.records = text.split( "@@@@@" ).map( record => this.parseSingleInstrumentRecord(record) );
	}
}






