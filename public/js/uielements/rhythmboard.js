/*const classesForDarbukaStrokes = { 
    "D" : "low",
    "T" : "",
    "K" : "",
    "t" : "nonaccented",
    "k" : "nonaccented",
    "R" : "",
    "L" : ""
};*/

const RHYTHM_SIZE_INPUT_ID = "rhythmSize";

// Edit rhythm in user interface.
class RhythmBoard {

    constructor(containerID) {
        this.items = [];
        this.selected = -1;
        this.containerID = containerID;
        this.rhythmChangedListeners = [];
    }

    get size() {
        return this.items.length;
    }

    calcClasses(text) {
        //const classes = classesForDarbukaStrokes;
        //return classes[text] ? classes[text] : "";
        return "";
    }

    render() {
        const defaultClass = " rhythm-item ";
        let result = "";
        this.items.forEach( (item, idx) => {
            let clsActive = this.selected == idx ? " selected " : "";
            let cls = defaultClass + this.calcClasses( item ) + clsActive;

            result += 
                `<div class='${cls}' onclick='rhythmBoard.clickStroke(${idx})'>
                    ${item}
                    <div class='board-idx'>${idx+1}</div>
                </div>`;
        });
        
        document.getElementById(this.containerID).innerHTML = result;
        document.getElementById( RHYTHM_SIZE_INPUT_ID ).value = this.items.length;
    }

    select(num) {
        this.selected = this.selected == num ? -1 : num;
    }

    // Rhythm could be wether array of chars or string.
    // if string - it will be treated as a Phrase. 
    // But make sure each syllable in the phrase has a duration of 1, duration info is ignored.
    setNewRhythm(rhythm) {
        let items = [];

        if (Array.isArray(rhythm))
            items = rhythm.slice();
        else if ( typeof rhythm === 'string' ) {
            let phrase = new Phrase( rhythm );
            for( const el of phrase.elements ) {
                items.push( el.syllable );
            }
        }
        else return;

        this.items = items;
        this.selected = -1;
        this.notifyRhythmChanged();
    }

    // Creates an empty rhythm by the given number of counts
    buildEmptyRhythm(num) {
        num = parseInt( num + "");
        if (!num || num <= 0) num = 8;

        let arrItems = [];
        for( let i=0; i < num; i++ ){
            arrItems.push( "-");
        }

        this.setNewRhythm(arrItems);
        this.render();
    }

    // Returns array of stroke names, can include "-" for pause.
    // Each stroke's duration = 1 impulse (1/8th note, kind of).
    get rhythm() {
        return this.items.slice();
    }

    get rhythmAsText() {
        return this.items.join(" ");
    }

    setSelectedStroke(stroke) {
        if (this.selected >=0 ) {
            this.items[this.selected] = stroke;
            this.notifyRhythmChanged();
            if (this.selected != this.items.length-1) this.selected++;
            else this.selected = -1;
        }
    }
  
    clickStroke(idx) {
        this.select(idx);
        this.render();
    }

   
    // RHYTHM CHANGE LISTENERS ------------------------

    // This callback takes one parameter - new rhythm as PlainRhythm object
    addRhythmChangedListener(callback) {
        this.rhythmChangedListeners.push( callback );
    }

    clearRhythmChangedListeners() {
        this.rhythmChangedListeners = [];
    }

    // notify those who want to know about the changes in the rhythm
    notifyRhythmChanged() {
        this.rhythmChangedListeners.forEach(listener => {
            listener( Rhythm.createRhythm( plainArrOfStrokesToPhrase(this.rhythm) ) );
        });
    }

}

const rhythmBoard = new RhythmBoard("rhythmContainer");
