

/*
* ----------------------------------------------------------------- SENTENCE CLASS
*/

class Sentence
{
	constructor()
	{
		this.elements = [];
		this.separatorString = SENTENCE_NEW_LINE; // SENTENCE_BETWEEN_PHRASES_FOR_PROCESSING;
		this.stringBetweenPhrases = SENTENCE_BETWEEN_PHRASES_FOR_USER;
		this.uid = uidGen.generateUID();
		this.originalString = "";
	}

	static createFromString(text, stringBetweenPhrases)
	{
		let result = new Sentence();
		let newPhraseMarker = "-#NEWPHRASE#-";
		let textSeparator = SENTENCE_SPLITTER;
		let textFixed = text.split(SENTENCE_NEW_LINE).
								join(newPhraseMarker).
									split(textSeparator).
										join(newPhraseMarker);

		let arr = removeEmptyElements( trimArray( textFixed.split(newPhraseMarker) ) );
		for(let el of arr)
			result.add(this.createElementFromString(el));
		
		if (!(stringBetweenPhrases === undefined))
			result.setStringBetweenPhrases(stringBetweenPhrases);

		result.originalString = text;
		return result;
	}

	// In an new sentence each sentence of a given array becomes one single phrase.
	// if onPhraseBasis is defined, adds phrase by phrase.
	static createOneSentence(arrSentences, onPhraseBasis, doAddSeparator)
	{
		let result = null;

		if (arrSentences.length == 1)
			result = arrSentences[0].clone();
		else
		{
			result = new Sentence();
			result.setStringBetweenPhrases(SENTENCE_SPLITTER);

			for(let i = 0; i <arrSentences.length; i++)
			{
				if (onPhraseBasis)
				{
					// add sentences phrase by phrase to a new sentence
					let it = new SentenceIterator(arrSentences[i]);
					let ph = it.gotoFirstPhrase();
					while(ph != null)
					{
						result.add(ph);	
						ph = it.getNextPhrase();
					}
					if( doAddSeparator && i != (arrSentences.length-1) )
						result.add(new Separator());
				}
				else
				{		
					// put all syllables of current sentence into one phrase, ignoring separators
					let ph = new Phrase();
					let it = new SentenceIterator(arrSentences[i]);
					let syll = it.gotoFirstSyllable();
					while(syll != null)
					{
						ph.add(syll);
						syll = it.getNextSyllable();
					}

					if (ph.elements.length > 0)
					{
						result.add(ph);
						if (doAddSeparator && i != (arrSentences.length-1) )
							result.add(new Separator());
					}
				}
				
			}
		}
		return result;
	}

	static createSeparatorSentence()
	{
		let result = new Sentence();
		result.add(new Separator());
		return result;
	}

	/*
	* txt should contain whether phrase or separator not both of them
	*/
	static createElementFromString(txt)
	{
		let result = null;
		if (txt.trim() == SENTENCE_NEW_LINE)
			result = new Separator();
		else
			result = new Phrase(txt);
		return result;
	}

	clone()
	{
		let result = new Sentence();
		for(let el of this.elements)
		{
			result.add( el.clone() );
		}

		result.separatorString = this.separatorString;
		result.stringBetweenPhrases = this.stringBetweenPhrases;
		result.originalString = this.originalString;
		return result;
	}

	/*
	* Reverses the order of all phrases in this sentence. This method creates new sentence 
	* and doesn't affect the current one.
	*/
	reverse()
	{
		let stack = new Stack();
		let it = new SentenceIterator(this);
		let ph = it.gotoFirstPhrase();
		while(ph != null)
		{
			stack.push(ph);
			ph = it.getNextPhrase();
		}
		let result = new Sentence();
		while(stack.size()>0)
			result.add(stack.pop().clone());
		return result;
	}

	/*
	* Shifts the sencence on a phrase basis by specified num of steps.
	* if num is positive shifts to the left, negative - to the right.
	* Creates new sentence and doesn't affect this one.
	* E.g. {A B C D E}.shift(2)  => C D E A B
	*	   {A B C D E}.shift(-1) => E A B C D 
	*/
	shift(num)
	{
		if (num==0) return this.clone();
		
		let result = new Sentence();
		let numOfSteps = this.elements.length;
		let startIdx = num>0 ? num : (parseInt(numOfSteps) + parseInt(num));
		for(let i=0; i < numOfSteps; i++)
		{
			let idx = (startIdx + i) % numOfSteps;
			result.add(this.elements[idx]);
		}
		return result;
	}

