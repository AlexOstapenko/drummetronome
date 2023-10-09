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

// In the end of line can be ": N"
// It means - repeat the text from this line N times.
function processRawTextRhythm( text ) {

    let result = "";
    const lines = text.split("\n").filter(line => line.trim() !== "");

    for (const line of lines) {
        value = "";
        if (line.includes(":")) {
            const [start, number] = line.split(":");
            value = ( start + (start[start.length-1]===" "? "" : " ") ).repeat(Number(number));
        } else {
            value = line;
        }

        if (result) result += "\n"; 
        result += value;
    }
    return result;
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



function simplifyFractions(fractions) {
    const correctFractions = fractions.map( item => (item.indexOf("/") < 0 ? (item + "/1") : item ) );

    // Функция для нахождения общего знаменателя
    function findCommonDenominator(fractions) {
        let commonDenominator = 1;
        for (const fraction of correctFractions) {
            const [numerator, denominator] = fraction.split('/').map(Number);
            commonDenominator *= denominator;
        }
        return commonDenominator;
    }

    // Находим общий знаменатель
    const commonDenominator = findCommonDenominator(correctFractions);

    // Преобразуем все дроби
    const simplifiedFractions = correctFractions.map(fraction => {
        const [numerator] = fraction.split('/').map(Number);
        const simplifiedNumerator = numerator * (commonDenominator / fraction.split('/')[1]);
        return simplifiedNumerator.toString();
    });

    // Функция для нахождения наибольшего общего делителя (НОД)
    function findGCD(a, b) {
        if (b === 0) {
            return a;
        } else {
            return findGCD(b, a % b);
        }
    }

    // Находим НОД для всех числителей и знаменателей
    const gcd = simplifiedFractions.reduce((currentGCD, fraction) => {
        const numerator = parseInt(fraction);
        return findGCD(currentGCD, numerator);
    }, parseInt(simplifiedFractions[0]));

    // Поделим все дроби на общий делитель (НОД)
    const furtherSimplifiedFractions = simplifiedFractions.map(fraction => {
        const numerator = parseInt(fraction);
        const simplifiedNumerator = numerator / gcd;
        return simplifiedNumerator.toString();
    });

    return furtherSimplifiedFractions;
}