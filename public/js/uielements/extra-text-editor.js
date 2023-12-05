class ExtraTextEditor {
	constructor() {

	}

	init() {
		this.divContainer = document.getElementById("div-extra-text-editor");	
	}

	showText(text) {
		this.divContainer.innerHTML = 
		`<div>
            <textarea class="extra-text-editor" id="extra-text-editor" rows="10">${text}</textarea><br>
        </div>`;
	}

	hideText() {
		this.divContainer.innerHTML = "";
	}

}