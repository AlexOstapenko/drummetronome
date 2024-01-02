/*
* Manages multiple rhythms players on a single page. When one player starts playing, all the others should stop.
*/
class RhythmPlayerControllsCollection {
	constructor() {
		this.rhythmPlayerControls = [];
		this.activeRhythmPlayerControl = null;
		this.idGeneratorForRhythmPlayers = new IDGenerator();
	}

	createRhythmPlayerControl() {
		let rpControl = new RhythmPlayerControl( this );
		rpControl.setID( this.idGeneratorForRhythmPlayers.getNewID() );
		this.rhythmPlayerControls.push( rpControl );
		return rpControl;
	}

	getRhythmPlayerControl( id ) {
		let matches = this.rhythmPlayerControls.filter( rpc => rpc.id===id);
		if (matches) return matches[0];
		return null;
	}

	play( rhythmPlayerControlID ) {
		// check do we need to start playing or stop playing?
		if (this.activeRhythmPlayerControl) {
			rhythmPlayerControlID = this.activeRhythmPlayerControl.id === rhythmPlayerControlID ? 
				-1 : rhythmPlayerControlID;
			this.stopPlaying(); // we have to stop playing current player

			// start playing the new player control
			// this is the situation when one player was playing 
			// and then some other player's PLAY button was clicked.
			if (rhythmPlayerControlID>=0)
				this.play( rhythmPlayerControlID );
		}
		else
			// we have to start playing
			this.startPlaying( rhythmPlayerControlID );
	}

	startPlaying(rhythmPlayerControlID) {
		this.activeRhythmPlayerControl = this.getRhythmPlayerControl( rhythmPlayerControlID );
		let rCard = this.activeRhythmPlayerControl.rhythmCard;

		let arrInstrNames = rCard.records.map( record => record.instrument );

	    let onInstrumentsLoaded = () => {
	        // STEP 2. Create instrument rack with instances
	        const rack = new InstrumentRack()

	        rCard.records.forEach( record => {
	            let {rhythm, instrument, gain, pan, mute} = record;
	            let instrInstance = rack.createInstrumentInstance( instrument );
	            instrInstance.data.rhythm = rhythm;
	            instrInstance.data.audio.gain = gain;
	            instrInstance.data.audio.panorama = pan;
	            instrInstance.data.audio.mute = mute;
	        });

	        // start playing
	        mtRhythmPlayer.stop();
	        audioFilePlayer.resumeAudio().then( () => {
	            mtRhythmPlayer.play( rack, rCard.tempo );
	            this.activeRhythmPlayerControl.startDurationTimer();
	            
	         });
	        
	        // change button labels of "Play/Stop" buttons of all player controls on the page
	        this.updateButtons();
	        this.updateTempoControls();
	    }

	    instrumentManager.loadMultipleInstruments(arrInstrNames, onInstrumentsLoaded);
	}

	stopPlaying() {
		if (this.activeRhythmPlayerControl) {
			mtRhythmPlayer.stop();
			this.activeRhythmPlayerControl.stopDurationTimer();
			this.activeRhythmPlayerControl = null;
			this.updateButtons();
			this.updateTempoControls();
		}
	}

	updateButtons() {
		let calcButtonState = (control) => {
			if (!this.activeRhythmPlayerControl) return BUTTON_STATE_PLAY;
			return control.id === this.activeRhythmPlayerControl.id ? 
	        		BUTTON_STATE_STOP : BUTTON_STATE_PLAY;
		} 

		this.rhythmPlayerControls.forEach( playerControl => { 
			playerControl.buttonState = calcButtonState( playerControl ); 
		});
	}
	
	updateTempoControls() {
		this.rhythmPlayerControls.forEach( playerControl => {
			let isVisible = true;
			if (this.activeRhythmPlayerControl !== null && this.activeRhythmPlayerControl.id === playerControl.id )
				isVisible = false;

			playerControl.setTempoControlVisibility( isVisible );
		});
	}
}
