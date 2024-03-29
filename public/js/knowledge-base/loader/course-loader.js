class CourseLoader {

	constructor() {
		this.idGenerator = new IDGenerator();
	}

	get coursesFolder() {return GlobalValues.getGlobalValue("root-folder"); }
	get courseDescriptionFileName() { return "course-description.json"; }
	get moduleDescriptionFileName() { return "module-description.json"; }
	get courseIntroFileName() { return "course-intro.html" }
	get moduleIntroFileName() { return "module-intro.html" }	
	get moduleDefaultIconFileName() { return "module-default-icon.jpg" }
	get lessonDefaultIconFileName() { return "lesson-default-icon###.jpg" }

	loadCoursePreview(folderName, callback) {
		let course = new Course();
		course.id = this.idGenerator.getNewID();
		course.folderName = folderName;
		course.path = this.coursesFolder + folderName;

		let courseDescriptionPath = course.path + "/" + this.courseDescriptionFileName;
		let fileLoader = new FileLoader();
		let textFile = fileLoader.loadFile(courseDescriptionPath, text => {
			let json = JSON.parse(text);

			// init the course object
			course.name = json.name;
			course.nameHTML = json.nameHTML;
			course.img.icon = json.img.icon ? course.path + "/" + json.img.icon : "";
			course.img.large = json.img.large ? course.path + "/" + json.img.large : "";
			course.img.titleIcon = json.img.titleIcon ? course.path + "/" + json.img.titleIcon : "";
			course.moduleFolders = json.modules;

			callback( course );
		});
	}

	loadCourseIntro(course, callback) {
		if ( !course.introFileLoaded) {
			let courseIntroPath = course.path + "/" + this.courseIntroFileName;
			let fileLoader = new FileLoader();
			let htmlFile = fileLoader.loadFile(courseIntroPath, html => {
				course.introHTML = html;
				course.introFileLoaded = true;
				callback(course);
			});
		}
		else callback( course );
	}

	loadModulesPreviews(course, callback) {

		if ( !course.modulePreviewsLoaded() ) {
			course.moduleFolders.forEach( moduleFolder => {
				let moduleFullPath = `${course.path}/${moduleFolder}`;
				let moduleDescriptionPath = `${moduleFullPath}/${this.moduleDescriptionFileName}`;
				let fileLoader = new FileLoader();
				let textFile = fileLoader.loadFile(moduleDescriptionPath, text => {
					let json = JSON.parse(text);

					// create module object
					let courseModule = new CourseModule();
					courseModule.name = json.name;
					courseModule.course = course;
					courseModule.moduleFolder = moduleFolder;
					courseModule.status = json.status;
					courseModule.img = {icon: 
						(json.img && json.img.icon) ? 
							`${moduleFullPath}/${json.img.icon}` : 
							`${course.path}/img/${this.moduleDefaultIconFileName}`};

					// create Lesson objects for each record
					courseModule.lessons = json.lessons.map( (lessonRecord, idx) => {
						let l = new Lesson();
						l.name = lessonRecord.name;
						l.file = lessonRecord.file;
						l.parentModule = courseModule;
						l.status = lessonRecord.status;

						let fileNameIdx = idx%2===0 ? "1" : "2";
						l.img = {icon: `${course.path}/img/${this.lessonDefaultIconFileName.replace(/###/g, fileNameIdx)}`}
						return l;
					});

					course.modules.push( courseModule );

					if ( course.modulePreviewsLoaded() ) {
						this.makeProperModulesSequence(course);
						callback( course );
					}
				});
			});
		}
	}

	// Make sure all modules are loaded.
	// This method rearranges course.modules array so the sequence is the same as in course.moduleFolders
	// This is needed because some modules can be loaded earlier, some later, so the sequence
	// mayy appear different than it should be according to the course description. So we fix it here.
	makeProperModulesSequence(course) {
		let arrProperSequence = [];
		course.moduleFolders.forEach(folder => {
			let m = course.getModule(folder);
			if (m) arrProperSequence.push( m );
		});
		course.modules = arrProperSequence;
	}

	loadModuleIntro(courseModule, callback) {
		if ( !courseModule.introFileLoaded ) {
			let moduleIntroPath = courseModule.path + "/" + this.moduleIntroFileName;
			let fileLoader = new FileLoader();
			let htmlFile = fileLoader.loadFile(moduleIntroPath, html => {
				courseModule.introHTML = html;
				courseModule.introFileLoaded = true;
				callback(courseModule);
			});
		} else {
			callback( courseModule );
		}
	}

	loadLessonContent(lesson, callback) {
		if (!lesson.contentLoaded) {
			let lessonContentFilePath = lesson.parentModule.path + "/" + lesson.file;
			let fileLoader = new FileLoader();
			let htmlFile = fileLoader.loadFile(lessonContentFilePath, html => {
				lesson.content = html;
				lesson.contentLoaded = true;
				callback(lesson);
			});
		}
		else callback( lesson );
	}
}





