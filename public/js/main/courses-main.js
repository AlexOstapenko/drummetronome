/*
* GLOBAL VARIABLES
*/
const courseRunner = new CourseRunner();
const openByDefault = {course: "frame-drums-ru", module: "module_snaps_2", lesson: "lesson-8.html"};

function onDocumentLoaded() {
	instrumentManager.loadInstrumentDefinitions( function() {
		init();
	});
}

function init() {
	courseRunner.courseRenderer.mainDivID = "divCoursesContainer";
	courseRunner.lessonPage.mainDivID = "divCoursesContainer";

	if (openByDefault && openByDefault.course)
	courseRunner.loadCourse( openByDefault.course, course => {
		courseRunner.showCourseModules(course.id, course => {
			if (openByDefault.module)
				courseRunner.showModule(Course.makeModuleID(course.id, openByDefault.module), module => {
					if (openByDefault.lesson)
			 			courseRunner.showLesson( module.id + "@@@" + openByDefault.lesson );
			 });
		});
	});
}

function loadCourse(courseFolder, callback) {
	courseRunner.loadCourse( courseFolder, callback);
}

function onClickLoadCourse() {
	const courseFolderName = document.getElementById("inputCourseFolder").value;
	courseRunner.loadCourse( courseFolderName );
}

function onClickCoursePreview(id, callback) {
	courseRunner.showCourseModules(id, callback);
}

/*
* Module id = courseID@@@module-folder-name
*/
function onClickModulePreview(moduleFullID, callback) {
	courseRunner.showModule(moduleFullID, callback);
}

/*
* Lesson id = courseID@@@module-folder-name@@@lessonIndex
*/
function onClickLessonPreview(fullLessonID, callback) {
	courseRunner.showLesson( fullLessonID, callback );
	window.scrollTo(0,0);
}

function onClickPlayRhythm(rhythmPlayerControlID) {
	courseRunner.play( rhythmPlayerControlID );
}

function onClickParentCourse(courseID) {
	courseRunner.stop();
	onClickCoursePreview( courseID );
}

function onClickParentModule(moduleFullID) {
	courseRunner.stop();
	onClickModulePreview(moduleFullID);
}

/////////////////////////////////////

function gotoRandomExercise(idName, counterName) {
	let a = 10;
	if ( courseRunner.lessonPage && courseRunner.lessonPage.arrIntCounters ) {
		let arr = courseRunner.lessonPage.arrIntCounters.filter(counter => counter.name == counterName)[0].history;

		let randomIndex = Math.floor(Math.random() * arr.length);
		let elementID = idName + randomIndex;
		let element = document.getElementById( elementID );
		element.scrollIntoView();
	}
}

