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
		const tagDisplayRhythm = 'displayrhythm';
		let html = "";
		let xmlParser = new DOMParser();
		let xmlDoc = xmlParser.parseFromString( xml, "text/xml" );

		let rhythmCardText = nonEmptyValues( xmlDoc.getElementsByTagName("rhythmcard")[0].textContent.split("\n")).join("\n");
		let displayRhythmNode = xmlDoc.getElementsByTagName( tagDisplayRhythm )[0];
		this.htmlForDisplayText = this.lessonRenderer.renderDisplayRhythmTag( displayRhythmNode );

		this.rhythmCard = new RhythmCard();
	    this.rhythmCard.parseRhythmCardText( rhythmCardText );
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
	    	<h3>Rhythm for practice</h3>
	    	${this.htmlForDisplayText}
	    	<button class='${this.buttonClass}'
	    		onclick="onClickPlayRhythm(${this.id});">
	    		${this.buttState}
	    	</button>
            <div id='divDurationTimer_${this.id}' class='divPlayingDurationTimer'></div>
	    	${this.tempoCtrl.render()}
	    </div>`;

		return html;
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