	/*
	* Sentence usually consists of phrases and separators, so
	* element could be instance of Phrase or Separator.
	*/
	add(element, fromBeginning)
	{
		if (typeof element == "string")
		{
			element = Sentence.createElementFromString(element);
		}

		if ( element instanceof Phrase || element instanceof Separator)
		{
			if (fromBeginning)
				this.elements.unshift(element);
			else
				this.elements.push(element);
		}
		return this;
	}

	/*
	* Instead of a phrase by given index (separators are skipped) 
	* you can insert new phrase or sentence 
	* (which contains one or several phrases) as a newPart param.
	* It is accepted if you pass instance of Phrase or Sentence here.
	*/
	replacePhrase(idx, newPart)
	{
		if (idx >= this.numOfPhrases() || idx < 0) return;

		let newSentence = null;
		if (newPart instanceof Phrase)
		{
			newSentence = new Sentence();
			newSentence.add(newPart);
		}
		else if (newPart instanceof Sentence)
			newSentence = newPart;
		else
			return;

		let newElements = [];
		let it = new SentenceIterator(this);
		let ph = it.gotoFirstPhrase();
		let counter = 0;
		while(ph != null)
		{
			if (!ph.isSeparator())
			{
				if (idx == counter)
					newElements = newElements.concat( newSentence.elements );
				else
					newElements.push( ph );

				counter++;
			}
			ph = it.getNextPhrase();
		}

		this.elements = newElements;
	}

	/*
	* Converts this sentence into a single phrase.
	*/
	toPhrase()
	{
		let result = new Phrase();
		let it = new SentenceIterator(this);
		let syll = it.gotoFirstSyllable();
		while(syll != null)
		{
			result.add(syll);
			syll = it.getNextSyllable();
		}
		return result;
	}

	numOfSyllables()
	{
		let result = 0;
		for(let el of this.elements)
		{
			if (!el.isSeparator())
				result += el.numOfSyllables();
		}
		return result;
	}

	numOfPhrases()
	{
		let result = 0;
		this.elements.forEach(function(item,idx,arr)
		{
			if ( !item.isSeparator() && item.numOfSyllables() > 0 )
				result++;
		});
		return result;	
	}

	isEmpty()
	{
		return this.numOfSyllables()==0;
	}

	getNumOfLineBreaks()
	{
		let result = 0;
		for(let el of this.elements)
		{
			if (el.isSeparator() && el.isNewLine())
			{
				result++;
			}
		}
		return result;
	}

	join(anotherSentence)
	{
		for(let el of anotherSentence.elements)
		{
			this.add(el.clone());
		}
		return this;
	}

	multSize(mult)
	{
		for(let el of this.elements)
		{
			if(!el.isSeparator())
				el.multSize(mult);
		}
		return this;
	}

	/*
	* By this method you can "touch" any particular syllable and change it's duration.
	* Operation could be one of: * / +
	* E.g. sentence = ta ki ta | ta ka
	* syllIdx=1 (ki), operation = "*", fraction = "1/2" - sentence will become: ta ki1/2 ta | ta ka
	*
	* Returns sentence itself (this);
	*/
	changeDurationOfSyllable(syllIdx, operation, fraction)
	{
		let it = new SentenceIterator(this);
		let syll = it.gotoSyllable(syllIdx);
		if (syll != null)
		{
			if (operation == "*")
				syll.fraction.mult(fraction);
			else if (operation == "/")
				syll.fraction.divide(fraction);
			else if (operation == "+")
				syll.fraction.plus(fraction);
		}
		return this;
	}

	toString(showHumanString)
	{
		let result = "";
		for(let i=0; i < this.elements.length; i++)
		{
			if (i > 0)
				result += this.stringBetweenPhrases;

			if (this.elements[i].isSeparator())
				result += this.separatorString;
			else
			{
				result += showHumanString ? this.elements[i].toHumanString() : this.elements[i].toString();
			}

			
		}

		return result;
	}

	// Store sentence in a string so it could be recovered later into equal Sentence object
	serialize()
	{
		let sent = this.clone();
		sent.setStringBetweenPhrases(SENTENCE_SPLITTER);
		sent.setSeparatorString( SENTENCE_NEW_LINE );

		let result = "";
		for(let i=0; i < sent.elements.length; i++)
		{
			if (result != "")
					result += sent.stringBetweenPhrases;

			if (sent.elements[i].isSeparator())
				result += sent.separatorString;
			else
				result += sent.elements[i].serialize();
		}

		return result;
	}

	setSeparatorString(s)
	{
		this.separatorString = s;
	}

