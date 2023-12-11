class LessonPage {
	constructor() {
		this.divContainerID = "";
		this.reinit();
	}

	reinit() {
		this.rhythmPlayerControls = [];
		this.idGeneratorForRhythmPlayers = new IDGenerator();
		this.activeRhythmPlayerControl = null;
	}

	set mainDivID(id) {
		this.divContainerID = id;
	}

	get divContainer() { return document.getElementById(this.divContainerID); }

	render(lesson) {
		this.reinit();

		let html = 
		`<b class='course-title'><i>${lesson.parentModule.course.name}</i><br> 
		Module: ${lesson.parentModule.name}</b>
		<h3>${lesson.name}</h3>`;
		
		html += this.parseDisplayRhythmTags( 
					this.parseRhythmPlayerTags( lesson.content ) );

		this.divContainer.className = "";
		this.divContainer.innerHTML = html;	
	}

	createRhythmPlayerControl() {
		let rpControl = new RhythmPlayerControl( this );
		rpControl.setID( this.idGeneratorForRhythmPlayers.getNewID() );
		this.rhythmPlayerControls.push( rpControl );
		return rpControl;
	}

	/*
	* In the lesson text there could be tags <rhythmplayer>...</rhythmplayer>.
	* Change eacn one of them to a rhytm-player-control component.
	*/
	parseRhythmPlayerTags(content) {

		// cut each occurrence of <rhythmplayer> ... </rhythmplayer> and 
		// insert rhythm-player-component in those places.

		content = this.replaceTags( content, "rhythmplayer", (xml) => {
			let rhythmPlayerControl = this.createRhythmPlayerControl( this );
			rhythmPlayerControl.setXML(xml);
			let html = 
			`<div id="rhythm-player-control-${rhythmPlayerControl.id}">
				${rhythmPlayerControl.render()}
			</div>`;

			return html;
		});

		return content;
	}

	parseDisplayRhythmTags(content) {
		return this.replaceTags( content, "displayrhythm", (xml) => {
			let xmlParser = new DOMParser();
			let xmlDoc = xmlParser.parseFromString( xml, "text/xml" );
			return this.renderDisplayRhythmTag( xmlDoc.documentElement );
		});
	}

	renderDisplayRhythmTag(xmlNode) {
		let textSize = xmlNode.hasAttribute("size") ? xmlNode.getAttribute("size") : "big";
		let additionalClass = "rhythm-to-display-text-" + textSize;
		let textToDisplay = xmlNode.innerHTML;
		textToDisplay = nonEmptyValues( textToDisplay.split("\n")).join("<br>");

		return `<div class='rhythm-to-display ${additionalClass}'>${textToDisplay}</div>`;
	}

	//	generic methog to replace all given tags and call a function for each tag
	replaceTags(content, tagName, funcTagProcessor) {
		let closingTag = `</${tagName}>`;
		let idx1 = content.indexOf("<" + tagName);
		while( idx1 >=0 ) {
			let idx2 = content.indexOf( closingTag );
			if (idx2==-1) throw SyntaxError(`Closing tag not found for '${tagName}'.`);
			idx2 += closingTag.length;
			let xml = content.substring( idx1, idx2 );
			
			content = content.substring(0, idx1) + 
					funcTagProcessor( xml ) +
					content.substring( idx2 );

			idx1 = content.indexOf(`<${tagName}`);
		}

		return content;
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

	        // TODO: start playing
	        mtRhythmPlayer.stop();
	        audioFilePlayer.resumeAudio().then( () => {
	            mtRhythmPlayer.play( rack, rCard.tempo );
	            this.activeRhythmPlayerControl.startDurationTimer();
	            
	         });
	        //tempoAgent.showTempoDiv(false);

	        // change button labels of "Play/Stop" buttons of all player controls on the page
	        this.updateButtons();
	    }

	    instrumentManager.loadMultipleInstruments(arrInstrNames, onInstrumentsLoaded);
	}

	stopPlaying() {
		mtRhythmPlayer.stop();
		this.activeRhythmPlayerControl.stopDurationTimer();
		this.activeRhythmPlayerControl = null;
		this.updateButtons();
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
	
}