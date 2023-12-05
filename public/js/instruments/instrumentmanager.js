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
    // In instrumentRef you can pass either name of the instrument or the instrument definition itself.
    // While the instrument is being loaded the modal window in shown "Loading the instrument <instrument name>".
    loadSingleInstrument(instrumentRef, callbackFunction) {
        let instrumentDef = null;
        if ( typeof instrumentRef === 'string') instrumentDef = this.getInstrument(instrumentRef);
        else instrumentDef = instrumentRef;

        if (!audioFilePlayer.isInstrumentLoaded(instrumentDef) ) {
            this.currentModalDiv = new ModalDiv();
            this.currentModalDiv.show( `Loading instrument: ` + instrumentDef.instrumentName );

            this.callbackWhenInstrumentIsLoaded = callbackFunction;

            if (!audioFilePlayer.isInstrumentLoaded(instrumentDef) ) {
                audioFilePlayer.loadAudioFiles( instrumentDef, this.instrumentLoaded.bind(this) );
            }
        } else
            this.currentModalDiv.hide();
    }

    // Called when single instrument is loaded (see loadSingleInstrument method).
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


    // Call this function to load a set of instruments.
    // Pass the callback to get notified when the instruments are loaded.
    // The callback function receives no arguments.
    // While the instruments are being loaded the modal window in shown "Loading instruments: <list>".
    loadMultipleInstruments(arrInstrNames, callbackFunction) {

        // making sure arrInstrNames has only unique values
        function unique(arr) {
            let arrNames = [];
            arr.forEach(name => {
                if (arrNames.indexOf(name)===-1) arrNames.push( name );
            });
            return arrNames;
        }
        let arrInstrumentDefinitions = unique( arrInstrNames ).map( instrName => this.getInstrument(instrName) );

        const currentModalDiv = new ModalDiv();
        currentModalDiv.show( `Loading instruments:]\n` + arrInstrNames.join("\n") );

        const onInstrumentsLoaded = () => {
            currentModalDiv.close();
            callbackFunction();
        }
    
        let multInstrLoader = new MultipleInstrumentsLoader();
        multInstrLoader.loadInstruments( arrInstrumentDefinitions, onInstrumentsLoaded );
    }


    // finishes the instrument selection process
    onInstrumentLoaded(instr) {
        // we change selected instrument value only when in is finally loaded
        this.selectedInstrument = instr;
        this.notifyInstrumentChanged();
    }

    checkInstrumentVisualizationInfo(instrument) {
        return instrument.visualization;
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

    // Returns Onject of InstrumentDefinition
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


// ---------------------------------
// ---------------------------------
class MultipleInstrumentsLoader {

    constructor() {
        this.arrInstrumentNames = [];
        this.loadedInstruments = [];
        this.callbackWhenAllLoaded = null;
    }

    // callbackWhenAllLoaded will be called with no params when all instruments are loaded
    loadInstruments(arrInstrDefinitions, callbackWhenAllLoaded) {
        this.callbackWhenAllLoaded = callbackWhenAllLoaded;
        this.arrInstrumentDefinitions = arrInstrDefinitions;
        this.loadedInstruments = [];
        this.arrInstrumentDefinitions.forEach( instrDef => {
            if ( audioFilePlayer.isInstrumentLoaded(instrDef) )
                this.onInstrumentLoaded( instrDef );
            else {
                audioFilePlayer.loadAudioFiles( instrDef, this.onInstrumentLoaded.bind(this) );
            }   
        });
    }

    onInstrumentLoaded(instrDef) {
        this.loadedInstruments.push( instrDef );

        // check if all instruments are loaded
        if ( this.loadedInstruments.length === this.arrInstrumentDefinitions.length &&
            this.callbackWhenAllLoaded ) {
            this.callbackWhenAllLoaded();
        }
    }
}












