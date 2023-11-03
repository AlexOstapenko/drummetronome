
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
            currentRhythmEditorType: "", // text or visual?
            audio: {
                gain: 1.0,
                panorama: 0
            }
        }
    }
}

/*
    Rack of instrument instances. You can add multiple instances 
    of the same or different instrument and play all rhythms simultaneously.
*/

class InstrumentsRack {

    constructor() {
        // to keep all info about particular instance of an instrument like rhythms, audio settings etc.
        this.instrumentInstances = {}; // key: instrument name, value - onject of InstrumentInstance

    }

    addInstrumentInstance(instrumentName) {
        this.instrumentInstances.push( new InstrumentInstance( instrumentName ) );
    }

    removeInstrumentInstance( instrumentName ) {
        let newArr = [];
        for( let instr of this.instrumentInstances) {
            if (instr.instrument.instrumentName !== instrumentName )
                newArr.push( instr );
        }
        this.instrumentInstances = newArr;
    }

}

const instrumentsRack new InstrumentsRack();
