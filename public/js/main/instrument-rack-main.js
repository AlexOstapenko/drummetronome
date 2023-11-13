function onDocumentLoaded() {
	instrumentRackUI.render();
	instrumentRackUI.generateInstrumentOptions();
	setDefaultValues();
    addEventListeners();
}

function setDefaultValues() {
    tempoAgent.updateToWebDoc();
}

function addEventListeners() {
    instrumentRackUI.addRackChangeListener( () => {
        insrumentRackMixer.updateAndRender();
    });
}

function clearTextRhythm() {
	instrumentRackUI.textRhythmEditorAgent.setRhythm("");
}

function clickPlayRhythm() {

	instrumentRackUI.saveCurrentTextRhythm();
	
    if ( instrumentRackUI.isEmpty() ) return;

    let butt = document.getElementById(ID_BUTT_PLAYSTOP);

    if ( mtRhythmPlayer.isPlaying ) {

        // stop
        mtRhythmPlayer.stop();
        playingDurationTimer.stop();

        butt.innerText = L_BUTT_PLAY; 
        butt.className = "button-play";

        tempoAgent.showTempoDiv(true);
    } else {
        // start or restart
        mtRhythmPlayer.stop();
        butt.innerText = L_BUTT_STOP; 
        butt.className = "button-stop";

        audioFilePlayer.resumeAudio().then( function () {
            mtRhythmPlayer.play(instrumentRackUI.rack, tempoAgent.bpm );
            playingDurationTimer.start();
         });
        tempoAgent.showTempoDiv(false);
    }
}

