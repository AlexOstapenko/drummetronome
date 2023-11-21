/*
We have a stage with several instruments.
Each instrument exists as a separate instance. It contains information about it's rhythm,
sound settings such as gain, panorama, mute etc.
*/
class InstrumentInstance {
    constructor(instrName) {
        this.instrument = instrumentManager.getInstrument( instrName );
        this.id = -1;
        this.data = {
            rhythm: "",
            audio: {
                gain: 1.0,
                panorama: 0,
                mute: false
            }
        }

        this.gainPanChangeNotifier = new ValueChangeNotifier();
    }

    setRhythm( text ) {
        this.data.rhythm = text;
    }

    getRhythm() { return this.data.rhythm };

    notifyAboutChanges() {
        this.gainPanChangeNotifier.notify( 
            {
                gain: this.data.audio.gain,
                panorama: this.data.audio.panorama
            }
        );
    }

    set gain(val) {
        this.data.audio.gain = val;
        this.notifyAboutChanges();
    }

    set panorama(val) {
        this.data.audio.panorama= val;
        this.notifyAboutChanges();   
    }


}