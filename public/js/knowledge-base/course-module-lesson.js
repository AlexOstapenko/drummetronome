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

	getModuleIdx(someModule) {
		for( let i=0; i < this.modules.length; i++ )
			if (someModule.moduleFolder === this.modules[i].moduleFolder) return i;
		return -1;
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

	getLessonIdx(lesson) {
		for( let i=0; i < this.lessons.length; i++ )
			if (lesson.file === this.lessons[i].file) return i;
		return -1;
	}

	getNextModule() {
		let idx = this.course.getModuleIdx(this);
		let numOfModules = this.course.modules.length;
		if (idx < 0 || idx === (numOfModules-1) ) return null;
		return this.course.modules[idx+1];
	}

	getModuleNumber() {
		return this.course.getModuleIdx(this)+1;
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

	getPrevLesson() {
		let idx = this.parentModule.getLessonIdx(this);
		if (idx <= 0 ) return null;
		return this.parentModule.lessons[idx-1];
	}

	getNextLesson() {
		let idx = this.parentModule.getLessonIdx(this);
		let numOfLessons = this.parentModule.lessons.length;
		if (idx < 0 || idx === (numOfLessons-1) ) return null;
		return this.parentModule.lessons[idx+1];
	}

	getLessonNumber() {
		return this.parentModule.getLessonIdx(this)+1;
	}
}






