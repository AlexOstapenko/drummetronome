class RhythmEditorsManager {

	constructor() {
		this.currentRhythmEditorIdx = 1;
		// these 2 arrays must me synchronized
		this.rhythmEditors = [ RHYTHM_EDITOR_TYPE_VISUAL, RHYTHM_EDITOR_TYPE_TEXT ];
		this.buttonLabelsForRhythmEditors = ["Visual editor", "Text editor"];
		this.textRhythmEditorAgent = new TextRhythmEditorAgent( RHYTHM_EDITOR_TEXT_ID );
	}

	setRhythmToCurrentEditor( text ) {

		if ( this.rhythmEditors[ this.currentRhythmEditorIdx ] === RHYTHM_EDITOR_TYPE_VISUAL ) {
			rhythmBoard.setNewRhythm( text );
    		rhythmBoard.render();

		} else if ( this.rhythmEditors[ this.currentRhythmEditorIdx ] === RHYTHM_EDITOR_TYPE_TEXT ) {
			this.setTextRhythm( text );
		}
	}

	switchRhythmEditor() {
		this.currentRhythmEditorIdx++; 
    	if (this.currentRhythmEditorIdx === this.rhythmEditors.length) this.currentRhythmEditorIdx = 0;
		this.updateRhythmEditorVisibility();
	}

	updateRhythmEditorVisibility() {
	    // show the current rhythm editor type
	    this.rhythmEditors.forEach( (item, idx) => {
	        let div = document.querySelector(`#${DIV_RHYTHM_EDITOR(item)}`);
	        div.style.display = (idx===rhythmEditorsManager.currentRhythmEditorIdx) ? "flex" : "none";
	    });

	    document.querySelector('#buttonSwitchRhythmEditor').innerText = 
	        this.buttonLabelsForRhythmEditors.slice().reverse()[this.currentRhythmEditorIdx];
	}

	// MANIPULSTIONS WITH TEXT EDITOR
	addTextToTextarea(id, newText) {
	    const textarea = document.getElementById(id); 

	    const cursorStart = textarea.selectionStart;
	    const cursorEnd = textarea.selectionEnd;
	    const text = textarea.value;

	    // Проверяем, находится ли курсор в начале строки
	    if ( text !== "" && text[text.length - 1] !== '\n' )
	        textarea.value +=  " ";
	    
	    textarea.value += newText;
	}

	addTextToRhythmTextEditor(str) {
	    this.addTextToTextarea( RHYTHM_EDITOR_TEXT_ID, str);
	} 

	getTextRhythm() {
	    return this.textRhythmEditorAgent.getRhythm();
	}

	setTextRhythm( str ) {
		this.textRhythmEditorAgent.setRhythm( str );
	}

	setTextRhythmToVisualEditor() {
	    const phrase = new Phrase( processRawTextRhythm( this.getTextRhythm() ) );
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

	setTextRhythmToVisualEditorAndSwitch() {
	    this.setTextRhythmToVisualEditor();
	    this.switchRhythmEditor();
	}
}

const rhythmEditorsManager = new RhythmEditorsManager();