class TextRhythmEditorAgent {

	constructor(textAreaId) {
		this.textAreaId = textAreaId;
	}

	setRhythm( text ) {
		document.querySelector(`#${this.textAreaId}`).value = text; 
	}

	getRhythm() {
		return document.querySelector(`#${this.textAreaId}`).value;
	}
}