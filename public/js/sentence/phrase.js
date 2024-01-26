const SYLLABLE_NOTATION_STROKE_HAS_NUMBERS = "stroke-contain-numbers";
const MULTI_STROKE_JOINT = '-';
const SENTENCE_SPLITTER = ":";
const SENTENCE_NEW_LINE = "|";
const SENTENCE_BETWEEN_PHRASES_FOR_USER = " " + SENTENCE_SPLITTER + " ";
// const SENTENCE_BETWEEN_PHRASES_FOR_PROCESSING = " " + SENTENCE_SPLITTER + " "; // " | ";

function isPause(stroke) {
    return stroke === "–";
}

class UIDGenerator
{
	constructor()
	{
		this.counter = 0;
	}

	generateUID()
	{
		return this.counter++;
	}
}

var uidGen = new UIDGenerator();

/*

*
trkt -> ta ri ki ta ->  ta2 ri2 ki2 ta2 -> ta3 ri3 ki3 ta3
*/

const SEPARATOR_NEWLINE = 0;
const SEPARATOR_SPACE = 1;

// ------------------------------------------------------------------------------------

class Separator
{
	constructor(sepType)
	{
		this.type = (sepType === undefined ? SEPARATOR_NEWLINE : sepType);
		this.elements = [];
	}

	isSeparator()
	{
		return true;
	}

	isNewLine()
	{
		return this.type == SEPARATOR_NEWLINE;
	}

	isSpace()
	{
		return this.type == SEPARATOR_SPACE;
	}

	numOfSyllables()
	{
		return 0;
	}

	clone()
	{
		let sep = new Separator(this.type);
		return sep;
	}

	getSize()
	{
		return 0;
	}

	toString()
	{
		return SENTENCE_NEW_LINE;
	}

}

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
			// syllables don't contain numbers by notation,
			// so - there is no delimiter between syllable and size
			let firstDigitIdx = syllText.search(/\d/); // simply search for the first digit
			
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
			}
		}

		syllObj.syllable = (idxSyllableEnd === -1) ? "" : syllText.substring(0, idxSyllableEnd);
		syllObj.fraction = (idxSize === -1) ? new Fraction(1,1) : new Fraction( syllText.substring(idxSize) );
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

//////////////////////////////////////////////////////////////////////////////
/* 
* Phrase is a single unit that combines several syllables (each of them can have it's own size).
* Unlike sentence, phrase doesn't contain separators. 
* Example: "ta ki ta", "(ta2 ka2 (dum2 taka)/2 )/2" etc.
* Also it can contain such modifier as ":" - repetition.
* For example: D:3 T:3 S2 will be treated as: D D D T T T S -
* You can use repetition for brackets: (D3 T3 S2):4 will repeat the 3 3 2 rhythm 4 times.
* Brackets and repetitions can be nested up to any depth.
*/
class Phrase
{
	constructor(text)
	{
		this.separator = " ";
		this.elements = [];
		if (text && text.trim() != "")
			this.setText(text, this.separator);	
	}

	isSeparator()
	{
		return false;
	}

	setText(text, separator)
	{

		function parseSingleCmd(parentPhrase, cmdText, ) {
			let arr = parentPhrase.parseData(cmdText);
			if (Array.isArray(arr)) { 
				parentPhrase.elements = parentPhrase.elements.concat( arr );
			}
		}

		text = text.trim();
		this.elements = [];
		if ( !(text === undefined) && text.length > 0 )
		{
			if (separator === undefined) separator = " ";

			let cmdParser = new CommandParser();
			let commands = cmdParser.splitCommands(text, false, separator);
			
			commands.forEach( (cmd,idx,thisArr) => {
				let arrItemsToParse = [];
				let repetitionsInfo = cmd.splitByModifier(":");
				let textBeforeModifier = repetitionsInfo[0];
				let numOfCopies = toInteger( repetitionsInfo[1] );
				if (!numOfCopies) numOfCopies = 1;
				
				arrItemsToParse = Array.from( { length: numOfCopies }, () => textBeforeModifier );
				arrItemsToParse.forEach( item => {
					parseSingleCmd( this, item );	
				});				
			});
		}
	}

