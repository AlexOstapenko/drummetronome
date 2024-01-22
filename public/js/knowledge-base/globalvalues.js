class GlobalValues {
	static getGlobalValue(name, params) {
		
		let globalValues = {
			"root-folder" : "!rhythm-knowledge-base/courses/",
			"course-folder" : params ? params.course.path : undefined,
			"video-size-w" : 400,
			"video-size-h" : 225,
		}
		globalValues["video-size"] = `width="${globalValues["video-size-w"]}" height="${globalValues["video-size-h"]}"`;

		return globalValues[name];
	}
}