const DIV_INSTRUMENT_SELECTION = "divInstrumentSelect";

// Works with InstrumentNManager and allows the user to select one instrument at a time
class InstrumentSelector {

	constructor() {
		this.selectedInstrumentName = instrumentManager.currentInstrument.instrumentName;
		instrumentManager.addInstrumentChangedListener( this );
	}

	render() {
		let div = document.querySelector("#"+DIV_INSTRUMENT_SELECTION);
		let html = "";
		

		instrumentManager.allInstruments.forEach(instr => {
			let addClass = instr.instrumentName === this.selectedInstrumentName ? "instrument-selected" : "";

			html += `<div class='divInstrument ${addClass}' onclick="instrumentSelector.select('${instr.instrumentName}')">${instr.instrumentName}</div>`;
		});

		div.innerHTML = html;


	}

	select(instrumentName) {
		this.selectedInstrumentName = instrumentName;
		this.render();
		instrumentManager.currentInstrument = instrumentManager.getInstrument( instrumentName );
	}

	instrumentChanged( instrument ) {
	    // set default rhythm texts for visual and text rhythm editor
	    rhythmBoard.setNewRhythm(instrument.defaultRhythms[0] );
	    rhythmBoard.render();
	    setTextRhythm( instrument.defaultRhythms[1] );
	    
	    strokeSelector.updateStrokes();
	    rhythmPlayer.updateCurrentInstrument();

	}

}

const instrumentSelector = new InstrumentSelector();