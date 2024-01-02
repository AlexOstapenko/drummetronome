

class PhraseVariations {
	constructor(arrOfStrings) {
		this.count = 0;
		this.limit = 2;
		this.phrases = arrOfStrings;
	}

	getVariation() {
		if (this.count===this.limit) return null;
		this.count++;
		return getRandomElement(this.phrases);
	}
}


class ExerciseGenerator {
	
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
		let arrResult = [];
		plainText.split( "-----").forEach(commaSeparatedVariations => {
			let arrVariationsOfOneOption = nonEmptyValues( commaSeparatedVariations.split(",") );
			let phraseVariationsObj = new PhraseVariations( arrVariationsOfOneOption );
			phraseVariationsObj.limit = limit;
			arrResult.push( phraseVariationsObj );
		});
		return arrResult;
	}

	/*
	Takes array of PhraseVariations objects and generates an exercise 
	*/
	static generateSpeedsJugglingExercise(plainTextWithVariations, limit, numOfLines) {
		let arrPhraseVariations = ExerciseGenerator.parsePlainTextOfVariations( 
				plainTextWithVariations, limit );
		let result = "";
		for (let i=0; i < numOfLines; i++) {
			let phrase = null;
			while (!phrase) phrase = getRandomElement( arrPhraseVariations ).getVariation();
			result += phrase + "\n";
		}
		return result;
	}
}