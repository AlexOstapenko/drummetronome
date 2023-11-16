// INSTRUMENTS AND RHYTHM EDITORS

// There are 2 rhythm editors: V - visual, T - text
const RHYTHM_EDITOR_TYPE_VISUAL = "visual-rhythm";
const RHYTHM_EDITOR_TYPE_TEXT = "text-rhythm";

const DIV_RHYTHM_EDITOR = editorType => `div-${editorType}-editor`;

// HTML IDS and LABELS

const RHYTHM_EDITOR_TEXT_ID = "rhythmEditor_text"; // Rhythm TEXT EDITOR
const ID_BUTT_PLAYSTOP = "buttPlayStop";
const ID_INPUT_TEMPO = "inputTempo";
const ID_INPUT_TEMPOVAL = "inputTempoValue";

const ID_DIV_TEMPO = "divTempo";

const L_BUTT_PLAY = "PLAY";
const L_BUTT_STOP = "STOP";

// Defaults
const DEFAULT_BPM = 90;

// Instruments names (keys to access instruments via InstrumentManager)
const INSTRUMENT_NAME_DARBUKA = "Darbuka";
const INSTRUMENT_NAME_COOPERMAN_TAR = "Tar";
const INSTRUMENT_NAME_KOSMOSKY_E = "Kosmosky (E)";
const INSTRUMENT_NAME_HANG_D_LOW_MYSTIC = "Hang Low Mystic (D)";

