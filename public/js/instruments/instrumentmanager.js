// DON'T USE underscore "~" in the name of the instrument.
const INSTRUMENT_ID_SPLITTER = "~";

/*
Loading instrument definitions.
Loading instruments by those definitions.
Managing the currently selected instrument.
Storing memory for each instrument (last rhythms, audio settings etc).
*/
class InstrumentManager {
    constructor() {
        this.allInstruments = [];
        this.selectedInstrument = null;
        this.instrumentChangedListeners = [];
        // key: instrument name, memory contains such elements like audio settings, last entered rhythms etc.
        this.instrumentsMemory = {};
        this.currentModalDiv = null;
        this.callbackWhenInstrumentDefinitionsLoaded = null;
        this.callbackWhenInstrumentIsLoaded = null;
    }

    loadInstrumentDefinitions(callbackWhenInitIsDone) {
        this.callbackWhenInstrumentDefinitionsLoaded = callbackWhenInitIsDone;
        let instrDefLoader = new InstrumentDefinitionsLoader();
        instrDefLoader.loadDefinitions( this.onInstrumentDefinitionsLoaded.bind(this) );
    }

    onInstrumentDefinitionsLoaded( instrumentDefinitions ) {
        this.allInstruments = instrumentDefinitions;
        this.selectedInstrument = this.allInstruments ? this.allInstruments[0] : null;
        if ( this.callbackWhenInstrumentDefinitionsLoaded ) 
            this.callbackWhenInstrumentDefinitionsLoaded();
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
        this.loadInstrument(instrument, this.onInstrumentLoaded.bind(this) );
    }

    // Call this function to load instrument and give the callback to get notified when the instrument is loaded.
    // The callback function receives one argument, it is instrument which was loaded.
    // In instrumentRef you can pass either name of the instrument or the instrument itself.
    // While the instrument is being loaded the modal window in shown "Loading the instrument <instrument name>".
    loadInstrument(instrumentRef, callbackFunction) {
        let instrument = null;
        if ( typeof instrumentRef === 'string') instrument = this.getInstrument(instrumentRef);
        else instrument = instrumentRef;

        if (!audioFilePlayer.isInstrumentLoaded(instrument) ) {
            // load audio
            this.callbackWhenInstrumentIsLoaded = callbackFunction;
            audioFilePlayer.loadAudioFiles( instrument, this.onInstrumentAudioLoaded.bind(this) );
            this.currentModalDiv = new ModalDiv();
            this.currentModalDiv.show( `Loading instrument: ` + instrument.instrumentName );

        } else
            this.instrumentLoaded(instrument);   

        // load image for future use in canvas
        if ( !instrument.imagesLoaded && instrument.images && 
            instrument.images.large && this.checkInstrumentVisualizationInfo(instrument) ) {
            var img = new Image();
            img.onload = () => {
                instrument.imagesLoaded = true;
                if ( audioFilePlayer.isInstrumentLoaded(instrument) ) {
                    this.instrumentLoaded(instrument);
                }
            };
            instrument.images.largeImg = img;
            img.src = instrument.folder + "/" + instrument.images.large; // start downloading
        } else instrument.imagesLoaded = true;
    }

    instrumentLoaded( instr ) {
        if (this.callbackWhenInstrumentIsLoaded) {
            this.callbackWhenInstrumentIsLoaded(instr);
            this.callbackWhenInstrumentIsLoaded = null;
        }
        
        // hide the status "LOADING..."
        if (this.currentModalDiv){
            this.currentModalDiv.close();
            this.currentModalDiv = null;
        }
    }


    onInstrumentAudioLoaded(instr) {
        if (instr.imagesLoaded)
            this.instrumentLoaded(instr);
    }

    // finishes the instrument selection process
    onInstrumentLoaded(instr) {
        // we change selected instrument value only when in is finally loaded
        this.selectedInstrument = instr;
        this.notifyInstrumentChanged();
    }

    checkInstrumentVisualizationInfo(instrument) {
        return instrument.strokeCoordinates;
    }

    addInstrumentChangedListener(listener) {
        this.instrumentChangedListeners.push(listener);
    }

    notifyInstrumentChanged() {
        this.instrumentChangedListeners.forEach( listener => {
            if (listener) listener.instrumentChanged( this.selectedInstrument );
        });
    }

    getInstrumentGain(instrumentName) {
        let instrument = this.getInstrument( instrumentName );
        if (instrument && instrument.gain)
            return parseFloat( instrument.gain );
        return 1;
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
                [RHYTHM_EDITOR_TYPE_TEXT]: trimLinesInRhythm(instrument.defaultRhythms[RHYTHM_EDITOR_TYPE_TEXT]),
                [RHYTHM_EDITOR_TYPE_VISUAL]: trimLinesInRhythm(instrument.defaultRhythms[RHYTHM_EDITOR_TYPE_VISUAL])
            }
        }
        return this.instrumentsMemory[instrumentName][rhythmType];
    }

}

const instrumentManager = new InstrumentManager();