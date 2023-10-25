const RHYTHM_EDITOR_TEXT_ID = "rhythmEditor_text";

function addTextToTextarea(id, newText) {
    const textarea = document.getElementById(id); 

    const cursorStart = textarea.selectionStart;
    const cursorEnd = textarea.selectionEnd;
    const text = textarea.value;

    // Проверяем, находится ли курсор в начале строки
    if ( text !== "" && text[text.length - 1] !== '\n' )
        textarea.value +=  " ";
    
    textarea.value += newText;
}

function addTextToRhythmTextEditor(str) {
    addTextToTextarea( RHYTHM_EDITOR_TEXT_ID, str);
} 

function getTextRhythm() {
    return document.querySelector(`#${RHYTHM_EDITOR_TEXT_ID}`).value;
}

function setTextRhythm( str ) {
    document.querySelector(`#${RHYTHM_EDITOR_TEXT_ID}`).value = str; 
}

/* Задача: все неспецифичные операторы повтора ":" превратить в повторы фраз, перед которыми они стоят.
Неспецифичный - это такой, который не стоит вплотную к слогу или скобковому выражению. 
Тогда он относится ко всему, что слева, но до такого же несецифичного оператора левее 
или до начала строки (то есть он действует только на то, что находится в этой строке).
То есть было: "фраза : 3"
стало: "(фраза) (фраза) (фраза)"

Пример: (D T :2 (T K)/2:2 ):2 P Pm :2
Станет: ( (D T) (D T) (T K)/2:2 ):2 (P Pm) (P Pm)
*/

/* TODO: не отлавливает вот такую фразу
D K :2 T2 ( (D K T K)/2 :2 T K ):3


A = D K
B = (D K T K)/2

A:2 (B:2 T K):3
*/

function normalizeTextRhythm( text ) {
    let exprParser = new ExpressionParser();
    return exprParser.parse( text );
}

function normalizeTextRhythm_old( text ) {
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
}

// RULES
// In the end of line can be ": N" - it means - 
//      repeat the text from this line N times.
// If the line starts from // - ignore this line (comment)

/* 
    More examples

    Text can be something like this:

    ( 
        D L:3 T K (R R L L)/2 
    ):4 D L L L T L:3 (D K T K)2/3

    it will be first converted to:

    D L L L T K (R R L L)/2
    D L L L T K (R R L L)/2
    D L L L T K (R R L L)/2
    D L L L T K (R R L L)/2
    D L L L T L L L
    D2/3 T2/3 T2/3 K2/3
    
    Ex2: 
    L:3/2 = L/2:3 = L/2 L/2 L/2

    Ex3:
    Non-specific repetitions char :
    D K : 2 S T :2 will be treated as: 2 times (D K) and 2 times (S T)
    D K D K S T S T

    but this is specific repetition char:
    T:4 - it belongs to T

    So:

    T:2 D:2 :4 - means 4 times (T T D D) 
*/
function processRawTextRhythm( text ) {    
   
    // exclude empty lines and comments - lines that start with "//"
    const lines = nonEmptyValues( text.split("\n") );
    const effectiveLines = lines.filter( line => line.slice(0,2) !== "//" );
    
    // apply all non-specific operators of repetition
    return normalizeTextRhythm( effectiveLines.join("\n") );

/*
    let line = effectiveLines.join(" ");

    let arrPreprocessed = [];
    effectiveLines.forEach( line => {
        // search for such ":" which is not connected to any particular syllable (separated by space from any)

        const idxOfRepetitionChar = findFirstNonspecificRepetitionChar(line);
        if (  idxOfRepetitionChar > 0 ) {
            if ( isWhitespaceAtIndex(line, idxOfRepetitionChar-1) ) {
                let arr1 = splitStringAtIndex( line, idxOfRepetitionChar);
                let arr2 = arr1[1].split(" "); // here - number of copies and the rest of the string
                let restOfString = arr2.slice(1).join(' ');

                let numOfCopies = toInteger( arr2[0] );
                if (!numOfCopies) numOfCopies = 1;
                arrPreprocessed.push(...Array.from( {length: numOfCopies}, () => arr1[0] ) );
                if (restOfString.trim()!=="" )
                    arrPreprocessed.push( processRawTextRhythm(restOfString) );
            }
        } else {
            arrPreprocessed.push( line );
        }
    });

    return arrPreprocessed.join("\n");*/
}

function setTextRhythmToVisualEditor() {
    const phrase = new Phrase( processRawTextRhythm( getTextRhythm() ) );
    const fractions = simplifyFractions( phrase.elements.map( element => element.fraction.toString(false, false)) );

    const arr = fractions.map( (item, idx) => {
        const syllable = phrase.elements[idx];

        const number = parseInt( item );
        let result = syllable.syllable;
        if (number > 1)
            result += " " + "- ".repeat( number-1 );
        return result;
    });

    rhythmBoard.setNewRhythm( arr.join(" ") );
    rhythmBoard.render();
}

function setTextRhythmToVisualEditorAndSwitch() {
    setTextRhythmToVisualEditor();
    switchRhythmEditor();
}



