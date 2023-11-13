// DON'T USE underscore "~" in the name of the instrument.
const INSTRUMENT_ID_SPLITTER = "~";

const INSTR_NAME_DARBUKA = "Darbuka";
const INSTR_NAME_COOPERMAN_TAR = "Tar";
const INSTR_NAME_KOSMOSKY_E = "Kosmosky (E)";
const INSTR_NAME_HANG_D_LOW_MYSTIC = "Hang Low Mystic (D)";

const INSTRUMENT_DARBUKA = {
    instrumentName: INSTR_NAME_DARBUKA,
    folder: "audio/darbuka_clay/", // add / in the end
    arrStrokeInfo: [
        {stroke: "D", file: "du.mp3", gain: 1.5},
        {stroke: "d", file: "du.mp3", gain: 0.8},
        {stroke: "-", file: ""},
        {stroke: "T", file: "t.mp3", gain: 0.7},
		{stroke: "K", file: "k.mp3", gain: 0.7},
        {stroke: "t", file: "te.mp3", gain: 0.6},
        {stroke: "k", file: "ke.mp3", gain: 0.6},
        {stroke: "ti", file: "te.mp3", gain: 0.1},
        {stroke: "ki", file: "ke.mp3", gain: 0.1},
        {stroke: "R", file: "ta.mp3"},
        {stroke: "L", file: "ka.mp3"},
        {stroke: "S", file: "pa.mp3"},
        {stroke: "P", file: "p.mp3", gain: 0.5},
        {stroke: "Pm", file: "pp.mp3", gain: 0.5},
        {stroke: "Pl", file: "ppp.mp3", gain: 0.5},
        {stroke: "X", file: "x.mp3"},
        {stroke: "N", file: "snap.mp3"},
        {stroke: "Z", file: "triangle.mp3", gain: 0.3},
        {stroke: "z", file: "triangle.mp3", gain: 0.1},
        {stroke: "O", file: "cabasa.mp3", gain: 0.1}
    ],
    defaultRhythms: {
        [RHYTHM_EDITOR_TYPE_VISUAL] : "D P Pl P D K X –",
        [RHYTHM_EDITOR_TYPE_TEXT] : 
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
        {stroke: "D", file: "d.mp3"},
        {stroke: "-", file: ""},
        {stroke: "T", file: "t.mp3"},
        {stroke: "K", file: "k.mp3"},
        {stroke: "t", file: "tsoft.mp3"},
        {stroke: "k", file: "ksoft.mp3"},
        {stroke: "ti", file: "ti.mp3"},
        {stroke: "ki", file: "ki.mp3"},
        {stroke: "R", file: "r.mp3", gain: 0.6},
        {stroke: "L", file: "l.mp3", gain: 0.6},
        {stroke: "P", file: "pbrighter.mp3"},
        {stroke: "A", file: "a.mp3", gain: 1},
        {stroke: "B", file: "b.mp3", gain: 1},
        {stroke: "C", file: "c.mp3", gain: 1},
        {stroke: "a", file: "a.mp3", gain: 0.3},
        {stroke: "b", file: "b.mp3", gain: 0.3},
        {stroke: "c", file: "c.mp3", gain: 0.3},
        {stroke: "X", file: "x.mp3", gain: 1.5},
        {stroke: "x", file: "x.mp3", gain: 0.8},
        {stroke: "Z", file: "triangle.mp3", gain: 0.3},
        {stroke: "z", file: "triangle.mp3", gain: 0.1},
        {stroke: "O", file: "cabasa.mp3", gain: 0.1}
    ],
    // first for visual editor, second for text editor
    defaultRhythms: {
        [RHYTHM_EDITOR_TYPE_VISUAL] : "D - P – k k P - D - k k P - k k", 
        [RHYTHM_EDITOR_TYPE_TEXT] : 
        `// PRECOUNT
        T2:2 T:4
        ***
        D L L L (R R L L)/2 (D L L L)/4 (T K)/2 :2
        (R R L L)/2 (D L L L)/4 (T K)/2 :2
        (D L L L)/4 (T K)/2 :2
        (R R R R L L L L)/4 :2`
    }
}

const INSTRUMENT_KOSMOSKY_E = {
    instrumentName: INSTR_NAME_KOSMOSKY_E,
    folder: "audio/kosmosky-e/guitar/", // add / in the end
    arrStrokeInfo: [
        {stroke: "O", file: "e-l.mp3", gain: 0.4},
        {stroke: "B", file: "b.mp3", gain: 0.4},
        {stroke: "D", file: "d.mp3", gain: 0.4},
        {stroke: "E", file: "e.mp3", gain: 0.4},
        {stroke: "F", file: "f-sharp.mp3", gain: 0.4},
        {stroke: "G", file: "g.mp3", gain: 0.4},
        {stroke: "A", file: "a.mp3", gain: 0.4},
        {stroke: "Bh", file: "b-higher.mp3", gain: 0.4},
        {stroke: "Dh", file: "d-higher.mp3", gain: 0.4},
        {stroke: "Eh", file: "e-higher.mp3", gain: 0.4},
        {stroke: "Z", file: "triangle.mp3", gain: 0.08},
        {stroke: "^", file: "cabasa.mp3", gain: 0.08},
        {stroke: "-", file: ""}
    ],
    defaultRhythms: {
        [RHYTHM_EDITOR_TYPE_VISUAL] : "O B D O B D E F", 
        [RHYTHM_EDITOR_TYPE_TEXT] : "(O-E)3 B Bh3 E Eh3 D Dh2 (Dh-A)2"
    }
};

const INSTRUMENT_HAND_D_LOW_MYSTIC = {
    instrumentName: INSTR_NAME_HANG_D_LOW_MYSTIC,
    folder: "audio/hang_d_low_mystic/", // add / in the end
    arrStrokeInfo: [
        {stroke: "O", file: "d-ding.mp3"},
        {stroke: "G", file: "g.mp3"},
        {stroke: "A", file: "a.mp3"},
        {stroke: "A#", file: "asharp.mp3"},
        {stroke: "D", file: "d.mp3"},
        {stroke: "E", file: "e.mp3"},
        {stroke: "F", file: "f.mp3"},
        {stroke: "Ah", file: "ah.mp3"},
        {stroke: "Ch", file: "ch.mp3"},
        {stroke: "-", file: ""},
        {stroke: "Z", file: "triangle.mp3", gain: 0.3},
        {stroke: "^", file: "cabasa.mp3", gain: 0.1}
    ],
    defaultRhythms: {
        [RHYTHM_EDITOR_TYPE_VISUAL] : "O G A A# D E F Ah Ch", 
        [RHYTHM_EDITOR_TYPE_TEXT] : "O-G A A# D E F Ah Ch"
    }
};
