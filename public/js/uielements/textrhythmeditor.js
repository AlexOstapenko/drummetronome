const RHYTHM_EDITOR_TEXT_ID = "rhythmEditor_text";
const DEFAULT_TEXTRHYTHM = 
`D L L L (R R L L)/2 (D L L L)/4 (T K)/2
D L L L (R R L L)/2 (D L L L)/4 (T K)/2

(R R L L)/2 (D L L L)/4 (T K)/2
(R R L L)/2 (D L L L)/4 (T K)/2

(D L L L)/4 (T K)/2
(D L L L)/4 (T K)/2

(R R R R L L L L R R R R L L L L)/4`;

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
    Unspecific repetitions char :
    D K : 2 S T :2 will be treated as: 2 times (D K) and 2 times (S T)
    D K D K S T S T

    but this is specific repetition char:
    T:4 - it belongs to T

    So:

    T:2 D:2 :4 - means 4 times (T T D D) 
*/

function processRawTextRhythm( text ) {

    let result = "";

    function isWhitespaceAtIndex(str, index) {
        const char = str.charAt(index);
        return char.trim() === '';
    }

    // find first : with space before it
    function findFirstNonspecificRepetitionChar(str) {
        for( let i=0; i < str.length; i++ ) {
            if ( str.charAt(i) === ":" && i > 0 && isWhitespaceAtIndex(str, i-1) ) {
                return i;
            }
        }
        return -1;
    }

    function splitStringAtIndex(str, index) {
        if (index >= 0 && index < str.length) {
            const part1 = str.substring(0, index);
            const part2 = str.substring(index + 1); // Исключаем символ по заданному индексу
            return [part1.trim(), part2.trim() ];
        } else {
            // Индекс находится за пределами строки
            return [str, ''];
        }
    }

    // exclude empty line and comments - lines that start with //
    const lines = nonEmptyValues( text.split("\n") );
    const effectiveLines = lines.filter( line => line.slice(0,2) !== "//" );

    // preprocess text: if there is nonspecific " : N" in the middle of line - it means: copy the left part N times

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
                arrPreprocessed.push( processRawTextRhythm(restOfString) );
            }
        } else {
            arrPreprocessed.push( line );
        }
    });

    return arrPreprocessed.join("\n");
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



