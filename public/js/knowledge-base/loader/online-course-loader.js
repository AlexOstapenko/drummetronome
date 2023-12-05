class OnlineCourse {

	constructor() {
		this.path = "";
		this.name = "";
		this.introHTML = "";
		this.moduleFolders = [];
		this.modules = [];
		this.img = {
			icon: "",
			large: ""
		}

	}
}

class OnlineCourseModule {
	constructor() {
		this.name = "";
		this.path = "";
		this.introHTML = "";
		this.introFileName = "";
		this.introFileLoaded = false;
		this.img = {icon: ""};
		this.lessons = [];
		this.lessonsLoaded = false;
	}
}


class OnlineCourseLoader {

	constructor() {
		this.empty();
	}

	empty() {
		this.callback = null;
		this.onlineCourse = null;
		this.loadingStatuses = {
			modulesLoaded: false,
			introHTMLLoaded: false
		}
	}

	get courseDescriptionFileName() {
		return "course-description.json";
	}

	get moduleDescriptionFileName() {
		return "module-description.json";
	}

	loadCourse(folderName, callback) {
		this.onlineCourse = new OnlineCourse();
		this.onlineCourse.path = folderName;
		this.callback = callback;

		let fileLoader = new FileLoader();
		let courseDescriptionPath = folderName + "/" + this.courseDescriptionFileName;
		let textFile = fileLoader.loadFile(courseDescriptionPath, text => {
			let json = JSON.parse(text);

			// init the course object
			this.onlineCourse.name = json.name;
			this.onlineCourse.img.icon = json.img.icon ? this.onlineCourse.path + "/" + json.img.icon : "";
			this.onlineCourse.img.large = json.img.large ? this.onlineCourse.path + "/" + json.img.large : "";

			// load the intro html
			fileLoader.loadFile( folderName + "/" + json.intro, html => {
				this.loadingStatuses.introHTMLLoaded = true;
				this.onCoursePartLoaded();
			});

			// load modules
			this.onlineCourse.moduleFolders = json.modules;
			this.loadModules();
		});
	}

	loadModules() {
		let onlineCourse = this.onlineCourse;
		let fileLoader = new FileLoader();
		onlineCourse.moduleFolders.forEach( moduleFolder => {

			let courseModule = new OnlineCourseModule();
			courseModule.path = onlineCourse.path + "/" + moduleFolder;
			this.onlineCourse.modules.push( courseModule );

			let moduleDescriptionPath = courseModule.path + "/" + this.moduleDescriptionFileName;
			fileLoader.loadFile( moduleDescriptionPath, text => {
				let jsonModule = JSON.parse(text);

				courseModule.name = jsonModule.name;
				courseModule.introFile = jsonModule.intro;
				courseModule.img.icon = jsonModule.img.icon ? courseModule.path + "/" + jsonModule.img.icon : "";

				this.loadingStatuses.modulesLoaded = true;
				this.onCoursePartLoaded();
			});

		});
	}

	onCoursePartLoaded() {
		if (this.loadingStatuses.modulesLoaded && this.loadingStatuses.introHTMLLoaded) {
			this.callback( this.onlineCourse );
			this.empty();
		}
	}

}