	setStringBetweenPhrases(s)
	{
		this.stringBetweenPhrases = s;
	}

	getSize(inFractionFormat)
	{
		let result = new Fraction(0);
		let it = new SentenceIterator(this);
		let syll = it.gotoFirstSyllable();
		while(syll != null)
		{
			result.plus(syll.fraction);
			syll = it.getNextSyllable();
		}
		if(!inFractionFormat) result = result.getSize();
		return result;
	}

	/*
	* Cuts n syllables. If n is positive - from the top, if n is negative - from the end.
	* E.g. (ta ka di mi | ta ki ta)
	{A B}.cut(2) | {A B}.cut(4) -> (di mi | ta ki ta) | (ta ki ta)

	ta ka | ta ki ta | ta ki ta
	6

	*/
	cut(n)
	{
		if (n != 0)
		{
			let newElements = [];
			let counter = 0;
			let nabs = Math.abs(n);
			let addTheRest = false;

			let dir = +1;
			let startIdx = 0;
			let idxLimit = this.elements.length;
			let fooLoopCondition = function(idx, limit){ return idx < limit;}

			if (n < 0)
			{
				dir = -1;
				startIdx = this.elements.length-1;
				fooLoopCondition = function(idx, limit){ return idx >= limit;}
				idxLimit = 0;
			}

			for(let i=startIdx; fooLoopCondition(i, idxLimit); i = i + dir)
			{
				let el = this.elements[i];

				if (addTheRest)
				{
					// nothing to think more - add all the rest of elements
					if (dir > 0)
						newElements.push(el);
					else
						newElements.unshift(el);
				}
				else
				{
					if (el.isSeparator())
					{
						newElements.push(el);
					}
					else
					{
						let numOfSyll = el.numOfSyllables();

						counter += numOfSyll;
						if (counter > nabs)
						{
							let numToCutInPhrase = numOfSyll - ( counter - nabs );
							el.cut( dir * numToCutInPhrase );
							newElements.push(el);
							addTheRest = true;
						}
					}
				}
			}
			this.elements = newElements;
		}

		return this;
	}

	/*
	* Opposite to "cut" - leaves specified number of syllables and removes others.
	* if n is positive - leaves from top, negative - from the end.
	* E.g. (ta ki ta | ta ki ta | ta ka).leave(6) -> (ta ki ta | ta ki ta)
		   (ta ki ta | ta ki ta | ta ka).leave(-2) -> (ta ka)
	*/
	leave(n)
	{
		let numOfSyll = this.numOfSyllables();
		let nabs = Math.abs(n);
		let dir = (n<0 ? -1 : 1)
		if (nabs < numOfSyll)
		{
			if (nabs == 0)
				this.elements = [];
			else
			{
				this.cut( -dir*(numOfSyll-nabs) );
			}
		}

		return this;
	}

	removeSeparators()
	{
		let arrNew = [];
		this.elements.forEach(function(item, idx, arr)
		{
			if (!item.isSeparator())
				arrNew.push(item);
		});
		this.elements = arrNew;
	}

	/*
	Creates an array of fractions for each phrase of a sentence
	*/
	sizesArray()
	{
		let result = [];
		let it = new SentenceIterator(this);
		let el = it.gotoFirstPhrase();
		while(el != null)
		{
			result.push( el.getSize(false) );
			el = it.getNextPhrase();
		}
		return result;
	}
}

/* 
* -------------------------------------------------------------------- SENTENCE ARRAY class 
* Iterates through all meaningful (non-separators) 
* syllables of a sentence
*/
class SentenceIterator
{
	constructor(sentence, ignoreSeparators)
	{
		this.sentence = sentence;
		this.phraseIdx = 0;
		this.syllIdx = 0;
		this.justStartedNewPhrase = true;
		this.ignoreSeparators = ( ignoreSeparators===undefined ? false : ignoreSeparators);
	}

	gotoFirstSyllable()
	{
		this.justStartedNewPhrase = true;
		this.phraseIdx = 0;
		this.syllIdx = 0;
		let result = null;

		// stand to the first meaningful syllable
		if (this.sentence.numOfSyllables() > 0)
		{
			let nothingFound = false;
			while(this.getCurrentPhrase().isSeparator() && !nothingFound)
			{
				this.gotoNextPhrase();
				if (this.wasLastPhrase())
					nothingFound = true;
			}
			if(!nothingFound) 
				result = this.getCurrentSyllable();
		}
		return result;
	}

