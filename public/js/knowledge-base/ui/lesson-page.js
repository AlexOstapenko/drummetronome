class LessonPage {
	constructor() {
		this.divContainerID = "";
		this.reinit();
	}

	reinit() {
		this.rhythmPlayers = new RhythmPlayerControllsCollection();
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

		let isLessonAvailable = this.isLessonAvailable(lesson);

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

	isLessonAvailable(lesson) {
		let isAvailable = true;
		if ( window.location.href.indexOf( "localhost:" ) === -1 ) {
			let lessonNotAvailable = 
				(lesson.status && lesson.status === Lesson.STATUS.NOT_AVAILABLE ) ||
				(lesson.parentModule.status && lesson.parentModule.status === Lesson.STATUS.NOT_AVAILABLE);

			isAvailable = !lessonNotAvailable;
		}
		return isAvailable;
	}

	// Generates links to previous page
	renderHeader(lesson) {

		let prevLesson = lesson.getPrevLesson();
		let nextLesson = lesson.getNextLesson();

		let html = 
		`<div class='page-header'>
				<span class='lesson-header-link lesson-header-link-1'
					onclick='onClickParentCourse(${lesson.parentModule.course.id})'>${CURR_LOC().course.backToCourse}</span> |
				<span class='lesson-header-link lesson-header-link-2'
					onclick='onClickParentModule( "${lesson.parentModule.id}" )'>${CURR_LOC().course.backToModule}</span> `;
		if (prevLesson || nextLesson) html += " | ";

		if (prevLesson) {
			html += `<button class="lesson-button-lesson-navigation-tiny"
						onclick='onClickLessonPreview("${prevLesson.id}")'>&leftarrow;</button> `;
		}

		if (nextLesson) {
			html += `<button class="lesson-button-lesson-navigation-tiny"
						onclick='onClickLessonPreview("${nextLesson.id}")'>&rightarrow;</button>`;
		}

		html += `</div>`;

		return html;
	}

	play( rhythmPlayerControlID ) {
		this.rhythmPlayers.play( rhythmPlayerControlID );
	}

	createRhythmPlayerControl() {
		return this.rhythmPlayers.createRhythmPlayerControl();
	}

	stopPlaying() {
		this.rhythmPlayers.stopPlaying();
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

		content = CustomTagParser.parseGlobalValues( content, {course: lesson.parentCourse} );
		content = CustomTagParser.parseFoldableSections( content );
		content = CustomTagParser.parseRhythmRepeat( content );
		content = CustomTagParser.parseRhythmPlayerTags( content, this );
		content = CustomTagParser.parseRandomExerciseButtons( content );
		content = CustomTagParser.parseInternalReferences( content, 
			{course: lesson.parentCourse, module: lesson.parentModule, lesson: lesson} );

		// random exercises
		content = CustomTagParser.parseRandomExerciseGenerator(content, this);
		content = CustomTagParser.parseRhythmRandomizer( content, this );

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

	changeRandomRhythm(rhythmPlayerID, randomizerType) {

		let rhythmPlayerControl = this.rhythmPlayers.getRhythmPlayerControl( rhythmPlayerID );
		this.stopPlaying();

		let divOptions = document.getElementById( `div-random-rhythms-base-${rhythmPlayerID}` );
		let divParams =  document.getElementById( `div-random-rhythms-params${rhythmPlayerID}` );
		let plainTextWithVariations = divOptions.textContent;
		let params = CustomTagParser.parseParams( divParams.textContent.trim() );
		let randomRhythmText = "";
		let precount = "";
		
		if (randomizerType === ExerciseGenerator.TYPE.speedJuggling) {
			let rhythmObj = ExerciseGenerator.generateSpeedsJugglingExercise( 
			plainTextWithVariations, parseInt( params.limit ), parseInt( params.numOfLines ) );

			randomRhythmText = rhythmObj.rhythm;
			precount = rhythmObj.precount;
		} else if (randomizerType === ExerciseGenerator.TYPE.rhythmRandomizer ) {
			let rhythmObj = ExerciseGenerator.generateRandomizedRhythm( plainTextWithVariations ); 
			randomRhythmText = rhythmObj.rhythm;
			precount = rhythmObj.precount;
		}

		rhythmPlayerControl.setRhythmCard( RandomExerciseRenderer.createRhythmCardText( 
			params.instrument, randomRhythmText, precount, parseInt(params.tempo) ),
			RandomExerciseRenderer.textToShowHTML(randomRhythmText), params.textSize);
		rhythmPlayerControl.reRender();
	}
	
}








