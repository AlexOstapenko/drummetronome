const ID_BUTT_PLAYSTOP = "buttPlayStop";
const ID_INPUT_TEMPO = "inputTempo";
const ID_INPUT_TEMPOVAL = "inputTempoValue";

const ID_DIV_TEMPO = "divTempo";

const L_BUTT_PLAY = "PLAY";
const L_BUTT_STOP = "STOP";

const DEFAULT_BPM = 180;
const defaultRhythm = "D-T-Tkk";


const soundPlayer = audioFilePlayer;

function onDocumentLoaded() {
    
    rhythmBoard.setNewRhythm(defaultRhythm);

    rhythmBoard.addRhythmChangedListener( rhythmPlayer.onRhythmChange.bind(rhythmPlayer) );

    rhythmBoard.render();
    strokeSelector.render();
    RHYTHMS_DB.render();

    document.getElementById(ID_INPUT_TEMPO).value = DEFAULT_BPM;
    document.getElementById(ID_INPUT_TEMPOVAL).innerHTML = DEFAULT_BPM;

    // load sounds
    soundPlayer.loadAudioFiles( DEFAULT_INSTRUMENT );
}

function testSound() {
    soundPlayer.resumeAudio().then( function () {
        soundPlayer.playStroke( "darbuka_D", 0);
    });
}

function clickPlayRhythm() {

    let butt = document.getElementById(ID_BUTT_PLAYSTOP);

    if ( rhythmPlayer.isActive ) {
        // stop
        rhythmPlayer.stop();
        butt.innerText = L_BUTT_PLAY; 
        butt.className = "button-listen";

        showTempoDiv(true);

    } else {
        // start or restart
        rhythmPlayer.stop();
        butt.innerText = L_BUTT_STOP; 
        butt.className = "button-stop";

        soundPlayer.resumeAudio().then( function () {
            onChangeTempo(); // make sure we use new tempo value
            rhythmPlayer.setRhythm( new Rhythm(rhythmBoard.rhythm) );
            rhythmPlayer.play();
         });

         showTempoDiv(false);
    }
}

function showTempoDiv(doShow)  {
    document.getElementById( ID_DIV_TEMPO ).style.visibility = doShow ? "visible" : "hidden";
}

// Set new tempo if player is not active
function onChangeTempo() {
    let bpm = document.getElementById(ID_INPUT_TEMPO).value;
    document.getElementById(ID_INPUT_TEMPOVAL).innerHTML = bpm;

    if (rhythmPlayer.isActive) return;
    let tempo = {beatsCount: rhythmBoard.size,  bpm: bpm*2};
    rhythmPlayer.tempo = tempo;
}