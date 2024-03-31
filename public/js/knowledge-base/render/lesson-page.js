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
		let lessonHTML = "";

		if ( !this.isMangoTasty(lesson) )
			lessonHTML += 
				`<p class='course-style-title'>${CURR_LOC().messages.lessoNotAvailable}</p>`;
		else {
			lessonHTML += 
			`<h3><span class="lesson-header-lesson-label">${CURR_LOC().course.lesson} ${lessonNumber}:</span> ${lesson.name}</h3>`;
			
			lessonHTML += this.parseCustomTags( lesson );
			lessonHTML += this.htmlLessonNavigation(lesson);
		}
		
		let html = 
		`<div class='page-container'>
			${this.renderHeader(lesson)}
			<div class='lesson-content'>${lessonHTML}</div>
		</div>`;
		this.divContainer.className = "";
		this.divContainer.innerHTML = html;
	}

	// Generates links to previous page
	renderHeader(lesson) {

		let prevLesson = lesson.getPrevLesson();
		let nextLesson = lesson.getNextLesson();
		let moduleNumber = lesson.parentModule.getModuleNumber();
		let moduleLabel = `${CURR_LOC().course.module} ${moduleNumber}</b>: ${lesson.parentModule.name}`;

		let html = 
		`${lesson.parentCourse.courseRunner.courseRenderer.renderCourseTitle(lesson.parentCourse)}
		<div style="padding: 5px 0"></div>
		<div class='page-header'>
				<span class='lesson-header-link lesson-header-link-2'
					onclick='CourseRunnerGlobals.onClickParentModule( "${lesson.parentModule.id}" )'>${moduleLabel}</span> `;
		
		// add PREV and NEXT buttons
		if (prevLesson || nextLesson) html += " | ";
		if (prevLesson) {
			html += `<button class="lesson-button-lesson-navigation-tiny"
						onclick='CourseRunnerGlobals.onClickLessonPreview("${prevLesson.id}")'>&leftarrow;</button> `;
		}

		if (nextLesson) {
			html += `<button class="lesson-button-lesson-navigation-tiny"
						onclick='CourseRunnerGlobals.onClickLessonPreview("${nextLesson.id}")'>&rightarrow;</button>`;
		}

		html += `</div>`;

		return html;
	}

	htmlLessonNavigation(lesson) {

		let html = 
			`<div style="height:20px">&nbsp;</div>
			<div class='lesson-div-lesson-navigation'>`;
		
		let prevLesson = lesson.getPrevLesson();
		let nextLesson = lesson.getNextLesson();
		
		if (prevLesson) {
			html += `<button class='lesson-button-lesson-navigation lesson-button-lesson-navigation-lesson' 
					onclick='CourseRunnerGlobals.onClickLessonPreview("${prevLesson.id}")'>${CURR_LOC().course.prevLesson}</button>`
		}

		if (nextLesson) {
			html += `<button class='lesson-button-lesson-navigation lesson-button-lesson-navigation-lesson' 
				onclick='CourseRunnerGlobals.onClickLessonPreview("${nextLesson.id}")'>${CURR_LOC().course.nextLesson}</button>`;
		}

		if (!nextLesson) {
			let nextModule = lesson.parentModule.getNextModule();
			if (nextModule) {
				html += `<button class='lesson-button-lesson-navigation lesson-button-lesson-navigation-module' 
					onclick='CourseRunnerGlobals.onClickModulePreview("${nextModule.id}")'>${CURR_LOC().course.nextModule}</button>`;		
			}
		}
		html += `</div>`;

		// generate links to all lessons in this module
		html += `<br><b>${CURR_LOC().course.allLessons}</b><br>`;
		lesson.parentModule.lessons.forEach( (currLesson, idx) => {
			let link = this.makeUrl(currLesson);
			let linkText = `${idx+1}. ${currLesson.name}`;
			if (lesson.file===currLesson.file) 
				linkText = 
					`<span class="lesson-navigation-link-to-curr-lesson">${linkText}</span>`;

			html += `<a onclick="CourseRunnerGlobals.stopPlayer();" class="lesson-navigation-link-to-lesson" href="${link}">${linkText}</a><br>`;
		});
		html += "<br>";

		return (prevLesson || nextLesson) ? html : "";
	}

	isMangoTasty(lesson) {
		let isAvailable = true;
		if ( window.location.href.indexOf("localhost:")>=0 ) return isAvailable;

		let urlString = window.location.href;
	    let url = new URL(urlString);
	    let mango = url.searchParams.get("mango");

	    if ( !mango || parseInt(mango)!==1 ) {

			let lessonNotAvailable = 
				(lesson.status && lesson.status === Lesson.STATUS.NOT_AVAILABLE ) ||
				(lesson.parentModule.status && lesson.parentModule.status === Lesson.STATUS.NOT_AVAILABLE);

			isAvailable = !lessonNotAvailable;
		}
		return isAvailable;
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
			{A: "<r-v-d/>", B: `<div><img src="../img/delimiter_curve.png"/></div>`},
			{A: "<t-c", B: `<text-card`},
			{A: "</t-c>", B: `</text-card>`}
			
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

		content = CustomTagParser.parseTextCards( content );
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
			let maxRepetitions = params["max-repetitions"] ? parseInt( params["max-repetitions"] ) : -1;
			let rhythmObj = ExerciseGenerator.generateRandomizedRhythm( 
				plainTextWithVariations, maxRepetitions ); 
			randomRhythmText = rhythmObj.rhythm;
			precount = rhythmObj.precount;
		}

		rhythmPlayerControl.setRhythmCard( RandomExerciseRenderer.createRhythmCardText( 
			params.instrument, randomRhythmText, precount, parseInt(params.tempo) ),
			RandomExerciseRenderer.textToShowHTML(randomRhythmText), params.textSize);
		rhythmPlayerControl.reRender();
	}

	makeUrl( obj ) {
		let fullBaseUrl = window.location.origin + window.location.pathname;
		let result = "";
		if (obj.constructor && obj.constructor.name  === "Lesson") {
			result = `${fullBaseUrl}?`+
					`course=${obj.parentModule.course.folderName}&`+
					`module=${obj.parentModule.moduleFolder}&`+
					`lesson=${obj.getFileNameWithoutExt()}`;

		} else if (obj.constructor && obj.constructor.name === "CourseModule") {
			result = `${fullBaseUrl}?`+
					`course=${obj.course.folderName}&`+
					`module=${obj.moduleFolder}`;
		}
		return result;
	}
	
}








