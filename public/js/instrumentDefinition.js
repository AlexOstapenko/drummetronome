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
        {stroke: "T", file: "T.mp3"},
        {stroke: "K", file: "K.mp3"},
        {stroke: "t", file: "T_soft.mp3"},
        {stroke: "k", file: "K_soft.mp3"},
        {stroke: "R", file: "R.mp3"},
        {stroke: "L", file: "L.mp3"},
        {stroke: "P", file: "P.mp3"},
        {stroke: "a", file: "a.mp3"},
        {stroke: "b", file: "b.mp3"},
        {stroke: "M", file: "M.mp3"},
        {stroke: "N", file: "N.mp3"},
        {stroke: "S", file: "S.mp3"},
        {stroke: "W", file: "W.mp3"},
        {stroke: "-", file: ""}
    ]
}

function strokeNames(instrument) {
    return instrument.arrStrokeToFile.map(item => item.stroke);
}

//const DEFAULT_INSTRUMENT = INSTRUMENT_DARBUKA; 
const DEFAULT_INSTRUMENT = INSTRUMENT_COOPERMAN_TAR;