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