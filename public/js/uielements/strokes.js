// UI control to select different strokes while editing rhythm in RhythmBoard

class StrokeSelector {

    constructor(containerID) {
        this.containerID = containerID;
    }

    init() {
        this.strokes = instrumentManager.strokeNames( instrumentManager.currentInstrument );
    }

    updateStrokes() {
        this.strokes = instrumentManager.strokeNames( instrumentManager.currentInstrument );
        this.render();
    }

    render() {
        let result = "";

        this.strokes.forEach( (stroke, idx ) => {
            result += "<div class='button-stroke' onclick='clickStrokeSelectorItem(" + idx + ")'>" + stroke + "</div>";
            //if ( (idx+1)%6 === 0 && idx !== this.strokes.length - 1 ) result += "<br>";
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