// DON'T USE underscore "_" in the name of the instrument.
const INSTR_NAME_DARBUKA = "darbuka";
const INSTR_NAME_COOPERMAN_TAR = "cooperman-tar";

const INSTRUMENT_DARBUKA = {
    instrumentName: INSTR_NAME_DARBUKA,
    folder: "audio/darbuka_clay/", // add / in the end
    arrStrokeToFile: [
        {stroke: "D", file: "du.mp3"},
        {stroke: "T", file: "sta.mp3"},
		{stroke: "K", file: "sta.mp3"},
        {stroke: "t", file: "te.mp3"},
        {stroke: "k", file: "ke.mp3"},
        {stroke: "R", file: "ta.mp3"},
        {stroke: "L", file: "ka.mp3"},
        {stroke: "P", file: "pa.mp3"},
        {stroke: "-", file: ""}
    ]
}

const INSTRUMENT_COOPERMAN_TAR = {
    instrumentName: INSTR_NAME_COOPERMAN_TAR,
    folder: "audio/cooperman_tar/", // add / in the end
    arrStrokeToFile: [
        {stroke: "D", file: "D.mp3"},
        {stroke: "-", file: ""},
        {stroke: "T", file: "T.mp3"},
        {stroke: "K", file: "K.mp3"},
        {stroke: "t", file: "Tsoft.mp3"},
        {stroke: "k", file: "Ksoft.mp3"},
        {stroke: "R", file: "R.mp3", gain: 0.6},
        {stroke: "L", file: "L.mp3", gain: 0.6},
        {stroke: "P", file: "P.mp3"},
        {stroke: "a", file: "a.mp3"},
        {stroke: "b", file: "b.mp3"},
        {stroke: "M", file: "M.mp3"},
        {stroke: "N", file: "N.mp3"},
        {stroke: "S", file: "S.mp3"},
        {stroke: "W", file: "W.mp3"}
    ]
}

class InstrumentHelper {
    constructor() {
        this.allInstruments = [INSTRUMENT_DARBUKA, INSTRUMENT_COOPERMAN_TAR];
        //this.defaultInstrument = INSTRUMENT_COOPERMAN_TAR;
        this.defaultInstrument = INSTRUMENT_DARBUKA;
    }

    strokeNames(instrument) {
        return instrument.arrStrokeToFile.map(item => item.stroke);
    }

    // strokeID = <instrumentName>_<strokeName>
    // get the gain value (if defined) from the corresponding instrument definition. If gain is not defined - return -1;
    getGainValue( strokeID ) {
        let arr = strokeID.split("_");
        let instrName = arr[0];
        let strokeName = arr[1];

        // search the needed instrument
        for (let instr of this.allInstruments) {
            if (instr.instrumentName === instrName) {
                for (let strokeInfo of instr.arrStrokeToFile) {
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
}

const instrumentHelper = new InstrumentHelper();