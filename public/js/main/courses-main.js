/*
* GLOBAL VARIABLES
*/
const courseRunner = new CourseRunner();
const openByDefault = {}; // {course: "frame-drums-ru", module: null, lesson: null};
let youtubePlayer = null;

function onDocumentLoaded() {
	instrumentManager.loadInstrumentDefinitions( function() {
		init();
	});	
}

function init() {

	processURLParams();

	courseRunner.courseRenderer.mainDivID = "divCoursesContainer";
	courseRunner.lessonPage.mainDivID = "divCoursesContainer";

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
				 			courseRunner.showLesson( module.id + "@@@" + openByDefault.lesson );
					});
			}
		});
	});
}

function loadCourse(courseFolder, callback) {
	courseRunner.loadCourse( courseFolder, callback);
}

function onClickLoadCourse() {
	courseRunner.stop();
	const courseFolderName = document.getElementById("inputCourseFolder").value;
	courseRunner.loadCourse( courseFolderName );

}

function onClickCoursePreview(id, callback) {
	courseRunner.stop();
	courseRunner.showCourseModules(id, callback);
}

/*
* Module id = courseID@@@module-folder-name
*/
function onClickModulePreview(moduleFullID, callback) {
	courseRunner.stop();
	courseRunner.showModule(moduleFullID, callback);
}

/*
* Lesson id = courseID@@@module-folder-name@@@lessonIndex
*/
function onClickLessonPreview(fullLessonID, callback) {
	courseRunner.stop();
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
// if the query in the url is:
// course=<name-of-course>&module=<module-folder>&lesson=<name-of-file-without-.html>
// also for module it can be #<num> to define number of the module in the list (1-based)
function processURLParams() {

    let urlString = window.location.href;
    let url = new URL(urlString);

    let aCourse = url.searchParams.get("course");
    let aModule = url.searchParams.get("module");
    let aLesson = url.searchParams.get("lesson");

    // 
    if (aCourse) openByDefault.course = aCourse;
    if (aModule) openByDefault.module = aModule;
    if (aLesson) openByDefault.lesson = aLesson + ".html";
}

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

function onClickGenerateNewRhythm(rhythmPlayerControlID, randomizerType) {
	if ( !courseRunner.lessonPage ) return;
	courseRunner.lessonPage.changeRandomRhythm(rhythmPlayerControlID, randomizerType); 
}
