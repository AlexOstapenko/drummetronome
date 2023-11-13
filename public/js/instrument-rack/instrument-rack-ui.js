const INSTRUMENT_SELECT_EL_ID = 'selectInstrument';

/*
    Instrument rack user interface.
*/
class InstrumentRackUIController {

    constructor() {
        this.rack = new InstrumentRack();
        this.divNameRack = 'divInstrumentsRack';
        this.textRhythmEditorAgent = new TextRhythmEditorAgent(RHYTHM_EDITOR_TEXT_ID);
        this.rackChangedListeners = [];
    }

    addRackChangeListener( callbackFunc ) {
        this.rackChangedListeners.push( callbackFunc );
    }

    notifyRackChangedListeners() {
        this.rackChangedListeners.forEach( func => {
            func();
        });
    }

    render() {
        let html = '';
        this.rack.instrumentInstances.forEach( (instance, idx) => {
            let checkbox = `<input type='checkbox' class='checkbox-instrument-instance' id='checkbox${instance.id}' ${instance.data.audio.mute ? "" : "checked"}
            onclick='instrumentRackUI.onClickCheckbox(${instance.id})'>`;
            let additionalClass = this.rack.selectedInstance === idx ? "instrument-instance-selected" : "";
            html += `<div class='div-instrument-instance ${additionalClass}'>
            ${checkbox} 
            <div class='div-instrument-instance-label' onclick='instrumentRackUI.onClickInstrument(${instance.id})'>${instance.instrument.instrumentName}</div> 
            <button class='butt-delete-instrument-instance' onclick='instrumentRackUI.onClickXButton(${instance.id})'>x</button>
            </div>`;
        });
        let divRack = document.querySelector(`#${this.divNameRack}`);
        divRack.innerHTML = html + (html === "" ? "" : "<br>");
        this.updateRhythmText(); // show the text of a currently selected instrument
    }

    saveCurrentTextRhythm() {
        let instance = this.rack.getInstanceByIdx( this.rack.selectedInstance );
        if (!instance) return;

        // first save the text of previously selected instrument to it's data
        instance.setRhythm( this.textRhythmEditorAgent.getRhythm() );
    }

    onInstrumentLoaded(instr) {
    
    }

    isEmpty() {
        return this.rack.isEmpty();
    }

    // all actions to switch to another instrument
    onClickInstrument(id) {
        if ( this.rack.selectedInstance === this.rack.getInstrumentIndex(id)) return; // selection didn't change

        // first save the text of previously selected instrument to it's data
        this.saveCurrentTextRhythm();

        this.rack.selectById( id );
        this.render();

        // set text of the newly selected instrument into text editor
        let instance = this.rack.getInstanceByIdx( this.rack.selectedInstance );
        this.textRhythmEditorAgent.setRhythm( instance.getRhythm() );
    }

    updateRhythmText() {
        // set text of the newly selected instrument into text editor
        let instance = this.rack.getInstanceByIdx( this.rack.selectedInstance );
        if (instance)
            this.textRhythmEditorAgent.setRhythm( instance.getRhythm() );
        else
            this.textRhythmEditorAgent.setRhythm( "" );
    }

    onClickAddNew() {

        // if player is playing - don't add
        if ( mtRhythmPlayer.isPlaying ) return;

        // first save the text of previously selected instrument to it's data
        this.saveCurrentTextRhythm();

        let select = document.getElementById( INSTRUMENT_SELECT_EL_ID );
        const instrumentName = select.value;
        instrumentManager.loadInstrument( instrumentName, this.onInstrumentLoaded.bind(this) );
        let instance = this.rack.createInstrumentInstance( instrumentName );
        this.render();
        this.textRhythmEditorAgent.setRhythm( instance.getRhythm() );

        this.notifyRackChangedListeners();
    }

    onClickCheckbox(id) {
        let instance = this.rack.getInstanceById(id);
        let checkbox = document.getElementById( 'checkbox'+id );
        instance.data.audio.mute = !checkbox.checked;
    }

    onClickXButton(id) {
        this.rack.removeInstrumentInstance(id);
        this.render();
        this.notifyRackChangedListeners();
    }

    onClickDeleteAll() {
        this.rack.deleteAll();
        this.render();
        this.notifyRackChangedListeners();
    }

    generateInstrumentOptions() {
        let select = document.getElementById( INSTRUMENT_SELECT_EL_ID );
        instrumentManager.allInstruments.forEach( instr => {
            let option = document.createElement("option");
            option.value = instr.instrumentName;
            option.text = instr.instrumentName;
            select.appendChild( option );
        });
    }
}

let instrumentRackUI = new InstrumentRackUIController();










