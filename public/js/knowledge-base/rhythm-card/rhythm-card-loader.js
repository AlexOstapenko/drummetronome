class RhythmCardLoader {

	constructor() {
		this.cardFileExtension = ".txt";
	}

	loadSingleRhythmCard(folder, cardName, callback) {
		let fileLoader = new FileLoader();
		let rhythmCard = null;
		fileLoader.loadFile( folder + "/" + cardName + this.cardFileExtension, rhythmCardText => {
			if (rhythmCardText) {
				rhythmCard = new RhythmCard();
			    rhythmCard.parseRhythmCardText( rhythmCardText );
			}
		    callback( rhythmCard );
		});
	}
}