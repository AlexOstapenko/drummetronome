
/* Loop the given rhythm.
 How is rhythm represented? By an objet of class Rhythm.

*/

class RhythmPlayer {

    constructor() {
        this.performance =
            { 
                instrName : DEFAULT_INSTRUMENT, 
                startTime: 0, // last scheduled time of the 1st beat of rhythm
                oneLoopDuration: 0, // will be calculated when the particlar rhythm will be set
                onePulseDuration: 0, // will be calculated when the particlar rhythm will be set
                rhythm: null, // should be object of class Rhythm
                timeline: [], // rhythm -> relative time of each next sound within one bar
                isActive: false,
                scheduleLoop: -1,
                doUpdateTimeline: false,

            };

            this.audioPlayer = audioFilePlayer;
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
    set tempoInfo(tempoInfo)  {
        this.performance.onePulseDuration = tempoInfo.onePulseDuration;
        this.performance.oneLoopDuration = tempoInfo.oneLoopDuration;
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
            this.audioPlayer.playStroke( 
                {instrumentName: DEFAULT_INSTRUMENT.instrumentName, strokeName: timeLineItem.stroke}, 
                time
            ); 
        });

        // TODO: oneLoopDuration
        this.performance.startTime += this.performance.oneLoopDuration/1000;
    }

    stop() {
        this.performance.isActive = false;
        this.audioPlayer.turnOffSound();
        if ( this.performance.scheduleLoop!= -1 )
            clearInterval( this.performance.scheduleLoop );
    }

    // based on the info from performance builds timeline array which contains objects with time and stroke name to play
    calculateTimeline() {
        this.performance.timeline = [];
        let accumulatedTime = 0;

        this.performance.rhythm.elements.forEach( item => {
            if ( !isPause(item.stroke) ) { // there is no sense to add pause to timeline
                this.performance.timeline.push( { 
                    stroke: item.stroke,
                    relativeTime: accumulatedTime, 
                });
            }

            // move accumulated time forward for next iteration
            const thisStrokeDuration = item.size*this.performance.onePulseDuration;
            accumulatedTime += thisStrokeDuration;
        });

        this.performance.doUpdateTimeline = false;
    }

    play() {
        this.stop();
        this.audioPlayer.turnOnSound();

        this.calculateTimeline();
        this.performance.isActive = true;
        this.performance.startTime = this.audioPlayer.audioContext.currentTime;
        
        this.scheduleNextBar();

        this.performance.scheduleLoop = setInterval(function () {
            this.scheduleNextBar();
        }.bind( this ), this.performance.oneLoopDuration-200 ); // 200 ms before the end of the loop schedule next loop

    }

    // EVENT HANDLER FOR RHYTHM CHANGE
    onRhythmChange(newRhythm) {
        //this.setRhythm( newRhythm );
    }

}

const rhythmPlayer = new RhythmPlayer();