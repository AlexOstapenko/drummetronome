
const MULTI_STROKE_JOINT = '-';

/* 
 Loop the given rhythm.
 How is rhythm represented? By an objet of class Rhythm.
 In the first round, if given, first will be played precount and only after that the rhythm will be looped.
 Precount is any rhythmic phrase that is separated by three stars *** from the rest of the rhythmic text.

*/

class RhythmPlayer {

    constructor() {
        this.performance =
            { 
                instrName : instrumentManager.currentInstrument.instrumentName, 
                startTime: 0, // last scheduled time of the 1st beat of rhythm
                oneLoopDuration: 0, // will be calculated when the particlar rhythm will be set
                onePulseDuration: 0, // will be calculated when the particlar rhythm will be set
                rhythm: null, // should be object of class Rhythm
                precount: null, // should be object of class Rhythm
                timeline: [], // rhythm -> relative time of each next sound within one bar
                isActive: false,
                scheduleLoop: -1,
                doUpdateTimeline: false,
                isJustStarted : false

            };

            this.audioPlayer = audioFilePlayer;
    }

    get isActive() { return this.performance.isActive; }
    get startTime() { return this.performance.startTime };

    // Here you set the rhyth to be looped (an instance of class Rhythm), 
    // and optionally precount rhythm that should be played just once in the beginning (also object of class Rhythm).
    setRhythm(rhythm, precount) {
        this.performance.rhythm = rhythm;
        this.performance.precount = precount ? precount : null;
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
     * Schedule next bar of the rhythm with Web Audio API.
     * Returns the duration of the phrase that has been scheduled.
     * It may be equal to the oneLoopDuration, but for the first time it will also include the precount duration. 
     */
    scheduleNextBar() {

        let loopDuration = this.performance.isJustStarted ? 
            this.performance.precount.size*this.performance.onePulseDuration + this.performance.oneLoopDuration : 
            this.performance.oneLoopDuration;

        // rhythm has been changed, let's recalculate timeline
        if (this.performance.doUpdateTimeline) {
            this.calculateTimeline();
            
        }

        // schedule next bar of rhythm in Web Audio API from new startTime
        this.performance.timeline.forEach( timeLineItem => {

            const time = this.performance.startTime + timeLineItem.relativeTime/1000;
            this.audioPlayer.playStroke( 
                {instrumentName: this.performance.instrName, strokeName: timeLineItem.stroke}, 
                time + (timeLineItem.randomShift ? timeLineItem.randomShift : 0 )
            ); 
        });

        this.performance.startTime += loopDuration/1000;
        return loopDuration;
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

        let addRhythmToTimeline = ( rhythm, accumulatedTime ) => {
            rhythm.elements.forEach( item => {
                if ( !isPause(item.stroke) ) { // there is no sense to add pause to timeline

                    // it is allowed the + sign in the syllable. It means several syllables should be played simultaneously.
                    // here we'll split them and add each to timeline.

                    item.stroke.split( MULTI_STROKE_JOINT ).forEach( (singleStroke, idx) => {
                        this.performance.timeline.push( { 
                            stroke: singleStroke,
                            relativeTime: accumulatedTime,
                            randomShift: idx > 0 ? (Math.floor(Math.random() * 20)/1000) : 0
                        });
                    });
                }

                // move accumulated time forward for next iteration
                const thisStrokeDuration = item.size*this.performance.onePulseDuration;
                accumulatedTime += thisStrokeDuration;
            });
            return accumulatedTime;
        }

        // for the first time add first precount and then main rhythm
        if (this.performance.isJustStarted && this.performance.precount != null ) {
            accumulatedTime = addRhythmToTimeline(this.performance.precount, accumulatedTime);
            this.performance.doUpdateTimeline = true;
        }
        else
            this.performance.doUpdateTimeline = false;

        this.performance.isJustStarted = false;

        // now add the main rhythm
        addRhythmToTimeline(this.performance.rhythm, accumulatedTime);
    }

    play() {
        this.stop();
        this.audioPlayer.turnOnSound();

        this.performance.isJustStarted = true;
        this.performance.doUpdateTimeline = true;
        //this.calculateTimeline();
        this.performance.isActive = true;
        this.performance.startTime = this.audioPlayer.audioContext.currentTime+0.05;
        let precountAndRhythmDuration = this.scheduleNextBar();

        // first time we play precount + main rhythm, but after this we set interval only for main rhythm
        setTimeout( function() {
            this.setInterval()
        }.bind(this), precountAndRhythmDuration - 200 );
    }

    setInterval() {
        this.scheduleNextBar();
        this.performance.scheduleLoop = setInterval(function () {
            this.scheduleNextBar();
        }.bind( this ), this.performance.oneLoopDuration-200 ); // 200 ms before the end of the loop schedule next loop        
    }

    updateCurrentInstrument() {
        this.performance.instrName = instrumentManager.currentInstrument.instrumentName;
    }

    // EVENT HANDLER FOR RHYTHM CHANGE
    onRhythmChange(newRhythm) {
        //this.setRhythm( newRhythm );
    }

}

const rhythmPlayer = new RhythmPlayer();


