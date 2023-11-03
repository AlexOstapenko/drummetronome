const DIV_INSTRUMENT_SELECTION = "divInstrumentSelect";

// Works with InstrumentManager and allows the user to select one instrument at a time
class InstrumentSelector {

	constructor() {
		this.selectedInstrumentName = instrumentManager.currentInstrument.instrumentName;
		//instrumentManager.addInstrumentChangedListener( this );
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

		if (this.selectedInstrumentName === instrumentName ) return;

		// before selecting new instrument - save data for the current
		instrumentManager.saveRhythm( this.selectedInstrumentName, RHYTHM_EDITOR_TYPE_TEXT, rhythmEditorsManager.getTextRhythm() );
		instrumentManager.saveRhythm( this.selectedInstrumentName, RHYTHM_EDITOR_TYPE_VISUAL, rhythmBoard.rhythmAsText );
		// select new instrument
		this.selectedInstrumentName = instrumentName;
		this.render();

		// set new instrument and restore rhythms from instruments memory
		instrumentManager.currentInstrument = instrumentManager.getInstrument( instrumentName );
		instrumentManager.recallRhythm( this.selectedInstrumentName, RHYTHM_EDITOR_TYPE_TEXT );
		instrumentManager.recallRhythm( this.selectedInstrumentName, RHYTHM_EDITOR_TYPE_VISUAL );
		this.instrumentChanged( this.selectedInstrumentName );
	}

	instrumentChanged( instrumentName ) {
	    // set rhythm texts for visual and text rhythm editor
	    rhythmBoard.setNewRhythm( instrumentManager.recallRhythm( instrumentName, RHYTHM_EDITOR_TYPE_VISUAL) );
	    rhythmBoard.render();
	    rhythmEditorsManager.setTextRhythm( instrumentManager.recallRhythm( instrumentName, RHYTHM_EDITOR_TYPE_TEXT) );
	    
	    strokeSelector.updateStrokes();
	    rhythmPlayer.updateCurrentInstrument();
	}
}

const instrumentSelector = new InstrumentSelector();