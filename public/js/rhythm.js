
// Rhythm is an Array of objects {stroke, size}
// * size is a relative length of the stroke within one loop (related to onePulseDuration).
class Rhythm {

    constructor(arrRhythmInfo) {
        this.arrElements = arrRhythmInfo;
    }

    get elements() {
        return this.arrElements;
    }
}

function isPhrase(obj) {
    return obj instanceof Phrase;
}

function createRhythm( phrase ) {

    if (!phrase || !isPhrase(phrase) ) 
        throw new SyntaxError("Phrase expected when creating new Rhythm object");

    // iterating through phrase to create Rhythm object

    let arrSyllables = phrase.elements;
    let arrRhythmInfo = arrSyllables.map( item => (
            {
                stroke: item.syllable, 
                size: item.fraction.getSize() 
            }
        )
    );

    return new Rhythm( arrRhythmInfo );
}

function plainArrOfStrokesToPhrase(arrStrokes) {
    return new Phrase( arrStrokes.join(" ") );
}