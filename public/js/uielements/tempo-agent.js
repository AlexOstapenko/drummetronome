
class TempoAgent {

	constructor(idDivTempo, idInputTempo, idTempoValue) {
		this.bpm = DEFAULT_BPM;
		this.idDivTempo = idDivTempo;
		this.idInputTempo = idInputTempo;
		this.idTempoValue = idTempoValue;
	}

	setTempo(newBPM) {
		this.bpm = newBPM;
		this.updateToWebDoc();
	}

	updateToWebDoc() {
		document.getElementById(this.idInputTempo).value = this.bpm;
		document.getElementById(this.idTempoValue).innerHTML = this.bpm;
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
    	document.getElementById( this.idDivTempo ).style.visibility = doShow ? "visible" : "hidden";
	}

}

const tempoAgent = new TempoAgent(ID_DIV_TEMPO, ID_INPUT_TEMPO, ID_INPUT_TEMPOVAL);