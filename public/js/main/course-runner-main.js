/*
* GLOBAL VARIABLES
*/
const courseRunner = new CourseRunner();

function onDocumentLoaded() {

	// tempoCtrl = tempoControlsManager.createTempoControl("divTempo2");
	// tempoCtrl.render();

	init();
}

function init() {
	courseRunner.courseRenderer.mainDivID = "divCoursesContainer";
}

function loadCourse() {
	const courseFolderName = document.getElementById("inputCourseFolder").value;
	courseRunner.loadCourse( courseFolderName );
}

function onClickCoursePreview(id) {
	courseRunner.showCourseModules(id);
}

/*
* Module id = courseID@@@module-folder-name
*/
function onClickModulePreview(moduleID) {
	courseRunner.showModule(moduleID);
}

/*
* Lesson id = courseID@@@module-folder-name@@@lessonIndex
*/
function onClickLessonPreview(fullLessonID) {
	courseRunner.showLesson( fullLessonID );
}