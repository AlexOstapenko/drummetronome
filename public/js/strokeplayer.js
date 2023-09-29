const NOTES = {
  "C": 261.63, "C#": 277.18, "D": 293.66, "D#": 311.13,
  "E": 329.63, "F": 349.23, "F#": 369.99, "G": 392.00,
  "G#": 415.30, "A": 440.00, "A#": 466.16, "B": 493.88
};

const INSTR_FRAMEDRUM = "frame drum";
const NoteDefaultDuration = 0.05;


const FRAMEDRUM_SOUNDS = {
    name: INSTR_FRAMEDRUM,
    stroke2frequecy: {
        "D": {frequency: NOTES["C"]}, 
        "P": {frequency: NOTES["D"]},
        "T": {frequency: NOTES["A"]},
        "t": {frequency: NOTES["A"], gain: 0.3},
		"K": {frequency: NOTES["A#"]},
        "k": {frequency: NOTES["A#"], gain: 0.3},
        "R": {frequency: NOTES["E"]},
        "L": {frequency: NOTES["F"]},
        "-": {frequency: 0}
    }
}

// Interacts with Web Audio API and plays given strokes
class OscilatorStrokePlayer {

    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
		this.soundIdx = 0;
		this.gainNode = null;
    }

	get audioContext() { 
		return this.audioCtx; 
	}

	resumeAudio() {
		return this.audioCtx.resume();
	}

    turnOnSound()
	{
		this.gainNode = this.audioCtx.createGain();
        this.gainNode.gain.value = 1;
        this.gainNode.connect( this.audioCtx.destination );
    }

    turnOffSound()
	{
		if (!this.gainNode) return;
		this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.5);
		this.gainNode.disconnect();
	}

	// strokeInfo may be string with stroke ID or object with such fields: instrName, stroke, gain
	playStroke( strokeInfo, when ) {
		let strokeID = "";
		let instrName = "";
		if ( typeof strokeInfo == "string" ) {
			strokeID = strokeInfo;
		} else if (typeof strokeInfo == "object") {
			instrName = strokeInfo.instrName;
		}

		if ( instrName != INSTR_FRAMEDRUM)
			return;

		// get info about stroke - frequency, gain
		let strokeData = FRAMEDRUM_SOUNDS.stroke2frequecy[strokeInfo.stroke];
		if (!strokeData) return;

		let frequency = strokeData.frequency ? strokeData.frequency : 0;
		let gain = strokeData.gain ? strokeData.gain : 1.0;

		if (frequency > 0)
			playNote( frequency, when, gain );
	}
}

const strokePlayer = new OscilatorStrokePlayer();

function playNote(noteFrequency, when, gain) {
	let audioContext = strokePlayer.audioContext;
	var oscillator = audioContext.createOscillator();
	oscillator.frequency.setValueAtTime(noteFrequency, audioContext.currentTime);

	let gainNode = strokePlayer.gainNode;
	if (gain) {
		let noteGain = audioContext.createGain();
        noteGain.gain.value = gain;
        noteGain.connect( strokePlayer.gainNode);
        gainNode = noteGain;
	}

	oscillator.connect( gainNode );
	oscillator.start(when);
	oscillator.stop(when + NoteDefaultDuration);
}




















