class ValueChangeNotifier {
	constructor() {
		this.valueChangeListeners = [];
	}

	// callBackFunc can be array of functions
	addValueChangeListener(callBackFunc) {
		if (Array.isArray( callBackFunc ) ) {
			callBackFunc.forEach( func => this.valueChangeListeners.push( func ) );
		} else this.valueChangeListeners.push( callBackFunc );
	}

	deleteAllListeners() {
		this.valueChangeListeners = [];
	}

	notify(newValue) {
		this.valueChangeListeners.forEach( func => {
			func(newValue);
		});
	}

}