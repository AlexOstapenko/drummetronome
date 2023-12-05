
class InstrumentInstanceMixer {
	constructor(instrumentInstance) {
		this.instrumentInstance = instrumentInstance;
	}

	render() {
		const id = this.instrumentInstance.id;
		return `
		<div class='individual-mixer'>
			<div id='mixer-label-${id}'>${this.labelHTML()}</div>
			
			Volume: <input id='mixer-gain-range-${id}' type="range" min="0" max="300" step="1" value="${this.instrumentInstance.data.audio.gain*100}"
			oninput='instrumentRackMixer.onInputGainValue(${id})'>&nbsp;&nbsp;

			Panorama: <input id='mixer-panorama-range-${id}' type="range" min="-100" max="100" step="1" value="${this.instrumentInstance.data.audio.panorama*100}"
			oninput='instrumentRackMixer.onInputPanoramaValue(${id})'>
	    	
	    </div>`;
	}

	labelHTML() {
		const inst = this.instrumentInstance;
		const panorama = inst.data.audio.panorama;
		return `<b>${inst.instrument.instrumentName}</b> &nbsp;&nbsp;&nbsp;
			${parseInt( inst.data.audio.gain*100)}%&nbsp;&nbsp;|&nbsp;&nbsp;
			${parseInt(panorama*100)} ${panorama < 0 ? "L" : (panorama > 0 ? "R" : "")}`;
	}

	updateLabel() {
		let divLabel = document.getElementById("mixer-label-"+this.instrumentInstance.id);
		divLabel.innerHTML = this.labelHTML();
	}
}

// ---------------------------------------
// ---------------------------------------
// ---------------------------------------

class InstrumentRackMixer {
	constructor(instrumentRack) {
		this.divNameForMixer = 'div-instrument-rack-mixer-container';
		this.instrumentRack = instrumentRack;
		this.update();
	}

	update() {
		this.individualMixers = [];
		this.instrumentRack.instrumentInstances.forEach( instance => {
			this.individualMixers.push( new InstrumentInstanceMixer(instance) );
		});
	}

	updateAndRender() {
		this.update();
		this.render();
	}

	render() {
		let html = this.individualMixers.map( mixer => mixer.render() ).join(" ");
		document.getElementById( this.divNameForMixer ).innerHTML = 
			this.individualMixers.length === 0 ? "" :
			`<div class='div-instrument-rack-mixer'>
			<h1>Mixer</h1>
			${html}
			</div>`;
	}

	onInputGainValue(id) {
		let newValue = document.getElementById(`mixer-gain-range-${id}`).value;
		let theMixer = this.individualMixers.filter( mixer => mixer.instrumentInstance.id===id )[0];
		theMixer.instrumentInstance.gain = newValue/100;
		theMixer.updateLabel();
	}

	onInputPanoramaValue(id) {
		let newValue = document.getElementById(`mixer-panorama-range-${id}`).value;
		let theMixer = this.individualMixers.filter( mixer => mixer.instrumentInstance.id===id )[0];
		theMixer.instrumentInstance.panorama = newValue/100;
		theMixer.updateLabel();	
	}

}

const instrumentRackMixer = new InstrumentRackMixer( instrumentRackUI.rack );



