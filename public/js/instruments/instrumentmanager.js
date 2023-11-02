
/*
We have a stage with several instruments.
Each instrument exists as a separate instance. It contains information about the rhythms,
sound settings as volume, panorama etc.
*/
class InstrumentInstance {
    constructor(instrName) {
        this.instrument = instrumentManager.getInstrument( instrName );
        this.data = {
            rhythms: {
                [RHYTHM_TYPE_TEXT]: "",
                [RHYTHM_TYPE_VISUAL] : ""
            },
            audio: {
                gain: 1.0,
                panorama: 0
            }
        }
    }
}

/*
Loading instruments.
Managing the currently selected instrument.
Managing, which instruments are currently active (can be more than one).
Storing memory for each instrument (last rhythms, audio settings etc).
*/
class InstrumentManager {
    constructor() {
        this.allInstruments = [INSTRUMENT_DARBUKA, INSTRUMENT_COOPERMAN_TAR, INSTRUMENT_KOSMOSKY, INSTRUMENT_HAND_D_LOW_MYSTIC];
        this.selectedInstrument = INSTRUMENT_DARBUKA;
        this.activeInstruments = []; 
        this.instrumentChangedListeners = [];
        // key: instrument name, memory contains such elements like audio settings, last entered rhythms etc.
        this.instrumentsMemory = {}; 

        // to keep all info about particular instance of an instrument like rhythms, audio settings etc.
        this.instrumentInstances = {}; // key: instrument name, value - onject of InstrumentInstance
    }

    strokeNames(instrument) {
        return instrument.arrStrokeInfo.map(item => item.stroke);
    }

    get currentInstrument() {
        return this.selectedInstrument;
    }

    set currentInstrument(instrument) {
        if ( instrument.instrumentName === this.selectedInstrument.instrumentName) return;
        this.selectedInstrument = instrument;

        if (!audioFilePlayer.isInstrumentLoaded(instrument) ) {
            audioFilePlayer.loadAudioFiles( instrument, this.instrumentLoaded.bind(this) );
        } else
            this.instrumentLoaded(instrument);
    }

    instrumentLoaded( instr ) {
        // we change selected instrument value only when in is finally loaded
        this.selectedInstrument = instr;
        this.notifyInstrumentChanged();

        // todo: hide the status "LOADING..." 
    }

    addInstrumentChangedListener(listener) {
        this.instrumentChangedListeners.push(listener);
    }

    notifyInstrumentChanged() {
        this.instrumentChangedListeners.forEach( listener => {
            if (listener) listener.instrumentChanged( this.selectedInstrument );
        });
    }

    // strokeID = <instrumentName>~<strokeName>
    // get the gain value (if defined) from the corresponding instrument definition. If gain is not defined - return -1;
    getGainValue( strokeID ) {
        let arr = strokeID.split(INSTRUMENT_ID_SPLITTER);
        let instrName = arr[0];
        let strokeName = arr[1];
        let instrument = this.getInstrument( instrName );


        // search the needed stroke
        for (let strokeInfo of instrument.arrStrokeInfo) {
            if (strokeInfo.stroke === strokeName) {
                // !!! found it!
                if ( strokeInfo.gain ) 
                    return strokeInfo.gain;
                else return -1;
            }
        };

        return -1;
    }

    static makeStrokeID(instrName, strokeName) {
        return `${instrName}${INSTRUMENT_ID_SPLITTER}${strokeName}`;
    }

    getInstrument( instrumentName ) {
        // search the needed instrument
        for (let instr of this.allInstruments) {
            if (instr.instrumentName === instrumentName) {
                return instr;
            }
        }
        return null;
    }

    addInstrumentInstance(instrumentName) {
        this.instrumentInstances.push( new InstrumentInstance( instrumentName ) );
    }

    removeInstrumentInstane( instrumentName ) {
        let newArr = [];
        for( let instr of this.instrumentInstances) {
            if (instr.instrument.instrumentName !== instrumentName )
                newArr.push( instr );
        }
        this.instrumentInstances = newArr;
    }

    // MEMORY FUNCTIONS
    saveRhythm(instrumentName, rhythmType, rhythmRawText) {
        if (!this.instrumentsMemory[instrumentName]) {
            this.instrumentsMemory[instrumentName] = {}
        }
        let instrMemory = this.instrumentsMemory[instrumentName];

        instrMemory[ rhythmType ] = rhythmRawText;
    }

    recallRhythm(instrumentName, rhythmType) {
        if (!this.instrumentsMemory[instrumentName]) {
            let instrument = this.getInstrument( instrumentName );
            this.instrumentsMemory[instrumentName] = {
                [RHYTHM_TYPE_TEXT]: trimLinesInRhythm(instrument.defaultRhythms[RHYTHM_TYPE_TEXT]),
                [RHYTHM_TYPE_VISUAL]: trimLinesInRhythm(instrument.defaultRhythms[RHYTHM_TYPE_VISUAL])
            }
        }
        return this.instrumentsMemory[instrumentName][rhythmType];
    }

}

const instrumentManager = new InstrumentManager();