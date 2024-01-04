

class PhraseVariations {
	constructor(arrOfStrings, limit) {
		this.count = 0;
		this.limit = limit || 2;
		this.phrases = arrOfStrings;
	}

	getVariation() {
		if (this.limit >0 && this.count===this.limit) return null;
		this.count++;
		return getRandomElement(this.phrases);
	}
}


class ExerciseGenerator {
	
	static TYPE = {
		speedJuggling : 1,
		rhythmRandomizer : 2
	}

	/*
	Plain text should be of this format:
		phraseA-1, phraseA-2, praseA-3, ...
		-----
		phraseB-1, phraseB-2, ...
		-----
		...

	Creates an array of PhraseVariations objects
	*/
	static parsePlainTextOfVariations(plainText, limit) {

		let precount = "";
		let arr = plainText.split( "***" );
		if (arr.length === 2) {
			precount = arr[0].trim();
			plainText = arr[1].trim();
		}

		let arrResult = [];
		plainText.split( "-----").forEach(commaSeparatedVariations => {
			let arrVariationsOfOneOption = nonEmptyValues( commaSeparatedVariations.split(",") );
			let phraseVariationsObj = new PhraseVariations( arrVariationsOfOneOption );
			phraseVariationsObj.limit = limit;
			arrResult.push( phraseVariationsObj );
		});

		return {variations: arrResult, precount: precount };
	}

	/*
	Takes array of PhraseVariations objects and generates an exercise 
	*/
	static generateSpeedsJugglingExercise(plainTextWithVariations, limit, numOfLines) {
		let parseResult = ExerciseGenerator.parsePlainTextOfVariations( 
							plainTextWithVariations, limit );
		let arrPhraseVariations = parseResult.variations;
		let rhythmText = "";
		for (let i=0; i < numOfLines; i++) {
			let phrase = null;
			while (!phrase) phrase = getRandomElement( arrPhraseVariations ).getVariation();
			rhythmText += phrase + "\n";
		}
		return {rhythm: rhythmText, precount: parseResult.precount };
	}

	/*
	Variables are defined by !<name>= without spaces, then comma separated array of strings, in the end should be ;
	After "rhythm:" should be formula of rhythm. Where you need random value of a variable, use !<name>.
	Example:
	!A= D L, (D L L L)/2, (D - L L)/2, (D L L -)/2, (D L - L)/2;
	!B= PA L, (PA L L L)/2, (PA - L L)/2, (PA L L -)/2, (PA L - L)/2;
	rhythm:
		D - PA -
		!A !B
		D - PA -
		!A !B
	*/
	static generateRandomizedRhythm( plainText ) {
		
		function parsePlainText(plainText) {
			let result = {};
			let regex = /![\s\S]*?;/g;
			// get variable definitions.
			let arrVariableDefinitions = plainText.match(regex);
			
			// get rhythm formula
			const rhythmMarker = "rhythm:";
			let rhythmIdx = plainText.indexOf(rhythmMarker);
			
			// get rhythm formula and trim all lines
			result.rhythmFormula = plainText.substring( rhythmIdx + rhythmMarker.length).split("\n").map(line=>line.trim()).join("\n");
			result.variables = arrVariableDefinitions.map( definition => {
				// cut ; from the end and split by = char
				let arr = definition.substring(0, definition.length-1).split("=");
				return {
					name: arr[0].substring(1), 
					variations: new PhraseVariations( nonEmptyValues( arr[1].split(",") ), -1)
				}
			});

			let arrCheckPrecount = result.rhythmFormula.split("***");
			if (arrCheckPrecount.length === 2) {
				result.precount = arrCheckPrecount[0].trim();
				result.rhythmFormula = arrCheckPrecount[1].trim();
			}

			return result;
		}

		// get the rhythm formula and phrase variation arrays
		let parsedObj = parsePlainText( plainText );
		let rhythm = parsedObj.rhythmFormula;
		// replace variables to random values from the corresponding phrases array
		parsedObj.variables.forEach( v => {
			let regex = new RegExp(`!${v.name}`, 'g');
			rhythm = rhythm.replace(regex, v.variations.getVariation.bind(v.variations));
		});
		let returnObj = { rhythm: rhythm }
		if (parsedObj.precount) returnObj.precount = parsedObj.precount;

		return returnObj // the rhythm is randomized!
	}
}