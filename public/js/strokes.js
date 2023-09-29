//const STROKES = ["–", "D", "T", "K", "t", "k", "S", "P", "i"];
// const STROKES = ["D", "T", "t", "K", "k", "R", "L", "P"];

function isPause(stroke) {
    return stroke === "–";
}

// UI control to select different strokes while editing rhythm in RhythmBoard

class StrokeSelector {

    constructor(containerID) {
        this.containerID = containerID;
        this.strokes = Object.keys(FRAMEDRUM_SOUNDS.stroke2frequecy);
    }

    render() {
        let result = "";

        this.strokes.forEach( (stroke, idx ) => {
            result += "<div class='button-sound' onclick='clickStrokeSelectorItem(" + idx + ")'>" + stroke + "</div>";
        });

        let elem = document.getElementById(this.containerID);
        elem.innerHTML = result;
    }
    
}

const strokeSelector = new StrokeSelector("strokeSelector");

function clickStrokeSelectorItem(idx) {
    rhythmBoard.setSelectedStroke( strokeSelector.strokes[idx] );
    rhythmBoard.render();
}