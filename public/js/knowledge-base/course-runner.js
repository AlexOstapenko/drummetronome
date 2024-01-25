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

	loadCourse(courseFolderName, callback) {

		let courseLoader = new CourseLoader( this );
		courseLoader.loadCoursePreview( courseFolderName, course => {
				course.courseRunner = this; // to get global values via getGlobalValue method of the CourseRunner
				this.loadedCourses.push(course);
				this.courseRenderer.renderCoursePreview(course);
				if (callback) callback( course );

				this.updateBrowserURL(course.folderName);
			} );
	}

	showCourseModules(courseID, callback) {
		let course = this.getCourse(courseID);
		if (!course.introFileLoaded) {
			let courseLoader = new CourseLoader();
			courseLoader.loadCourseIntro(course, course => {
				courseLoader.loadModulesPreviews( course, course => {
					this.courseRenderer.renderCourse(course);
					if (callback) callback( course );
					this.updateBrowserURL(course.folderName);
				});
			});
		}
		else {
			this.updateBrowserURL(course.folderName);
			this.courseRenderer.renderCourse(course);
		}
	}

	showModule(moduleFullID, callback) {

		let whenReady = (aModule) => {
			this.updateBrowserURL(aModule.course.folderName, aModule.moduleFolder);
			this.courseRenderer.renderModule( aModule );
			if (callback) callback(aModule);
		};

		let m = this.getModule(moduleFullID);
		let courseLoader = new CourseLoader();

		if (!m.introFileLoaded) {
			courseLoader.loadModuleIntro(m, courseModule => {
				whenReady( courseModule );
			});	
		}
		else
			whenReady( m );
	}

	showLesson( fullLessonID, callback ) {

		let whenReady = (lesson) => {
			this.updateBrowserURL(lesson.parentModule.course.folderName, 
				lesson.parentModule.moduleFolder, 
				lesson.file.split(".")[0] );

			this.lessonPage.render( lesson );
			if (callback) callback( lesson );
		}

		let lesson = this.getLesson( fullLessonID );
		if ( !lesson.contentLoaded) {
			let courseLoader = new CourseLoader();
			courseLoader.loadLessonContent( lesson, l => {
				whenReady(l);
			});
		}
		else whenReady(lesson);

	}

	play( rhythmPlayerControlID ) {
		this.lessonPage.play( rhythmPlayerControlID );
	}

	stop() {
		this.lessonPage.stopPlaying();	
	}

	updateBrowserURL(course, moduleFolder, lesson) {
		let fullBaseUrl = window.location.origin + window.location.pathname;
		let part2 = "?";
		if (!course) return;
		part2 += `course=${course}`;
		if (moduleFolder) {
			part2 += `&module=${moduleFolder}`;
			if (lesson) part2 += `&lesson=${lesson}`;
		}

		var newURL = fullBaseUrl + part2;

		// Update URL in the address bar
		window.history.pushState({path: newURL}, null, newURL);
	}


}