class RhythmCardLoader {

	constructor() {
		this.cardFileExtension = ".txt";
	}

	loadSingleRhythmCard(folder, cardName, callback) {
		let fileLoader = new FileLoader();
		fileLoader.loadFile( folder + "/" + cardName + this.cardFileExtension, rhythmCardText => {
			let rhythmCard = new RhythmCard();
		    rhythmCard.parseRhythmCardText( rhythmCardText );
		    callback( rhythmCard );
		});
	}
}