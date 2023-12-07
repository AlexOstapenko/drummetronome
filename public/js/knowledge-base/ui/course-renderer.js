class CourseRenderer {

	constructor() {
		this.divContainerID = "";
	}

	set mainDivID(id) {
		this.divContainerID = id;
	}

	get divContainer() { return document.getElementById(this.divContainerID); }

	renderCourse(course) {
		let html = 
		`<div class="course-preview">
			<img src='${course.img.icon}' onclick='onClickCoursePreview(${course.id})'>
			<div class='course-name'>${course.name}</div>
		</div>`;
		this.divContainer.className = 'courses-container';
		this.divContainer.innerHTML = html;
	}

	renderModules(course) {

		const bgs = ['bg-color-yellow', 'bg-color-pink', "bg-color-green", "bg-color-red"];
		let bgIdx = -1;

		let html = `${course.introHTML}
		<br>
		<h1>Modules</h1>
		<div class='cards-container'>`;
		course.modules.forEach( m => {
			bgIdx++; if (bgIdx == bgs.length) bgIdx = 0; // choose next overlay color

			html += 
			`<div class="card-preview" onclick="onClickModulePreview('${course.id}@@@${m.moduleFolder}')">
				<div class="card-preview-img-container">
					<img class='card-preview-img' src='${m.img.icon}'>	
					<div class="card-preview-img-overlay ${bgs[bgIdx]}"></div>
				</div>
				<div class='card-preview-name'>${m.name}</div>
			</div>`;
		});
		html += "</div>";
		this.divContainer.className = "";
		this.divContainer.innerHTML = html;	
	}

	renderModule(courseModule) {
		let course = courseModule.course;
		const bgs = ['bg-color-yellow', 'bg-color-pink', "bg-color-green", "bg-color-red"];
		let bgIdx = -1;

		let html = 
		`<h1>${courseModule.course.name}</h1>
		<h2>Module: ${courseModule.name}</h2>
		${courseModule.introHTML}
		<div class='cards-container'>`;
		
		courseModule.lessons.forEach( (lesson,idx) => {
			bgIdx++; if (bgIdx == bgs.length) bgIdx = 0; // choose next overlay color

			html += 
			`<div class="card-preview" onclick="onClickLessonPreview('${lesson.id}')">
				<div class="card-preview-img-container">
					<img class='card-preview-img' src='${lesson.img.icon}'>	
					<div class="card-preview-img-overlay ${bgs[bgIdx]}"></div>
				</div>
				<div class='card-preview-name'>${lesson.name}</div>
			</div>`;
		});
		html += "</div>";
		
		this.divContainer.className = "";
		this.divContainer.innerHTML = html;	
	}

	renderLesson( lesson ) {
		let html = 
		`<h3>${lesson.parentModule.course.name} <br> ${lesson.parentModule.name}<br> ${lesson.name}</h3>`;
		
		
		html += this.parseLessonContent( lesson );
		this.divContainer.className = "";
		this.divContainer.innerHTML = html;	
	}

	parseLessonContent(lesson) {
		// TODO – parse rhythms cards in html
		return lesson.content;
	}


}