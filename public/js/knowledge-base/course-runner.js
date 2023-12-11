class CourseRunner {

	constructor() {
		this.courseRenderer = new CourseRenderer();
		this.lessonPage = new LessonPage();
		this.loadedCourses = [];
	}

	getCourse(id) {
		let courses = this.loadedCourses.filter(course => course.id == id);
		if (courses && courses.length>0) return courses[0];
		return null;
	}

	getModule(moduleFullID) {
		let ids = Course.parseID( moduleFullID );
		let course = this.getCourse( ids.courseID );
		let m = course.modules.filter( m => m.moduleFolder === ids.moduleID )[0];
		return m;
	}

	getLesson(lessonFullID) {
		let ids = Course.parseID( lessonFullID );
		let m = this.getModule(Course.makeModuleID(ids.courseID, ids.moduleID));
		let lessonID = ids.lessonID;
		let lesson = m.lessons.filter( l => l.file === lessonID )[0];
		return lesson;
	}

	loadCourse(courseFolderName) {

		let courseLoader = new CourseLoader();
		let path = "rhythm-knowledge-base/courses/" + courseFolderName;
		courseLoader.loadCoursePreview( path, course => {
				this.loadedCourses.push(course);
				this.courseRenderer.renderCoursePreview(course);
			} );;
	}

	showCourseModules(courseID) {
		let course = this.getCourse(courseID);
		if (!course.introFileLoaded) {
			let courseLoader = new CourseLoader();
			courseLoader.loadCourseIntro(course, course => {
				courseLoader.loadModulesPreview( course, course => {
					this.courseRenderer.renderCourse(course);
				});
			});
		}
		else this.courseRenderer.renderCourse(course);
	}

	showModule(moduleFullID) {
		let m = this.getModule(moduleFullID);
		let courseLoader = new CourseLoader();

		if (!m.introFileLoaded) {
			courseLoader.loadModuleIntro(m, courseModule => {
				this.courseRenderer.renderModule( courseModule );
			});	
		}
		else
			this.courseRenderer.renderModule( m );
	}

	showLesson( fullLessonID ) {
		let lesson = this.getLesson( fullLessonID );
		if ( !lesson.contentLoaded) {
			let courseLoader = new CourseLoader();
			courseLoader.loadLessonContent( lesson, l => {
				this.lessonPage.render( l );
			});
		}
		else this.lessonPage.render( lesson );

	}

	play( rhythmPlayerControlID ) {
		this.lessonPage.play( rhythmPlayerControlID );
	}

	stop() {
		this.lessonPage.stopPlaying();	
	}
}