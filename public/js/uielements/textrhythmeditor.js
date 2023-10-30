
/*
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


*/
