/*const classesForDarbukaStrokes = { 
    "D" : "low right",
    "T" : "high",
    "K" : "high",
    "t" : "nonaccented",
    "k" : "nonaccented",
    "R" : "right",
    "L" : "left"
};*/

const classesForDarbukaStrokes = { 
    "D" : "low",
    "T" : "",
    "K" : "",
    "t" : "nonaccented",
    "k" : "nonaccented",
    "R" : "",
    "L" : ""
};


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
        const classes = classesForDarbukaStrokes;
        return classes[text] ? classes[text] : "";
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

            if ( idx%8 === 0 && idx != this.items.length)
                result += "<br>";

        });
        
        document.getElementById(this.containerID).innerHTML = result;
        document.getElementById( RHYTHM_SIZE_INPUT_ID ).value = this.items.length;
    }

    select(num) {
        this.selected = this.selected == num ? -1 : num;
    }

    // rhythm could be wether array of chars or string.
    // if scting - it will be splitter char by char to create the array
    setNewRhythm(rhythm) {
        this.items = (typeof rhythm == "string") ? rhythm.split("") : rhythm.slice();
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
            listener( createRhythm( plainArrOfStrokesToPhrase(this.rhythm) ) );
        });
    }

}

const rhythmBoard = new RhythmBoard("rhythmContainer");