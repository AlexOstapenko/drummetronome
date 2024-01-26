/*

Example 1:

D K :3 T2 ( (D K T K)/2 :4 T K ):2
translate it to something like this
<1~3> D K </1> T2 <3~2>( <2~4>(D K T K)/2</2> T K )</3~2>
and finally:

D K D K  // from <1>
T2
// 2 times from <3>
(D K T K)/2 (D K T K)/2 (D K T K)/2 (D K T K)/2 // from <2>
T K
(D K T K)/2 (D K T K)/2 (D K T K)/2 (D K T K)/2 // from <2>
T K

Example 2:

D ( T K :3 ) :2
will be converted to

D (T K T K T K) D (T K T K T K)
if [A] = D, [B] = ( T K :3 )
then it is [A] [B] :2, which means [A] [B] [A] [B]


Example 3:

D K :2 
(T K D : 2 K:2) :2



So - expression can be: 
- plain - without any repetition operation
- set of other expressions


Разных ударов будет около 10, но мы возьмем только 2 для примера: D и T.
Также в записи ритма будет возможность указать повторение - через знак двоеточия ":"
Также будет возможность брать выражения в скобки ( ... ), чтобы придать контекст и/или сгруппировать выражения.

Есть два варианта, как мы можем указать повторение:
1) специфичный, когда мы пишем двоеточие около удара или выражения в скобках без пробела. 
Пример 1:
D:2 - это значит, надо D повторить дважды, получится: D D.
Пример 2:
(D T):3 - тут мы повторяем трижды все, что в скобках, получится: D T D T D T.

2) неспецифичный знак повторения. Тоже двоеточие, но перед ним стоит пробел. 
В этом случае мы повторем все, что стоит перед этим двоеточием, но не выходя за рамки блока, где стоит этот оператор.
Под блоком я имею в виду либо текущую строку, либо содержимое скобок, если неспецифичный оператор ":" встретился внутри скобок,
либо этот оператор заканчивает свое действие, когда левее его встретится предыдущий неспецифичный оператор. Смотри примеры.

Пример 1:
D T :2 
тут ":2" не привязан к T, так как написан через пробел. Значит, :2 относится ко всему выражению "D T", 
поэтому результатом будет: D T D T.
Пример 2:
T ( D T T :3) 
тут у нас неспецифичный оператор :3 стоит внутри скобок, поэтому его действие распространяется только на D T T. 
Итоговая фраза должна получиться: T (D T T) (D T T) (D T T). В скобки я взял для наглядности.
Пример 3 - несколько неспецифичных операторов в строке:
D T :2 T D D :3 T :5
тут первый ":2" относится в "D T", второй оператор - ":3" относится к "T D D", а третий оператор ":5" относится к T,
итого должно получиться: (D T) (D T) (T D D) (T D D) (T D D) T T T T T
*/

class ExpressionParser {

	static NOTATION_STROKE_CONTAIN_NUMBERS = "stroke-contain-numbers";

	constructor() {
		this.varValueInBrackets = true;
	}

	/*
	In the beginning you can define variables. For example:
	A = (D K T K)/2 (D K):2 T (K K)/2;
	A A/2:2

	So after this text all "A"'s will be replaced with "(value of A)"
	Variables are expected as first part of any text rhythm
	*/
	parseVariables(text) {
		// check what is before and afer the given indexes
	    function isSeparateWord(text, startIndex, endIndex) {
	          const varAllowedChars = "_"+
	      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"+
	      "абвгдеёжзийклмнопрстуфхцышщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"; // Список допустимых символов в словах
	      const charBefore = text[startIndex - 1] || '';
	      const charAfter = text[endIndex] || '';

	      return (
	        varAllowedChars.includes(text[startIndex]) && // Первый символ слова
	        (!varAllowedChars.includes(charBefore) || charBefore === '') && // Проверка, что перед словом нет другой буквы
	        (!varAllowedChars.includes(charAfter) || charAfter === '') // Проверка, что после слова нет другой буквы
	      );
	    }

	   let replaceVar = ( text, varName, varValue) => {
	        let startIdx = 0;
	        let result = "";
	        let idx = text.indexOf(varName, startIdx);
	        while (idx>=0) {
	            let endIdx = idx + varName.length;
	            if ( isSeparateWord(text, idx, endIdx) ) {
	            	if ( this.varValueInBrackets )
						text = text.substring(0, idx) + ' (' + varValue.trim() +')' + text.substring( endIdx ); 
					else
						text = text.substring(0, idx) + varValue.trim() + text.substring( endIdx ); 
	            } else startIdx = endIdx;
	            idx = text.indexOf(varName, startIdx);
	        }
	        return text;
	    }

		let processFirstVariable = (text) => {
			let idx = text.indexOf( "=" );
			if (idx===-1) return text;

			// get the variable name from the position of "=" till the beginning of current line
			let doContinue = true;
			let varName = "";
			for( let i=idx-1; doContinue; i--) {
				let currChar = text.charAt(i);
				if ( !/\s/.test(currChar) && currChar!='\n') varName = currChar + varName;
				doContinue = !(currChar==='\n' || i===0);
			}
			
			// get variable value from "=" char to ";" char
			let idxSemicolon = text.indexOf(';');
			if (idxSemicolon===-1) throw new SyntaxError(`Semicolon ';' not found in variable ${varName} declaration.`)
			let varValue = text.substring(idx+1, idxSemicolon);

			// get rest of the string
			let restOfText = text.substring( idxSemicolon+1 ).trim();

			//replace all [varName] to [varValue]
			doContinue = true;
			do {
				let replaced = replaceVar(restOfText, varName, varValue);
				doContinue = (replaced !== restOfText);
				restOfText = replaced;
			} while (doContinue);

			return restOfText;
		}

		// replace all variables to their values
		let doContinue = true;
		let processed = text;
		do {
			let currProcessed = processFirstVariable(processed);
			doContinue = ( currProcessed !== processed);
			processed = currProcessed;
		}while(doContinue);

		return processed;
	}

