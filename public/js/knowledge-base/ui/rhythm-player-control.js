const BUTTON_STATE_PLAY = "PLAY";
const BUTTON_STATE_STOP = "STOP";

/*
* Rhythm text to display,
* Button play/stop,
* Tempo control.
*/
class RhythmPlayerControl {

	constructor(lessonRenderer) {
		this.id = -1;
		this.lessonRenderer = lessonRenderer;
		this.rhythmCard = null;
		this.tempoCtrl = null;
		this.buttState = "PLAY";
		this.htmlForDisplayText = "";
		this.durationTimer = new PlayingDurationTimer("");
		this.additionalTitleHtml = "";
	}

	setID(id) {
		this.id = id;
		this.durationTimer.setDivID( "divDurationTimer_" + this.id );
	}


	setXML( xml ) {
		let html = "";
		let xmlParser = new DOMParser();
		let xmlDoc = xmlParser.parseFromString( xml, "text/xml" );
		let rhythmCardNode = xmlDoc.getElementsByTagName("rhythmcard")[0];
		let rhythmCardText = nonEmptyValues( rhythmCardNode.textContent.split("\n")).join("\n");
		
		this.rhythmCard = new RhythmCard();
	    this.rhythmCard.parseRhythmCardText( rhythmCardText );

	    // the rhythm text that we show to the user can be defined in <displayrhythm> tag.
	    // but if such tag is absent – use the rhythm from the first instrument in rhythm card
	    //let displayRhythmNode = xmlDoc.getElementsByTagName( tagDisplayRhythm )[0];
		//this.htmlForDisplayText = this.lessonRenderer.renderDisplayRhythmTag( displayRhythmNode );
		this.calculateHTMLForDisplayText(xmlDoc);

	    this.tempoCtrl = tempoControlsManager.createTempoControl();
	    this.tempoCtrl.setInitialTempo(this.rhythmCard.tempo);
	    this.tempoCtrl.tempoChangeNotifier.addValueChangeListener( newValue => {
	    	this.rhythmCard.tempo = parseInt( newValue );
	    });
	}

	/*
		This method can be applied to change the rhythm of the player at any time.
	*/
	setRhythmCard(rcText, textToShow, textSize) {
		let rhythmCardText = nonEmptyValues( rcText.split("\n") ).join("\n");
		this.rhythmCard = new RhythmCard();
	    this.rhythmCard.parseRhythmCardText( rhythmCardText );
	    this.htmlForDisplayText = this.renderDisplayRhythmFromText(textToShow, textSize);
	}

	render() {
		let html = 
	    `<div id="rhythm-player-control-container${this.id}" class='rhythm-player-control-container'>
	    	${this.getInnerHTML()}
	    </div>`;

		return html;
	}

	getInnerHTML() {
		let html =
			`${this.additionalTitleHtml}
	    	<span class='rhythm-player-control-title'>${CURR_LOC().controls.playerTitle}</span>
	    	${this.htmlForDisplayText}
	    	<div class="rhythm-player-control-button-container">
		    	<button class='${this.buttonClass}'
		    		onclick="onClickPlayRhythm(${this.id});">
		    		${this.buttState}
		    	</button>
	    	</div>
            <div id='divDurationTimer_${this.id}' class='divPlayingDurationTimer'></div>
	    	<div id='rhythm-player-control-tempo-control_${this.id}'>${this.tempoCtrl.render()}</div>`;

	    	return html;
	}


	reRender() {
		let div = document.getElementById( `rhythm-player-control-container${this.id}` );
		if (div) div.innerHTML = this.getInnerHTML();
	}

	// the rhythm text that we show to the user can be defined in <displayrhythm> tag.
    // but if such tag is absent – use rhythm text from the first instrument in rhythm card
	calculateHTMLForDisplayText(xmlDoc) {
		const tagDisplayRhythm = 'displayrhythm';
		let displayRhythmText = "";
		let textSize = "big";

		// rhythm text may have comments as: // blah blah...
		// remove "//" in all comment-type lines
		function processCommentsInRhythmText(text) {
			let lines = text.split("\n");
			return lines.map( line => {
				if ( line.trim().indexOf( "//")==0 ) 
					return line.substring( 2 );
				else return line;
			} ).join("\n");
		}

		let displayRhythmNode = xmlDoc.getElementsByTagName( tagDisplayRhythm );
		if (displayRhythmNode && displayRhythmNode.length > 0 ) { // there is a child tag displayrhythm
			displayRhythmNode = displayRhythmNode[0];
			
			// calculate text size
			textSize = displayRhythmNode.hasAttribute("size") ? displayRhythmNode.getAttribute("size") : "big";
			if ( ["big", "small"].indexOf(textSize)===-1 ) textSize = "big";
			// get text
			displayRhythmText = displayRhythmNode.innerHTML;
			if (displayRhythmText=== "=")
				displayRhythmText = processCommentsInRhythmText( this.rhythmCard.records[0].rhythm )
		}
		else {  // there is no special child tag displayrhythm, so copy from rhythm-card
			displayRhythmText = processCommentsInRhythmText( this.rhythmCard.records[0].rhythm );
		}

		//this.htmlForDisplayText = this.lessonRenderer.renderDisplayRhythmTag( displayRhythmNode );
		this.htmlForDisplayText = this.renderDisplayRhythmFromText( displayRhythmText, textSize );
	}

	renderDisplayRhythmFromText(text, size) {
		let textSize = size || "big";
		let additionalClass = "rhythm-to-display-text-" + textSize;
		text = nonEmptyValues( text.split("\n")).join("<br>");
		return `<div class='rhythm-to-display ${additionalClass}'>${text}</div>`;
	}

	setTempoControlVisibility(isVisible) {
		document.getElementById(`rhythm-player-control-tempo-control_${this.id}`).innerHTML = 
			isVisible ? this.tempoCtrl.render() : "";
	}

	startDurationTimer() {
		this.durationTimer.start();
	}

	stopDurationTimer() {
		this.durationTimer.stop();
	}

	// state = play or stop
	set buttonState( state ) {
		this.buttState = state;
		let div = document.getElementById("rhythm-player-control-" + this.id);
		div.innerHTML = this.render();
	}

	get buttonState() { return this.buttState; }

	get buttonClass() {
		return this.buttState === BUTTON_STATE_PLAY ? "button-play" : "button-stop";
	}
}





