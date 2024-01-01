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

/*
	function onYouTubeIframeAPIReady() {
	  player = new YT.Player('youtubePlayer', {
	    events: {
	      'onReady': onPlayerReady
	    }
	  });
	}

	function onPlayerReady(event) {
	  // Воспроизведение видео
	  // player.playVideo();

	  // Остановка видео
	  // player.stopVideo();
	}
*/
	
}

function init() {

	processURLParams();

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

function processURLParams() {
    let urlString = window.location.href;
    let url = new URL(urlString);

    let course = url.searchParams.get("course");
    let moduleFolder = url.searchParams.get("module");
    let lesson = url.searchParams.get("lesson");

    // if the query in the url is:
    // course=<name-of-course>&module=<module-folder>&lesson=<name-of-file-without-.html>
    if (course) openByDefault.course = course;
    if (moduleFolder) openByDefault.module = moduleFolder;
    if ( lesson ) openByDefault.lesson = lesson + ".html";
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