	// Parses the expression
	parse(text) {

		// first parse variables
		text = this.parseVariables(text);

		// array, here we'll collect info about each tag as object: {tagName: , numOfRepetitions: }
		let tagsInfo = [];

		// first replace all non-specific repetition " : N" with ending tag: </r~N>
		let text1 = text.replace(/^\s+/g, '').replace(/\s+:\s*(\d+)/g, " </r~$1>");

		if (text1.indexOf('</r')==-1) //  nothing to parse!
			return text;

		// now process according to the rules
		let counter = 0;
		while( text1.indexOf('</r') > 0) {
			text1 = processFirstTag(text1, counter+1);
			counter++;
		}
		
		// now as we have the bigger picture, we can apply repetition tags
		tagsInfo.forEach( tagData => {
			text1 = applyRepetitionTag( text1, tagData.tagName, tagData.numOfRepetitions );	
		});

		return text1;

		// Algorhythm
		// Input: T K :2 (D T : 4) K K :3
		// First step - closing tags: T K </r~2> (D T </r~4> ) K K </r~3>
		// Now we need to put correctly all opening tags,
		// for this we need to properly determine the context.
		// If it's inside the ( ... ), then brackets define local context.
		// If it's outside, then the beginning of context is defined by previous tag or the new line char.

		function processFirstTag(str, commandID) {

			let result = "";
			let tagName = "r" + commandID;
	        let firstIdx = str.indexOf('</r');
	        if ( firstIdx === -1 ) return str;

	        // find the end of this tag and get number of repetitions N
	        let found = false;
	        let idxEndOfTag=firstIdx+2
	        do {
	        	idxEndOfTag++;
	        	if (str.charAt(idxEndOfTag) === '>') found = true;
	        } while (!found);
	        let N = str.substring(firstIdx + 4, idxEndOfTag);

	        // collecting info about repetitions to the special array
	        tagsInfo.push({tagName: tagName, numOfRepetitions: N});

			// iterate to the beginning of str and collect the full picture via tags r<counter>
			// later we'll replase those tags to specific repetition operators
	        let bracketsCounter = 0;
	        for (let i=firstIdx-1; i >=0; i-- ) {
	        	let currChar = str.charAt(i);
	        	if ( currChar===')') bracketsCounter++;
	        	if ( currChar==='(') bracketsCounter--;

	        	// here we process 4 situations that mean : we have found the beginning of the tag!
	        	if ( currChar === '\n' && bracketsCounter===0 ) { // beginning of line 
	        		result = str.substring(0, i) + `\n[${tagName}]` + str.substring(i+1, firstIdx) + `[/${tagName}]` + str.substring(idxEndOfTag+1);
	        		return result;
	        	}

	        	if ( i===0 ) { // very beginning of string
	        		result = `[${tagName}]` + str.substring(0, firstIdx) + `[/${tagName}]` + str.substring(idxEndOfTag+1);
	        		return result;
	        	}

	        	if ( currChar === '(' && bracketsCounter===-1) {// beginning of current block
	        		result = str.substring(0, i+1) + `[${tagName}]` + str.substring(i+1, firstIdx) + `[/${tagName}]` + str.substring(idxEndOfTag+1);
	        		return result;
	        	}

	        	if ( currChar===']' && bracketsCounter===0) { // stop here because of previous repetition command
	        		result = str.substring(0, i+1) + `[${tagName}]` + str.substring(i+1, firstIdx) + `[/${tagName}]` + str.substring(idxEndOfTag+1);
	        		return result;
	        	}
	        }

	        return result;
	    }

	    // Finds and replaces [tagName] sentence [/tagName] to n times sentence.
	    function applyRepetitionTag(inputText, tagName, n) {

	    	let result = inputText;
	    	const openingTag = `[${tagName}]`;
	    	const closingTag = `[/${tagName}]`;

	    	let idx1 = inputText.indexOf( openingTag );
	    	let idx2 = inputText.indexOf( closingTag )
	    	if (idx1 >=0 && idx2 >=0 ) {
	    		let prefix = inputText.substring(0, idx1);
	    		let content = inputText.substring(idx1 + openingTag.length, idx2);
	    		let suffix = inputText.substring(idx2+closingTag.length);	    
	    		result = `${prefix} (${content}):${n} ${suffix}`
	    	}

	    	return result;
		}

	}
}









