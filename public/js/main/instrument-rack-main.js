function onDocumentLoaded() {

    instrumentManager.loadInstrumentDefinitions( function() {
        instrumentVisualizer.init();
        instrumentRackUI.render();
        instrumentRackUI.generateChoiceOfInstruments();
        setDefaultValues();
        addEventListeners();
    } );

}

function setDefaultValues() {
    tempoAgent.updateToWebDoc();
}

function addEventListeners() {
    instrumentRackUI.rackChangedNotifier.addValueChangeListener( [
        (rack) => { instrumentRackMixer.updateAndRender(); },
        instrumentVisualizer.onRackChanged.bind(instrumentVisualizer)
    ]);
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

function makeRhythmCard() {
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
            mute: ${instance.data.audio.mute ? instance.data.audio.mute : false}
            rhythm:
            ${instance.data.rhythm}\n\n`;
        
    });
    result = result.split("\n").map(line=>line.trim()).join("\n");
    let textEd = new ExtraTextEditor();
    textEd.init();
    textEd.showText( result );
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
            selectedInstance.instrument.strokeInfo( (stroke, hint, idx, length) => {
                // formatting output for each stroke
                let result = "";
                let numOfStrokesInRow = 4;
                if (idx!=0 && idx%numOfStrokesInRow == 0) result += "<br>";
                result += `<span class='stroke-info-stroke'>${stroke}</span>`;
                if ( hint ) result += " <span class='stroke-info-hint'>(" + hint + ")</span>";
                if ( idx%numOfStrokesInRow < (numOfStrokesInRow-1) && idx < length-1  )
                    result += "&nbsp;&nbsp;|&nbsp;&nbsp;";
                return result;
            });

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

// Takes the current editor's text and treats is as a rhythm card
function parseRhythmCard() {

    // STEP 1. Load the instrument definitions
    let rhythmCardText = new TextRhythmEditorAgent(RHYTHM_EDITOR_TEXT_ID).getRhythm();

    let rCard = new RhythmCard();
    rCard.parseRhythmCardText( rhythmCardText );
    console.log( "Loading rhythm card: " + rCard.name + "\n" + "Category: " + rCard.category );

    let arrInstrNames = rCard.records.map( record => record.instrument );

    function onInstrumentsLoaded() {
        // STEP 2. Create instrument instances, set the tempo
        const rack = instrumentRackUI.rack;
        rack.deleteAll();

        tempoAgent.setTempo( rCard.tempo );

        rCard.records.forEach( record => {
            let {rhythm, instrument, gain, pan, mute} = record;
            console.log( instrument, gain, pan, rhythm );
            
            let instrInstance = rack.createInstrumentInstance( instrument );
            instrInstance.data.rhythm = rhythm;
            instrInstance.data.audio.gain = gain;
            instrInstance.data.audio.panorama = pan;
            instrInstance.data.audio.mute = mute;

        });

        instrumentRackUI.render();
        instrumentRackMixer.updateAndRender();

    }

    instrumentManager.loadMultipleInstruments(arrInstrNames, onInstrumentsLoaded);
}

