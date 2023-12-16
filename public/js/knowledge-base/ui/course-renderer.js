/*
* Renders course, modules and lesson previews.
* For rendering lessons there is specialized class LessonRenderer.
*/

class CourseRenderer {

	constructor() {
		this.divContainerID = "";
	}

	set mainDivID(id) {
		this.divContainerID = id;
	}

	get divContainer() { return document.getElementById(this.divContainerID); }

	renderCoursePreview(course) {
		let html = 
		`<div class="course-preview">
			<img src='${course.img.icon}' onclick='onClickCoursePreview(${course.id})'>
			<div class='course-name'>${course.name}</div>
		</div>`;
		this.divContainer.className = 'courses-container';
		this.divContainer.innerHTML = html;
	}

	renderCourse(course) {

		const bgs = ['bg-color-yellow', 'bg-color-pink', "bg-color-green", "bg-color-red"];
		let bgIdx = -1;

		let introHTMLParsed = this.parseCustomTags(course.introHTML);

		let html = `${introHTMLParsed}
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

		let renderHeaderLinks = (course) => {
			let html = 
			`<div class='page-header'>
				<span class='lesson-header-link lesson-header-link-1'
					onclick='onClickParentCourse(${course.id})'>Back to course</span>
			</div>
			`;
			return html;
		};

		let html = 
		`${renderHeaderLinks(courseModule.course)}
		<b class='course-title'>${courseModule.course.name}</b>
		<h2><span class='module-title'>Module:</span> ${courseModule.name}</h2>
		${courseModule.introHTML}
		<h3>Lessons:</h3>
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

	parseCustomTags(content) {
		return CustomTagParser.parseFoldableSections( content );
	}
}













