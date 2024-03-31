const SYLLABLE_NOTATION_STROKE_HAS_NUMBERS = "stroke-contain-numbers";

// -----------------------------------------------------------------------------
class SyllableParser
{

	static parsingConfig = {
		syllableToSizeDelimiter: ""
	}

	static setNotation(value) {
		if ( (value ||"").trim() === SYLLABLE_NOTATION_STROKE_HAS_NUMBERS ) {
			SyllableParser.parsingConfig.syllableToSizeDelimiter = "_";
		}
		else 
			SyllableParser.parsingConfig.syllableToSizeDelimiter = "";
	}

	/*
	* Accepts string like:
	* ta
	* dum2
	* ka1/2
	* and creates Syllable object
	*/
	static createSyllable(syllText)
	{
		let syll = new Syllable();
		SyllableParser.parseSyllableText(syllText, syll);
		return syll;
	}

	/*
	Parses syllable text and stores the results to syllObj.

	Here we divide the syllable name from the size of the syllable
	2 options are possible:
	1) syllable name doesn't contain numbers, like "D", "TA" etc.
		In this case the size info will come right after the syllable name: D3, 3 is the size.
	2) syllable name contains numbers like "G1", "A3" etc.
		In this case the size info will come after "_" char: G1_2, 2 is the size.

	In both cases possible the fraction part, that can come without "_":
	G1/2, A3/3 - etc.

	How do we know, which is the case? By testing static property "parsingConfig.syllableToSizeDelimiter" 
	of SyllableParser.

	G1/2 - G1, size 1/2
	G1_/2 - same as previous
	G1_2 - G1, size 2
	A3_20/5 - A3, size 20/5
	D/2 - D, size 1/2
	D20/3 - D, size 20/3
	T3 - T, size 3
	K - K, size 1

	*/

	static parseSyllableText(syllText, syllObj)
	{
		if ( syllText === undefined || syllText == "" ) {
			return {syllable: "", fraction: new Fraction(1,1) }
		}

		syllObj.syllable = "es"; // pause by default

		const idxDivSign = syllText.indexOf("/");
		let idxSyllableEnd = -1;
		let idxSize = -1;

		// Go through all possible variations to define, where is the end of syllable and the beginning of size info
		if ( SyllableParser.parsingConfig.syllableToSizeDelimiter != "") { // by notation delimiter is defined
			let idxDelimiter = syllText.indexOf( SyllableParser.parsingConfig.syllableToSizeDelimiter ); // search for delimiter
			if (idxDelimiter >= 0) { // size part should be here
				idxSyllableEnd = idxDelimiter;
				idxSize = idxDelimiter+1;
			} else { // no delimiter found, but may be fraction part
				if ( idxDivSign >= 0 ) { // division sign / found (fraction)
					idxSize = idxDivSign;
					idxSyllableEnd = idxDivSign;
				} else { // full text is just syllable, no size info
					idxSize = -1;
					idxSyllableEnd = syllText.length;
				}
			}
		} else {
			// syllable names don't contain numbers by notation,
			// so - there is no delimiter between syllable and size
			// Example: D/2 or A2/3 or T3 or K
			let firstDigitIdx = syllText.search(/\d/); // simply search for the first digit

			if (firstDigitIdx>=0 || idxDivSign >=0) {
				idxSize = firstDigitIdx*idxDivSign < 0 ? Math.max(firstDigitIdx, idxDivSign) : Math.min(firstDigitIdx, idxDivSign);
				idxSyllableEnd = idxSize;
			}
			else { // none are present - no digit, no "/" 
				idxSize = -1;
				idxSyllableEnd = syllText.length;
			}

			/*
			if (firstDigitIdx>=0) { // found some digit!
				idxSize = firstDigitIdx;
				idxSyllableEnd = firstDigitIdx;
			} else {
				if ( idxDivSign >= 0 ) {
					idxSize = idxDivSign;
					idxSyllableEnd = idxDivSign;
				} else { // no numbers and no / sign
					idxSyllableEnd = syllText.length;
					idxSize = -1;
				}
			}*/
		}

		let sizeTxt = (idxSize === -1) ? "1" : syllText.substring(idxSize);
		if (sizeTxt.startsWith('/')) sizeTxt = `1${sizeTxt}`; // if it is /2, make it 1/2

		syllObj.syllable = (idxSyllableEnd === -1) ? "" : syllText.substring(0, idxSyllableEnd);
		syllObj.fraction = Fraction.createFromString(sizeTxt);
	}

}
// ------------------------------------------------------------------------------------

class Syllable
{
	constructor(syllText)
	{
		this.syllable = "";
		this.fraction = new Fraction();

		this.setValue(syllText);
	}

	getSize()
	{
		return this.fraction.getSize();
	}

	// Syllable + size
	// E.g.
	// "ta4" - separates "ta" and "4" and allows to change size of a phrase etc.
	setValue(syllText)
	{	
		SyllableParser.parseSyllableText(syllText, this);
	}

	equals(otherSyllable)
	{
		if (typeof otherSyllable == "string")
			otherSyllable = new Syllable( otherSyllable );

		return ( otherSyllable.syllable.toUpperCase() == this.syllable.toUpperCase() && 
				 otherSyllable.fraction.equals( this.fraction ) );
	}


	toString() {
		return this.syllable + this.sizeToString();
	}

	serialize() {
		let result = "";
		let sizeTxt = this.fraction.toString();

		if (sizeTxt=="1")
			result = this.syllable;
		else if (sizeTxt != "0")
			result = this.syllable + sizeTxt;
		return result;
	}

	sizeToString()
	{
		let fractionAsText = this.fraction.toString();
		return fractionAsText == "1" ? "" : fractionAsText;
	}

	multSize(value)
	{
		this.fraction.mult(value);
	}

	divSize(value)
	{
		this.fraction.divide(value);
	}

	clone()
	{
		let newSyll = new Syllable("");
		newSyll.syllable = this.syllable;
		newSyll.fraction = this.fraction.clone();
		
		return newSyll;
	}

}