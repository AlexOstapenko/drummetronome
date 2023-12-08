class CourseRunner {

	constructor() {
		this.courseRenderer = new CourseRenderer();
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
				console.log( course );
				this.courseRenderer.renderCourse(course);
			} );;
	}

	showCourseModules(courseID) {
		let course = this.getCourse(courseID);
		if (!course.introFileLoaded) {
			let courseLoader = new CourseLoader();
			courseLoader.loadCourseIntro(course, course => {
				courseLoader.loadModulesPreview( course, course => {
					this.courseRenderer.renderModules(course);
				});
			});
		}
		else this.courseRenderer.renderModules(course);
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
				this.courseRenderer.renderLesson( lesson );
			});
		}
		else this.courseRenderer.renderLesson( lesson );
	}





}