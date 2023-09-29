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

// Edit rhythm in user interface.
class RhythmBoard {

    constructor(containerID) {
        this.items = [];
        this.selected = -1;
        this.containerID = containerID;
        this.rhythmChangedListeners = [];
        this.setNewSize(8);
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
            result += "<div class='" + cls + "' onclick='clickRhythmBoardStroke(" + idx + ")'>" + item + 
            "<div class='board-idx'>" + (idx+1) + "</div>" +
            "</div>";
        });
        
        document.getElementById(this.containerID).innerHTML = result;
        document.getElementById("num").value = this.items.length;
    }

    select(num) {
        this.selected = this.selected == num ? -1 : num;
    }

    // rhythm could be wether array of chars or string.
    // if scting – it will be splitter char by char to create the array
    setNewRhythm(rhythm) {
        this.items = (typeof rhythm == "string") ? rhythm.split("") : rhythm.slice();
        this.selected = -1;
        this.notifyRhythmChanged();
    }

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

    setNewSize(num) {
        if (num < 0) return;

        let arrItems = [];
        for( let i=0; i < num; i++ ){
            arrItems.push( "-");
        }

        this.setNewRhythm(arrItems);
    }

    // This callback takes one parameter - new rhythm as Rhythm object
    addRhythmChangedListener(callback) {
        this.rhythmChangedListeners.push( callback );
    }

    clearRhythmChangedListeners() {
        this.rhythmChangedListeners = [];
    }

    notifyRhythmChanged() {
        this.rhythmChangedListeners.forEach(listener => {
            listener( new Rhythm(this.rhythm) );
        });
    }

}

const rhythmBoard = new RhythmBoard("rhythmContainer");

function clickRhythmBoardStroke(idx) {
    rhythmBoard.select(idx);
    rhythmBoard.render();
}

function setNewSize() {
    let num = parseInt( document.getElementById("num").value );
    if (num < 0) return;

    rhythmBoard.setNewSize(num);
    rhythmBoard.render();
}

function setSize(num) {
    document.getElementById("num").value = num;
    setNewSize();
}

function clickPlayRhythm() {
    rhythmPlayer.setRhythm(new Rhythm( rhythmBoard.rhythm ) );
    rhythmPlayer.play();
}