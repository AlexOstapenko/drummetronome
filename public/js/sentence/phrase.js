const SENTENCE_SPLITTER = ":";
const SENTENCE_NEW_LINE = "|";
const SENTENCE_BETWEEN_PHRASES_FOR_USER = " " + SENTENCE_SPLITTER + " ";
// const SENTENCE_BETWEEN_PHRASES_FOR_PROCESSING = " " + SENTENCE_SPLITTER + " "; // " | ";

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

	static parseSyllableText(syllText, syllObj)
	{
		if ( syllText === undefined || syllText == "" )
		{
			syllObj.syllable = "";
			syllObj.fraction = new Fraction();
		}
		else
		{
			syllObj.syllable = "es"; // pause by default

			let numIdx = syllText.search(/\d/);
			let divSignIdx = syllText.indexOf("/");

			if ( numIdx == -1 && divSignIdx == -1)
			{
				syllObj.fraction = new Fraction(1,1);
				syllObj.syllable = syllText;
			}
			else
			{
				let idx = (divSignIdx < numIdx && divSignIdx>=0) ? divSignIdx : numIdx;
				if (idx != 0)
					syllObj.syllable = syllText.substring(0, idx);

				let fractionAsText = syllText.substring(idx);
				syllObj.fraction = new Fraction(fractionAsText);
			}
		}
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


	toString(callBackSyllableToStringAgent)
	{
		let result = "";

		if (callBackSyllableToStringAgent === undefined)
		{
			let sizeText = this.sizeToString();

			if ( this.fraction.equals("1") )
				result = this.syllable.toUpperCase();
			else if ( this.fraction.getSize()>=1 )
				result = this.syllable.toUpperCase() + this.sizeToString();
			if ( this.fraction.equals("1/2") )
				result = this.syllable.toLowerCase();
			else if (this.fraction.equals("1/4"))
				result = this.syllable[0].toLowerCase();
			else // if (this.fraction.getSize() < 0.25)
				result = this.syllable.toUpperCase() + this.sizeToString();
		}
		else
			result = callBackSyllableToStringAgent(this);

		return result;
	}

	serialize()
	{
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
* Example: "ta ki ta", "(ta2 ka2 (dum2taka)/2)/2" etc.
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

		text = text.trim();
		this.elements = [];
		if ( !(text === undefined) && text.length > 0 )
		{
			if (separator === undefined) separator = " ";

			let cmdParser = new CommandParser();
			let commands = cmdParser.splitCommands(text, true, separator);
			
			let me = this;
			commands.forEach(function(cmdText,idx,thisArr)
			{
				let arr = me.parseData(cmdText);
				if (Array.isArray(arr)) me.elements = me.elements.concat( arr );
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