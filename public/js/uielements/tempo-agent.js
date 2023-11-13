
class TempoAgent {

	constructor() {
		this.bpm = DEFAULT_BPM;
	}

	updateToWebDoc() {
		document.getElementById(ID_INPUT_TEMPO).value = this.bpm;
		document.getElementById(ID_INPUT_TEMPOVAL).innerHTML = this.bpm;
	}

	updateBPMFromWebDoc() {
		this.bpm = parseInt( document.getElementById(ID_INPUT_TEMPO).value );
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
    	document.getElementById( ID_DIV_TEMPO ).style.visibility = doShow ? "visible" : "hidden";
	}

}

const tempoAgent = new TempoAgent();