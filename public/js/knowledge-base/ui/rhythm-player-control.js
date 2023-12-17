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
	}

	setID(id) {
		this.id = id;
		this.durationTimer.setDivID( "divDurationTimer_" + this.id );
	}


	setXML( xml ) {
		let html = "";
		let xmlParser = new DOMParser();
		let xmlDoc = xmlParser.parseFromString( xml, "text/xml" );

		let rhythmCardText = nonEmptyValues( xmlDoc.getElementsByTagName("rhythmcard")[0].textContent.split("\n")).join("\n");
		
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

	render() {
		
		let html = 
	    `<br>
	    <div class='rhythm-player-control-container'>
	    	<span class='rhythm-player-control-title'>${CURR_LOC().controls.playerTitle}</span>
	    	${this.htmlForDisplayText}
	    	<button class='${this.buttonClass}'
	    		onclick="onClickPlayRhythm(${this.id});">
	    		${this.buttState}
	    	</button>
            <div id='divDurationTimer_${this.id}' class='divPlayingDurationTimer'></div>
	    	<div id='rhythm-player-control-tempo-control_${this.id}'>${this.tempoCtrl.render()}</div>
	    </div>`;

		return html;
	}

	// the rhythm text that we show to the user can be defined in <displayrhythm> tag.
    // but if such tag is absent – use rhythm text from the first instrument in rhythm card
	calculateHTMLForDisplayText(xmlDoc) {
		const tagDisplayRhythm = LESSON_TAGS['displayrhythm'];
		let displayRhythmNode = xmlDoc.getElementsByTagName( tagDisplayRhythm );
		if (displayRhythmNode && displayRhythmNode.length > 0 )
			displayRhythmNode = displayRhythmNode[0];
		else { // take html from rhythm card
			let xml = 
			`<${LESSON_TAGS["displayrhythm"]} size='big'>
				${this.rhythmCard.records[0].rhythm}
			</${LESSON_TAGS["displayrhythm"]}>`;
			let xmlParser = new DOMParser();
			xmlDoc = xmlParser.parseFromString( xml, "text/xml" );
			displayRhythmNode = xmlDoc.documentElement;
		}

		this.htmlForDisplayText = this.lessonRenderer.renderDisplayRhythmTag( displayRhythmNode );
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



