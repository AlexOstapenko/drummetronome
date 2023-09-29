
// Loop the given rhythm 

class RhythmPlayer {

    constructor() {
        this.performance =
            { 
                instrName : DEFAULT_INSTRUMENT, 
                startTime: 0, // last scheduled time of the 1st beat of rhythm
                oneBarDuration: 2400,
                rhythm: null, // should be object of class Rhythm
                timeline: [], // rhythm -> relative time of each next sound within one bar
                isActive: false,
                scheduleLoop: -1,
                doUpdateTimeline: false,

            };

            this.player = audioFilePlayer;
    }

    get isActive() { return this.performance.isActive; }

    setRhythm(rhythm) {
        this.performance.rhythm = rhythm;
        this.performance.doUpdateTimeline = true;
    }

    /**
     * Calculates duration of one bar based on two params: how many beats in one bar and what is bpm.
     * @param {{ beatsCount: any; bpm: any; }} value
     */
    set tempo(value)  {
        let {beatsCount, bpm} = value;
        this.performance.oneBarDuration = 1000*beatsCount*60/bpm;
        this.performance.doUpdateTimeline = true;
    }

    /**
     * Schedule next bar of the rhythm with Web Audio API
     */
    scheduleNextBar() {

        // rhythm has been changed, let's recalculate timeline
        if (this.performance.doUpdateTimeline) {
            this.calculateTimeline();
            this.performance.doUpdateTimeline = false;
        }

        // schedule next bar of rhythm in Web Audio API from new startTime
        this.performance.timeline.forEach( timeLineItem => {

            const time = this.performance.startTime + timeLineItem.relativeTime/1000;
            this.player.playStroke( 
                {instrumentName: DEFAULT_INSTRUMENT.instrumentName, strokeName: timeLineItem.stroke}, 
                time
            ); 
        });

        this.performance.startTime += this.performance.oneBarDuration/1000;
    }

    stop() {
        this.performance.isActive = false;
        this.player.turnOffSound();
        if ( this.performance.scheduleLoop!= -1 )
            clearInterval( this.performance.scheduleLoop );

    }

    // based on the info from performance builds timeline array which contains objects with time and stroke name to play
    calculateTimeline() {
        let info = this.performance;
        let numOfStrokes = info.rhythm.strokes.length;
        info.timeline = [];

        let onePulseDuration = info.oneBarDuration / numOfStrokes;
        info.rhythm.strokes.forEach( (stroke, idx) => {
            if ( !isPause(stroke) ) {
                info.timeline.push( { 
                    relativeTime: onePulseDuration*idx, 
                    stroke: stroke
                });
            }
        });

        this.performance.doUpdateTimeline = false;
    }

    play() {
        this.stop();
        this.player.turnOnSound();

        this.calculateTimeline();
        this.performance.isActive = true;
        this.performance.startTime = strokePlayer.audioContext.currentTime;
        
        this.scheduleNextBar();

        this.performance.scheduleLoop = setInterval(function () {
            this.scheduleNextBar();
        }.bind( this ), this.performance.oneBarDuration-200 );
    }

    // EVENT HANDLER FOR RHYTHM CHANGE
    onRhythmChange(newRhythm) {
        this.setRhythm( newRhythm );
    }

}

const rhythmPlayer = new RhythmPlayer();