

class PhraseVariations {
	constructor(arrOfStrings, limit) {
		this.count = 0;
		this.limit = limit || 2;
		this.phrases = arrOfStrings;
		this.lastCalculatedVariation = "";
		this.usedPrasesCounter = {} // key: index of the phrase, value - count, how many times it was used.
		this.maxRepetitions = -1;
	}

	prepare() {
		// make counter for each phrase (initially all phrases are used 0 times) 
		for( let i=0; i< this.phrases.length; i++)
			this.usedPrasesCounter[i] = 0;
	}

	getVariation() {
		
		// make sure we don't exceed the limit of phrases from this 
		if (this.limit > 0 && this.count===this.limit) return null;
		this.count++;
		let idx = getRandomInt(0, this.phrases.length);


		// make sure that each phrase is used less than maxRepetitions times.
		if ( this.maxRepetitions > 0) {
			let counter = 0; // to prevent infinite loop
			while ( this.usedPrasesCounter[idx] >= this.maxRepetitions && counter < this.phrases.length ) {
				idx++; if (idx === this.phrases.length) idx=0;
				counter++;
			}
		}

		this.usedPrasesCounter[idx]++; // increment number of times this phrase was used
		return this.phrases[idx];
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
	Takes text with definition of all possible variations and generates an exercise.
	Example:
		(Z O:7)/2
		***
		D, T, R, PA
		-----
		(T K)/2, (R L)/2, (D D)/2, (D L)/2, (PA D)/2, (D PA)/2, (PA PA)/2
		-----
		(T K T K)/4, (R R L L)/4, (T L L L)/4, (D L L L)/4
		-----
		(R R R R L L L L)/8, (D L L L T L L L)/8, (D L L L L T L L)/8, (D L L T L L L L)/8

	Before "***" - it is precount for rhythm. 
	Then you have different variation groups. To generate random rhythm it takes random phrase 
	from random variation group. 
	Limit tell to generator how many times each group can be used. For example, 
	if I want 8 lines of rhythm, I want only <=2 of lines to be taken from the group 1, not 3 or more.
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
	Example 1:
	!A= D L, (D L L L)/2, (D - L L)/2, (D L L -)/2, (D L - L)/2;
	!B= PA L, (PA L L L)/2, (PA - L L)/2, (PA L L -)/2, (PA L - L)/2;
	rhythm:
		D - PA -
		!A !B
		D - PA -
		!A !B
	
	Example 2:
	if you want to refer to the same variation as before, you can use !A~ - tilda remembers the last random value 
	and allows to use same value again.

	!A !A~ !A~ !B

	Formula above will give you three times same rhythm and then some random value from the group !B.

	Example 3:
	By the way same effect you can achieve with variables in the rhythm:
	
	phrase_A = !A;
	phrase_A phrase_A phrase_A !B
	*/
	static generateRandomizedRhythm( plainText, maxRepetitions ) {
		
		function parsePlainText(plainText) {
			let result = {};
			// to get rhythm formula
			const rhythmMarker = "rhythm:";
			let rhythmIdx = plainText.indexOf(rhythmMarker);

			maxRepetitions = maxRepetitions || -1;
			
			// to parse variables
			let regex = /![\s\S]*?;/g;
			// get variable definitions.
			let arrVariableDefinitions = plainText.substring(0, rhythmIdx).match(regex);
			
			// get rhythm formula and trim all lines
			result.rhythmFormula = plainText.substring( rhythmIdx + rhythmMarker.length).split("\n").map(line=>line.trim()).join("\n");
			result.variables = arrVariableDefinitions.map( definition => {
				// cut ; from the end and split by = char
				let arr = definition.substring(0, definition.length-1).split("=");
				let variationsGroup = new PhraseVariations( nonEmptyValues( arr[1].split(",") ), -1);
				variationsGroup.maxRepetitions = maxRepetitions;
				variationsGroup.prepare();
				return {
					name: arr[0].substring(1), 
					variations: variationsGroup
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
		let lastVarValue = {};
		// replace variables to random values from the corresponding phrases array
		parsedObj.variables.forEach( v => {
			let regex = new RegExp(`!${v.name}(~)?`, 'g');

			let replaceFunc = (match, tilda) => {
				if ( tilda ) {
					return lastVarValue[v.name];
				} else {
					let newVariation = v.variations.getVariation();
					lastVarValue[v.name] = newVariation;
					return newVariation;
				}
			};

			rhythm = rhythm.replace(regex, replaceFunc);
		});

		let returnObj = { rhythm: rhythm }
		if (parsedObj.precount) returnObj.precount = parsedObj.precount;

		return returnObj // the rhythm is randomized!
	}
}