	/*
	* Returns n-th syllable in a sentence or null is sentence has less syllables than n.
	*/
	gotoSyllable(n)
	{
		let counter = 0;
		let syll = this.gotoFirstSyllable();
		while(syll != null && counter < n)
		{
			syll = this.getNextSyllable();
			counter++;
		}
		return syll;
	}

	getNextSyllable()
	{
		let result = null;

		if (!this.wasLastPhrase())
		{
			let doSearchSyllable = true;
			while(doSearchSyllable)
			{
				// shift to next
				this.gotoNextSyll();
				if ( this.wasLastSyllable() )
				{
					this.gotoNextPhrase();
					if (this.wasLastPhrase())
						doSearchSyllable = false;
				}
				else
					this.justStartedNewPhrase = false;

				if ( doSearchSyllable && !this.getCurrentPhrase().isSeparator() ) 
				{
					result = this.getCurrentSyllable();
					doSearchSyllable = false;
				}
			}
		}
		return result;
	}

	/*
	* Returns n-th phrase in a sentence or null is sentence has less phrases than n.
	*/
	gotoPhrase(n)
	{
		let counter = 0;
		let ph = this.gotoFirstPhrase();
		while(ph != null && counter < n)
		{
			ph = this.getNextPhrase();
			counter++;
		}
		return ph;
	}

	gotoFirstPhrase()
	{
		this.justStartedNewPhrase = true;
		this.phraseIdx = 0;
		this.syllIdx = 0;
		let result = null;
		if (this.sentence.elements.length > 0)
			result = this.getCurrentPhrase();

		if (result != null && result.isSeparator() && this.ignoreSeparators)
			result = this.skipSeparators();
		
		return result;
	}

	// skips separators starting from the current phrase and returns new current phrase
	skipSeparators()
	{
		let result = this.wasLastPhrase() ? null : this.getCurrentPhrase();
		if (result != null && result.isSeparator() )
		{
			while(result != null && result.isSeparator())
				result = this.getNextPhrase();
		}

		return result;
	}

	getNextPhrase()
	{
		let result = null;

		this.gotoNextPhrase();
		if (!this.wasLastPhrase())
			result = this.ignoreSeparators ? this.skipSeparators() : this.getCurrentPhrase();

		return result;
	}

	///// TECHNICAL FUNCTIONS - don't use them in a client code. 

	gotoNextSyll()
	{
		this.syllIdx++;
	}

	// COULD BE SEPARATOR
	gotoNextPhrase()
	{
		this.justStartedNewPhrase = true;
		this.phraseIdx++;
		this.syllIdx=0;
	}

	getCurrentSyllable()
	{
		return this.getCurrentPhrase().elements[this.syllIdx];
	}

	getCurrentPhrase()
	{
		return this.sentence.elements[this.phraseIdx];
	}

	wasLastPhrase()
	{
		return (this.phraseIdx > (this.sentence.elements.length-1) );
	}

	wasLastSyllable()
	{
		let result = this.getCurrentPhrase().isSeparator();
		if (!result)
			result = (this.syllIdx > (this.getCurrentPhrase().elements.length-1) )
		return result;
	}
}

/* 
* -------------------------------------------------------------------- SENTENCE ARRAY class 
*/
class SentenceArray
{
	constructor(arr)
	{
		this.elements = [];
		if ( !(arr===undefined) && arr != null )
		{
			if (arr instanceof Sentence)
				arr = [arr];

			for(let el of arr)
				this.elements.push(el);
		}
	}

	getNumOfLineBreaks()
	{
		let result = 0;
		for(let sent of this.elements)
			result += sent.getNumOfLineBreaks();
		return result;
	}

	getNumOfNonEmptySentences()
	{
		let result = 0;
		for(let sent of this.elements)
			if (sent.getNumOfLineBreaks() != sent.elements.length)
				result++;

		return result;
	}

	add(sentence)
	{
		this.elements.push(sentence);
	}

	getSize(inFractionFormat)
	{
		let result = new Fraction(0);
		for(let sent of this.elements)
		{
			let currSize = sent.getSize(true);
			result.plus(currSize);	
		}
		if (!inFractionFormat) result = result.getSize();
		return result;
	}

	clone()
	{
		let newArr = new SentenceArray();
		for(let el of this.elements)
			newArr.add( el.clone() );
		return newArr;
	}

	toString(separator)
	{
		let result = "";
		for(let el of this.elements)
			result += (result == "" ? "" : (separator === undefined?" ":separator)) + el.toString();

		return result;
	}

	processEach(callBack)
	{
		for(let sent of this.elements)
			callBack(sent);
	}
	
}






