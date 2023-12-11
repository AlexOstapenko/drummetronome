class UITempoControl {
	constructor(id) {
		this.id = id;
		this.bpm = 90;
		this.tempoChangeNotifier = new ValueChangeNotifier();
	}

	render() {
		let id = this.id;
		let html = 
		`<div class='div-tempo-container' id='${this.idTempoContainer}'>
            <div class='div-tempo-text'>Tempo: <span id="${this.idTempoValue}">${this.bpm}</span> <br></div>
            <div id="divTempo_${id}">
                <input id="${this.idInputTempo}" class="tempoRuller"
                    size="10" value="${this.bpm}" type="range" min="20" max="500" step="5"
                    oninput="tempoControlsManager.onChangeTempo(${id})">
                <br>
                <button class='butt-tempo-shift' onclick="tempoControlsManager.clickShiftTempo(${id},-20)">-20</button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <button class='butt-tempo-shift' onclick="tempoControlsManager.clickShiftTempo(${id},-5)">-5</button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <button class='butt-tempo-shift' onclick="tempoControlsManager.clickShiftTempo(${id}, 5)">+5</button>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <button class='butt-tempo-shift' onclick="tempoControlsManager.clickShiftTempo(${id},20)">+20</button>
            </div>
        </div>`;

        //this.divContainer.innerHTML = html;
        return html;
	}

	get idInputTempo() {
		return `inputTempo_${this.id}`;
	}
	get idTempoValue() {
		return `inputTempoValue_${this.id}`;
	}
	get idTempoContainer() {
		return `divTempoContainer_${this.id}`;
	}

	setTempo(newBPM) {
		this.bpm = newBPM;
		this.updateToWebDoc();
	}

	setInitialTempo( newBPM ) {
		this.bpm = newBPM;
	}

	updateToWebDoc() {
		document.getElementById(this.idInputTempo).value = this.bpm;
		document.getElementById(this.idTempoValue).innerHTML = this.bpm;

		this.tempoChangeNotifier.notify(this.bpm);
	}

	updateBPMFromWebDoc() {
		this.bpm = parseInt( document.getElementById(this.idInputTempo).value );
	}

	onChangeTempo(){
		this.updateBPMFromWebDoc();
		this.updateToWebDoc();
	}

	clickShiftTempo(amount) {
		this.bpm += amount;
		if (this.bpm < 20 ) this.bpm = 20;
		if (this.bpm > 500) this.bpm = 500;

		this.updateToWebDoc();
	}

	showTempoDiv(doShow)  {
    	document.getElementById( this.idTempoContainer ).style.visibility = doShow ? "visible" : "hidden";
	}

	revertVisibility() {
		let element = document.getElementById( this.idTempoContainer );
		element.style.visibility = element.style.visibility == 'visible' ? "hidden" : "visible";
	}

}

class TempoControlsManager {
	constructor() {
		this.idCounter = -1;
		this.tempoControls = [];
	}

	newID() {
		this.idCounter++;
		return this.idCounter;
	}

	createTempoControl() {
		let tempoCtrl = new UITempoControl( this.newID() );
		this.tempoControls.push( tempoCtrl );
		return tempoCtrl;
	}

	getTempoControl(id) {
		return this.tempoControls.filter( control => control.id === id)[0];
	}

	onChangeTempo(id) {
		this.getTempoControl(id).onChangeTempo();
	}

	clickShiftTempo(id, num) {
		this.getTempoControl(id).clickShiftTempo(num);
	}

}

const tempoControlsManager = new TempoControlsManager();

