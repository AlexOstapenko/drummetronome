class ExtraTextEditor {
	constructor() {

	}

	init() {
		this.textEditorElement = document.getElementById("extra-text-editor");	
	}

	showText(text) {
		this.textEditorElement.value = text;
	}

	hideText() {
		this.textEditorElement.value = "";
	}

}