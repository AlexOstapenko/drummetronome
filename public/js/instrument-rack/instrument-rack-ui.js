const INSTRUMENT_SELECT_EL_ID = 'selectInstrument';

/*
    Instrument rack user interface.
*/
class InstrumentRackUIController {

    constructor() {
        this.rack = new InstrumentRack();
        this.divNameRack = 'divInstrumentsRack';
        this.textRhythmEditorAgent = new TextRhythmEditorAgent(RHYTHM_EDITOR_TEXT_ID);
        this.rackChangedNotifier = new ValueChangeNotifier();
    }

    render() {
        let html = '';
        let html2 = '';
        this.rack.instrumentInstances.forEach( (instance, idx) => {

            let instr = instance.instrument;
            let checkbox = `<input type='checkbox' id='checkbox${instance.id}' ${instance.data.audio.mute ? "" : "checked"}
            onclick='instrumentRackUI.onClickCheckbox(${instance.id})'>`;
            let clickableItem = '';
            if (instr.images && instr.images.icon)
                clickableItem = `<img class='instr-instance-center-item' width='50px' height='50px' src='${instr.folder}/${instr.images.icon}'>`;
            else 
                clickableItem = `<p class='instr-instance-center-item'>${instr.instrumentName}</p>`;

            let containerClass = this.rack.selectedInstance === idx ? "instr-instance-container-selected" : "instr-instance-container";

            html += 
            `<div class='instr-instance'>
                <div class='${containerClass}'>
                    ${checkbox}
                    <div onclick='instrumentRackUI.onClickInstrument(${instance.id})'>
                        ${clickableItem} 
                    </div>
                    <button class='instr-instance-close-button' onclick='instrumentRackUI.onClickXButton(${instance.id})'>x</button>
                </div>
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
        hideStrokesInfo();

        this.rackChangedNotifier.notify(this.rack);
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
        instrumentManager.loadSingleInstrument( instrumentName, this.onInstrumentLoaded.bind(this) );

        // the rest is done in onInstrumentLoaded method
    }

    onInstrumentLoaded(instr) {
        let instance = this.rack.createInstrumentInstance( instr.instrumentName );
        this.render();
        this.textRhythmEditorAgent.setRhythm( instance.getRhythm() );
        this.rackChangedNotifier.notify( this.rack );
    }


    onClickCheckbox(id) {
        let instance = this.rack.getInstanceById(id);
        let checkbox = document.getElementById( 'checkbox'+id );
        instance.data.audio.mute = !checkbox.checked;
    }

    onClickXButton(id) {

        // if player is playing - don't do anything
        if ( mtRhythmPlayer.isPlaying ) return;

        this.rack.removeInstrumentInstance(id);
        this.render();
        this.rackChangedNotifier.notify( this.rack );
    }

    onClickDeleteAll() {

        // if player is playing - don't add
        if ( mtRhythmPlayer.isPlaying ) return;

        this.rack.deleteAll();
        this.render();
        this.rackChangedNotifier.notify( this.rack );
    }

    generateChoiceOfInstruments() {
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










