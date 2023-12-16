class Course {

	constructor() {
		this.id = -1;
		this.path = "";
		this.name = "";
		this.introHTML = "";
		this.introFileLoaded = false;
		this.moduleFolders = [];
		this.modules = [];
		this.img = {
			icon: "",
			large: ""
		}
	}

	modulePreviewsLoaded() {
		return this.modules.length === this.moduleFolders.length;
	}

	static idSplitter() { return "@@@" }

	static parseID(fullID) {
		let arr = fullID.split( Course.idSplitter() );
		let result = {};
		if (arr.length>=1)
			result.courseID = arr[0];
		if (arr.length >= 2)
			result.moduleID = arr[1];
		if (arr.length >= 3)
			result.lessonID = arr[2];
		return result;
	} 

	static makeModuleID(courseID, moduleID) {
		return courseID + Course.idSplitter() + moduleID;
	}

	getModule(moduleFolder) {
		let arrFilteredModules = this.modules.filter( m => m.moduleFolder === moduleFolder );
		if (arrFilteredModules) return arrFilteredModules[0];
		return null;
	}
}

class CourseModule {
	constructor() {
		this.name = "";
		this.course = null;
		this.moduleFolder = ""; // only the name of the folder with this module, used as id of the module within the course
		this.introHTML = "";
		this.introFileLoaded = false;
		this.img = {icon: ""};
		this.lessons = []; // array of Lesson objects
	}

	get path() {
		return `${this.course.path}/${this.moduleFolder}`;
	}

	get id() {
		return `${this.course.id}${Course.idSplitter()}${this.moduleFolder}`;
	}
}

class Lesson {
	constructor() {
		this.name = "";
		this.parentModule = null;
		this.file = "";
		this.content = "";
		this.contentLoaded = false;
	}

	get path() {
		return `${this.parentModule.path}/${this.file}`;
	}

	get id() {
		return `${this.parentModule.id}${Course.idSplitter()}${this.file}`;
	}

}






