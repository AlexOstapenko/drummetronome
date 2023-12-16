/*
* GLOBAL VARIABLES
*/
const courseRunner = new CourseRunner();
const openByDefault = {course: "frame-drums-ru"};

function onDocumentLoaded() {
	instrumentManager.loadInstrumentDefinitions( function() {
		init();
	});
}

function init() {
	courseRunner.courseRenderer.mainDivID = "divCoursesContainer";
	courseRunner.lessonPage.mainDivID = "divCoursesContainer";

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




