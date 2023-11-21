/*
    Rack of instrument instances. You can add multiple instances 
    of the same or different instrument and play all rhythms in this rack simultaneously.
*/
class InstrumentRack {

    constructor() {
        // to keep all info about particular instance of an instrument like rhythms, audio settings etc.
        this.deleteAll();
    }

    deleteAll() {
        this.instrumentInstances = [];
        this.selectedInstance = -1;

        // for id generation
        this.idcounter = -1;
    }

    createInstrumentInstance(instrumentName) {
        let instance = new InstrumentInstance( instrumentName );
        instance.id = this.newId();
        this.instrumentInstances.push( instance );
        this.selectedInstance = this.instrumentInstances.length-1;
        return instance;
    }

    removeInstrumentInstance( instanceId ) {
        let newArr = [];
        let selectedIdx = this.selectedInstance;
        this.instrumentInstances.forEach( (instance, idx) => {
            if (instanceId === instance.id )
                if (this.selectedInstance === idx)
                    selectedIdx = idx-1; // shift selected instrument to previous one
                else
                    selectedIdx = this.selectedInstance - 1;
            else
                newArr.push( instance );
        });
        this.instrumentInstances = newArr;
        this.setSelectedIndex(selectedIdx);
    }

    isEmpty() {
        return this.instrumentInstances.length === 0;
    }

    setSelectedIndex(idx) {
        if (idx < this.instrumentInstances.length && idx >=0 )
            this.selectedInstance = idx;
        else if (this.instrumentInstances.length > 0)
            this.selectedInstance = 0;
    }

    getInstrumentIndex( id ) {
        for( let i=0; i < this.instrumentInstances.length; i++) {
            let inst = this.instrumentInstances[i];
            if ( inst.id === id ) return i;
        }
        return -1; // not found
        
    }

    selectById(id) {
        this.setSelectedIndex( this.getInstrumentIndex(id) );
    }

    getInstanceById(id) {
        let filterResults = this.instrumentInstances.filter( inst => inst.id===id);
        if (filterResults) return filterResults[0];
    }

    getInstanceByIdx(idx) {
        if (idx < this.instrumentInstances.length && idx >=0 )
            return this.instrumentInstances[idx];
        return null;
    }

    getSelectedInstance() {
        if (this.instrumentInstances.length === 0 || this.selectedInstance===-1 ) return null;
        return this.instrumentInstances[this.selectedInstance];
    }

    newId() {
        this.idcounter++;
        return this.idcounter;
    }

}
