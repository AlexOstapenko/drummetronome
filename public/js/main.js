const ID_BUTT_PLAYSTOP = "buttPlayStop";
const ID_INPUT_TEMPO = "inputTempo";
const ID_INPUT_TEMPOVAL = "inputTempoValue";

const ID_DIV_TEMPO = "divTempo";

const L_BUTT_PLAY = "PLAY";
const L_BUTT_STOP = "STOP";

const DEFAULT_BPM = 90;

const soundPlayer = audioFilePlayer; // object that actually plays sounds

function onDocumentLoaded() {

    initDefaultInstrument();

    setDefaultValues();
    rhythmsDBUI.render();

    instrumentSelector.render();

    updateRhythmEditorVisibility();

    //if ( rhythmEditors[rhythmEditorsManager.currentRhythmEditorIdx] === RHYTHM_EDITOR_VISUAL)
    initVisualRhythmEditor();
    
    addUIEventHandlers();
}

function initDefaultInstrument() {
    // load sounds
    const currInstr = instrumentManager.currentInstrument;
    soundPlayer.loadAudioFiles( currInstr );

    // set default rhythm texts for visual and text rhythm editor
    rhythmBoard.setNewRhythm(currInstr.defaultRhythms[0] );
    setTextRhythm( currInstr.defaultRhythms[1] );
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
    rhythmEditorsManager.currentRhythmEditorIdx++; 
    if (rhythmEditorsManager.currentRhythmEditorIdx === rhythmEditors.length) rhythmEditorsManager.currentRhythmEditorIdx = 0;

    updateRhythmEditorVisibility();
}

function updateRhythmEditorVisibility() {
    // show the current rhythm editor type
    rhythmEditors.forEach( (item, idx) => {
        let div = document.querySelector(`#${item}`);
        div.style.display = (idx===rhythmEditorsManager.currentRhythmEditorIdx) ? "flex" : "none";
    });

    document.querySelector('#buttonSwitchRhythmEditor').innerText = 
        buttonLabelsForRhythmEditors.slice().reverse()[rhythmEditorsManager.currentRhythmEditorIdx];
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
    let rhythmPhrase = null;

    if (rhythmEditors[rhythmEditorsManager.currentRhythmEditorIdx] === RHYTHM_EDITOR_VISUAL) {
        let beatsCount = rhythmBoard.size;
        let actualBPM = bpm*2;

        tempoInfo.oneLoopDuration = 1000*beatsCount*60/actualBPM;
        //tempoInfo.onePulseDuration = tempoInfo.oneLoopDuration / beatsCount; 
        tempoInfo.onePulseDuration = 60*1000/actualBPM;
        
        // setting up the rhythm
        rhythmPhrase = new Phrase( rhythmBoard.rhythm.join( " " ) );

    } else if (rhythmEditors[rhythmEditorsManager.currentRhythmEditorIdx] === RHYTHM_EDITOR_TEXT) {
        let textRhythmRaw = getTextRhythm();
        rhythmPhrase = new Phrase( processRawTextRhythm( getTextRhythm() ) );
        tempoInfo.onePulseDuration = 60*1000/(bpm*2);
        tempoInfo.oneLoopDuration = rhythmPhrase.getSize(false) * tempoInfo.onePulseDuration;
    }

    rhythmPlayer.tempoInfo = tempoInfo;
    rhythmPlayer.setRhythm( createRhythm( rhythmPhrase ) );
}






