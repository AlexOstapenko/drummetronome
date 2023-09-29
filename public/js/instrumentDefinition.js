const INSTR_NAME_DARBUKA = "darbuka";

const INSTRUMENT_DARBUKA = {
    instrumentName: INSTR_NAME_DARBUKA,
    folder: "audio/",
    arrStrokeToFile: [
        {stroke: "D", file: "du.mp3"},
        {stroke: "T", file: "sta.mp3"},
		{stroke: "K", file: "sta.mp3"},
        {stroke: "t", file: "te.mp3"},
        {stroke: "k", file: "ke.mp3"},
        {stroke: "R", file: "ta.mp3"},
        {stroke: "L", file: "ka.mp3"},
        {stroke: "P", file: "pa.mp3"}
    ]
}

function strokeNames(instrument) {
    return instrument.arrStrokeToFile.map(item => item.stroke);
}

const DEFAULT_INSTRUMENT = INSTRUMENT_DARBUKA;