	// Processes single data, wether single syllable (with it's size info) 
	// or a block "(...)" also with size info
	parseData(txt)
	{
		txt = txt.trim();
		if (txt.length==0) return null;

		let result = [];
		let fraction = "1";

		if (txt[0]=='(')
		{
			let cmd = new Command(txt);

			// TODO: change to process also :N after "()"
			// e.g. (D T K T)/2:4 - repeat 4 times all phrase
			// or many lines:
			/*
			(
				D K T K
				D:4 T:4
			):2

			will become

			D K T K D D D D T T T T 
			D K T K D D D D T T T T 
			*/


			// process the inner space of the brackets
			let indexes = cmd.getBracketIndexes('(');
			let bracketData = "";
			if (indexes.idx1 >=0 && indexes.idx2 > 0)
			{
				bracketData = txt.substring(indexes.idx1+1, indexes.idx2);
				if (indexes.idx2 < txt.length-1 )
					fraction = txt.substring(indexes.idx2+1);
			}

			let ph = new Phrase(bracketData);
			ph.multSize(fraction);

			result = ph.elements;
		}
		else
		{
			result = [new Syllable(txt) ];
		}			

		return result;
	}

	equals(otherPhrase)
	{
		if (typeof otherPhrase == "string" )
			otherPhrase = new Phrase( otherPhrase);

		let result = false;
		if (otherPhrase.numOfSyllables() == this.numOfSyllables())
		{
			let doContinue = true;
			for(let i=0, L = this.elements.length; i < L && doContinue; i++ )
			{
				if (!this.elements[i].equals(otherPhrase.elements[i]))
					doContinue = false;
			}

			result = doContinue;
		}
		return result;
	}


	numOfSyllables()
	{
		return this.elements.length;
	}

	/*
	syllable - instance of class Syllable.
	*/
	add(syllable)
	{
		this.elements.push(syllable);
	}

	toString()
	{
		/*
		let result = "";
		for(let i=0; i < this.elements.length; i++)
		{
			let el = this.elements[i];
			if(result!= "") result += " ";
			result += el.toString();
		}
		return result;*/
		return this.toHumanString();
	}

	toHumanString(callBackSyllableToStringAgent)
	{
		let result = "";
		let doSeparate = false;
		let prevSize = null;
		for(let i=0; i < this.elements.length; i++)
		{
			let el = this.elements[i];

			// do separate (add " " if):
			// 1) prevSize is different from current size
			// 2) if current size == N/2 or N
			doSeparate =
				(el.fraction.denom == 2 || 
				el.fraction.getSize() >= 1 ||
				(prevSize!= null && !prevSize.equals(el.fraction) ));
				
			prevSize = el.fraction;

			result += ((doSeparate && result!="") ? " ": "") + 
						el.toString(callBackSyllableToStringAgent);
		}
		return result;
	}


	/*toHumanString(callBackSyllableToStringAgent)
	{
		let result = "";
		let prevSize = null;

		for(let i=0; i < this.elements.length; i++)
		{
			let el = this.elements[i];

			
			if (result != "" && prevSize != null && 
				( !prevSize.equals( el.fraction ) || 
				  !prevSize.equals("1/2") || 
				  !prevSize.equals("1/4") 
				) 
			) 
				result += " ";
			prevSize = el.fraction;

			if (result != "" && ( el.getSize()>=1 || el.fraction.equals("1/2") ) ) 
				result += " ";

			let ending =
				(el.fraction.equals("1/2") || el.fraction.equals("1/4") || i < (this.elements.length-1) ) ? "" : " ";


			result += el.toString(callBackSyllableToStringAgent);// + ending;
		}
		return result;
	}*/

	serialize()
	{
		let result = "";
		for(let i=0; i < this.elements.length; i++)
		{
			let el = this.elements[i];
			if(result!= "") result += " ";
			result += el.serialize(); 
		}
		return result;
	}

	multSize(mult)
	{
		for(let i=0; i < this.elements.length; i++)
			this.elements[i].multSize(mult);
		return this;
	}

	clone()
	{
		let ph = new Phrase("");

		for(let i=0; i < this.elements.length; i++)
		{
			let el = this.elements[i].clone();
			ph.elements.push( el );
		}

		return ph;
	}

	getSize(inFractionFormat)
	{
		let result = 0;

		if (inFractionFormat)
			result = new Fraction(0);

		for(let el of this.elements)
		{
			if (inFractionFormat)
				result.plus(el.fraction);
			else
				result += el.getSize();
		}

		return result;
	}

	/*
	* Cuts n syllables. If n is positive - from the top, if n is negative - from the end.
	* E.g. (ta ka ta ki ta).cut(2) = (ta ki ta)
	* E.g. (ta ka di mi).cut(-2) = (ta ka)

	*/
	cut(n)
	{
		let result = [];
		let nabs = Math.abs(n);
		if (nabs < this.elements.length)
		{
			let startIdx = nabs;
			let idxLimit = this.elements.length;

			if (n < 0)
			{
				startIdx = 0;
				idxLimit = this.elements.length - nabs;
			}

			for(let i=startIdx; i < idxLimit; i++)
			{
				result.push(this.elements[i]);
			}
		}
		this.elements = result;

		return this;
	}
}