// DON'T USE underscore "~" in the name of the instrument.
const INSTRUMENT_ID_SPLITTER = "~";

const INSTR_NAME_DARBUKA = "Darbuka";
const INSTR_NAME_COOPERMAN_TAR = "Tar";
const INSTR_NAME_KOSMOSKY = "Kosmosky (E)";

const INSTRUMENT_DARBUKA = {
    instrumentName: INSTR_NAME_DARBUKA,
    folder: "audio/darbuka_clay/", // add / in the end
    arrStrokeInfo: [
        {stroke: "D", file: "du.mp3", gain: 1.5},
        {stroke: "d", file: "du.mp3", gain: 0.8},
        {stroke: "-", file: ""},
        {stroke: "T", file: "T.mp3", gain: 0.7},
		{stroke: "K", file: "K.mp3", gain: 0.7},
        {stroke: "t", file: "te.mp3", gain: 0.6},
        {stroke: "k", file: "ke.mp3", gain: 0.6},
        {stroke: "ti", file: "te.mp3", gain: 0.1},
        {stroke: "ki", file: "ke.mp3", gain: 0.1},
        {stroke: "R", file: "ta.mp3"},
        {stroke: "L", file: "ka.mp3"},
        {stroke: "S", file: "pa.mp3"},
        {stroke: "P", file: "P.mp3", gain: 0.5},
        {stroke: "Pm", file: "PP.mp3", gain: 0.5},
        {stroke: "Pl", file: "PPP.mp3", gain: 0.5},
        {stroke: "X", file: "X.mp3"},
        {stroke: "N", file: "snap.mp3"}
    ],
    defaultRhythms: {
        [RHYTHM_TYPE_VISUAL] : "D P Pl P D K X –",
        [RHYTHM_TYPE_TEXT] : 
        `// PRECOUNT
        T2:2 T:4
        ***
        D S k S D k S (k k)/2
        D S (k k)/2 S D k (S X P Pm)/2
        D S (k k)/2 S D (k k)/2 S (k k)/2
        (D D D D)/4 S (Pl Pl Pm P)/2 X X T/2 (t k k t k k t k k)/6`
    }
}

const INSTRUMENT_COOPERMAN_TAR = {
    instrumentName: INSTR_NAME_COOPERMAN_TAR,
    folder: "audio/cooperman_tar/", // add / in the end
    arrStrokeInfo: [
        {stroke: "D", file: "D.mp3"},
        {stroke: "-", file: ""},
        {stroke: "T", file: "T.mp3"},
        {stroke: "K", file: "K.mp3"},
        {stroke: "t", file: "Tsoft.mp3"},
        {stroke: "k", file: "Ksoft.mp3"},
        {stroke: "ti", file: "ti.mp3"},
        {stroke: "ki", file: "ki.mp3"},
        {stroke: "R", file: "R.mp3", gain: 0.6},
        {stroke: "L", file: "L.mp3", gain: 0.6},
        {stroke: "P", file: "Pbrighter.mp3"},
        {stroke: "A", file: "A.mp3", gain: 1},
        {stroke: "B", file: "B.mp3", gain: 1},
        {stroke: "C", file: "C.mp3", gain: 1},
        {stroke: "a", file: "A.mp3", gain: 0.3},
        {stroke: "b", file: "B.mp3", gain: 0.3},
        {stroke: "c", file: "C.mp3", gain: 0.3},
        {stroke: "X", file: "X.mp3", gain: 1.5},
        {stroke: "x", file: "X.mp3", gain: 0.8}
    ],
    // first for visual editor, second for text editor
    defaultRhythms: {
        [RHYTHM_TYPE_VISUAL] : "D - P – k k P - D - k k P - k k", 
        [RHYTHM_TYPE_TEXT] : 
        `// PRECOUNT
        T2:2 T:4
        ***
        D L L L (R R L L)/2 (D L L L)/4 (T K)/2 :2
        (R R L L)/2 (D L L L)/4 (T K)/2 :2
        (D L L L)/4 (T K)/2 :2
        (R R R R L L L L)/4 :2`
    }
}

const INSTRUMENT_KOSMOSKY = {
    instrumentName: INSTR_NAME_KOSMOSKY,
    folder: "audio/kosmosky/guitar/", // add / in the end
    arrStrokeInfo: [
        {stroke: "El", file: "E-L.mp3", gain: 0.7},
        {stroke: "B", file: "B.mp3", gain: 0.7},
        {stroke: "D", file: "D.mp3", gain: 0.7},
        {stroke: "E", file: "E.mp3", gain: 0.7},
        {stroke: "F", file: "F-sharp.mp3", gain: 0.7},
        {stroke: "G", file: "G.mp3", gain: 0.7},
        {stroke: "A", file: "A.mp3", gain: 0.7},
        {stroke: "Bh", file: "B-higher.mp3", gain: 0.7},
        {stroke: "Dh", file: "D-higher.mp3", gain: 0.7},
        {stroke: "Eh", file: "E-higher.mp3", gain: 0.7},
        {stroke: "-", file: ""}
    ],
    defaultRhythms: {
        [RHYTHM_TYPE_VISUAL] : "El B D El B D E F", 
        [RHYTHM_TYPE_TEXT] : "(El+E)3 B Bh3 E Eh3 D Dh2 (Dh+A)2"
    }
};

