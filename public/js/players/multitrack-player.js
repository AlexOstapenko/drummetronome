
class Track {
	constructor(parentRack, instrument) {
		this.parentRack = parentRack;
		this.rhythmPhrase = null;
		this.oneLoopDuration = 0;
		this.timeline = [];
		this.instrument = instrument;
		this.intervalID = -1;
		this.audioSetup = {};
		this.lastStartTime = 0;
		this.doRepeat = false;

		// create track's own gain node and panorama node
		const audioCtx = this.parentRack.audioPlayer.audioCtx;

		this.gainNode = audioCtx.createGain();
        this.gainNode.gain.value = 1;
	    this.panNode = audioCtx.createStereoPanner();
	    this.panNode.pan.value = 0;
	}	

	set rhythm(rhythmText) {
		this.rhythmPhrase = new Phrase( rhythmText );
		this.oneLoopDuration = this.rhythmPhrase.getSize(false) * this.parentRack.onePulseDuration;
		this.calculateTimeline();
	};

	/**
     * Schedule next bar of the rhythm with Web Audio API.
     * Returns the duration of the phrase that has been scheduled.
     */
    scheduleNextLoop( ) {
        // schedule next bar of rhythm in Web Audio API from new startTime
        this.timeline.forEach( timeLineItem => {

            const time = this.lastStartTime + timeLineItem.relativeTime/1000;
            const strokeInfo = 
            {
            	instrumentName: this.instrument.instrumentName, 
            	strokeName: timeLineItem.stroke,
            	gainNode: this.gainNode,
            	panNode: this.panNode
            };

            this.parentRack.audioPlayer.playStroke( 
                strokeInfo, 
                time
            );
        });

        this.lastStartTime += this.oneLoopDuration/1000;

    	// setup the repetition of scheduling for the track if doRepeat is set to true
        if (this.doRepeat && this.intervalID===-1) {
			this.intervalID = setInterval(function () {
		        this.scheduleNextLoop();
		    }.bind( this ), this.oneLoopDuration );
        }

        return this.oneLoopDuration;
    }

	calculateTimeline() {
		this.timeline = [];
        let accumulatedTime = 0;

        let addRhythmToTimeline = ( rhythm, accumulatedTime ) => {
            rhythm.elements.forEach( item => {
                if ( !isPause(item.stroke) ) { // there is no sense to add pause to timeline

                    // it is allowed the + sign in the syllable. It means several syllables should be played simultaneously.
                    // here we'll split them and add each to timeline.

                    item.stroke.split( MULTI_STROKE_JOINT ).forEach( (singleStroke, idx) => {
                        this.timeline.push( { 
                            stroke: singleStroke,
                            relativeTime: accumulatedTime
                        });
                    });
                }

                // move accumulated time forward for next iteration
                const thisStrokeDuration = item.size*this.parentRack.onePulseDuration;
                accumulatedTime += thisStrokeDuration;
            });
            return accumulatedTime;
        }

        // add rhythm to timeline
        addRhythmToTimeline( Rhythm.createRhythm( this.rhythmPhrase ), accumulatedTime );
	}

	gainPanoramaChanged(newVal) {
		this.gainNode.gain.value = newVal.gain;
		this.panNode.pan.value = newVal.panorama;
	} 
}

/*
	This is player for InstrumentRack, which means multiple instruments will play simultaneously.
*/
class MultiTrackRhythmPlayer {
	constructor() {
		this.audioPlayer = audioFilePlayer;
		this.onePulseDuration = 0; // duration of one pulse will be common for all timelines
		this.isPlaying = false;

		// Array of tracks, one for each instrumentInstance. Array of objects, 
		// each object with it's own timeline, lastStartTime, 
		// loopDuration, interval function id etc.
		this.tracks = [];
		this.precountTrack = null; // precount is taken from the first instrument that has precount. others are ignored
	}

	/*
		Retrieves raw text rhythms for each instance, which is not muted (data.audio.mute property).
		Parses those texts, finds pre-count (chooses the first one and ignores all others) and prepares timelines for the first lauch.
		Prepares all necessary info to this.tracks[] array to play.
	*/
	prepare(instrumentRack) {
		this.tracks = [];
		if ( !instrumentRack.instrumentInstances ) return;

		instrumentRack.instrumentInstances.forEach( instrInst => {
			// take into account only un-muted instruments
			if ( !instrInst.data.audio.mute ) {

				let currTrack = new Track(this, instrInst.instrument);
				currTrack.doRepeat = true;

				// add event listener about gain / panorama change
				instrInst.gainPanChangeListener.addValueChangeListener( currTrack.gainPanoramaChanged.bind(currTrack) );

				// get the audio setup if any
				if (instrInst.data.audio) {
					if ( instrInst.data.audio.gain )
						currTrack.audioSetup.gain = instrInst.data.audio.gain;
					if (instrInst.data.audio.panorama)
						currTrack.audioSetup.panorama = instrInst.data.audio.panorama;	
				};

				// get the main rhythm and precount (if any)
				let processedRhythm = processRawTextRhythm( instrInst.data.rhythm );
		        if ( Array.isArray(processedRhythm ) ) { // in means we have 0 - precount, 1 - rhythm itself
		            if (!this.precountTrack) { // setup special track for precount only if it doesn't exist yet
		            	this.precountTrack = new Track( this, instrInst.instrument );
		            	this.precountTrack.doRepeat = false;
						this.precountTrack.audioSetup = currTrack.audioSetup;
						this.precountTrack.rhythm = processedRhythm[0];
						// leave here only the text of main rhythm
						processedRhythm = processedRhythm[1];
		            } 
		        }
		        currTrack.rhythm = processedRhythm;
		        this.tracks.push( currTrack );
			}
		});
	}

	play(instrumentRack, bpm ) {
		this.stop();
        this.audioPlayer.turnOnSound();
		this.onePulseDuration = 60*1000/(bpm*2);
		this.isPlaying = true;

		const playStartTime = this.audioPlayer.audioContext.currentTime+0.05;

        // get ready precount (if any) and rhythms of all the tracks
		this.prepare(instrumentRack);
			
        // initially schedule just the precountTrack (if it is defined) and after this calculate timelines for each track
        if (this.precountTrack) {
        	this.precountTrack.lastStartTime = playStartTime;
			let precountDuration = this.precountTrack.scheduleNextLoop();
			this.precountTrack = null; // we don't need it anymore
			// closer to an end of precountTrack schedule first loop for all tracks
			setTimeout( function() {
		        this.scheduleAllTracks(playStartTime + precountDuration/1000);
		    }.bind(this), precountDuration - 200 );
		} else 
			this.scheduleAllTracks(playStartTime); // if there's no precount - start immediately all tracks
	}

	scheduleAllTracks(startTime) {
		this.tracks.forEach( track => {
			track.lastStartTime = startTime;
			track.scheduleNextLoop();

			// // setup the repetition of scheduling for each track
			// track.intervalID = setInterval(function () {
		    //     track.scheduleNextLoop();
		    // }.bind( track ), track.oneLoopDuration ); // approx 200 ms before the end of the loop schedule next loop
		});
	}

	stop() {
        this.isPlaying = false;
        this.audioPlayer.turnOffSound();
        this.stopAllIntervals();
        this.tracks = [];
    }

    stopAllIntervals() {
    	if (!this.tracks) return;

    	this.tracks.forEach( track => {
    		if (track.intervalID!== -1) clearInterval( track.intervalID );
    	});
    }
}

const mtRhythmPlayer = new MultiTrackRhythmPlayer();


