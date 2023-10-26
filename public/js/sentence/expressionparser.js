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

	constructor() {

	}

	// Parses the expression
	parse(text) {

		// array, here we'll collect info about each tag as object: {tagName: , numOfRepetitions: }
		let tagsInfo = [];

		//console.log( "Original text:\n" + text);
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

	    // Replaces 
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

	/*parse_old(text) {

	    let text1 = text.replace(/^\s+/g, '').replace(/\s+:\s*(\d+)/g, " ~[$1]");
	    text1 = trimArray( text1.split('\n') ).join("\n");

	    // searches for the beginning of block: opened (, beginning of line or beginning of string
	    function findBeginningOfBlock(str, startIdx) {
	        for( let i=startIdx; i >= 0; i--) {
	            let currChar = str.charAt(i);
	            if ( ['\n','|'].includes(currChar) ) // found!
	                return i+1;
	        }
	        return 0;
	    }

	    function processFirstTilda(str) {

	        let firstTildaIdx = str.indexOf('~');
	        if ( firstTildaIdx === -1 ) return str;

	        // if we found ~ char, then right after it we should find [N] (according to the first regexp replacement)
	        // so get the number N
	        const idxClosingOfN = str.indexOf( "]", firstTildaIdx);
	        const N = parseInt(str.substring(firstTildaIdx+2, idxClosingOfN));
	        const restOfString = idxClosingOfN === str.length? "" : str.substring( idxClosingOfN+1 );
	        let bracketsCounter = 0;
	        let content = "";
	        let lineStartIdx = findBeginningOfBlock(str, firstTildaIdx);
	        const beginningOfString = str.substring(0, lineStartIdx);
	        
	        // find beginning of the related block and get all the block content
	        for( let i=firstTildaIdx-1; i >= lineStartIdx; i--) {
	            let currChar = str.charAt(i);
	            if (currChar === ")") bracketsCounter++;
	            if (currChar === "(") bracketsCounter--;

	            if (i==lineStartIdx || (currChar==="(" && bracketsCounter===0)) {
	                if (bracketsCounter===0) {
	                    let substr = str.substring(lineStartIdx, firstTildaIdx-1);
	                    content = Array.from( {length: N}, () => substr ).join(" ")
	                } else if (str.charAt(i) === "(" && bracketsCounter === -1 ) {
	                    let substr = str.substring(i+1, firstTildaIdx-1);
	                    content = "(" + Array.from( {length: N}, () => substr ).join(" ");
	                }
	            }
	        }

	        return beginningOfString + " " + content + "|" + restOfString;
	    }

	    while( text1.includes('~') ) {
	        text1 = processFirstTilda(text1);
	    }

	    text1 = text1.replace(/\|/g, '').replace( / +/g, ' ');

	    console.log( "NORMALIZED TEXT" );
	    console.log( text1 ); 
	    return text1;


	}*/

}









