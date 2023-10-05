class InstrumentManager {
    constructor() {
        this.allInstruments = [INSTRUMENT_DARBUKA, INSTRUMENT_COOPERMAN_TAR];
        //this.selectedInstrument = INSTRUMENT_COOPERMAN_TAR;
        this.selectedInstrument = INSTRUMENT_DARBUKA;

        this.instrumentChangedListeners = [];
    }

    strokeNames(instrument) {
        return instrument.arrStrokeInfo.map(item => item.stroke);
    }

    get currentInstrument() {
        return this.selectedInstrument;
    }

    set currentInstrument(instrument) {
        if ( instrument.instrumentName === this.currentInstrument.instrumentName) return;

        function instrumentLoaded( instr ) {
            // we change selected instrument value only when in is finally loaded
            instrumentManager.selectedInstrument = instr;
            instrumentManager.notifyInstrumentChanged();

            // todo: hide the status "LOADING..." 
        }
        if (!audioFilePlayer.isInstrumentLoaded(instrument) )
            audioFilePlayer.loadAudioFiles( instrument, instrumentLoaded );
        else
            instrumentLoaded(instrument);
    }

    addInstrumentChangedListener(listener) {
        this.instrumentChangedListeners.push(listener);
    }

    notifyInstrumentChanged() {
        this.instrumentChangedListeners.forEach( listener => {
            if (listener) listener.instrumentChanged( this.currentInstrument );
        });
    }

    // strokeID = <instrumentName>~<strokeName>
    // get the gain value (if defined) from the corresponding instrument definition. If gain is not defined - return -1;
    getGainValue( strokeID ) {
        let arr = strokeID.split(INSTRUMENT_ID_SPLITTER);
        let instrName = arr[0];
        let strokeName = arr[1];

        // search the needed instrument
        for (let instr of this.allInstruments) {
            if (instr.instrumentName === instrName) {
                for (let strokeInfo of instr.arrStrokeInfo) {
                    if (strokeInfo.stroke === strokeName) {
                        // !!! found it!
                        if ( strokeInfo.gain ) 
                            return strokeInfo.gain;
                        else return -1;
                    }
                };
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
}

const instrumentManager = new InstrumentManager();