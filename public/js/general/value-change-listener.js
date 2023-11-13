class ValueChangeListener {
	constructor() {
		this.valueChangeListeners = [];
	}

	addValueChangeListener(callBackFunc) {
		this.valueChangeListeners.push( callBackFunc );
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