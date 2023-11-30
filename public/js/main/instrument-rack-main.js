function onDocumentLoaded() {

    instrumentManager.loadInstrumentDefinitions( function() {
        instrumentVisualizer.init();
        instrumentRackUI.render();
        instrumentRackUI.generateInstrumentOptions();
        setDefaultValues();
        addEventListeners();
    } );
}

function setDefaultValues() {
    tempoAgent.updateToWebDoc();
}

function addEventListeners() {
    instrumentRackUI.rackChangedNotifier.addValueChangeListener( [
        (rack) => { insrumentRackMixer.updateAndRender(); },
        instrumentVisualizer.onRackChanged.bind(instrumentVisualizer)
    ]);

    // to update the canvas when the image is loaded
    //instrumentRackUI.instrumentLoadedNotifier.addValueChangeListener( instrumentVisualizer.onInstrumentLoaded.bind(instrumentVisualizer) );
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

function collectAllRhythms() {
    let result = "";

    // header
    result =  `category: ?
                name: ?
                tempo: ${tempoAgent.bpm}

                #####\n\n`;

    if (instrumentRackUI.rack.instrumentInstances)
    instrumentRackUI.rack.instrumentInstances.forEach( (instance,idx) => {
        if (idx > 0) result += '@@@@@\n\n';
        result += `${instance.instrument.instrumentName}
            gain: ${instance.data.audio.gain}
            pan: ${instance.data.audio.panorama}
            rhythm:
            ${instance.data.rhythm}\n\n`;
        
    });
    result = result.split("\n").map(line=>line.trim()).join("\n");
    console.log( result );
    return result;
}

let strokesInfoVisible = false;
const buttLabelsShowHideStrokesInfo = ["Show strokes", "Hide strokes"];
function showHideStrokesHelp() {
    let div = document.getElementById( "div-strokes-help" );
    let butt = document.getElementById( "buttShowHideStrokesHelp" );

    if (strokesInfoVisible) {
        hideStrokesInfo();
    } else {
        let selectedInstance = instrumentRackUI.rack.getSelectedInstance();
        div.innerHTML = !selectedInstance ? "" : 
            selectedInstance.instrument.strokeInfo();

        butt.textContent = buttLabelsShowHideStrokesInfo[1];
        strokesInfoVisible = true;
    }
}

function hideStrokesInfo() {
    let div = document.getElementById( "div-strokes-help" );
    let butt = document.getElementById( "buttShowHideStrokesHelp" );

    div.innerHTML = "";
    butt.textContent = buttLabelsShowHideStrokesInfo[0];
    strokesInfoVisible = false;
}

function parseRhythmCard() {
    let rCard = new RhythmCard();
    rCard.parseRhythmCardText();


}

