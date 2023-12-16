class KeyValueParser {

	// splitter can be single string value or array of strings. But in each string only one of the splitters 
	// should be present.
	// it is useful if you want to provide some freedom in the format. E.g. to suppost both gain=1.5 or gain:1.5,
	// in this case you can pass splitter=[":", "="]
	static parse(text,splitter) {
		let arrSplitters = [];
		if (!splitter) 
			arrSplitters = ["="];
		else if (typeof splitter === "string" ) arrSplitters = [splitter]; // convert to array
		else if ( Array.isArray(splitter) ) arrSplitters = splitter;
		else arrSplitters = [splitter.toString()];

		// get non-empty trimmed lines
		let lines = text.split('\n')
			.filter( line => (line.trim().length > 0) )
			.map( line => line.trim() );
		let result = [];
		lines.forEach(line =>{
			let idx = -1;
			// search any of splitters (wins the first which will be found)
			for( let i=0; i < arrSplitters.length; i++ ) {
				let idxOfSplitter = line.indexOf(arrSplitters[i]);
				if ( idxOfSplitter >= 0 ) {
					idx = idxOfSplitter;
					break;
				}
			}
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
		this.records = []; // array of {instrument: ..., gain: ..., pan: ..., rhythm: ...}
		this.category = "";
		this.name = "";
		this.tempo = 90;
	}

	parseSingleInstrumentRecord(text) {

		// "rhythm:..." in text should be last one, so first cut everything before rhythm and analyzen it

		let textBeforeRhythm = "";
		let idxOfRhythm = text.indexOf( "rhythm:" );
		if (idxOfRhythm>0) textBeforeRhythm = text.substring( 0, idxOfRhythm ).trim();
		let result = KeyValueParser.parse( textBeforeRhythm, ["=", ":"] );

		// process "rhythm" separately (it should be the last value and can be multistring)
		if (idxOfRhythm===-1) idxOfRhythm = text.indexOf("rhythm=");
		if (idxOfRhythm !== -1 ) {
			result.rhythm = text.substring(idxOfRhythm + 7).trim();
		}

		// default values and type conversion
		result.instrument = result.instrument ? result.instrument : "";
		result.gain = result.gain ? parseFloat(result.gain) : 1;
		result.pan = result.pan ? parseFloat( result.pan ) : 0;
		result.mute = result.mute ? parseBool(result.mute) : false;

		return result;
	}

	parseCaption(caption) {
		let captionObj = KeyValueParser.parse(caption, [":", "="]);
		if (captionObj.category) this.category = captionObj.category;
		if (captionObj.name) this.name = captionObj.name;
		if (captionObj.tempo) this.tempo = parseInt(captionObj.tempo);
	}

	/* Structure of text:
	category: ...
	name: ...
	tempo: ...
	#####
	instrument: Name-of-instrument
	gain: ...
	pan: ...
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






