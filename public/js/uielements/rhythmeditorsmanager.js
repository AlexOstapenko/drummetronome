// There are 2 rhythm editors: V - visual, T - text
const RHYTHM_EDITOR_VISUAL = "div-visual-rhythm-editor";
const RHYTHM_EDITOR_TEXT = "div-text-rhythm-editor";

// these 2 arrays must me synchronized
const rhythmEditors = [ RHYTHM_EDITOR_VISUAL, RHYTHM_EDITOR_TEXT ];
const buttonLabelsForRhythmEditors = ["* V *", "* T *"];

// ------------------------

class RhythmEditorsManager {

	constructor() {
		this.currentRhythmEditorIdx = 1;

	}

	setRhythmToCurrentEditor( text ) {

		if ( rhythmEditors[ this.currentRhythmEditorIdx ] === RHYTHM_EDITOR_VISUAL ) {
			rhythmBoard.setNewRhythm( text );
    		rhythmBoard.render();

		} else if ( rhythmEditors[ this.currentRhythmEditorIdx ] === RHYTHM_EDITOR_TEXT ) {
			setTextRhythm( text );
		}
	}
}

const rhythmEditorsManager = new RhythmEditorsManager();