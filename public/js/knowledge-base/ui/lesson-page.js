class LessonPage {
	constructor() {
		this.divContainerID = "";
		this.reinit();
	}

	reinit() {
		this.rhythmPlayerControls = [];
		this.idGeneratorForRhythmPlayers = new IDGenerator();
		this.activeRhythmPlayerControl = null;
	}

	set mainDivID(id) {
		this.divContainerID = id;
	}

	get divContainer() { return document.getElementById(this.divContainerID); }

	render(lesson) {
		this.reinit();

		let moduleNumber = lesson.parentModule.getModuleNumber();
		let lessonNumber = lesson.getLessonNumber();
		let lessonHTML = this.renderHeader(lesson);

		let isLessonAvailable = true;
		if ( window.location.href.indexOf( "localhost:" ) === -1 ) {
			let lessonNotAvailable = 
				(lesson.status && lesson.status === Lesson.STATUS.NOT_AVAILABLE ) ||
				(lesson.parentModule.status && lesson.parentModule.status === Lesson.STATUS.NOT_AVAILABLE);

			isLessonAvailable = !lessonNotAvailable;
		}

		if ( !isLessonAvailable )
			lessonHTML += 
				`<p class='course-style-title'>${CURR_LOC().messages.lessoNotAvailable}</p>`;
		else {
			lessonHTML += 
			`<p class='lesson-header-title'>
				<b>${CURR_LOC().course.course}: </b><i>${lesson.parentModule.course.name}</i><br>
				<b>${CURR_LOC().course.module} ${moduleNumber}</b>: ${lesson.parentModule.name}
			</b></p>
			<h3><span class="lesson-header-lesson-label">${CURR_LOC().course.lesson} ${lessonNumber}:</span> ${lesson.name}</h3>`;
			
			lessonHTML += this.parseCustomTags( lesson );
			lessonHTML += this.htmlLessonNavigation(lesson);
		}
		
		let html = `<div class='lesson'>${lessonHTML}</div>`;
		this.divContainer.className = "";
		this.divContainer.innerHTML = html;
	}

	// Generates links to previous page
	renderHeader(lesson) {
		let html = 
			`<div class='page-header'>
				<span class='lesson-header-link lesson-header-link-1'
					onclick='onClickParentCourse(${lesson.parentModule.course.id})'>${CURR_LOC().course.backToCourse}</span> |
				<span class='lesson-header-link lesson-header-link-2'
					onclick='onClickParentModule( "${lesson.parentModule.id}" )'>${CURR_LOC().course.backToModule}</span> 
			</div>`;
		return html;
	}

	createRhythmPlayerControl() {
		let rpControl = new RhythmPlayerControl( this );
		rpControl.setID( this.idGeneratorForRhythmPlayers.getNewID() );
		this.rhythmPlayerControls.push( rpControl );
		return rpControl;
	}

	getRhythmPlayerControl( id ) {
		let matches = this.rhythmPlayerControls.filter( rpc => rpc.id===id);
		if (matches) return matches[0];
		return null;
	}

	play( rhythmPlayerControlID ) {
		// check do we need to start playing or stop playing?
		if (this.activeRhythmPlayerControl) {
			rhythmPlayerControlID = this.activeRhythmPlayerControl.id === rhythmPlayerControlID ? 
				-1 : rhythmPlayerControlID;
			this.stopPlaying(); // we have to stop playing current player

			// start playing the new player control
			// this is the situation when one player was playing 
			// and then some other player's PLAY button was clicked.
			if (rhythmPlayerControlID>=0)
				this.play( rhythmPlayerControlID );
		}
		else
			// we have to start playing
			this.startPlaying( rhythmPlayerControlID );
	}

	startPlaying(rhythmPlayerControlID) {
		this.activeRhythmPlayerControl = this.getRhythmPlayerControl( rhythmPlayerControlID );
		let rCard = this.activeRhythmPlayerControl.rhythmCard;

		let arrInstrNames = rCard.records.map( record => record.instrument );

	    let onInstrumentsLoaded = () => {
	        // STEP 2. Create instrument rack with instances
	        const rack = new InstrumentRack()

	        rCard.records.forEach( record => {
	            let {rhythm, instrument, gain, pan, mute} = record;
	            let instrInstance = rack.createInstrumentInstance( instrument );
	            instrInstance.data.rhythm = rhythm;
	            instrInstance.data.audio.gain = gain;
	            instrInstance.data.audio.panorama = pan;
	            instrInstance.data.audio.mute = mute;
	        });

	        // TODO: start playing
	        mtRhythmPlayer.stop();
	        audioFilePlayer.resumeAudio().then( () => {
	            mtRhythmPlayer.play( rack, rCard.tempo );
	            this.activeRhythmPlayerControl.startDurationTimer();
	            
	         });
	        
	        // change button labels of "Play/Stop" buttons of all player controls on the page
	        this.updateButtons();
	        this.updateTempoControls();
	    }

	    instrumentManager.loadMultipleInstruments(arrInstrNames, onInstrumentsLoaded);
	}

	stopPlaying() {
		if (this.activeRhythmPlayerControl) {
			mtRhythmPlayer.stop();
			this.activeRhythmPlayerControl.stopDurationTimer();
			this.activeRhythmPlayerControl = null;
			this.updateButtons();
			this.updateTempoControls();
		}
	}

	updateButtons() {
		let calcButtonState = (control) => {
			if (!this.activeRhythmPlayerControl) return BUTTON_STATE_PLAY;
			return control.id === this.activeRhythmPlayerControl.id ? 
	        		BUTTON_STATE_STOP : BUTTON_STATE_PLAY;
		} 

		this.rhythmPlayerControls.forEach( playerControl => { 
			playerControl.buttonState = calcButtonState( playerControl ); 
		});
	}
	
	updateTempoControls() {
		this.rhythmPlayerControls.forEach( playerControl => {
			let isVisible = true;
			if (this.activeRhythmPlayerControl !== null && this.activeRhythmPlayerControl.id === playerControl.id )
				isVisible = false;

			playerControl.setTempoControlVisibility( isVisible );
		});
	}

	parseShortcuts(lesson) {
		let content = lesson.content;
		let arrShortcuts = [
			{A: "<r-p", B: "<rhythmplayer"},
			{A: "</r-p>", B: "</rhythmplayer>"},
			{A: "<r-c", B: "<rhythmcard"},
			{A: "</r-c>", B: "</rhythmcard>"},
			{A: "<d-r", B: "<displayrhythm"},
			{A: "</d-r>", B: "</displayrhythm>"},
			{A: "<f-s", B: "<foldable-section"},
			{A: "</f-s>", B: "</foldable-section>"},
			{A: "<r-e-b", B: "<random-exercise-button"},
			{A: "</r-e-b>", B: "</random-exercise-button>"},
			{A: "<r-v-d/>", B: `<div><img src="../img/delimiter_curve.png"/></div>`}
			//{A: "<r-v-d/>", B: `<div style="border:0.5px solid #aaaaaa"> </div>`}
		];
		// replace all chortcuts: 
		arrShortcuts.forEach( shortcut => {
			content = replaceString( content, shortcut.A, shortcut.B );
		});
		return content;
	}

	parseCustomTags(lesson) {

		let content = lesson.content;
		content = this.parseShortcuts( lesson )

		// now come to parse custom tags
		let resultIntCounters = CustomTagParser.parseIntCounters( content );
		content = resultIntCounters.text;
		// save the counters for future possible uses like function gotoRandomExercise in courses-main.js
		this.arrIntCounters = resultIntCounters.intCounters; 
		content = CustomTagParser.parseFoldableSections( content );
		content = CustomTagParser.parseRhythmRepeat( content );
		content = CustomTagParser.parseRhythmPlayerTags( content, this );
		content = CustomTagParser.parseRandomExerciseButtons( content );
		content = CustomTagParser.parseInternalReferences( content, lesson );

		return content;
	}

	htmlLessonNavigation(lesson) {

		let html = 
			`<div style="height:20px">&nbsp;</div>
			<div class='lesson-div-lesson-navigation'>`;
		
		let prevLesson = lesson.getPrevLesson();
		let nextLesson = lesson.getNextLesson();
		
		if (prevLesson) {
			html += `<button class='lesson-button-lesson-navigation lesson-button-lesson-navigation-lesson' 
					onclick='onClickLessonPreview("${prevLesson.id}")'>${CURR_LOC().course.prevLesson}</button>`
		}

		if (nextLesson) {
			html += `<button class='lesson-button-lesson-navigation lesson-button-lesson-navigation-lesson' 
				onclick='onClickLessonPreview("${nextLesson.id}")'>${CURR_LOC().course.nextLesson}</button>`;
		}

		if (!nextLesson) {
			let nextModule = lesson.parentModule.getNextModule();
			if (nextModule) {
				html += `<button class='lesson-button-lesson-navigation lesson-button-lesson-navigation-module' 
					onclick='onClickModulePreview("${nextModule.id}")'>${CURR_LOC().course.nextModule}</button>`;		
			}
		}

		
		html += `</div>`;

		return (prevLesson || nextLesson) ? html : "";
	}

}