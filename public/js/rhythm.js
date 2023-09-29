class Rhythm {

    constructor(rhythm) {
        this.arrStrokes = (typeof rhythm == "string") ? rhythm.split("") : 
            Array.isArray(rhythm) ? rhythm.slice() : [];
    }

    get strokes() {
        return this.arrStrokes;
    }
}