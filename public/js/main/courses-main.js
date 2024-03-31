/*
* GLOBAL VARIABLES
*/
//const courseRunner = new CourseRunner();
const openByDefault = {}; // {course: "frame-drums-ru", module: null, lesson: null};
let youtubePlayer = null;


class CourseRunnerGlobals {

	static mainDivID = "divCoursesContainer";
	//static lessonPageDivID = "divCoursesContainer";
	static courseRunner = new CourseRunner();
	static openByDefault = {};  // {course: "frame-drums-ru", module: null, lesson: null};
	static youtubePlayer = null;

	static onDocumentLoaded() {

		instrumentManager.loadInstrumentDefinitions( function() {
			CourseRunnerGlobals.init();
		});	
	}

	/*
	Looks to the CourseRunnerGlobals.openByDefault object to find out what to open.
	Initialize some of it's properties {course, module, lesson} to open the corresponding page.
	*/
	static init() {
		CourseRunnerGlobals.processURLParams();
		const courseRunner = CourseRunnerGlobals.courseRunner;
		const openByDefault = CourseRunnerGlobals.openByDefault;

		courseRunner.courseRenderer.mainDivID = CourseRunnerGlobals.mainDivID;
		courseRunner.lessonPage.mainDivID = CourseRunnerGlobals.mainDivID;

		if (openByDefault && openByDefault.course)
		courseRunner.loadCourse( openByDefault.course, course => {
			courseRunner.showCourseModules(course.id, course => {
				// openByDefault.module may be the folder name of the module or order number (e.g. @5). 
				// If it's the number, we have to get the folder name by it's index
				if (openByDefault.module) {
					if (openByDefault.module.indexOf("@")===0)
						openByDefault.module = course.getModuleFolderByIdx(parseInt(openByDefault.module.substring(1))-1);

					if (openByDefault.module)
						courseRunner.showModule(Course.makeModuleID(course.id, openByDefault.module), module => {
							if (openByDefault.lesson)
					 			courseRunner.showLesson( module.id + Course.idSplitter() + openByDefault.lesson );
						});
				}
			});
		});
	}

	/////////////////////////////////////
	// if the query in the url is:
	// course=<name-of-course>&module=<module-folder>&lesson=<name-of-file-without-".html">
	// also for module it can be #<num> to define number of the module in the list (1-based)
	static processURLParams() {

	    let urlString = window.location.href;
	    let url = new URL(urlString);

	    let aCourse = url.searchParams.get("course");
	    let aModule = url.searchParams.get("module");
	    let aLesson = url.searchParams.get("lesson");

	    // 
	    if (aCourse) CourseRunnerGlobals.openByDefault.course = aCourse;
	    if (aModule) CourseRunnerGlobals.openByDefault.module = aModule;
	    if (aLesson) CourseRunnerGlobals.openByDefault.lesson = aLesson + ".html";
	}

	/*
	* Module id = courseID@@@module-folder-name
	*/
	static onClickModulePreview(moduleFullID, callback) {
		CourseRunnerGlobals.courseRunner.stop();
		CourseRunnerGlobals.courseRunner.showModule(moduleFullID, callback);
		window.scrollTo(0,0);
	}

	static onClickLoadCourse() {
		CourseRunnerGlobals.courseRunner.stop();
		const courseFolderName = document.getElementById("inputCourseFolder").value;
		CourseRunnerGlobals.courseRunner.loadCourse( courseFolderName );

	}

	static onClickCoursePreview(id, callback) {
		CourseRunnerGlobals.courseRunner.stop();
		CourseRunnerGlobals.courseRunner.showCourseModules(id, callback);
		window.scrollTo(0,0);
	}

	/*
	* Lesson id = courseID@@@module-folder-name@@@lessonIndex
	*/
	static onClickLessonPreview(fullLessonID, callback) {
		CourseRunnerGlobals.courseRunner.stop();
		CourseRunnerGlobals.courseRunner.showLesson( fullLessonID, callback );
		window.scrollTo(0,0);
	}

	static loadCourse(courseFolder, callback) {
		CourseRunnerGlobals.courseRunner.loadCourse( courseFolder, callback);
	}


	static onClickPlayRhythm(rhythmPlayerControlID) {
		CourseRunnerGlobals.courseRunner.play( rhythmPlayerControlID );
	}

	static onClickParentCourse(courseID) {
		CourseRunnerGlobals.courseRunner.stop();
		CourseRunnerGlobals.onClickCoursePreview( courseID );
	}

	static onClickParentModule(moduleFullID) {
		CourseRunnerGlobals.courseRunner.stop();
		CourseRunnerGlobals.onClickModulePreview(moduleFullID);
	}

	static onOpenInternalRef(courseFolder, moduleFolder, lessonFileName) {
		let currentUrlWithoutParams = window.location.origin + window.location.pathname;
		let url = currentUrlWithoutParams + `?course=${courseFolder}&module=${moduleFolder}&lesson=${lessonFileName}`;
		window.open(url, '_blank');
	}
	
	static gotoRandomExercise(idName, counterName) {
		CourseRunnerGlobals.stopPlayer();
		let courseRunner = CourseRunnerGlobals.courseRunner;
		if ( courseRunner.lessonPage && courseRunner.lessonPage.arrIntCounters ) {
			let arr = courseRunner.lessonPage.arrIntCounters.filter(counter => counter.name == counterName)[0].history;

			let randomIndex = Math.floor(Math.random() * arr.length);
			let elementID = idName + arr[randomIndex];
			let element = document.getElementById( elementID );
			if (element)
				element.scrollIntoView();
			else {
				console.log( "Cannot find element by ID: " + elementID );
			}
		}
	}

	static stopPlayer() {
		CourseRunnerGlobals.courseRunner.stop();
	}

	static onClickGenerateNewRhythm(rhythmPlayerControlID, randomizerType) {
		if ( !CourseRunnerGlobals.courseRunner.lessonPage ) return;
		CourseRunnerGlobals.courseRunner.lessonPage.changeRandomRhythm(rhythmPlayerControlID, randomizerType); 
	}

}







