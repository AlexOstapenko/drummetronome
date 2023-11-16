
const soundPlayer = audioFilePlayer; // object that actually plays sounds

function onDocumentLoaded() {

    instrumentManager.loadInstrumentDefinitions( function() {
        initDefaultInstrument();
        setDefaultValues();
        rhythmsDBUI.render();
        strokeSelector.init();
        instrumentSelector.init();
        instrumentSelector.render();
        rhythmPlayer.init();
        rhythmEditorsManager.updateRhythmEditorVisibility();
        initVisualRhythmEditor();
        addUIEventHandlers();    
    });
}

function initDefaultInstrument() {
    // load sounds
    const currInstr = instrumentManager.currentInstrument;
    soundPlayer.loadAudioFiles( currInstr );

    // set default rhythm texts for visual and text rhythm editor
    rhythmBoard.setNewRhythm(instrumentManager.recallRhythm( currInstr.instrumentName, RHYTHM_EDITOR_TYPE_VISUAL) );
    rhythmEditorsManager.setTextRhythm( instrumentManager.recallRhythm( currInstr.instrumentName, RHYTHM_EDITOR_TYPE_TEXT)  );
}

function setDefaultValues() {
    document.getElementById(ID_INPUT_TEMPO).value = DEFAULT_BPM;
    document.getElementById(ID_INPUT_TEMPOVAL).innerHTML = DEFAULT_BPM;
}

function addUIEventHandlers() {

    function updateRhythmSize() {
        rhythmBoard.buildEmptyRhythm( document.getElementById( RHYTHM_SIZE_INPUT_ID ).value );
    }

    // process ENTER in editing rhythm size input field
    document.getElementById("rhythmSize").addEventListener('keyup', function (event) {
        if (event.key === 'Enter') 
            updateRhythmSize();
    });

    document.getElementById("buttonOkNewRhythmSize").addEventListener('click', function (event) {
        updateRhythmSize();
    });
}

function initVisualRhythmEditor() {
    
    rhythmBoard.addRhythmChangedListener( rhythmPlayer.onRhythmChange.bind(rhythmPlayer) );
    rhythmBoard.render();
    strokeSelector.render();
}

// There is 2 types of rhythm, editors: visual, more simple 
// and text editor where you can define more complex rhythmic phrases
function switchRhythmEditor() {
    rhythmEditorsManager.switchRhythmEditor();
}

function buttonSetRhythmSize(num) {
    if ( rhythmPlayer.isActive ) return;
    rhythmBoard.buildEmptyRhythm(num);
}

function clickPlayRhythm() {

    let butt = document.getElementById(ID_BUTT_PLAYSTOP);

    if ( rhythmPlayer.isActive ) {

        // stop
        rhythmPlayer.stop();
        playingDurationTimer.stop();

        butt.innerText = L_BUTT_PLAY; 
        butt.className = "button-play";

        showTempoDiv(true);
    } else {
        // start or restart
        rhythmPlayer.stop();
        butt.innerText = L_BUTT_STOP; 
        butt.className = "button-stop";

        soundPlayer.resumeAudio().then( function () {
            setRhythmAndTempoInfoToPlayer();
            rhythmPlayer.play();
            playingDurationTimer.start();
         });
         showTempoDiv(false);
    }
}

function showTempoDiv(doShow)  {
    document.getElementById( ID_DIV_TEMPO ).style.visibility = doShow ? "visible" : "hidden";
}

// When the tempo range element's value is changed
function onChangeTempo() {
    if (rhythmPlayer.isActive) return; // if user wants to change the tempo - only through STOP-START

    let bpm = document.getElementById(ID_INPUT_TEMPO).value;
    document.getElementById(ID_INPUT_TEMPOVAL).innerHTML = bpm;
}

// Set new tempo and rhythm if player is not active
function setRhythmAndTempoInfoToPlayer() {
    if (rhythmPlayer.isActive) return;

    let bpm = document.getElementById(ID_INPUT_TEMPO).value;

    let tempoInfo = {};
    let rhythmData = {precount: "", mainRhythm: ""};

    if (rhythmEditorsManager.rhythmEditors[rhythmEditorsManager.currentRhythmEditorIdx] === RHYTHM_EDITOR_TYPE_VISUAL) {
        let beatsCount = rhythmBoard.size;
        let actualBPM = bpm*2;

        tempoInfo.oneLoopDuration = 1000*beatsCount*60/actualBPM;
        tempoInfo.onePulseDuration = 60*1000/actualBPM;
        
        // setting up the rhythm
        rhythmData.mainRhythm = rhythmBoard.rhythm.join( " " );

    } else if (rhythmEditorsManager.rhythmEditors[rhythmEditorsManager.currentRhythmEditorIdx] === RHYTHM_EDITOR_TYPE_TEXT) {
        let textRhythmRaw = rhythmEditorsManager.getTextRhythm();
        let processedRhythm = processRawTextRhythm( textRhythmRaw );
        if ( Array.isArray(processedRhythm ) ) { // in means we have 0 - precount, 1 - rhythm itself
            rhythmData.precount = processedRhythm[0];
            rhythmData.mainRhythm = processedRhythm[1];
        } else rhythmData.mainRhythm = processedRhythm;

        let rhythmPhrase = new Phrase( rhythmData.mainRhythm );
        tempoInfo.onePulseDuration = 60*1000/(bpm*2);
        tempoInfo.oneLoopDuration = rhythmPhrase.getSize(false) * tempoInfo.onePulseDuration;
    }

    rhythmPlayer.tempoInfo = tempoInfo;
    rhythmPlayer.setRhythm( Rhythm.createRhythm( new Phrase(rhythmData.mainRhythm) ), 
                            Rhythm.createRhythm( new Phrase(rhythmData.precount) ) );
}




